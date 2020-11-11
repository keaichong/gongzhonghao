const db = require('./db');

module.exports = (sql, parmas = []) => {
    return new Promise((resolve, reject) => {
        db.query(sql, parmas, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
};