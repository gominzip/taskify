"use strict";

// 모듈
const express = require("express");
const app = express();

// 라우팅
const main = require("./src/routes/main");

// 앱 세팅
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use(express.static(`${__dirname}/src/public`)); // 정적경로 추가

app.use("/", main);

module.exports = app;
