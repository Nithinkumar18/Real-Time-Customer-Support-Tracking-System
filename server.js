const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const logger = require('./src/loggers/logger');
const app = express();
const userRoutes = require('./src/routes/userRoutes');
const ticketRoutes = require('./src/routes/ticketRoutes');


app.use(express.json());
app.use('/user/v1',userRoutes);
app.use('/ticket/v1',ticketRoutes);

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info('connecting to database.... 🔮');
    app.listen(process.env.PORT);
    logger.info(`Connected 👋 And Server started on ${process.env.PORT} ⬆️`);
}).catch((err) => {
    logger.error('🤷🏻‍♂️',err);
})

