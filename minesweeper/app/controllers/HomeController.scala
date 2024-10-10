package controllers

import javax.inject._
import play.api._
import play.api.mvc._

import com.google.inject.Guice
import de.htwg.se.minesweeper.aview.{TUI, MinesweeperGUI}
import de.htwg.se.minesweeper.controller.Controller
import de.htwg.se.minesweeper.util.StdInInputSource

@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

}