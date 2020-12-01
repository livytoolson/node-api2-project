const express = require('express');
const Post = require('../data/db')

const router = express.Router();

router.post('/', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ eroorMessage: "Please provide title and contents for the post." })
    }
    Post.insert(req.body)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                error: "There was an error while saving the post to the database." 
            })
        })
})

router.post('/:id/comments', (req, res) => {
    if (!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
    const commentInfo = {...req.body, post_id: req.params.id}
    Post.insertComment(commentInfo)
        .then(comment => {
            res.status(201).json(comment)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error: "There was an error while saving the comment to the database." })
        })
})

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find(req.query)
        res.json(posts)
    } catch (error) {
        res.status(500).json({ error: "The posts information could not be retrieved." })
    }
})

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        }) 
        .catch(error => {
            console.log(error)
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})

router.get('/:id/comments', (req, res) => {
    Post.findCommentById(req.params.id)
        .then(comments => {
            if (comments.length > 0) {
                res.status(200).json(comments)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    Post.remove(id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: "Post has successfully been deleted." })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error: "The post could not be removed." })
        })
})

router.put('/:id', (req, res) => {
    const changes = req.body
    const { id } = req.params
    const updatedPostFromClient = req.body
    if (!updatedPostFromClient.title || !updatedPostFromClient.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    Post.update(id, changes)
    .then(updatedPostFromClient => {
        if (updatedPostFromClient > 0) {
            return Post.findById(id)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .then(post => {
        res.json(post)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "The post information could not be modified." })
    })
})


module.exports = router