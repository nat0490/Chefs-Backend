const express = require('express');
const router = express.Router();
const UserChef = require('../models/userChef');
const UserProfil = require('../models/userProfil');

router.post('/upgradeToChef', (req, res) => {
  // Vérifie si l'utilisateur est connecté
  if (!req.body.user) {
    res.status(401).json({ result: false, error: 'Unauthorized' });
    return;
  }

  // Recherche l'utilisateur existant
  UserProfil.findById(req.user._id, (err, existingUser) => {
    if (err) {
      res.status(500).json({ result: false, error: 'Error finding existing user' });
      return;
    }

    if (!existingUser) {
      res.status(404).json({ result: false, error: 'User not found' });
      return;
    }

    // Crée une instance de UserChef en utilisant les informations de l'utilisateur existant
    const newUserChef = new UserChef({
      spécialisation: req.body.spécialisation,
      userCompliment: req.body.userCompliment,
      experience: req.body.experience,
      passion: req.body.passion,
      services: req.body.services,
      userProfil: existingUser._id, // Utilise l'ID de l'utilisateur existant
    });

    // Sauvegarde l'utilisateur chef dans la base de données
    newUserChef.save((err, savedUserChef) => {
      if (err) {
        res.status(500).json({ result: false, error: 'Error saving user chef details' });
        return;
      }

      res.status(200).json({ result: true, savedUserChef });
    });
  });
});

module.exports = router;
