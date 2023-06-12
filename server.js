// Import the necessary dependencies
const express = require('express');
const bodyParser = require('body-parser');

const mysql = require('mysql');
const cors = require('cors');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'more_buy'
})

// Create a new instance of the Express app
const app = express();

// Set up the middleware to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Define a POST route to handle the incoming request from the React app
app.post('/new_address', (req, res) => {
  const { name } = req.body;

  // Do something with the "name" parameter
  console.log(`Received name: ${name}`);


  console.log(req.body);

    const sql = "INSERT INTO address (name, landmark) VALUES ?";
    const values = [
        [req.body.name, 'Highway 71'],
        ['Peter', 'Lowstreet 4']
        ];
        db.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + req.body);
        console.log("Number of records inserted: " + result.affectedRows);
       // console.log(req);
        });

  // Send a response back to the React app
  res.send(`Hello, ${name}!`);
});

app.get("/users", (req, res)=>{
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})




// Start the server
app.listen(8081, () => {
    console.log('Server started on port 8081');
  });






/*const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
app.use(cors())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'more_buy'
})

app.get('/', (re, res)=>{
    return res.json('From backend side');
})

*/
/*  Add Address */
/*
const express = require('express');
const app = express();
const port = 8081;

app.use(express.json());

app.post('/new_address', (req, res) => {
    const name = req.body.name;
    console.log(name);
    res.json({ message: `Hello, ${name}!` });
  });
/*
app.post("/new_address", (req, res)=>{
   console.log(req);
    const sql = "INSERT INTO address (name, landmark) VALUES ?";
    const values = [
        [req.body.name, 'Highway 71'],
        ['Peter', 'Lowstreet 4']
        ];
        db.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + req.body);
        console.log("Number of records inserted: " + result.affectedRows);
       // console.log(req);
        });
})*/

/*
app.get("/users", (req, res)=>{
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})



app.listen(8081, ()=>{
    console.log("listening");
})*/