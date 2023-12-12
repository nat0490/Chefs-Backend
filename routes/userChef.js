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


// Récupérer les informations d'un UserChef
router.get('/:userChefId', (req, res) => {
  UserChef.findOne({ _id: req.params.userChefId })
    .populate("userProfil")
    .exec()
    .then(data => {
      if (data) {
        res.json({ result: true, data });
      } else {
        res.json({ result: false, message: "UserChef profile not found" });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ result: false, message: 'Server error' });
    });
});







// Mettre à jour les spécialisation  d'un UserChef
router.put('/:userChefId/update-spécialisation', (req, res) => {
  const updatedFields = {};

  if (req.body.spécialisation) {
    updatedFields.spécialisation = req.body.spécialisation;
  }
  

  UserChef.findOneAndUpdate({ _id: req.params.userChefId }, { $set: updatedFields }, { new: true })
    .then(updatedUser => {
      if (updatedUser) {
        res.json({ result: true, updatedUser });
      } else {
        res.status(404).json({ result: false, error: 'UserChef not found' });
      }
    });
});


// Mettre à jour les userCompliment  d'un UserChef
router.put('/:userChefId/update-userCompliment', (req, res) => {
  const updatedFields = {};

  if (req.body.userCompliment) {
    updatedFields.userCompliment = req.body.userCompliment;
  }
  

  UserChef.findOneAndUpdate({ _id: req.params.userChefId }, { $set: updatedFields }, { new: true })
    .then(updatedUser => {
      if (updatedUser) {
        res.json({ result: true, updatedUser });
      } else {
        res.status(404).json({ result: false, error: 'UserChef not found' });
      }
    });
});




// Mettre à jour les experience d'un UserChef
router.put('/:userChefId/update-experience', (req, res) => {
  const updatedFields = {};

  if (req.body.experience) {
    updatedFields.experience = req.body.experience;
  }
  

  UserChef.findOneAndUpdate({ _id: req.params.userChefId }, { $set: updatedFields }, { new: true })
    .then(updatedUser => {
      if (updatedUser) {
        res.json({ result: true, updatedUser });
      } else {
        res.status(404).json({ result: false, error: 'UserChef not found' });
      }
    });
});


// Mettre à jour les experience d'un UserChef
router.put('/:userChefId/update-passion', (req, res) => {
  const updatedFields = {};

  if (req.body.passion) {
    updatedFields.passion = req.body.passion;
  }
  

  UserChef.findOneAndUpdate({ _id: req.params.userChefId }, { $set: updatedFields }, { new: true })
    .then(updatedUser => {
      if (updatedUser) {
        res.json({ result: true, updatedUser });
      } else {
        res.status(404).json({ result: false, error: 'UserChef not found' });
      }
    });
});


// Mettre à jour les services d'un UserChef
router.put('/:userChefId/update-services', (req, res) => {
  const updatedFields = {};

  if (req.body.services) {
    updatedFields.services = req.body.services;
  }
  

  UserChef.findOneAndUpdate({ _id: req.params.userChefId }, { $set: updatedFields }, { new: true })
    .then(updatedUser => {
      if (updatedUser) {
        res.json({ result: true, updatedUser });
      } else {
        res.status(404).json({ result: false, error: 'UserChef not found' });
      }
    });
});

// Supprimer un UserChef
router.delete("/:userChefId/delete", (req, res) => {
  UserChef.deleteOne({ _id: req.params.userChefId }).then(dataDeleted => {
    if (dataDeleted.deletedCount === 0) {
      res.status(500).json({ result: false, error: "Unable to delete" });
    } else {
      res.json({ result: true });
    }
  });
});


module.exports = router;
