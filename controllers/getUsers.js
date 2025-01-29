const selectUsers = require("../models/selectUsers");

const getUsers = (request, response) => {
    selectUsers().then((users) => {
        response.status(200).send({ users });
    })
}

module.exports = getUsers;