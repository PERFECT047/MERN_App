const PORT = 8000

const express = require('express')
const { MongoClient, MongoUnexpectedServerResponseError } = require('mongodb')
const { v4 : uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcryptjs');

const uri = 'mongodb+srv://perfect047:mypassword@cluster0.vay8c.mongodb.net/?retryWrites=true&w=majority'
const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) =>{
    res.json('Hello there MATE!')
})

app.post('/signup', async (req, res) =>{
    
    const client = new MongoClient(uri)
    const {email, password} = req.body
    // console.log(email, password)
    const generatedUserId = uuidv4()
    const hashedpassword = await bcrypt.hash(password, 10)

    try {
        client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const exisitingUser = await users.findOne({ email })

        console.log(exisitingUser)

        if(exisitingUser) {
            return res.status(409).send('User already exist. Please try login')
        }

        const sanitizedEmail = email.toLowerCase()

        const data = {
            user_id: generatedUserId,
            email: sanitizedEmail,
            hashed_password: hashedpassword
        }

        const insertedUser = await users.insertOne(data)

        const token = jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 60 * 24,
        })

        res.status(201).json({token, userId: generatedUserId, email: sanitizedEmail})

    } catch(err) {
        console.log(err)
    }

})

app.get('/users', async (req, res) => {
    
    const client = new MongoClient(uri)

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const returnedUsers = await users.find().toArray()
        res.send(returnedUsers)
    } finally {
        await client.close()
    }
})

app.listen(PORT, () => console.log('Server on ' + PORT))