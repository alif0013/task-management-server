const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


//middle ware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.98p3czt.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        const usersCollection = client.db('taskManager').collection('users');
        const taskCollection = client.db('taskManager').collection('task');


        // user related api 
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })



        // task related api 
        app.get('/task', async (req, res) => {
            const result = await taskCollection.find().toArray();
            res.send(result)
        })

        app.get('/to-do', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await taskCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/task', async (req, res) => {
            const user = req.body;
            const result = await taskCollection.insertOne(user);
            res.send(result)
        })

        // updated a task 

        app.put("/update-task/:id", async (req, res) => {
            const id = req.params.id;
            const updateTask = req.body;
            // console.log("id", id, updatedProduct);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            // title, description,email, marks, due, level, photo

            const product = {
                $set: {

                    title: updateTask.title,
                    description: updateTask.description,
                    tags: updateTask.tags,
                    deadline: updateTask.deadline,
                    
                },
            };
            const result = await taskCollection.updateOne(
                filter,
                product,
                options
            );
            res.send(result);
        });




        // delete a task by delete operation
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            // const query = {_id: id}
            const result = await taskCollection.deleteOne(query)
            res.send(result)
        })





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Forum Server is Running')
})

app.listen(port, () => {
    console.log(`Forum server is running on PORT ${port}`);
})