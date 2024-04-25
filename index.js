const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

const corsConfig = {
    origin: '',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
app.use(express.json())
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ecoeol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    

    const coffeesCollection = client.db('coffeesDB').collection('coffeees');
    const usersCollection = client.db('usersDB').collection('users')

    app.post('/coffees',async(req,res)=>{
        const newCoffee = req.body;
        
        const result = await coffeesCollection.insertOne(newCoffee)
        res.send(result)
    })

    app.get('/coffees',async(req,res)=>{
        const cursor = coffeesCollection.find()
        const result = await cursor.toArray();
        res.send(result)  
    })

    app.get('/coffees/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeesCollection.findOne(query);
        res.send(result)
    })
    
    app.put('/coffees/:id',async(req,res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert:true}
        const updatedCoffee = req.body;
        const coffee = {
            $set:{
                name: updatedCoffee.name,
                quantity: updatedCoffee.quantity,
                supplier: updatedCoffee.supplier,
                taste: updatedCoffee.taste,
                photo: updatedCoffee.photo,
                category: updatedCoffee.category,
                details: updatedCoffee.details,
            }
        }
        const result = await coffeesCollection.updateOne(filter,coffee,options)
        res.send(result);

    })

    app.delete('/coffees/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeesCollection.deleteOne(query);
        res.send(result)
    })




    //user

    app.post('/users',async(req,res)=>{
        const user = req.body;
        const result = await usersCollection.insertOne(user)
        res.send(result);
    })

    app.get('/users',async(req,res)=>{
        const cursor = usersCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.patch('/users',async(req,res)=>{
        const user = req.body;
        const filter = {email:user.email}
        const updateDoc ={
            $set:{
                lastLoggedAt:user.lastLoggedAt
            }
        }
        const result = await usersCollection.updateOne(filter,updateDoc)
        res.send(result)
        
    })

    app.delete('/users/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await usersCollection.deleteOne(query);
        res.send(result)
    })







    // Send a ping to confirm a successful connection
    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send("Server is running")
});
app.listen(port,()=>{
    console.log(`Coffee express running on port ${port}`);
})
