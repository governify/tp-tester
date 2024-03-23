#!/bin/sh
npm ci
ng serve --host 0.0.0.0 &
node server.js
