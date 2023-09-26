const router = require("express").Router();
const { response } = require("express");
const Post = require("../models/Post");

//create a post
router.post("/", async (req, res) => {
    try {
        const newPost = new Post(req.body);
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    } catch (err ) {
        console.log(err);
        return res.status(500).json(500);
    }
});

//update a post
router.put ("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({$set: req.body});
            return res.status(200).json("The post has been updated");
        } else {
            response.status(403).json("You can update only your post");
        }
    } catch (err) {
        console.log (err);
        return res.status(500).json(err);
    }
});

//delete a post
router.delete ("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            return res.status(200).json("Post has been deleted");
        } else {
            response.status(403).json("You can delete only your post");
        }
    } catch (err) {
        console.log(err);
        return res.status(403).json(err);
    }
});

//like a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // like a post
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({$push: {likes: req.body.userId}});
            return res.status(200).json("Post has been liked");
        } 
        // idslike a post
        else {
            await post.updateOne({$pull: {likes: req.body.userId}});
            return res.status(200).json("Post has been disliked");
        }
    } catch (err) {
        console.log(err);
        return res.status(403).json(err);
    }
});

//get a post


//get timeline posts


module.exports = router;