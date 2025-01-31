const getTopics = require("../../controllers/getTopics");

const topicsRouter = require("express").Router();

topicsRouter
    .route("/")
    .get(getTopics);

module.exports = topicsRouter;