const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
  console.log(req.session);

    Post.findAll({
        attributes: [
          'id',
          'title',
          'post_text',
          'created_at'
        ],
        order: [['created_at', 'DESC']],
        include: [
          {
            model: User,
            attributes: ['username']
          },
          {
            model: Comment
          }
        ]
      })
        .then(dbPostData => {
          const posts = dbPostData.map(post => post.get({ plain: true }));
          // pass post objects into the homepage template
          res.render('homepage', { posts, loggedIn: req.session.loggedIn });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
  });

  router.get('/usersort', (req, res) => {
    console.log(req.session);
  
      Post.findAll({
          attributes: [
            'id',
            'title',
            'post_text',
            'created_at',
            'user_id'
          ],
          order: [['user_id']],
          include: [
            {
              model: User,
              attributes: ['username']
            },
            {
              model: Comment
            }
          ]
        })
          .then(dbPostData => {
            const posts = dbPostData.map(post => post.get({ plain: true }));
            // pass post objects into the homepage template
            res.render('homepage', { posts, loggedIn: req.session.loggedIn });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
    });

  router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }

    res.render('login');
  });

  router.get('/post/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'post_text', 'title', 'created_at'],
      include: [
          {
              model: Comment,
              attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
              // also include the User model itself so it can attach the username to the comment
              include: {
                  model: User,
                  attributes: ['username']
              }
          },
          {
              model: User,
              attributes: ['username']
          }
      ]
    })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });

      // pass data to template
      res.render('single-post', {
        post,
        loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });

module.exports = router;
