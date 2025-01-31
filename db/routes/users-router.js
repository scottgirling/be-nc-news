const getUsers = require("../../controllers/getUsers");

const usersRouter = require("express").Router();

usersRouter
    .route("/")
    .get(getUsers);

module.exports = usersRouter;