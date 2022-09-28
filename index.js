const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
let persons = [
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})
app.use(express.json())
app.use(cors())
morgan.token('req-body', (req, res) => {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))


const generateId = () => {
    return Math.floor((Math.random() * 10000) + 5)
}

app.get('/', (request, response) => {
    const REST = {
        GET: {
            description: 'Get all persons data in database.',
            route: '/api/persons'
        },
        GET: {
            description: 'Get one persons\' data in database.',
            route: '/api/persons/:id'
        },
        GET: {
            description: 'Information about phonebook.',
            route: '/info'
        },
        POST: {
            description: 'Add a new contact to phonebook.',
            route: '/api/persons'
        },
        DELETE: {
            description: 'Delete a contact from phonebook.',
            route: '/api/persons/:id'
        }
    }
    
    response.json(REST)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people.<br />${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    }
    response.status(404).json({error: 'Person was not found.'})
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !==id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if(!body.name || !body.number){
        return response.status(400).send({error: 'The name or number from content is missing.'})
    }

    if(persons.map(person => person.name).find(name => name ===body.name)){
        return response.status(400).send({error: 'The name must be unique.'})
    }

    const contact = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    response.json(contact)
})
