import play.sbt.PlayImport._
import play.core.PlayVersion

name := """Minesweeper"""
organization := "de.htwg.wa"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.13.15"

libraryDependencies ++= Seq(
  guice,
  jdbc,
  ws,
  "org.scalatestplus.play" %% "scalatestplus-play" % "7.0.1" % Test,
  "com.typesafe.play" %% "play-json" % "2.9.2",
  "org.specs2" %% "specs2-core" % "4.12.4" % Test,
  "org.apache.pekko" %% "pekko-actor" % "1.0.1",
  "org.apache.pekko" %% "pekko-stream" % "1.0.1",
  "org.apache.pekko" %% "pekko-http-core" % "1.0.1",
  "org.playframework" %% "play-pekko-http-server" % PlayVersion.current
)

unmanagedBase := baseDirectory.value / "lib"

scalacOptions += "-Ytasty-reader"

// Fügt zusätzliche Pakete in Twirl hinzu
//TwirlKeys.templateImports += "de.htwg.wa.controllers._"

// Fügt zusätzliche Pakete in conf/routes hinzu
// play.sbt.routes.RoutesKeys.routesImport += "de.htwg.wa.binders._"
