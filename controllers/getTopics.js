const selectTopics = require("../models/selectTopics");

const getTopics = (request, response, next) => {
    selectTopics().then((topics) => {
        response.status(200).send({ topics });
    })
    .catch(next);
}

module.exports = getTopics;