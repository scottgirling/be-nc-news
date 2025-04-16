const express = require("express");
const cors = require("cors");
const app = express();

const apiRouter = require("./routes/api-router");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use((error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg })
    }
    next(error);
});

app.use((error, request, response, next) => {
    if (error.code === "23502") {
        response.status(400).send({ msg: "Bad Request: body does not contain the correct fields" });
    }
    next(error);
});

app.use((error, request, response, next) => {
    if (error.code === "22P02" || error.code === "42703") {
        response.status(400).send({ msg: "Bad Request: wrong data type" });
    }
    next(error);
})

app.use((error, request, response, next) => {
    response.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;