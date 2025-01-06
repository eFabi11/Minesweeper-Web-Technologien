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

import org.apache.pekko.actor._
import org.apache.pekko.stream._
import org.apache.pekko.stream.scaladsl._
import play.api.libs.streams.ActorFlow
import scala.concurrent.Future



@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents)(implicit system: ActorSystem, mat: Materializer) extends BaseController {

  val game = new Game()
  val gameField = new Field(game.gridSize, Symbols.Covered)
  val gameController = new Controller(gameField, game)

  private val gameSessions = scala.collection.mutable.Map[String, ActorRef]()
  private val vsGameSessions = system.actorOf(VsGameSessionManager.props(), "vsGameSessions")

  val fileIOXML = new FileIOXML()

  def gameHomepage() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.gameHomepage())
  }

  def gameGui() = Action { implicit request: Request[AnyContent] =>
    gameController.setDifficulty(new EasyDifficulty)

    val htmlContent = views.html.gameGui().toString

    val headContent = "<head>" + (htmlContent.split("<body>").head) + "</head>"
    val bodyContent = htmlContent.split("<body>").last.split("</body>").head

    Ok(Json.obj("success" -> true, "head" -> headContent, "body" -> bodyContent))
  }

  def getGameBoard = Action { implicit request: Request[AnyContent] =>
    val rows = gameController.field.size
    val cols = gameController.field.size
    val cells = (0 until rows).map { row =>
      (0 until cols).map { col =>
        gameController.field.cell(col, row) match {
          case Symbols.Bomb => Json.obj("state" -> "bomb", "image" -> routes.Assets.versioned("assets/Mine.png").url)
          case Symbols.Covered => Json.obj("state" -> "covered")
          case Symbols.Empty => Json.obj("state" -> "empty")
          case Symbols.Flag => Json.obj("state" -> "flag")
          case number => Json.obj("state" -> "number", "value" -> number.toString)
        }
      }
    }
    val gameBoardJson = Json.obj(
      "rows" -> rows,
      "cols" -> cols,
      "cells" -> cells
    )
    Ok(gameBoardJson)
  }

  def loadGamePage() = Action { implicit request: Request[AnyContent] =>
    val htmlContent = views.html.loadGamePage().toString

    val headContent = "<head>" + (htmlContent.split("<body>").head) + "</head>"
    val bodyContent = htmlContent.split("<body>").last.split("</body>").head

    Ok(Json.obj("success" -> true, "head" -> headContent, "body" -> bodyContent))
  }

  def setDifficulty = Action { implicit request: Request[AnyContent] =>
    gameController.restart()
    val diff = request.body.asFormUrlEncoded.get("level").head.toString
    val selectedStrategy: DifficultyStrategy = diff match {
      case "E" | "easy" => new EasyDifficulty
      case "M" | "medium" => new MediumDifficulty
      case "H" | "hard" => new HardDifficulty
      case _ =>
        println("Invalid input, defaulting to Easy")
        new EasyDifficulty
    }
    gameController.setDifficulty(selectedStrategy)
    val responseJson = Json.obj("success" -> true, "gameState" -> gameController.game.gameState.toString)
    println(s"Response JSON: ${responseJson.toString()}")
    Ok(responseJson).as(ContentTypes.JSON)

  }

  def uncoverField = Action { implicit request =>
    val x = request.body.asFormUrlEncoded.get("x").head.toInt
    val y = request.body.asFormUrlEncoded.get("y").head.toInt
    gameController.uncoverField(x, y)
    Ok(Json.obj("success" -> true, "gameState" -> gameController.game.gameState.toString))
  }

  def flagField = Action { implicit request =>
    val x = request.body.asFormUrlEncoded.get("x").head.toInt
    val y = request.body.asFormUrlEncoded.get("y").head.toInt
    gameController.flagField(x, y)
    Ok(Json.obj("success" -> true, "gameState" -> gameController.game.gameState.toString))
  }

  def undo() = Action { implicit request: Request[AnyContent] =>
    gameController.undo()
    Ok(Json.obj("success" -> true, "gameState" -> gameController.game.gameState.toString))
  }

  def restart() = Action { implicit request: Request[AnyContent] =>
    gameController.restart()
    Ok(Json.obj("success" -> true, "gameState" -> gameController.game.gameState.toString))
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

  def saveGame() = Action.async { implicit request: Request[AnyContent] =>
    fileIOXML.save(gameController.field)
    moveAndRename()
    Future.successful(Ok(Json.obj("success" -> true)))
  }

  def loadGame(gameId: String) = Action.async { implicit request: Request[AnyContent] =>
    val field = loadXML(gameId)
    gameController.setField(loadXML(gameId))
    gameController.setFirstMove(false)
    gameController.game.gameState = GameStatus.Playing

    val htmlContent = views.html.gameGui().toString

    val headContent = "<head>" + (htmlContent.split("<body>").head) + "</head>"
    val bodyContent = htmlContent.split("<body>").last.split("</body>").head

    Future.successful(Ok(Json.obj("success" -> true, "field" -> field.toString)))
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

  def getGamesList() = Action { implicit request =>
    val games = listSavedGamesImpl()
    val gamesJson = Json.toJson(games.map { case (gameId, fileName) =>
      Json.obj("gameId" -> gameId, "fileName" -> fileName)
    })
    Ok(Json.obj("games" -> gamesJson))
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

  def coopSocket(gameId: String) = WebSocket.accept[JsValue, JsValue] { request =>
    ActorFlow.actorRef { out =>
      val gameActor = gameSessions.getOrElseUpdate(gameId, system.actorOf(GameSession.props(gameId), s"gameSession-$gameId"))
      ClientActor.props(gameActor, out)
    }
  }

  def vsWebSocket(gameId: String, playerId: String) = WebSocket.accept[JsValue, JsValue] { request =>
    ActorFlow.actorRef { out =>
      VsClientActor.props(gameId, playerId, out, vsGameSessions)
    }
  }

}