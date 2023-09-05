//const http = require('http')

// let notes = [
//     {
//         id: 1,
//         content: "HTML is easy",
//         important: true
//     },
//     {
//         id: 2,
//         content: "Browser can execute only JavaScript",
//         important: false
//     },
//     {
//         id: 3,
//         content: "GET and POST are the most important methods of HTTP protocol",
//         important: true
//     }
// ]

// let persons =[
//   { 
//     "id": 1,
//     "name": "Arto Hellas", 
//     "number": "040-123456"
//   },
//   { 
//     "id": 2,
//     "name": "Ada Lovelace", 
//     "number": "39-44-5323523"
//   },
//   { 
//     "id": 3,
//     "name": "Dan Abramov", 
//     "number": "12-43-234345"
//   },
//   { 
//     "id": 4,
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122"
//   }
// ]


// const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'application/json' })
//     response.end(JSON.stringify(notes))
// })

// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)
// console.log(`note is ${notes}`);

//store notes in a cloud: mongodb+srv://Deaken:${password}@cluster0.b4num6j.mongodb.net/phonebook?retryWrites=true&w=majority

// const mongoose = require('mongoose')
// const password = process.argv[2]

// const url =
//   `mongodb+srv://Deaken:${password}@cluster0.b4num6j.mongodb.net/phonebook?retryWrites=true&w=majority`

// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })
// don't the id and verson to show in the fornt-end
// noteSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// const Note = mongoose.model('Note', noteSchema)

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

// samiliar as process.env.MONGODB_URI, URL are in .env
// dotenv has to get ipmort before note
require('dotenv').config()
// Using express
const express = require('express')
const cors = require('cors')
const app = express()
//import modules of Note model
const Note = require('./models/note')
//import modules of Person model
const Person = require('./models/person')
//const app2 = express()

const morgen = require('morgan')
const app3 = morgen('combined')

app.use(express.static('build'))
app.use(express.json())
//app.use(requestLogger)
app.use(cors())
//app.use(requestLogger)

const insertPersons = async (persons) =>{
  try {
    const result = await Person.insertMany(persons);
    console.log('Persons inserted:', result);
  } catch (error) {
    console.error('Error:', error);
  }
} 

app.post('/api/notes', (request, response) => {
  const body = request.body
  console.log(`content: ${body.content}`);
  // content property may not be empty
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // important property may is empty, we defind important is false
  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  //notes = notes.concat(note)
  // response.json(note)

  //using mongoose
  note.save().then(savedNote => {
    response.json(savedNote)
  })

})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// app.get('/api/notes', (request, response) => {
//   response.json(notes)
// })

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  Note.findById(id)
    .then(note => {
      if (note) {
        response.json(note)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error);
      response.status(500).end()
    })
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})


app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {
  const names = Person.map(person => person.name)
  const time = Date()
  response.send(`<h1> 
    <div>Name: ${names.join(', ')}</div>
    <div> time: ${time}</div> 
    <div>Phonebook has info for ${Person.length} people</div>
    </h1>`)
})

//app.use(requestLogger)

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    // .catch(error => {
    //   console.log(error);
    //   console.log("Should not repeat the request without modifications");
    //   response.status(400).send({error: "malformatted id"})
    // })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  //persons = persons.filter(person => person.id !== id)
  //response.status(204).end()
  Person.findByIdAndDelete(id)
  .then(result => {
    response.status(204).end()
    console.log("person deleted successfully");
  })
  .catch(error => next(error))
})

//create a list of person objects
// const personsToInsert =[
//   {name: "Default person1", number: "000-0001"},
//   {name: "Default person2", number: "000-0002"},
//   {name: "Default person3", number: "000-0003"}
// ]
// //upload default person list to MongoDB
// app.post('api/personlist', async (request, response) =>{
//   Person.insertMany(personsToInsert)
// })
// update person's number
app.put('/api/persons/:id', async (request, response, next) => {
  const id = request.params.id
  const body = request.body
  const {name, number} = body
  const person ={
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(id, person, {new: true, runValidators: true, context:'query'})
  .then(updatePerson => {
    response.json(updatePerson)
  })
  .catch(error => next(error))
})


app.post('/api/persons', async (request, response, next) => {
  const body = request.body
  // name or number property may not be empty
  //console.log(`body: ${body}`);
  //console.log(`name: ${body.name}, the type of name ${typeof(body.name)}`);
  //console.log(`number: ${body.number}`);
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }
  // user enter name 
  const name = body.name.toLowerCase()
  console.log(`new person name: ${name}`)
  const personExisting = (query) => {
    return query.then(result => result.length > 0).catch(() => false);
  }
  const personFound = async (name) => {
    const personExist = Person.find({ name: { $regex: new RegExp('^' + name + '$', 'i') } })
    return await personExisting(personExist)
  }
  const flag = await personFound(name)
  console.log(`found: ${flag}`);
  if (flag) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  // const person = {
  //   name: body.name,
  //   number: body.number,
  //   id: Math.random(1,1000)
  // }
  //persons = persons.concat(person)
  //response.json(persons)

  const person = new Person({
    name: body.name,
    number: body.number
  })
  //using mongoose
  person.save().then(savePerson => {
    response.json(savePerson)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id or name must be unique' })
  }
  else if(error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }
  next(error)
}
// this has to be the last loaded middleware.
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

  // app2.get('/api/persons', (request, response) => {
  //   response.json(persons)
  // })

  // const PORT2 = 3002
  // app2.listen(PORT2, () => {
  //   console.log(`Server running on port ${PORT2}`)
  // })


