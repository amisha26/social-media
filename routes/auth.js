const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


//REGISTER
// router.get("/register", async (req, res) => {
//     const user = await new User(
//         {
//             username: "john",
//             email: "john@example.com",
//             password: "12345"
//         }
//     )

//     await user.save();
//     res.send("ok")
// });

//REGISTER
router.post("/register", async (req, res) => {
    try{
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User(
            {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            }
        );

        //save user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch(err){
        console.log(err);
    }
});


//LOGIN
router.post("/login", async (req, res) => {
    
}
);

module.exports = router