const express = require('express');
const db = require('./db/db.json');
const fs = require ('fs');
const path = require('path');
//adds unique identifyer using NPM UUID
const uuid = require('./id-number/uuid');
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//adds static HTML CSS and JS
app.use(express.static('public'));

//get route for homepage 
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes',(req, res) => {
  //pulls second HTML page and renders
  res.sendFile(path.join(__dirname, './public/notes.html'))
  
})

app.route('/api/notes')
.get((req,res) => {
  
  console.info(`${req.method} they requested.. again`);
  //utf-8 is default character encoding used by all browsers
  let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  // console.log('this is the data from get - ' + data);
  res.send(data);
})
.post((req,res) => {
  console.info(`${req.method} Post Time, Yay more data!`);
  const madeNote = req.body;
 //gets unique identifier  
  madeNote.id = uuid();
  //turns string into object
 let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  //add now object to data 
  data.push(madeNote);
  
//stringify before sending to json file 
  fs.writeFileSync('./db/db.json', JSON.stringify(data));
    res.status(201).json(data);
 
})
app.delete(`/api/notes/:id`,(req, res) => {
 
  let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  
  const indexOfObj = data.findIndex(obj => {
    return obj.id === req.params.id;
  });
  
  data.splice(indexOfObj, 1);
  
  fs.writeFileSync('./db/db.json', JSON.stringify(data));
  
  res.send('selected data has been deleted')


})

app.listen(PORT, () =>
  console.log(`listening on my alltime favorite port ${PORT}!`)
);