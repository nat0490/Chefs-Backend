const express = require('express');
const router = express.Router();
const UserChef = require('../models/userChef');


// Pour cree un userchef
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
        })
      } else {
        res.status(500).json({ result: false, error: 'Profile already exists for this user' });
      }
    })
    
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
    
});







//METTRE A JOUR  spécialisation 
router.put('/:userChefId/updatespecialisation', async (req, res) => {
  const { userChefId } = req.params;
  const { newspécialisation } = req.body;
  UserChef.findOne( {_id: userChefId})
    .then((data)=> {
      if (data.spécialisation === newspécialisation) { //spécialisation identique à l'ancien
        res.json({ result: false, message: 'Same spécialisation'})
      } else {
        UserChef.updateOne(
          { _id: userChefId },
          { $set: { spécialisation: newspécialisation }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'spécialisation change' });
            }
          }));
      }
  })
});


// Mettre à jour les userCompliment  d'un UserChef
router.put('/:userChefId/update', async (req, res) => {
  const { userChefId } = req.params;
  const { newsuserCompliment } = req.body;
  UserChef.findOne( {_id: userChefId})
    .then((data)=> {
      if (data.userCompliment === newsuserCompliment) { //userCompliment identique à l'ancien
        res.json({ result: false, message: 'Same userCompliment'})
      } else {
        UserChef.updateOne(
          { _id: userChefId },
          { $set: { spécialisation: newsuserCompliment }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'userCompliment change' });
            }
          }));
      }
  })
});




//METTRE A JOUR  l'experience 
router.put('/:userChefId/updateexperience', async (req, res) => {
  const { userChefId } = req.params;
  const { newsexperience } = req.body;
  UserChef.findOne( {_id: userChefId})
    .then((data)=> {
      if (data.experience === newsexperience) { //experience identique à l'ancien
        res.json({ result: false, message: 'Same experience'})
      } else {
        UserChef.updateOne(
          { _id: userChefId },
          { $set: { experience: newsexperience}}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'experience change' });
            }
          }));
      }
  })
});


//METTRE A JOUR la passion 
router.put('/:userChefId/updatepassion', async (req, res) => {
  const { userChefId } = req.params;
  const { newspassion } = req.body;
  UserChef.findOne( {_id: userChefId})
    .then((data)=> {
      if (data.passion === newpassion) { //passion identique à l'ancien
        res.json({ result: false, message: 'Same passion'})
      } else {
        UserChef.updateOne(
          { _id: userChefId },
          { $set: { passion: newspassion }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'passion change' });
            }
          }));
      }
  })
});


//METTRE A JOUR  le services 
router.put('/:userChefId/updateservices', async (req, res) => {
  const { userChefId } = req.params;
  const { newservices } = req.body;
  UserChef.findOne( {_id: userChefId})
    .then((data)=> {
      if (data.services === newservices) { //services identique à l'ancien
        res.json({ result: false, message: 'Same services'})
      } else {
        UserChef.updateOne(
          { _id: userChefId },
          { $set: { services: newservices }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'services change' });
            }
          }));
      }
  })
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
