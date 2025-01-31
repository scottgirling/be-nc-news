const getUsers = require("../../controllers/getUsers");
const getUserByUsername = require("../../controllers/getUserByUsername");

const usersRouter = require("express").Router();

usersRouter
    .route("/")
    .get(getUsers);

usersRouter
    .route("/:username")
    .get(getUserByUsername);

module.exports = usersRouter;