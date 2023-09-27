const router = require("express").Router();
const { response } = require("express");
const Post = require("../models/Post");
const User = require("../models/User");

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
        return res.status(500).json(err);
    }
});

//get a post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post)
            return res.status(404).json("Post not found");
        return res.status(200).json(post);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});


//get timeline posts
router.get("/timeline/all", async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        if (!currentUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const post = await Post.find({ userId: currentUser._id });
        const friendsPost = await Promise.all(
            currentUser.following.map(friendId => {
                return Post.find({ userId: friendId });
            })
        );

        res.json(post.concat(...friendsPost));
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});



module.exports = router;