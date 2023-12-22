const express = require('express');
const cookieParser = require('cookie-parser');
const dbConnect = require('./database/index');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
// const {PORT} = require('./config/index')
const app = express();
const PORT = 8080;

app.use(cookieParser());
app.use(express.json());

app.use(router);

dbConnect();


app.get('/', (req, res) => {
  res.send('Hello World1234!')
})

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})