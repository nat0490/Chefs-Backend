var express = require('express');
var router = express.Router();

const UserProfil = require('../models/userProfil');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');



//créer un userProfil => Test TC OK
router.post('/create/:userConnexion', (req, res) => {
    //Toutes les infos sont demandé d'un coup
    if (!checkBody(req.body, ['nom', 'prenom', 'tel', 'rue', 'ville', 'codePostal', 'chef'])) {
      res.status(500).json({ result: false, error: 'Missing or empty fields' });
      return;
    }
    //le profil est-il déjà créé pour cet ID de connexion?
    UserProfil.findOne({ userConnexion: req.params.userConnexion }).then(data => {
      if (data === null) {
        const newProfil = new UserProfil({
          userConnexion: req.params.userConnexion,
          nom: req.body.nom,
          prenom: req.body.prenom,
          adresse: {
            rue: req.body.rue,
            ville: req.body.ville,
            codePostal: req.body.codePostal
          },
          tel: req.body.tel,
          chef: req.body.chef,
        });
        newProfil.save().then(newDoc => {
          res.json({ result: true, newDoc });
        });
      } else {
        res.status(500).json({ result: false, error: "Profil alrady create for this Userconnexion" });
      }
    }
  );
});
 


//METTRE A JOUR SON ADRESSE



//METTRE A JOUR SON TEL => Test TC OK
router.put('/:userId/update-tel', async (req, res) => {
  const { userId } = req.params;
  const { newTel } = req.body;
  UserProfil.findOne( {_id: userId})
    .then((data)=> {
      if (data.tel === newTel) {
        res.json({ result: false, message: 'Same Tel'})
      } else {
        UserProfil.updateOne(
          { _id: userId },
          { $set: { tel: newTel }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'Tel change' });
            }
          }));
      }
  })
});

//METTRE A JOUR CHEF => Test TC OK
router.put('/:userId/update-chef', async (req, res) => {
  const { userId } = req.params;
  UserProfil.findOne( {_id: userId})
    .then((data)=> {
      let newStatus = !data.chef;
        UserProfil.updateOne(
          { _id: userId },
          { $set: { chef: newStatus }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: `Statue Chef change to: ${newStatus}` });
            }
          }));
  })
});

  
//SUPPRIMER UN PROFIL => Test TC OK
router.delete("/delete", (req, res) => {
  if (req.body.id === "") {
    res.status(500).json({ result: false, error: "Missing fields" });
  } else {
    UserProfil.deleteOne({ _id: req.body.id }).then((dataDeleted) => {
      console.log(dataDeleted);
      if (dataDeleted.deletedCount === 0) {
        res.status(500).json({ result: false, error: "Impossible to delete" });
      } else {
        res.json({ result: true });
      }
    });
  }
});
  
  
  
   
  
  module.exports = router;
  