var express = require('express');
var router = express.Router();

const UserConnexion = require('../models/userConnexion');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');


//créer un user pour connexion => Test TC OK
router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['username', 'password', 'email'])) {
    res.status(500).json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  //Find if user already existe
  UserConnexion.findOne({ /*username: req.body.username ||*/ email: req.body.email }).then(data => {
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

  //Connecter un user => Test TC OK
  router.post('/signin', (req, res) => {
    //connection via email et PW
    if (!checkBody(req.body, ['email', 'password'])) {
      res.status(500).json({ result: false, error: 'Missing or empty fields' });
      return;
    }
  
    UserConnexion.findOne({ email: req.body.email }).then(data => {
      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        res.json({ result: true, data });
      } else {
        res.status(500).json({ result: false, error: 'User not found or wrong password' });
      }
    });
  });

  //modifier psw => Test TC OK
router.put('/:userId/update-password', async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;
  const hashUpdate = bcrypt.hashSync(newPassword, 10);
  //Vérifier si le nouveau PW est identique à l'ancien
  UserConnexion.findOne( {_id: userId})
      .then((data)=> {
        if (bcrypt.compareSync(newPassword, data.password)) {
          res.json({ result: false, message: 'Same Password'})
        } else {
          //PW différent donc modif du PW
          UserConnexion.updateOne(
          { _id: userId },
          { $set: { password: hashUpdate }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'Password change' });
            }
          }));
        }
      })
});

  //modifier email => Test TC OK
  router.put('/:userId/update-email', async (req, res) => {
    const { userId } = req.params;
    const { newEmail } = req.body;
    //Vérifier si le nouveau email est identique à l'ancien
    UserConnexion.findOne( {_id: userId})
      .then((data)=> {
        if (data.email === newEmail) {
          res.json({ result: false, message: 'Same Email'})
        } else {
          //vérifier si un profil à déjà ce nouvel email
          UserConnexion.findOne({email: newEmail})
          .then(data => {
            if (data) {
              res.json({ result: false, message: 'This new Email have an other acount'})
            } else {
              UserConnexion.updateOne(
                //Email dif donc on change
                { _id: userId },
                { $set: { email: newEmail }}
                ).then((data => {
                  if (data.acknowledged === false) {
                    res.status(500).json({ result: false, error: "noMatch" });
                  } else {
                    res.json({ result: true, message: 'Email change' });
                  }
                }));
            }
          })
        }
    })
  });
  
  //modifier username => Test TC OK
  router.put('/:userId/update-username', async (req, res) => {
    const { userId } = req.params;
    const { newUserName } = req.body;
    //Vérifier si le nouveau username est identique à l'ancien
    UserConnexion.findOne( {_id: userId})
    .then((data)=> {
      if (data.username === newUserName) {
        res.json({ result: false, message: 'Same Username'})
      } else {
        UserConnexion.updateOne(
          { _id: userId },
          { $set: { username: newUserName }}
          ).then((data => {
            if (data.acknowledged === false) {
              res.status(500).json({ result: false, error: "noMatch" });
            } else {
              res.json({ result: true, message: 'Username change' });
            }
          }));
      }
    })
  });

  //supprimer un compte => Test TC OK
  //coté FRONT: demander PW + email
  router.delete("/delete", (req, res) => {
    if (req.body.id === "") {
      res.status(500).json({ result: false, error: "Missing fields" });
    } else {
      UserConnexion.deleteOne({ _id: req.body.id }).then((dataDeleted) => {
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
  


