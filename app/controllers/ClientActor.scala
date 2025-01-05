package controllers

import org.apache.pekko.actor._
import play.api.libs.json._
import controllers.GameSession._

object ClientActor {
  def props(gameActor: ActorRef, out: ActorRef) = Props(new ClientActor(gameActor, out))
}

class ClientActor(gameActor: ActorRef, out: ActorRef) extends Actor {

  override def preStart(): Unit = {
    gameActor ! Join(self)
  }

  override def postStop(): Unit = {
    gameActor ! Left(self)
  }

  def receive = {
    case msg: JsValue =>
      // Nachricht vom WebSocket-Client empfangen
      val action = (msg \ "action").as[String]
      val data = (msg \ "data").as[JsValue]
      gameActor ! PlayerAction(action, data)

    case UpdateState(state) =>
      // Nachricht vom GameSession Actor erhalten, an WebSocket-Client senden
      out ! state

    case _ => // Ignoriere unbekannte Nachrichten
  }
}
