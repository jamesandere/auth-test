const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const User = require('../models/User');
const router = require('express').Router();

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);  
    } catch (error) {
        res.status(500).json(error)
    }
});

module.exports = router;