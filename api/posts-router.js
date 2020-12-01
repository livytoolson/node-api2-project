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
                error: "There was an error while saving the post to the database" 
            })
        })
})
// router.post('/:id/comments', (req, res) => {

// })
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
        res.json(posts)
    } catch (error) {
        res.json(error.message)
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

module.exports = router