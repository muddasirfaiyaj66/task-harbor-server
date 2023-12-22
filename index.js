const  express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware 
app.use(express.json());


app.get('/', async(req,res)=>{
    res.send({message: 'Welcome to TaskHarbor server!!'});
});

app.listen(port,()=>{
    console.log(`server running on port: ${port}`);
})