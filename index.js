require('dotenv').config()
console.log(process.env.MONGODB_URI, process.env.PORT)
const express = require('express')
const app = express()
const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')
const PORT = process.env.PORT

app.use(cors())

app.use(bodyParser.json())

app.use(morgan('tiny'))

app.use(express.static('build'));

let persons = [
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Roope Kasasen",
    "number": "234234234",
    "id": 4
  },
  {
    "name": "Pekka Pouta",
    "number": "234234",
    "id": 7
  },
  {
    "name": "Mikko Mäkinen",
    "number": "243234234",
    "id": 8
  },
  {
    "name": "Mauno Mäkinen",
    "number": "213423234",
    "id": 9
  },
  {
    "name": "Merja Mäntynen",
    "number": "234234234",
    "id": 10
  }
]

/*
app.get('/', (req, res) => {
  res.send("test")
})
*/
const virheet = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return res.status(400).send({ error: 'id on vääräässä muodossa' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(virheet)

  app.get('/info', (req, res) => {
    Person.find().then(persons => {
      
      res.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${new Date()}</p>`)
    })
    
  })
  
  app.get('/api/persons', (req, res) => {
    Person.find().then(persons => {
      const persons2 = persons.map(person => person.toJSON())
      res.json(persons2)
    })
  })

  app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
      .then(person => {
        if (person) {
          res.json(person.toJSON())
        } else {
          res.status(404).end()
        }
      })
      .catch(error => next(error))
  })

  app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
      .then(result => {
        res.status(204).end()
      })
      .catch(error => next(error))
  })

  app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
      name: body.name,
      number: body.number,
    }
    Person.findByIdAndUpdate(req.params.id, person, {new : true})
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
  })

  
  app.post('/api/persons', (req, res, next) => {
    const body = req.body
  
    if (!body.name || !body.number) {
      return res.status(400).json({ 
        error: 'puutteelliset tiedot' 
      })
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save().then(savedPerson => {
      res.json(savedPerson.toJSON())
    })
    .catch(error => next(error))

  })
  
  const eiLoydy = (req, res) => {
    res.status(404).send({ error: 'Osoitetta ei löydy' })
  }

  app.use(eiLoydy)

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })