var express = require('express');
var router = express.Router();

const UserProfil = require('../models/userProfil');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');



//créer un userProfil => Test TC OK
router.post('/create', (req, res) => {
    //Toutes les infos sont demandé d'un coup
    if (!checkBody(req.body, ['chef', 'userConnexion', 'tel', 'nom', 'prenom','email', 'rue', 'ville', 'codePostal'])) {
      res.status(500).json({ result: false, error: 'Missing or empty fields' });
      return;
    }
    UserProfil.findOne({ email: req.body.email }).then(data => {
      if (data === null) {
        const newUserDetails = new UserDetails({
          userConnexion: req.body.userConnexion,
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
        newUserDetails.save().then(newDoc => {
          res.json({ result: true, newDoc });
        });
      } else {
        res.status(500).json({ result: false, error: 'Email already have an acount' });
      }
    }
    );
    });
  
  
  
  //créer un user pour chef
  
  
  
  //chercher un user par nom (connexion) => Test TC OK
  router.post('/signin', (req, res) => {
    if (!checkBody(req.body, ['username', 'password'])) {
      res.status(500).json({ result: false, error: 'Missing or empty fields' });
      return;
    }
    UserProfil.findOne({ username: req.body.username }).then(data => {
      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        res.json({ result: true, data });
      } else {
        res.status(500).json({ result: false, error: 'User not found or wrong password' });
      }
    });
  });
  
  
  //mettre à jour un user: 
  
  module.exports = router;
  