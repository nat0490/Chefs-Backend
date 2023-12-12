var express = require('express');
var router = express.Router();

const Feedback = require('../models/feedback');
const { checkBody } = require('../modules/checkBody');


//CRER UN FEEDBACK => Test TC OK
router.post('/create', (req,res) => {
    if (!checkBody(req.body, ['userProfil', 'recipes', 'rating', 'commentaire', 'date'])) {
        res.status(500).json({ result: false, error: 'Missing or empty fields' });
        return;
      } else {
            const newFeed = new Feedback({
                userProfil : req.body.userProfil,
                recipes: req.body.recipes,
                rating: req.body.rating,
                commentaire: req.body.commentaire,
                date: req.body.date,
            })
            newFeed.save().then(newFed => {
                res.json({result: true, newFed})
            });
      }
})

//MODIFIER UN COMMENTAIRE => Test TC OK
router.put('/:feedbackId/update-commentaire', (req,res) => {
    Feedback.findOne({ _id: req.params.feedbackId})
        .then(data => {
            if (data) {
                Feedback.updateOne(
                  { _id: req.params.feedbackId },
                  { $set: { commentaire: req.body.commentaire }}
                  ).then((data => {
                    if (data.acknowledged === false) {
                      res.status(500).json({ result: false, error: "noMatch" });
                    } else {
                      res.json({ result: true, message: 'Commentaire change' });
                    }
                  }));
            } else {
                res.json({result: false, message: 'no feedback find (wrong id?'})
            }
        })
})


//MODIFIER UNE NOTE => Test TC OK
router.put('/:feedbackId/update-rating', (req,res) => {
    Feedback.findOne({ _id: req.params.feedbackId})
        .then(data => {
            if (data) {
                Feedback.updateOne(
                  { _id: req.params.feedbackId },
                  { $set: { rating: req.body.rating }}
                ).then((data => {
                    if (data.acknowledged === false) {
                      res.status(500).json({ result: false, error: "noMatch" });
                    } else {
                      res.json({ result: true, message: 'note change' });
                    }
                  }));
            } else {
                res.json({result: false, message: 'no feedback find (wrong id?'})
            }
        })
})


//FEEDBACK POUR UN PLAT (+ afficher sa note moyenne?) => test TC OK
router.get("/findRecipe", (req,res) => {
    if (!req.body.recipeId) {
        res.status(500).json({ result: false, error: 'Missing or empty fields' });
        return;
    } else {
        Feedback.find({recipes: req.body.recipeId})
        .then(data => {
          console.log(data);
            if (data && data.length > 0) {
              //calcule note moyenne
              const ratings = data.map(feedback => feedback.rating);
              const noteMoyenne = ratings.reduce((total, rating) => total + rating, 0) / ratings.length;
                res.json({ result: true, recipes: data, noteMoyenne })
            } else { res.json({result: false, message: 'no data found'})}
        })
    }
});
    

//SUPPRIMER UN FEEDBACK => Test TC OK
router.delete("/delete", (req, res) => {
    if (!req.body.id) {
      res.status(500).json({ result: false, error: "Missing fields" });
    } else {
      Feedback.deleteOne({ _id: req.body.id }).then((dataDeleted) => {
        console.log(dataDeleted);
        if (dataDeleted.deletedCount === 0) {
          res.status(500).json({ result: false, error: "Impossible to delete" });
        } else {
          res.json({ result: true, message: 'feedback delete' });
        }
      });
    }
  });


module.exports = router;