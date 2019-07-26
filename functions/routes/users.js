const users = require('../services/users');
const express = require('express');
const router = new express.Router();

/**
 * @param {user, sqlQuery} user and sqlQuery need to passed to createUser method to create the user in database; 
 */
router.post('/users', (req, res, next) => {
    const options = {
        user: req.body
    };
    users.registerUser(options).then(result => {
        res.status(result.status || 200).send(result.data);
    }).catch(err => {
        return res.status(err.status).send({
            status: err.status,
            error: err.error
        });
    })
});

module.exports = router;
