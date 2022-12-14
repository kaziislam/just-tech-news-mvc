const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Vote } = require('../../models');

// get all users' posts
router.get('/', (req, res) => {
    console.log('=======================');
    Post.findAll({
        // Query configuration
        attributes: ['id', 'post_url', 'title', 'created_at',
            [sequelize.literal('(select count(*) from vote where post.id = vote.post_id)'), 'vote_count']
        ],
        order: [['created_at', 'DESC']],
        // include here is SQL JOIN
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            res.json(dbPostData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err);
        });
});

// get a single post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at',
            [sequelize.literal('(select count(*) from vote where post.id = vote.post_id )'), 'vote_count']
        ],
        // include here is SQL JOIN
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found wiht this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// create a post
router.post('/', (req, res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'http://taskmaster.com/press', user_id: 1}
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
        .then(dbPostData => {
            res.json(dbPostData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err);
        });
});

// create a vote
// PUT /api/posts/upvote - when we vote on a post, we're technically updating that post's data
router.put('/upvote', (req, res) => {
    // custom static (from `Post.js`) method created in models/Post.js
    Post.upvote(req.body, { Vote })
        .then(updatedPostData => res.json(updatedPostData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

// update a post
router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// delete a post
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(400).json({ message: 'No post found with this id' });
                return
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;