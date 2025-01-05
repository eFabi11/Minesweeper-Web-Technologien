// Play Framework Plugin für die Version 3.0.5
addSbtPlugin("org.playframework" % "sbt-plugin" % "3.0.5")

// Unterstützung für Giter8-Templates (optional, für Scaffold-Projekte)
addSbtPlugin("org.foundweekends.giter8" % "sbt-giter8-scaffold" % "0.16.2")

// Code Coverage Plugin (optional, für Testabdeckung)
addSbtPlugin("org.scoverage" % "sbt-scoverage" % "2.2.2")

// Heroku Plugin für einfacheres Deployment (optional, für automatisierte Tasks)
addSbtPlugin("com.heroku" % "sbt-heroku" % "0.10.2")

// Unterstützung für Abhängigkeitsmanagement von Scala XML-Modulen
ThisBuild / libraryDependencySchemes += "org.scala-lang.modules" %% "scala-xml" % VersionScheme.Always
