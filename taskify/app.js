"use strict";

// 모듈
const express = require("express");
const app = express();

// 라우팅
const columnRoutes = require("./src/routes/ColumnRoutes");
const taskRoutes = require("./src/routes/TaskRoutes");

// 앱 세팅
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/src/public`));

app.use("/", columnRoutes);
app.use("/tasks", taskRoutes);

module.exports = app;
