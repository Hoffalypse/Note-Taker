const express = require('express');
const db = require('./db/db.json');
const fs = require ('fs');
const path = require('path');
//adds unique identifyer using NPM UUID
const uuid = require('./helper/uuid');
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//adds static HTML CSS and JS
app.use(express.static('public'));

app.get('/notes',(req, res) => {
  data = path.join(__dirname, './public/notes.html');
  //pulls second HTML page and renders
  res.sendFile(data)
  
})

app.route('/api/notes')
.get((req,res) => {
  //pulls the added notes from memory
  console.info(`${req.method} requested.. again`);
  res.send(JSON.parse(fs.readFileSync("./db/db.json", "utf8")));
})
.post((req,res) => {
  console.info(`${req.method} Post Time, Yay more data!`);
  const madeNote = req.body;
 //gets unique identifier  
 
  madeNote.id = uuid();
  
  //turns string into object and preps file to be added to
 let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  //add new object to data 
  data.push(madeNote);
  
//stringify before sending to json file 
  fs.writeFileSync('./db/db.json', JSON.stringify(data));
    res.status(201).json(data);
 
})
app.delete(`/api/notes/:id`,(req, res) => {
 
  let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  //goes through all objects to see which matches the passed in ID
  const indexOfObj = data.findIndex(obj => {
    return obj.id === req.params.id;
  });
  //pull out deleted element of the object 
  data.splice(indexOfObj, 1);
  
  fs.writeFileSync('./db/db.json', JSON.stringify(data));
  
  res.send('selected data has been deleted. POOF!')


})

//wild card route for not listed URL entries
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`listening on my alltime favorite port ${PORT}!`)
);