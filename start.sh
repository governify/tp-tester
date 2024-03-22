#!/bin/sh
npm install
npm install express
ng serve --host 0.0.0.0 &
node server.js
