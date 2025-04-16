const addTopic = require("../models/addTopic");

const postTopic = (request, response, next) => {
    const { slug, description } = request.body;
    addTopic(slug, description)
    .then((newTopic) => {
        response.status(201).send({ newTopic });
    })
    .catch((error) => {
        next(error);
    })
}

module.exports = postTopic;