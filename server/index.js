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

        // console.log(exisitingUser)

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

        res.status(201).json({ token, userId: generatedUserId })

    } catch(err) {
        console.log(err)
    }

})

app.post('/login', async (req, res) => {
    
    const client = new MongoClient(uri)
    const {email, password} = req.body

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const user = await users.findOne({ email})

        const correctPassword = await bcrypt.compare(password, user.hashed_password)

        if(user && correctPassword) {
            const token = jwt.sign(user, email, {
                expiresIn: 60 * 24,
            })

            res.status(201).json({ token, userId: user.user_id })
        }

        res.status(401).send('Invalid Credential')
    } catch (err) {
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


app.put('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData

    try{
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = {user_id: formData.user_id}
        const updateDocument = {
            $set: {
                first_name: formData.first_name,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                show_gender: formData.show_gender,
                gender_identity: formData.gender_identity,
                gender_interest: formData.gender_interest,
                url: formData.url,
                about: formData.about,
                matches: formData.matches
            },
        }

        const insertedUser = await users.updateOne(query, updateDocument)
        res.status(200).send(insertedUser)

    } finally {
        await client.close()
    }

})



app.listen(PORT, () => console.log('Server on ' + PORT))