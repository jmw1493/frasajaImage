const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const memory = {todo: []};
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res, next) => {
  res.json(memory);
});

app.post('/', (req, res, next) => {
  memory.todo.push(req.body.data);
  res.json(req.body);
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
})
