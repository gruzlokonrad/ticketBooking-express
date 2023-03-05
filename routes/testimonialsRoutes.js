import express from 'express';
import database from '../db.js';
import shortid from 'shortid'

const db = database.testimonials
const router = express.Router()
router.route('/testimonials/random').get((req, res) => {
  if (db.length) {
    const randomId = Math.floor(Math.random() * db.length);
    console.log('randomId', randomId)
    res.send(db.find((author, index) => index === randomId))
  } else {
    res.send('Database is empty')
  }
})
router.route('/testimonials/:id').get((req, res) => {
  res.send(db.find(author => author.id === Number(req.params.id)))
})
router.route('/testimonials').get((req, res) => {
  res.send(db)
})

router.route('/testimonials').post((req, res) => {
  const { author, text } = req.body
  if (author && text) {
    const id = shortid.generate()
    const newRecord = { id, author, text }
    db.push(newRecord)
    res.status(200).send(newRecord)
  } else {
    res.send('Something went wrong ..')
  }
})

router.route('/testimonials/:id').put((req, res) => {
  const { author, text } = req.body
  const paramId = Number(req.params.id)
  try {
    db.forEach((authorObj, index) =>
      authorObj.id === paramId && (
        db[index] = {
          ...authorObj,
          author: author || authorObj.author,
          text: text || authorObj.text
        }
      )
    )
    res.status(200).send("Update success!")
  } catch (e) {
    res.status(500).send("Something went wrong :/")
  }
})

router.route('/testimonials/:id').delete((req, res) => {
  const paramId = Number(req.params.id)
  if (db.find(auth => auth.id === paramId)) {
    try {
      db = db.filter(author => author.id !== paramId && author)
      res.status(200).send(db)
    } catch (e) {
      res.status(500).send({ message: e })
    }
  } else {
    res.status(500).send({ message: "Object does not exist" })
  }
})


export default router