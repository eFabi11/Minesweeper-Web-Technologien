package controllers

import org.scalatestplus.play._
import org.scalatest.matchers.should.Matchers // Ensure this import is included
import play.api.test._
import play.api.test.Helpers._
import play.api.libs.json._
import controllers.HomeController
import org.scalatest.wordspec.AnyWordSpec
import play.api.inject.guice._
import play.api.Application
import play.api.inject.Injector
import scala.concurrent.Future


class HomeControllerSpec extends AnyWordSpec with Matchers with GuiceOneAppPerTest with Injecting {

  "HomeController" should {

    "return the game homepage" in {
      val controller = inject[HomeController]
      val request = FakeRequest(GET, "/gameHomepage")
      val result = controller.gameHomepage().apply(request)

      whenReady(result) { r =>
        status(r) shouldBe OK
        contentType(r) shouldBe Some("text/html")
        contentAsString(r) should include("Welcome to the Minesweeper Game!")
      }
    }
  }
}