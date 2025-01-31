// const db = require("../../db/connection");

// const checkUserExists = (username) => {
//     return db.query("SELECT * FROM users WHERE username = $1", [username])
//     .then(({ rows }) => {
//         if (!rows.length) {
//             return Promise.reject({ status: 404, msg: "User does not exist." });
//         }
//     });
// }

// module.exports = checkUserExists;