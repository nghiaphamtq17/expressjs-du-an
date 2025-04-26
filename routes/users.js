var express = require('express');
var router = express.Router();
const { registerUser, loginUser } = require('../services/user.service')

// /user/

router.post('/register', async(req, res, next) => registerUser(req,res));

router.post('/login', async(req, res, next) => loginUser(req,res))

module.exports = router;
