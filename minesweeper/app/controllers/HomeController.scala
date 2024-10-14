package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import play.twirl.api.Html
import scala.xml.XML
import java.io.File
import java.nio.file.{Files, Paths, StandardCopyOption}

import de.htwg.se.minesweeper.aview.{TUI, MinesweeperGUI}
import de.htwg.se.minesweeper.model.{Status => GameStatus, Symbols}
import de.htwg.se.minesweeper.model.field.Field
import de.htwg.se.minesweeper.model.game.Game
import de.htwg.se.minesweeper.controller.controller.Controller
import de.htwg.se.minesweeper.util.StdInInputSource
import de.htwg.se.minesweeper.difficulty.{DifficultyStrategy, EasyDifficulty, MediumDifficulty, HardDifficulty}
import de.htwg.se.minesweeper.util.FileIOXML

import java.nio.file.{Files, Paths}
import java.util.stream.Collectors
import scala.collection.JavaConverters._

@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  val game = new Game()
  val gameField = new Field(game.gridSize, Symbols.Covered)
  val gameController = new Controller(gameField, game)

  val fileIOXML = new FileIOXML()

  // Initialize TUI and GUI
  // val gameTui = new TUI(gameController, StdInInputSource)
  // Uncomment the GUI initialization
  // val gameGui = new MinesweeperGUI(gameController)

  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

  def gameHomepage() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.gameHomepage())
  }

  // TUI Game Board
  def gameTui() = Action { implicit request: Request[AnyContent] =>
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
      val gameOverMessage = gameController.game.gameState.toString
      Ok(views.html.gameOverScreen(gameOverMessage))
    } else {
      Redirect(routes.HomeController.gameGui()) // Redirect to GUI
    }
  }

  def flagField(x: Int, y: Int) = Action { implicit request: Request[AnyContent] =>
    gameController.flagField(x, y)
    if (gameController.game.gameState == GameStatus.Lost || gameController.game.gameState == GameStatus.Won) {
      val gameOverMessage = gameController.game.gameState.toString
      Ok(views.html.gameOverScreen(gameOverMessage))
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
    moveAndRename()
    Redirect(routes.HomeController.gameGui())
  }

  def loadGame(name: String) = Action { implicit request: Request[AnyContent] =>
    gameController.setField(loadXML(name))
    gameController.setFirstMove(false)
    gameController.game.gameState = GameStatus.Playing
    Redirect(routes.HomeController.gameGui())
  }

  def loadXML(name: String): Field = {
    val file = scala.xml.XML.loadFile(s"saves/$name.xml")
    val size = (file \\ "field" \ "@size").text.toInt

    var field = new Field(size, Symbols.Covered)

    (file \\ "cell").foreach { cellNode =>
      val row = (cellNode \ "@row").text.toInt
      val col = (cellNode \ "@col").text.toInt
      val value = (cellNode \ "@value").text match {
        case "-" => Symbols.Covered
        case "*" => Symbols.Bomb
        case " " => Symbols.Empty
        case "f" => Symbols.Flag
        case "0" => Symbols.Zero
        case "1" => Symbols.One
        case "2" => Symbols.Two
        case "3" => Symbols.Three
        case "4" => Symbols.Four
        case "5" => Symbols.Five
        case "6" => Symbols.Six
        case "7" => Symbols.Seven
        case "8" => Symbols.Eight
      }
      field = field.copy(matrix = field.matrix.replaceCell(row, col, value))
    }
    field
  }
  
  def moveAndRename(): Unit = {
    val savesDir = new File("saves")
    if (!savesDir.exists()) savesDir.mkdirs()

    val originalFile = new File("field.xml")
    if (originalFile.exists()) {
      val nextId = getNextFileId(savesDir)
      val renamedFile = new File(s"saves/field_$nextId.xml")
      Files.move(Paths.get(originalFile.getPath), Paths.get(renamedFile.getPath), StandardCopyOption.REPLACE_EXISTING)
    }
  }

  def getNextFileId(dir: File): Int = {
    val xmlFiles = dir.listFiles().filter(_.getName.endsWith(".xml"))
    val fileNumbers = xmlFiles.map(_.getName.stripPrefix("field_").stripSuffix(".xml").toInt)
    if (fileNumbers.isEmpty) 1 else fileNumbers.max + 1
  }

  def loadGamePage() = Action { implicit request: Request[AnyContent] =>
    val games = listSavedGamesImpl()  // Direktes Aufrufen der Implementierung, die die Dateiliste zurückgibt
    Ok(views.html.loadGamePage(games))
}

// Hilfsmethode, die tatsächlich die Spiele aus dem Verzeichnis ausliest
def listSavedGamesImpl(): Seq[(String, String)] = {
    val savesDir = Paths.get("saves")
    val saveFiles = Files.list(savesDir).filter(p => p.toString.endsWith(".xml")).collect(Collectors.toList()).asScala

    val games = saveFiles.map(file => {
        val fileName = file.getFileName.toString
        val gameId = fileName.substring(0, fileName.lastIndexOf("."))
        (gameId, fileName)  // Tuple containing the game ID and the file name
    })
    games.toSeq
}

def deleteGame(gameId: String) = Action { implicit request: Request[AnyContent] =>
    val filePath = Paths.get(s"saves/$gameId.xml")
    if (Files.exists(filePath)) {
        Files.delete(filePath)
        Redirect(routes.HomeController.loadGamePage()).flashing("success" -> "Game deleted successfully.")
    } else {
        Redirect(routes.HomeController.loadGamePage()).flashing("error" -> "Game file not found.")
    }
}


}
