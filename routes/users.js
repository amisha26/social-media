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
    try {
        const {userId} = req.body;
        if (userId === req.params.id) {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user)
                return res.status(404).json("User not found");
            return res.status(200).json("User deleted");
        }
    } catch(err) {
        console.log(err)
        return res.status(500).json(err);
    }
});


// get a user
router.get("/:id", async (req, res) => {
    try {
        const {userId} = req.body;
        if (userId === req.params.id) {
            const user = await User.findById(req.params.id);
            // to fetch fields other than the one's mentioned below
            const {password, updatedAt, ...other} = user._doc; 

            if (!user)
                return res.status(404).json("User not found");
            return res.status(200).json(other);
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json(err);
    }
});


// follow a user
router.put("/:id/follow", async (req, res) => {
    try {
        const {userId} = req.body;
        if (userId != req.params.id) {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(userId);
            if (!user.followers.includes(userId)){
                await user.updateOne({$push : {followers: userId}});
                await currentUser.updateOne({$push : {following: req.params.id}});
                return res.status(200).json("user has been followed");
            } else {
                return res.status(403).json("You already follow this user");
            }
        } else {
            return res.status(403).json("You can't follow your own account");
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});


// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    try {
        const {userId} = req.body;
        if (userId != req.params.id) {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(userId);
            console.log("curr userrr :", currentUser);
            if (user.followers.includes(userId)) {
                await user.updateOne({$pull : {followers: userId}});
                await currentUser.updateOne({$pull : {following: req.params.id}});
                return res.status(200).json("user has been unfollowed");
            } else {
                return res.status(403).json("You don't follow this user");
            }
        } else {
            return res.status(403).json("You can't unfollow your own account");
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json(err);
    }
});

module.exports = router