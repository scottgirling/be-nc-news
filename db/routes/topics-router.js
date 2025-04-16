const getTopics = require("../../controllers/getTopics");
const postTopic = require("../../controllers/postTopic");

const topicsRouter = require("express").Router();

topicsRouter
    .route("/")
    .get(getTopics)
    .post(postTopic);

module.exports = topicsRouter;