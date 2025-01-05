package controllers

import org.apache.pekko.actor._
import play.api.libs.json._
import de.htwg.se.minesweeper.difficulty.{DifficultyStrategy, EasyDifficulty, MediumDifficulty, HardDifficulty}
import de.htwg.se.minesweeper.model.{Symbols, field}
import de.htwg.se.minesweeper.model.field.Field
import de.htwg.se.minesweeper.model.game.Game
import de.htwg.se.minesweeper.controller.controller.Controller

object GameSession {
  def props(gameId: String) = Props(new GameSession(gameId))

  // Nachrichten
  case class Join(clientActor: ActorRef)
  case class Left(clientActor: ActorRef)
  case class PlayerAction(action: String, data: JsValue)
  case class UpdateState(state: JsValue)
}

class GameSession(gameId: String) extends Actor {
  import GameSession._

  // Liste der verbundenen ClientActors
  var clients = Set.empty[ActorRef]

  // Erstelle eine neue Instanz von gameController für diese Sitzung
  val game = new Game()
  val gameField = new Field(game.gridSize, Symbols.Covered)
  val gameController = new Controller(gameField, game)

  def receive = {
    case Join(clientActor) =>
      clients += clientActor
      // Senden Sie den aktuellen Spielzustand an den neuen Client
      clientActor ! UpdateState(getGameStateAsJson())

    case Left(clientActor) =>
      clients -= clientActor
      if (clients.isEmpty) {
        // Stoppen Sie den Actor, wenn keine Clients mehr verbunden sind
        context.stop(self)
      }

    case PlayerAction(action, data) =>
      action match {
        case "uncover" =>
          val x = (data \ "x").as[Int]
          val y = (data \ "y").as[Int]
          gameController.uncoverField(x, y)
          broadcastState()

        case "flag" =>
          val x = (data \ "x").as[Int]
          val y = (data \ "y").as[Int]
          gameController.flagField(x, y)
          broadcastState()

        case "setDifficulty" =>
          val level = (data \ "level").as[String]
          val selectedStrategy: DifficultyStrategy = level match {
            case "E" => new EasyDifficulty
            case "M" => new MediumDifficulty
            case "H" => new HardDifficulty
            case _ =>
              println("Invalid input, defaulting to Easy")
              new EasyDifficulty
          }
          gameController.setDifficulty(selectedStrategy)
          broadcastState()

        case "restart" =>
          gameController.restart()
          broadcastState()

        case "undo" =>
          gameController.undo()
          broadcastState()

        // Weitere Aktionen können hier hinzugefügt werden
      }

    case _ => // Ignoriere unbekannte Nachrichten
  }

  def getGameStateAsJson(): JsValue = {
    val rows = gameController.field.size
    val cols = gameController.field.size
    val cells = (0 until rows).map { row =>
      (0 until cols).map { col =>
        gameController.field.cell(col, row) match {
          case Symbols.Bomb => Json.obj("state" -> "bomb")
          case Symbols.Covered => Json.obj("state" -> "covered")
          case Symbols.Empty => Json.obj("state" -> "empty")
          case Symbols.Flag => Json.obj("state" -> "flag")
          case number => Json.obj("state" -> "number", "value" -> number.toString)
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

  def broadcastState(): Unit = {
    val state = getGameStateAsJson()
    clients.foreach(_ ! UpdateState(state))
  }
}
