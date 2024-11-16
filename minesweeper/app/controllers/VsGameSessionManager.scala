package controllers

import org.apache.pekko.actor._
import play.api.libs.json._

object VsGameSessionManager {
  def props(): Props = Props(new VsGameSessionManager)

  // Messages
  case class Join(gameId: String, playerId: String, clientActor: ActorRef)
  case class Left(gameId: String, playerId: String)
  case class PlayerAction(gameId: String, playerId: String, action: String, data: JsValue)
}

class VsGameSessionManager extends Actor {
  import VsGameSessionManager._

  // Map of gameId to VsGameSession ActorRef
  var sessions = Map.empty[String, ActorRef]

  def receive: Receive = {
    case msg @ Join(gameId, playerId, clientActor) =>
      val session = sessions.getOrElse(gameId, {
        val newSession = context.actorOf(VsGameSession.props(gameId), s"vsSession-$gameId")
        sessions += gameId -> newSession
        newSession
      })
      session.forward(VsGameSession.Join(playerId, clientActor))

    case msg @ Left(gameId, playerId) =>
      sessions.get(gameId).foreach(_.forward(VsGameSession.Left(playerId)))

    case msg @ PlayerAction(gameId, playerId, action, data) =>
      sessions.get(gameId).foreach(_.forward(VsGameSession.PlayerAction(playerId, action, data)))
  }
}
