const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("hi, it's user route");
});

module.exports = router