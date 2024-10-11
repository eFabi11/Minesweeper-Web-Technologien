package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import play.twirl.api.Html

import com.google.inject.Guice
import de.htwg.se.minesweeper.aview.{TUI, MinesweeperGUI}
import de.htwg.se.minesweeper.model.{Status => GameStatus, Symbols, Game, Field}
import de.htwg.se.minesweeper.controller.Controller
import de.htwg.se.minesweeper.util.StdInInputSource
import de.htwg.se.minesweeper.difficulty.{DifficultyStrategy, EasyDifficulty, MediumDifficulty, HardDifficulty}

@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  val game = new Game()
  val gameField = new Field(game.gridSize, Symbols.Covered)
  val gameController = new Controller(gameField, game)
  //val gameState = new Status()

  val gameTui = new TUI(gameController, StdInInputSource)
  //val gameGui = new MinesweeperGUI(gameController)

  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

  //TUI Initialisation
  def gameBoard() = Action { implicit request: Request[AnyContent] =>
    val gameBoardText = gameController.toString
    val htmlGameBoardText = s"<pre>${gameBoardText.replace("\n", "<br>")}</pre>"
    val html: Html = Html(htmlGameBoardText)
    Ok(views.html.main(title = "Minesweeper")(content = html))
  }

  def setDifficulty(diff: String) = Action { implicit request: Request[AnyContent] =>
    val selectedStrategy: DifficultyStrategy = diff match {
      case "E" => new EasyDifficulty
      case "M" => new MediumDifficulty
      case "H" => new HardDifficulty
      case _ =>
        println("Ungültige Eingabe, Standard: Easy")
        new EasyDifficulty
    }
    gameController.setDifficulty(selectedStrategy)
    Redirect(routes.HomeController.gameBoard())
  }

  def uncoverField(x: Int, y: Int) = Action { implicit request: Request[AnyContent] =>
    gameController.uncoverField(x,y)
    if (gameController.game.gameState == GameStatus.Lost || gameController.game.gameState == GameStatus.Won) {
      val htmlText = s"<pre>${"Spiel beendet. Status: " + gameController.game.gameState}</pre>"
      val html: Html = Html(htmlText)
      Ok(views.html.main(title = "Minesweeper")(content = html))
    } else {
      Redirect(routes.HomeController.gameBoard())
    }
  }

  def flagField(x: Int, y: Int) = Action { implicit request: Request[AnyContent] =>
    gameController.flagField(x,y)
    if (gameController.game.gameState == GameStatus.Lost || gameController.game.gameState == GameStatus.Won) {
      val htmlText = s"<pre>${"Spiel beendet. Status: " + gameController.game.gameState}</pre>"
      val html: Html = Html(htmlText)
      Ok(views.html.main(title = "Minesweeper")(content = html))
    } else {
      Redirect(routes.HomeController.gameBoard())
    }
  }

  def undo() = Action { implicit request: Request[AnyContent] =>
    gameController.undo()
    Redirect(routes.HomeController.gameBoard())
  }

  def restart() = Action { implicit request: Request[AnyContent] =>
    gameController.restart()
    Redirect(routes.HomeController.gameBoard())
  }
}