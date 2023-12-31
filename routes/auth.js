const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        }
        );
        const user = await newUser.save();
        return res.status(200).json(user);

    } catch (err) {
        return res.status(500).json(err);
    }
});


//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user == null) {
            return res.status(404).json("User not found");
        }
        else {
            const passwd = await bcrypt.compare(req.body.password, user.password);
            if (passwd == false) {
                return res.status(404).json("wrong password");
            }
            else{
                return res.status(200).json("login successful");
            }
        }

    } catch (err) {
        return res.status(500).json(err);
    }
});


module.exports = router
