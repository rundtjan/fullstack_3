const express = require('express')
const app = express()
const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())

app.use(bodyParser.json())

app.use(express.static('build'));

//app.use(express.static(path.join(__dirname, 'build')));


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
  app.get('/info', (req, res) => {
    res.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${new Date()}</p>`)
  })
  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
  
    res.status(204).end();
  });

  const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/persons', (req, res) => {
    const body = req.body
  
    if (!body.name || !body.number) {
      return res.status(400).json({ 
        error: 'puutteelliset tiedot' 
      })
    }

    const names = persons.map(person => person.name)

    if (names.includes(body.name)){
      return res.status(400).json({ 
        error: 'nimi löytyy jo luettelosta' 
      })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: Math.floor(Math.random() * 10000000),
    }
  
    persons = persons.concat(person)
  
    res.json(person)
  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })