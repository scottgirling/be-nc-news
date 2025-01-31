const addArticle = require("../models/addArticle");

const postArticle = (request, response, next) => {
    const { author, title, body, topic, article_img_url } = request.body;

    addArticle(author, title, body, topic, article_img_url)
    .then((newArticle) => {
        response.status(201).send({ newArticle });
    })
    .catch((error) => {
        next(error);
    })
}

module.exports = postArticle;