// src/app.ts
import express from 'express';
const app = express();
require('dotenv').config();
const port = process.env.PORT_BUSINESS;
const userRoutes = require('./routes/user');

app.use((req, res, next) => {
    if(req.headers.origin === process.env.URL_BASE_LOGING && req.originalUrl.includes('/api/users')) next()
    else return res.status(401).json({error: "Unauthorized"})
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
