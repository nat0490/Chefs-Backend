var express = require('express');
var router = express.Router();

const Feedback = require('../models/feedback');
const { checkBody } = require('../modules/checkBody');

//EN ATTENTE DE RECETTE POUR TESTER

//CRER UN FEEDBACK
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

//MODIFIER UN COMMENTAIRE
router.put('/:feedbackId/update-commentaire', (req,res) => {
    Feedback.findOne({ id: req.params.feedbackId})
        .then(data => {
            if (data) {
                Feedback.updateOne({
                    id: req.params.feedbackId,
                    commentaire: req.params.commentaire,
                }).then((data => {
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


//MODIFIER UNE NOTE
router.put('/:feedbackId/update-rating', (req,res) => {
    Feedback.findOne({ id: req.params.feedbackId})
        .then(data => {
            if (data) {
                Feedback.updateOne({
                    id: req.params.feedbackId,
                    rating: req.params.rating,
                }).then((data => {
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


//FEEDBACK POUR UN PLAT (pour faire sa note moyenne)
router.get("/findRecipe", (req,res) => {
    if (!req.body.recipes) {
        res.status(500).json({ result: false, error: 'Missing or empty fields' });
        return;
    } else {
        Feedback.find({recipes: req.body.recipes})
        .then(data => {
            if (data) {
                res.json({ result: true, recipes: data})
            } else { res.json({result: false, message: 'no data found'})}
        })
    }
});
    

//SUPPRIMER UN FEEDBACK
router.delete("/delete", (req, res) => {
    if (req.body.id === "") {
      res.status(500).json({ result: false, error: "Missing fields" });
    } else {
      Feedback.deleteOne({ _id: req.body.id }).then((dataDeleted) => {
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