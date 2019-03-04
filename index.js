const express = require('express');
const bodyParser = require('body-parser');
const store = require('./store');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/api/register', (req, res) => {
  store.register({
      teacher: req.body.teacher,
      students: req.body.students
    })
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500));
});

app.listen(8094, () => {
  console.log('Server running on http://localhost:8094')
});
