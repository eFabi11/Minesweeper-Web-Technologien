package controllers

import org.apache.pekko.actor._
import play.api.libs.json._
import controllers.VsGameSession
import controllers.VsGameSessionManager
import controllers.VsGameSession.UpdateState

object VsClientActor {
  def props(gameId: String, playerId: String, out: ActorRef, vsGameSessions: ActorRef): Props =
    Props(new VsClientActor(gameId, playerId, out, vsGameSessions))
}

class VsClientActor(gameId: String, playerId: String, out: ActorRef, vsGameSessions: ActorRef) extends Actor {
  import VsGameSessionManager._

  override def preStart(): Unit = {
    vsGameSessions ! Join(gameId, playerId, self)
  }

  override def postStop(): Unit = {
    vsGameSessions ! Left(gameId, playerId)
  }

  def receive: Receive = {
  case msg: JsValue =>
    val action = (msg \ "action").as[String]
    val data = (msg \ "data").asOpt[JsValue].getOrElse(Json.obj())
    vsGameSessions ! PlayerAction(gameId, playerId, action, data)
  case UpdateState(state) =>
    out ! state
}
}
