// import dependencies

import bodyParser from 'body-parser';
import config from './utils/config.js';
import connectDB from './utils/connectDB.js';
import cors from 'cors';
import express from 'express';
import router from './routes/index.js';

// set up dependencies
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* cors */
app.use(cors());

connectDB();
app.use('/api', router);

// set up route
app.listen(config().port, () => {
  console.log(`Our server is running on port ${config().port}`);
});
