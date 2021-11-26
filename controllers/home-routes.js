const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User } = require('../models');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
          'id',
          'title',
          'post_text',
          'created_at'
        ],
        include: [
          {
            model: User,
            attributes: ['username']
          }
        ]
      })
        .then(dbPostData => {
          const posts = dbPostData.map(post => post.get({ plain: true }));
          // pass post objects into the homepage template
          res.render('homepage', { posts });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
  });

module.exports = router;