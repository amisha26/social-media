const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {
    const { userId, password } = req.body;
    if (userId === req.params.id) {
        if (password) {
            try {
                const salt = await bcrypt.genSalt(10);
                const passwd = await bcrypt.hash(password, salt);
                const updatedBody = {...req.body, password: passwd};
                const user = await User.findByIdAndUpdate(userId, { $set: updatedBody });
                if (!user)
                    return res.status(404).json("user not found");
                return res.status(200).json("Account has been updated");
            
            } catch (err) {
                console.log(err);
                return res.status(500).json("something went wrong");
            }
        }
        try {
            const user = await User.findByIdAndUpdate(userId, { $set: req.body });
            if (!user)
                return res.status(404).json("user not found");
            return res.status(200).json("Account has been updated");

        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can update only your account");
    }
});

//delete user
router.delete("/:id", async (req, res) => {
    try{
        const {userId} = req.body;
        if (userId === req.params.id) {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user)
                return res.status(404).json("User not found");
            return res.status(200).json("User deleted");
        }
    } catch(err){
        console.log(err)
        return res.status(500).json(err);
    }
});


// get a user


// follow a user


// unfollow a user

module.exports = router