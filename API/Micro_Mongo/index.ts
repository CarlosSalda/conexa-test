const express = require('express');
const app = express();
require('dotenv').config();
require('./database');

const port = process.env.PORT_MONGO || process.env.PORT;
const userRoutes = require('./routes/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/bd', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
