const express = require('express');
const router = express.Router();
const UserChef = require('../models/userChef');

router.post('/upgradeToChef/:userId', (req, res) => {
  const userId = req.params.userId;

  UserChef.findOne({ userProfil: userId })
    .then(existingUser => {
      if (existingUser === null) {
        const newUserChef = new UserChef({
          spécialisation: req.body.spécialisation,
          userCompliment: req.body.userCompliment,
          experience: req.body.experience,
          passion: req.body.passion,
          services: req.body.services,
          userProfil: userId,
        });

        newUserChef.save().then(newDoc => {
          res.json({ result: true, newDoc });
        }).catch(err => {
          res.status(500).json({ result: false, error: 'Error saving user chef details', err });
        });
      } else {
        res.status(500).json({ result: false, error: 'Profile already exists for this user' });
      }
    })
    .catch(err => {
      res.status(500).json({ result: false, error: 'Error finding user profile', err });
    });
});

module.exports = router;
