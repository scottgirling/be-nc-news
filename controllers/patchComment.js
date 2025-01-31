const updateComment = require("../models/updateComment");
const checkCommentExists = require("../models/utils/checkCommentExists");

const patchComment = (request, response, next) => {
    const { comment_id } = request.params;
    const { inc_votes } = request.body;
   
    checkCommentExists(comment_id)
    .then(() => {
        return updateComment(inc_votes, comment_id)
    })
    .then((updatedComment) => {
        response.status(200).send({ updatedComment })
    })
    .catch((error) => {
        next(error);
    })
}

module.exports = patchComment;