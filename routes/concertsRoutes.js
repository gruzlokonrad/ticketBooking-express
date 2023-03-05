import express from 'express';
import database from '../db.js';
import shortid from 'shortid'

const db = database.concerts
const router = express.Router()
router.route('/concerts/random').get((req, res) => {
  if (db.length) {
    const randomId = Math.floor(Math.random() * db.length);
    console.log('randomId', randomId)
    res.send(db.find((concert, index) => index === randomId))
  } else {
    res.send('Database is empty')
  }
})
router.route('/concerts/:id').get((req, res) => {
  res.send(db.find(concert => concert.id === Number(req.params.id)))
})
router.route('/concerts').get((req, res) => {
  res.send(db)
})

router.route('/concerts').post((req, res) => {
  // performer: 'John Doe', genre: 'Rock', price: 25, day: 1, image: '/img/uploads/1fsd324fsdg.jpg'
  const { performer, genre, price, day, image } = req.body
  if (performer && genre && price && day && image) {
    const id = shortid.generate()
    const newRecord = { id, performer, genre, price, day, image }
    db.push(newRecord)
    res.status(200).send(newRecord)
  } else {
    res.send('Something went wrong ..')
  }
})

router.route('/concerts/:id').put((req, res) => {
  const { performer, genre, price, day, image } = req.body
  const paramId = req.params.id
  try {
    db.forEach((dbObject, index) =>
      Number(dbObject.id) === paramId && (
        db[index] = {
          ...dbObject,
          performer: performer || dbObject.performer,
          genre: genre || dbObject.genre,
          price: price || dbObject.price,
          day: day || dbObject.day,
          image: image || dbObject.image,
        }
      )
    )
    res.status(200).send("Update success!")
  } catch (e) {
    res.status(500).send("Something went wrong :/")
  }
})

router.route('/concerts/:id').delete((req, res) => {
  const paramId = Number(req.params.id)
  if (db.find(auth => auth.id === paramId)) {
    try {
      db = db.filter(concert => concert.id !== paramId && concert)
      res.status(200).send(db)
    } catch (e) {
      res.status(500).send({ message: e })
    }
  } else {
    res.status(500).send({ message: "Object does not exist" })
  }
})


export default router