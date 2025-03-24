const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const logger = require('./src/loggers/logger');
const app = express();

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