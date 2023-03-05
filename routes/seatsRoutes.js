import express from 'express';
import database from '../db.js';
import shortid from 'shortid'

const db = database.seats
const router = express.Router()
router.route('/seats/random').get((req, res) => {
  if (db.length) {
    const randomId = Math.floor(Math.random() * db.length);
    console.log('randomId', randomId)
    res.send(db.find((seat, index) => index === randomId))
  } else {
    res.send('Database is empty')
  }
})
router.route('/seats/:id').get((req, res) => {
  res.send(db.find(seat => seat.id === Number(req.params.id)))
})
router.route('/seats').get((req, res) => {
  res.send(db)
})

router.route('/seats').post((req, res) => {
  const { day, seat, client, email } = req.body
  const isSlotTaken = !!db.some(item => item.seat == seat && item.day == day)
  if (!isSlotTaken) {
    if (day && seat && client && email) {
      const id = shortid.generate()
      const newRecord = { id, day, seat, client, email }
      db.push(newRecord)
      res.status(200).send(newRecord)
    } else {
      res.send('Something went wrong ..')
    }
  } else {
    res.status(200).json({ message: "The slot is already taken..." })
  }
})

router.route('/seats/:id').put((req, res) => {
  const { day, seat, client, email } = req.body
  const paramId = req.params.id
  try {
    db.forEach((authorObj, index) =>
      String(authorObj.id) === paramId && (
        db[index] = {
          ...authorObj,
          day: day || authorObj.day,
          seat: seat || authorObj.seat,
          client: client || authorObj.client,
          email: email || authorObj.email
        }
      )
    )
    res.status(200).send("Update success!")
  } catch (e) {
    res.status(500).send("Something went wrong :/")
  }
})

router.route('/seats/:id').delete((req, res) => {
  const paramId = Number(req.params.id)
  if (db.find(auth => auth.id === paramId)) {
    try {
      db = db.filter(seat => seat.id !== paramId && seat)
      res.status(200).send(db)
    } catch (e) {
      res.status(500).send({ message: e })
    }
  } else {
    res.status(500).send({ message: "Object does not exist" })
  }
})


export default router