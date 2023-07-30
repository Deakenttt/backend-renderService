//const http = require('http')

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

let persons =[
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]


// const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'application/json' })
//     response.end(JSON.stringify(notes))
// })

// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)
// console.log(`note is ${notes}`);

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

// Using express
const express = require('express')
const cors = require('cors')
const app = express()

const app2 = express()

const morgen = require('morgan')
const app3 = morgen('combined')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

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
  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/notes', (request, response) => {
    response.json(notes)
  })

  app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    
    if (note) {
      response.json(note)
    } 
    else {
      response.status(404).end()
    }
  })

  app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })


  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/info', (request, response) =>{
    const names = persons.map(person => person.name)
    const time = Date()
    response.send(`<h1> 
    <div>Name: ${names.join(', ')}</div>
    <div> time: ${time}</div> 
    <div>Phonebook has info for ${persons.length} people</div>
    </h1>`)
  })

  app.get('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } 
    else {
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
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
  const name = body.name.toLowerCase()
  console.log(`new person name: ${name}`);
  const flag = persons.find(
    person => {
    console.log(`person name: ${person.name.toLowerCase()}`);
    return (person.name.toLowerCase().includes(name) === true)
  })
  console.log(`found: ${flag !== undefined}`);
  if(flag){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.random(1,1000)
  }

  persons = persons.concat(person)

  response.json(persons)
})

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  app2.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  const PORT2 = 3002
  app2.listen(PORT2, () => {
    console.log(`Server running on port ${PORT2}`)
  })


