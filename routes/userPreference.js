const express = require('express');
const router = express.Router();
const UserPreference = require('../models/userPreference');

// Créer de nouvelles préférences pour un utilisateur
router.post('/new-preference', async (req, res) => {
    const { userProfilId, typeCuisine } = req.body;

    const newPreference = new UserPreference({
        userProfil: userProfilId,
        typeCuisine: typeCuisine,
    });

    newPreference.save()
        .then(savedPreference => {
            res.status(201).json({ success: true, preference: savedPreference });
        })
        
});




// Supprimer une préférence utilisateur
router.delete('/delete-preference/:preferenceId', async (req, res) => {
  const { preferenceId } = req.params;

  UserPreference.findByIdAndDelete(preferenceId)
      .then(deletedPreference => {
          if (deletedPreference) {
              res.json({ success: true, message: 'Preference deleted successfully' });
          } else {
              res.status(404).json({ success: false, error: 'Preference not found' });
          }
      })
      
});

module.exports = router;

module.exports = router;
