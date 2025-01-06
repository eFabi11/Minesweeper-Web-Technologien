#!/bin/bash
# Start Backend (sbt) in Hintergrund
sbt run &
# Starte Frontend (npm)
npm run serve