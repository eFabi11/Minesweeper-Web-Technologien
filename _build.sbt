name := "Minesweeper"
organization := "de.htwg.wa"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.13.15"

// Play Framework Core Dependencies
libraryDependencies ++= Seq(
  guice, // Dependency Injection
  "com.typesafe.play" %% "play-json" % "2.9.4", // JSON Support
)

// Add unmanaged libraries (e.g., custom JARs) in the "lib" folder
unmanagedBase := baseDirectory.value / "lib"

// Add additional compiler options
scalacOptions ++= Seq(
  "-Ytasty-reader", // Enable compatibility with TASTy (Scala 3 interop)
  "-deprecation",   // Show deprecated warnings
  "-feature"        // Highlight language features
)

// Define the Play application to use the default port or Heroku-provided port
PlayKeys.playDefaultPort := sys.env.getOrElse("PORT", "9000").toInt

// Uncomment if additional Twirl templates or routes imports are required
// TwirlKeys.templateImports += "de.htwg.wa.controllers._"
// play.sbt.routes.RoutesKeys.routesImport += "de.htwg.wa.binders._"
