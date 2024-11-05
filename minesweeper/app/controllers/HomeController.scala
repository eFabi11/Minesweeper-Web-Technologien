package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import play.twirl.api.Html
import scala.xml.XML
import play.api.libs.json._
import java.io.File
import scala.concurrent._
import java.nio.file.{Files, Paths, StandardCopyOption}

import de.htwg.se.minesweeper.aview.{TUI, MinesweeperGUI}
import de.htwg.se.minesweeper.model.{Status => GameStatus, Symbols, Matrix}
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

  def gameHomepage() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.gameHomepage())
  }

  def gameGui() = Action { implicit request: Request[AnyContent] =>
    val gameState = gameController.game.gameState.toString
    Ok(views.html.gameGui(gameController, gameState))
  }

  def loadGamePage() = Action { implicit request: Request[AnyContent] =>
    val games = listSavedGamesImpl()
    Ok(views.html.loadGamePage(games))
  }

  def setDifficulty = Action { implicit request: Request[AnyContent] =>
    val diff = request.body.asFormUrlEncoded.get("level").head.toString
    val selectedStrategy: DifficultyStrategy = diff match {
      case "E" => new EasyDifficulty
      case "M" => new MediumDifficulty
      case "H" => new HardDifficulty
      case _ =>
        println("Invalid input, defaulting to Easy")
        new EasyDifficulty
    }
    gameController.setDifficulty(selectedStrategy)
    Ok(Json.obj("success" -> true))
  }

  def uncoverField = Action { implicit request =>
    val x = request.body.asFormUrlEncoded.get("x").head.toInt
    val y = request.body.asFormUrlEncoded.get("y").head.toInt
    gameController.uncoverField(x, y)
    Ok(Json.obj("success" -> true))
  }

  def flagField = Action { implicit request =>
    val x = request.body.asFormUrlEncoded.get("x").head.toInt
    val y = request.body.asFormUrlEncoded.get("y").head.toInt
    gameController.flagField(x, y)
    Ok(Json.obj("success" -> true))
  }

  def undo() = Action { implicit request: Request[AnyContent] =>
    gameController.undo()
    Ok(Json.obj("success" -> true))
  }

  def restart() = Action { implicit request: Request[AnyContent] =>
    gameController.restart()
    Ok(Json.obj("success" -> true))
  }

  def getBombMatrix = Action { implicit request: Request[AnyContent] =>
    val bombMatrix = gameController.field.bomben
    val bombMatrixJson = bombMatrix.rows.map(row => row.map {
      case Symbols.Bomb => "*"
      case Symbols.Covered => "-"
      case Symbols.Empty => " "
      case number => number.toString
    })
    Ok(Json.toJson(bombMatrixJson))
  }

  def saveGame() = Action { implicit request: Request[AnyContent] =>
    fileIOXML.save(gameController.field)
    moveAndRename()
    Ok(Json.obj("success" -> true))
  }

  def loadGame(gameId: String) = Action.async { implicit request: Request[AnyContent] =>
    gameController.setField(loadXML(gameId))
    gameController.setFirstMove(false)
    gameController.game.gameState = GameStatus.Playing
    Future.successful(Ok(Json.obj("redirect" -> routes.HomeController.gameGui().url.toString)))
  }

  def deleteGame(gameId: String) = Action.async { implicit request: Request[AnyContent] =>
    val filePath = Paths.get(s"saves/$gameId.xml")
    if (Files.exists(filePath)) {
      Files.delete(filePath)
      Future.successful(Ok(Json.obj("success" -> true)))
    } else {
      Future.successful(NotFound(Json.obj("error" -> "Game file not found.")))
    }
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

  def listSavedGamesImpl(): Seq[(String, String)] = {
    val savesDir = Paths.get("saves")
    if (!Files.exists(savesDir)) {
        // Create the "saves" directory if it doesn't exist
        Files.createDirectories(savesDir)
    }
    val saveFiles = Files.list(savesDir)
      .filter(p => p.toString.endsWith(".xml"))
      .collect(Collectors.toList())
      .asScala

    val games = saveFiles.map(file => {
        val fileName = file.getFileName.toString
        val gameId = fileName.substring(0, fileName.lastIndexOf("."))
        (gameId, fileName)
    })
    games.toSeq
  }
}