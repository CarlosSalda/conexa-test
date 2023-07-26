// src/app.ts
const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT_LOGING;
const logInRoutes = require('./routes/logIn');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', logInRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});