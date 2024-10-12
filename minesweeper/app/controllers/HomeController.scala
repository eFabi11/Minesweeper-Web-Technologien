package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import play.twirl.api.Html

import de.htwg.se.minesweeper.aview.{TUI, MinesweeperGUI}
import de.htwg.se.minesweeper.model.{Status => GameStatus, Symbols}
import de.htwg.se.minesweeper.model.field.Field
import de.htwg.se.minesweeper.model.game.Game
import de.htwg.se.minesweeper.controller.controller.Controller
import de.htwg.se.minesweeper.util.StdInInputSource
import de.htwg.se.minesweeper.difficulty.{DifficultyStrategy, EasyDifficulty, MediumDifficulty, HardDifficulty}
import de.htwg.se.minesweeper.util.FileIOXML

@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  val game = new Game()
  val gameField = new Field(game.gridSize, Symbols.Covered)
  val gameController = new Controller(gameField, game)

  val fileIOXML = new FileIOXML()

  // Initialize TUI and GUI
  val gameTui = new TUI(gameController, StdInInputSource)
  // Uncomment the GUI initialization
  // val gameGui = new MinesweeperGUI(gameController)

  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

  // TUI Game Board
  def gameBoard() = Action { implicit request: Request[AnyContent] =>
    val gameBoardText = gameController.toString
    val htmlGameBoardText = s"<pre>${gameBoardText.replace("\n", "<br>")}</pre>"
    val html: Html = Html(htmlGameBoardText)
    Ok(views.html.main(title = "Minesweeper TUI")(content = html))
  }

  // GUI Game Board
  def gameGui() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.gameGui(gameController))
  }

  def setDifficulty(diff: String) = Action { implicit request: Request[AnyContent] =>
    val selectedStrategy: DifficultyStrategy = diff match {
      case "E" => new EasyDifficulty
      case "M" => new MediumDifficulty
      case "H" => new HardDifficulty
      case _ =>
        println("Invalid input, defaulting to Easy")
        new EasyDifficulty
    }
    gameController.setDifficulty(selectedStrategy)
    Redirect(routes.HomeController.gameGui()) 
  }

  def uncoverField(x: Int, y: Int) = Action { implicit request: Request[AnyContent] =>
    gameController.uncoverField(x, y)
    if (gameController.game.gameState == GameStatus.Lost || gameController.game.gameState == GameStatus.Won) {
      val htmlText = s"<pre>${"Game over. Status: " + gameController.game.gameState}</pre>"
      val html: Html = Html(htmlText)
      Ok(views.html.main(title = "Minesweeper")(content = html))
    } else {
      Redirect(routes.HomeController.gameGui()) // Redirect to GUI
    }
  }

  def flagField(x: Int, y: Int) = Action { implicit request: Request[AnyContent] =>
    gameController.flagField(x, y)
    if (gameController.game.gameState == GameStatus.Lost || gameController.game.gameState == GameStatus.Won) {
      val htmlText = s"<pre>${"Game over. Status: " + gameController.game.gameState}</pre>"
      val html: Html = Html(htmlText)
      Ok(views.html.main(title = "Minesweeper")(content = html))
    } else {
      Redirect(routes.HomeController.gameGui()) // Redirect to GUI
    }
  }

  def undo() = Action { implicit request: Request[AnyContent] =>
    gameController.undo()
    Redirect(routes.HomeController.gameGui()) // Redirect to GUI
  }

  def restart() = Action { implicit request: Request[AnyContent] =>
    gameController.restart()
    Redirect(routes.HomeController.gameGui()) // Redirect to GUI
  }

  def saveGame() = Action { implicit request: Request[AnyContent] =>
    fileIOXML.save(gameController.field)
    Redirect(routes.HomeController.gameGui())
  }

  def loadGame() = Action { implicit request: Request[AnyContent] =>
    gameController.setField(fileIOXML.load)
    Redirect(routes.HomeController.gameGui())
  }

}