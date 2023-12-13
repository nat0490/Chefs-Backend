var express = require('express');
var router = express.Router();
const UserConnexion = require('../models/userConnexion');
const UserProfil = require('../models/userProfil');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

//app.use('/users', usersRouter);


//créer un user pour connexion => Test TC OK

router.post('/signup', async (req, res) => {
  if (!checkBody(req.body, ['password', 'email'])) {
    return res.status(500).json({ result: false, error: 'Missing or empty fields' });
  }

  try {
    const existingUser = await UserConnexion.findOne({ email: req.body.email });

    if (!existingUser) {
      // Créez un nouvel utilisateur de profil
      const newUserProfil = new UserProfil({
        nom: req.body.nom,
        prenom: req.body.prenom,
        dateOfBirth : req.body.dateOfBirth,
        adresse: {
          rue: req.body.rue,
          ville: req.body.ville,
          codePostal: req.body.codePostal,
        },
        tel: req.body.tel,
        chef: false,
      });

      const savedUserProfil = await newUserProfil.save();

      // Créez un nouvel utilisateur de connexion
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUserConnexion = new UserConnexion({
        email: req.body.email,
        password: hash,
        token: uid2(32),
        userProfile: savedUserProfil._id, // Utilisation de la clé étrangère
      });

      const savedUserConnexion = await newUserConnexion.save();

      res.json({ result: true, savedUserConnexion, savedUserProfil });
    } else {
      res.status(500).json({ result: false, error: 'Un compte est déjà créé avec cette adresse email' });
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur et du profil :', error);
    res.status(500).json({ result: false, error: 'Internal Server Error' });
  }
});
  // if (!checkBody(req.body, ['username', 'password', 'email'])) {
  //   res.status(500).json({ result: false, error: 'Missing or empty fields' });
  //   return;
  // }
  // //Find if user already existe
  // UserConnexion.findOne({ /*username: req.body.username ||*/ email: req.body.email }).then(data => {
  //   if (data === null) {
  //     //user don't exist = create user
  //     const hash = bcrypt.hashSync(req.body.password, 10);
  //     const newUser = new UserConnexion({      
  //       email: req.body.email,
  //       password: hash,
  //       token: uid2(32),
  //     });
  //     newUser.save().then(newDoc => {
  //       res.json({ result: true, newDoc });
  //     });
  //   } else {
  //     // User aldready exist
  //     res.status(500).json({ result: false, error: 'User already exists' });
  //   }
  // });


  

  //Connecter un user => Test TC OK
  router.post('/signin', (req, res) => {
    //connection via email et PW
    if (!checkBody(req.body, ['email', 'password'])) {
      res.status(500).json({ result: false, error: 'Missing or empty fields' });
      return;
    }
    UserConnexion.findOne({ email: req.body.email }).then(data => {
      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        const id_userProfile = data.userProfile
        UserProfil.findById(id_userProfile).then(userProfile => {
          res.json({ result: true, dataUserConnexion: data , dataUserProfils : userProfile });
        }
        )
      } else {
        res.status(500).json({ result: false, error: 'User not found or wrong password' });
      }
    });

  });

//modifier psw => Test TC OK
//ATTENTION!! MODIFER!! PRENDRE TOKEN ET NON ID POUR CHANGER CAR ID NON DANS REDUCER
router.put('/:userToken/update-password', async (req, res) => {
  const { userToken } = req.params;
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
//ATTENTION!! MODIFER!! PRENDRE TOKEN ET NON ID POUR CHANGER CAR ID NON DANS REDUCER
  router.put('/:userToken/update-email', async (req, res) => {
    const { userToken } = req.params;
    const { newEmail } = req.body;
    //Vérifier si le nouveau email est identique à l'ancien
    UserConnexion.findOne( {token: userToken})
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
  


