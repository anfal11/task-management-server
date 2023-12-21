const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000


//middleware
app.use(cors());
app.use(express.json());


//mongo connection


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ey8cr7h.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();

    const taskCollection = client.db("taskManagement").collection("allTasks")
    const userCollection = client.db("taskManagement").collection("users")

    app.post("/users", async (req, res) => {
        const query = { email: req.body.email };
        const existingUser = await userCollection.findOne(query);
        if (existingUser) {
          res.send({ message: "user already exists", insertedId: null });
        } else {
          const newUser = req.body;
          const result = await userCollection.insertOne(newUser);
          res.send(result);
        }
      });


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Task Management Platform is available now')
})

app.listen(port, () => {
  console.log(`Task Management Platform is running on port ${port}`)
})