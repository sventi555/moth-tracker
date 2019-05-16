require('dotenv-safe').config();
const express = require('express');

const { errorMiddleware } = require('./middlewares/error-middleware');
const mothRoutes = require('./routes/moth-routes');

const app = express();

app.use(express.json());
mothRoutes(app);

app.use(errorMiddleware);

app.listen(process.env.PORT);
