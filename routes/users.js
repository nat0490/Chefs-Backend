var express = require('express');
var router = express.Router();

const UserConnexion = require('../models/userConnexion');
const UserProfil = require('../models/userProfil');
const UserChef = require('../models/userChef');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');


/* GET users listing. */
router.get('/', (req, res, ) => {
  res.send('respond with a resource');
});

//créer un user pour connexion => Test TC OK
router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['username', 'password', 'email'])) {
    res.status(500).json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  //Find if user already existe
  UserConnexion.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      //user don't exist = create user
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new UserConnexion({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        token: uid2(32),
      });
      newUser.save().then(newDoc => {
        res.json({ result: true, newDoc });
      });
    } else {
      // User aldready exist
      res.status(500).json({ result: false, error: 'User already exists' });
    }
  });
  });




//créer un user pour détails => Test TC OK
router.post('/details/create', (req, res) => {
  //METS-ON LE CHECK BODY? 
  //L'UTILISATEUR PEUX-T-IL RAJOUTER LES INFOS QUAND IL LE VEUX? OU TOUS METTRE D'UN COUP?
  if (!checkBody(req.body, ['chef', 'userConnexion', 'tel', 'nom', 'prenom','email', 'rue', 'ville', 'codePostal'])) {
    res.status(500).json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  UserProfil.findOne({ email: req.body.email }).then(data => {
    if (data === null) {
      const newUserDetails = new UserDetails({
        nom: req.body.nom,
        prenom: req.body.prenom,
        adresse: {
          rue: req.body.rue,
          ville: req.body.ville,
          codePostal: req.body.codePostal
        },
        tel: req.body.tel,
        cuisto: req.body.cuisto,
        userConnexion: req.body.userConnexion,
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
  UserConnexion.findOne({ username: req.body.username }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, data });
    } else {
      res.status(500).json({ result: false, error: 'User not found or wrong password' });
    }
  });
});


//mettre à jour un user: 

module.exports = router;
