// console.log("HELLO!");

const express = require('express');
const app = express();
const path = require('path');

app.get('/', (req, res, next) => {
  console.log("fghj")
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
})
