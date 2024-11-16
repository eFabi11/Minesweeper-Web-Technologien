package controllers

import org.apache.pekko.actor._
import play.api.libs.json._
import de.htwg.se.minesweeper.difficulty._
import de.htwg.se.minesweeper.model._
import de.htwg.se.minesweeper.model.field.Field
import de.htwg.se.minesweeper.model.game.Game
import de.htwg.se.minesweeper.controller.controller.Controller

object VsGameSession {
  def props(gameId: String): Props = Props(new VsGameSession(gameId))

  // Messages
  case class UpdateState(state: JsValue)
  case class Join(playerId: String, clientActor: ActorRef)
  case class Left(playerId: String)
  case class PlayerAction(playerId: String, action: String, data: JsValue)
}

class VsGameSession(gameId: String) extends Actor {
  import VsGameSession._

  // Map of playerId to (clientActor, Controller)
  var players = Map.empty[String, (ActorRef, Controller)]
  var difficultyVotes = Map.empty[String, DifficultyStrategy]

  def receive: Receive = {
    case Join(playerId, clientActor) =>
      // Create a new game controller for the player
      val game = new Game()
      val gameField = new Field(game.gridSize, Symbols.Covered)
      val gameController = new Controller(gameField, game)
      players += (playerId -> (clientActor, gameController))
      broadcastPlayers()

    case Left(playerId) =>
      players -= playerId
      if (players.isEmpty) {
        context.stop(self)
      } else {
        broadcastPlayers()
      }

    case PlayerAction(playerId, action, data) =>
      players.get(playerId) match {
        case Some((_, gameController)) =>
          action match {
            case "voteDifficulty" =>
              val level = (data \ "level").as[String]
              val strategy = level match {
                case "E" => new EasyDifficulty
                case "M" => new MediumDifficulty
                case "H" => new HardDifficulty
                case _ => new EasyDifficulty
              }
              difficultyVotes += (playerId -> strategy)
              if (difficultyVotes.size == players.size) {
                // All players have voted
                val selectedDifficulty = selectDifficulty()
                players.values.foreach { case (_, controller) =>
                  controller.setDifficulty(selectedDifficulty)
                }
                broadcastStartGame(selectedDifficulty)
              }

            case "uncover" =>
              val x = (data \ "x").as[Int]
              val y = (data \ "y").as[Int]
              gameController.uncoverField(x, y)
              broadcastGameStates()

            case "flag" =>
              val x = (data \ "x").as[Int]
              val y = (data \ "y").as[Int]
              gameController.flagField(x, y)
              broadcastGameStates()

            case "undo" =>
              gameController.undo()
              broadcastGameStates()

            case "restart" =>
              gameController.restart()
              broadcastGameStates()

            // Add other actions as needed
          }
        case None =>
          // Player not found
          println(s"Player $playerId not found.")
      }

    case _ =>
      // Ignore unknown messages
  }

  def selectDifficulty(): DifficultyStrategy = {
    // Determine the most voted difficulty
    val difficultyCount = difficultyVotes.values.groupBy(identity).mapValues(_.size)
    val selectedDifficulty = difficultyCount.maxBy(_._2)._1
    selectedDifficulty
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
  }

  def broadcastGameStates(): Unit = {
    val gameStates = players.map { case (playerId, (_, controller)) =>
      val gameData = getGameStateAsJson(controller)
      Json.obj(
        "playerId" -> playerId,
        "gameData" -> gameData
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

  def getGameStateAsJson(gameController: Controller): JsValue = {
    val rows = gameController.field.size
    val cols = gameController.field.size
    val gameOver = gameController.game.gameState.toString == "Won" || gameController.game.gameState.toString == "Lost"

    val cells = (0 until rows).map { row =>
      (0 until cols).map { col =>
        val cellValue = gameController.field.cell(col, row)
        val cellStr = cellValue.toString
        val coveredStr = Symbols.Covered.toString
        val flagStr = Symbols.Flag.toString
        val emptyStr = Symbols.Empty.toString
        val bombStr = Symbols.Bomb.toString

        cellStr match {
        case `coveredStr` => Json.obj("state" -> "covered")
        case `flagStr` => Json.obj("state" -> "flag")
        case `emptyStr` => Json.obj("state" -> "empty")
        case s if s.matches("[1-8]") => Json.obj("state" -> "number", "value" -> s)
        case `bombStr` =>
            if (gameOver) Json.obj("state" -> "bomb") else Json.obj("state" -> "covered")
        case _ => Json.obj("state" -> "unknown")
        }
      }
    }
    Json.obj(
      "rows" -> rows,
      "cols" -> cols,
      "cells" -> cells,
      "gameState" -> gameController.game.gameState.toString
    )
  }
}
