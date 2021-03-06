const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./request/loggerMiddleware')

app.use(express.json()) // soportar las request q se le hacen cuando se le pasa un objeto y lo
// parse para tenerlo disponible en el request
app.use(cors())
app.use(logger)

let notes = [
  {
    id: 1,
    content: 'HTML and CSS are easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>hello world</h1> ')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find((note) => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter((note) => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'

    })
  }

  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids) // Se obtiene el valor máximo
  const newNote = {
    id: maxId + 1,
    content: note.content,
    date: new Date().toISOString,
    important: typeof note.important !== undefined ? note.important : false
  }

  notes = notes.concat(newNote)
  // notes = [...notes,newNote]
  response.status(201).json(note)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
