const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.send("Welcome");
})

router.post('/register', async(req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        !user && res.status(401).json("Wrong credentials!");

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8); 

        originalPassword !== req.body.password && res.status(401).json("Wrong credentials!");

        if(user){
            const accessToken = jwt.sign({
                id: user.id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SEC,
            {expiresIn: "3d"}
            );
    
            const {password, ...others} = user._doc;
            res.status(200).json({...others, accessToken});
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;