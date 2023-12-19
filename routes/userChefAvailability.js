const express = require('express');
const router = express.Router();
const UserChefAvailability  = require('../models/userChefAvailability');





// Route pour ajouter une disponibilité pour un chef utilisateur spécifique
router.post('/:userChefId/add', async (req, res) => {
  try {
    const userChefId = req.params.userChefId;
    const { date, time, isAvailable } = req.body;

    const newAvailability = new UserChefAvailability({
      userChef: userChefId, // Associe l'ID de l'utilisateur chef à la disponibilité
      availability: { date, time, isAvailable },
    });

    const savedAvailability = await newAvailability.save();
    res.json(savedAvailability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour récupérer toutes les disponibilités d'un chef utilisateur spécifique
router.get('/:userChefId', async (req, res) => {
  try {
    const userChefId = req.params.userChefId;
    const availabilities = await UserChefAvailability.find({ userChef: userChefId });
    res.json(availabilities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


  


  // Route pour mettre à jour la date d'une disponibilité spécifique pour un chef utilisateur
  router.put('/:userChefId/update/:availabilityId/date', async (req, res) => {
    const { userChefId, availabilityId } = req.params;
    const { newdate } = req.body;
  
   
  
    UserChefAvailability.findOne({ _id: userChefId , _id: availabilityId })
      .then((data) => {
        console.log('Data found:', data);
  
        if (data.date === newdate) {
          res.json({ result: false, message: 'Same date' });
        } else {
          UserChefAvailability.updateOne(
            { _id: userChefId , _id: availabilityId },
            { $set: { 'availability.date': new Date(newdate) } }
          ).then((result) => {
            console.log('Update result:', result);
  
            if (result.acknowledged === false) {
              res.status(500).json({ result: false, error: 'noMatch' });
            } else {
              res.json({ result: true, message: 'Date changed' });
            }
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).json({ result: false, error: error.message });
      });
  });
  
  // Route pour mettre à jour la isAvailable d'une disponibilité spécifique pour un chef utilisateur
  router.put('/:userChefId/update/:availabilityId/isAvailable', async (req, res) => {
   
      const { userChefId, availabilityId } = req.params;
      const { newisAvailable } = req.body;
   
  
    UserChefAvailability.findOne({ _id: userChefId , _id: availabilityId })
      .then((data) => {
        console.log('Data found:', data);
  
        if (data.isAvailable === newisAvailable) {
          res.json({ result: false, message: 'Same isAvailable' });
        } else {
          UserChefAvailability.updateOne(
            { _id: userChefId , _id: availabilityId },
            { $set: { 'availability.isAvailable': newisAvailable } }
          ).then((result) => {
            console.log('Update result:', result);
  
            if (result.acknowledged === false) {
              res.status(500).json({ result: false, error: 'noMatch' });
            } else {
              res.json({ result: true, message: 'isAvailable changed' });
            }
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).json({ result: false, error: error.message });
      });
  });
  
  // Route pour mettre à jour la time d'une disponibilité spécifique pour un chef utilisateur
  router.put('/:userChefId/update/:availabilityId/time', async (req, res) => {
   
    const { userChefId, availabilityId } = req.params;
    const { newtime } = req.body;
 

  UserChefAvailability.findOne({ _id: userChefId , _id: availabilityId })
    .then((data) => {
      

      if (data.time === newtime) {
        res.json({ result: false, message: 'Same time' });
      } else {
        UserChefAvailability.updateOne(
          { _id: userChefId , _id: availabilityId },
          { $set: { 'availability.time': newtime } }
        ).then((result) => {
          console.log('Update result:', result);

          if (result.acknowledged === false) {
            res.status(500).json({ result: false, error: 'noMatch' });
          } else {
            res.json({ result: true, message: 'time changed' });
          }
        });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).json({ result: false, error: error.message });
    });
});









  // Route pour supprimer une disponibilité spécifique pour un chef utilisateur
router.delete('/:userChefId/delete/:availabilityId', async (req, res) => {
    try {
      const { userChefId, availabilityId } = req.params;
  
      await UserChefAvailability.findOneAndRemove({ _id: availabilityId, userChef: userChefId });
  
      res.json({ message: 'Availability deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  
  

module.exports = router;
