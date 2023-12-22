const  express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware 
app.use(express.json());
app.use(cors({
    origin:['http://localhost:5173', 'https://task-harbor.web.app', 'https://task-harbor.firebaseapp.com'],
    
    
    credentials: true
}))
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rrl4awm.mongodb.net/?retryWrites=true&w=majority`;



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
    //   await client.connect();
      // Send a ping to confirm a successful connection
    //   await client.db("admin").command({ ping: 1 });
    //   console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);
//Collections 
const tasksCollections = client.db('taskHarborDB').collection('tasks');

//add tasks 
app.post('/api/v1/tasks', async(req,res)=>{
    try{
        const data = req.body;
        const result = await tasksCollections.insertOne(data);

        res.send(result);

    }catch (error) {
        res.status(500).send({ error: 'An error occurred', message: error.message });
      }
})
app.get('/api/v1/tasks', async(req,res)=>{
    try{
        let query = {};
        if(req?.query?.email){
            console.log(req.query.email);
            query={...query, email:req?.query?.email}
          }

          const result = await tasksCollections.find(query).toArray();

        res.send(result);

    }catch (error) {
        res.status(500).send({ error: 'An error occurred', message: error.message });
      }
});
app.delete('/api/v1/tasks/:id', async(req,res)=>{
    try{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const result = await tasksCollections.deleteOne(filter);

        res.send(result);

    }
    catch (error) {
        res.status(500).send({ error: 'An error occurred', message: error.message });
      }
})
app.put('/api/v1/tasks/:id/status', async (req, res) => {
    try {
        const id = req.params.id;
        const newStatus = req.body.status;

        const filter = { _id: new ObjectId(id) };
        const update = { $set: { status: newStatus } };

        const result = await tasksCollections.updateOne(filter, update);

        res.send(result);
    } catch (error) {
        res.status(500).send({ error: 'An error occurred', message: error.message });
    }
});
app.put('/api/v1/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;

        const filter = { _id: new ObjectId(id) };
        const update = { $set: updatedData };

        const result = await tasksCollections.updateOne(filter, update);

        res.send(result);
    } catch (error) {
        res.status(500).send({ error: 'An error occurred', message: error.message });
    }
});


app.get('/', async(req,res)=>{
    res.send({message: 'Welcome to TaskHarbor server!!'});
});

app.listen(port,()=>{
    console.log(`server running on port: ${port}`);
})