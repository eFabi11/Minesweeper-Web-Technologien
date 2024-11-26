package controllers

import org.apache.pekko.actor._
import play.api.libs.json._
import de.htwg.se.minesweeper.difficulty._
import de.htwg.se.minesweeper.model._
import de.htwg.se.minesweeper.model.field.Field
import de.htwg.se.minesweeper.model.game.Game
import de.htwg.se.minesweeper.controller.controller.Controller

object VsGameSession {
  def props(gameId: String, maxPlayers: Int): Props = Props(new VsGameSession(gameId, maxPlayers))

  // Messages
  case class UpdateState(state: JsValue)
  case class Join(playerId: String, clientActor: ActorRef)
  case class Left(playerId: String)
  case class PlayerAction(playerId: String, action: String, data: JsValue)
}

class VsGameSession(gameId: String, maxPlayers: Int) extends Actor {
  import VsGameSession._

  var players = Map.empty[String, (ActorRef, Controller)]
  var difficultySet = false
  var globalDifficulty: Option[DifficultyStrategy] = None


  def receive: Receive = {
    case Join(playerId, clientActor) =>
      if (players.size < maxPlayers) {
        val game = new Game()
        val gameField = new Field(game.gridSize, Symbols.Covered)
        val gameController = new Controller(gameField, game)
        players += (playerId -> (clientActor, gameController))
        broadcastPlayers()

        println(s"Player joined: $playerId, total players: ${players.size}")

        if (!difficultySet) {
          // Send 'setDifficulty' to first player
          val firstPlayerId = players.keys.head
          val (firstPlayerActor, _) = players(firstPlayerId)
          println(s"Sending 'setDifficulty' to first player: $firstPlayerId")
          firstPlayerActor ! UpdateState(Json.obj(
            "action" -> "setDifficulty",
            "players" -> players.keys.toSeq
          ))
        }

        if (players.size == maxPlayers && difficultySet) {
          broadcastStartGame(globalDifficulty.get)
        }
      } else {
        clientActor ! UpdateState(Json.obj("action" -> "gameFull"))
      }

    case PlayerAction(playerId, action, data) =>
      action match {
        case "setDifficulty" =>
          if (!difficultySet && players.keys.headOption.contains(playerId)) {
            val level = (data \ "level").as[String]
            globalDifficulty = Some(level match {
              case "E" => new EasyDifficulty
              case "M" => new MediumDifficulty
              case "H" => new HardDifficulty
              case _   => new EasyDifficulty
            })
            difficultySet = true

            players.values.foreach { case (_, controller) =>
              controller.setDifficulty(globalDifficulty.get)
            }

            broadcastStartGame(globalDifficulty.get)
          } else {
            sender() ! UpdateState(Json.obj("action" -> "error", "message" -> "Difficulty already set or unauthorized player"))
          }

        case "uncover" =>
          players.get(playerId).foreach { case (_, gameController) =>
            val x = (data \ "x").as[Int]
            val y = (data \ "y").as[Int]
            gameController.uncoverField(x, y)
            broadcastGameStates()
          }

        case "flag" =>
          players.get(playerId).foreach { case (_, gameController) =>
            val x = (data \ "x").as[Int]
            val y = (data \ "y").as[Int]
            gameController.flagField(x, y)
            broadcastGameStates()
          }

        case "undo" =>
          players.get(playerId).foreach { case (_, gameController) =>
            gameController.undo()
            broadcastGameStates()
          }

        case "restart" =>
          players.get(playerId).foreach { case (_, gameController) =>
            gameController.restart()
            broadcastGameStates()
          }

        case _ =>
          println(s"Unknown action: $action")
      }

    case Left(playerId) =>
      players -= playerId
      broadcastPlayers()
  }

  def broadcastPlayers(): Unit = {
    val playerList = players.keys.toSeq
    val message = Json.obj(
      "action" -> "updatePlayers",
      "players" -> playerList
    )
    players.values.foreach { case (clientActor, _) =>
      clientActor ! UpdateState(message)
    }
  }

  def broadcastStartGame(difficulty: DifficultyStrategy): Unit = {
    val message = Json.obj(
      "action" -> "startGame",
      "difficulty" -> difficulty.getClass.getSimpleName.replace("$", "")
    )
    players.values.foreach { case (clientActor, _) =>
      clientActor ! UpdateState(message)
    }
    broadcastGameStates()
  }

  def broadcastGameStates(): Unit = {
    val gameStates = players.map { case (playerId, (_, controller)) =>
      Json.obj(
        "playerId" -> playerId,
        "gameData" -> getGameStateAsJson(controller)
      )
    }.toSeq

    val message = Json.obj(
      "action" -> "gameState",
      "gameStates" -> gameStates
    )

    players.values.foreach { case (clientActor, _) =>
      clientActor ! UpdateState(message)
    }
  }

  def getGameStateAsJson(controller: Controller): JsValue = {
  Json.obj(
    "rows" -> controller.field.size,
    "cols" -> controller.field.size,
    "cells" -> Json.toJson(
      (0 until controller.field.size).map { row =>
        (0 until controller.field.size).map { col =>
          controller.field.cell(col, row).toString
        }
      }
    )
  )
}
}