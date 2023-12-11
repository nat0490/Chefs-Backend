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




