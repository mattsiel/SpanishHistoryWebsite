/* eslint-disable import/extensions */
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';

// swagger init
import swaggerUI from 'swagger-ui-express';
import swaggerConf from './swagger-config.js';

// routes
import DynastyRoute from './routes/dynasty.js';
import PersonRoute from './routes/person.js';
import FamilyRoute from './routes/family.js';
import LocationRoute from './routes/location.js';

// inits
import initDynasty from './init/initialDynasty.js';
import initIberianFamilies from './init/iberia/initialFamily.js';
import initIberianLocations from './init/iberia/initalLocation.js';
import { Delete } from './init/removeAll.js';

const app = express();

const port = process.env.API_PORT;

const corsOptions = {
  origin: 'http://localhost:3500',
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(
  '/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(swaggerConf.specs, swaggerConf.uiOptions),
);

app.get('/', (request, response) => {
  response.json({ info: `the vars are ${process.env.PGHOST}` });
});

app.use('/person', PersonRoute);
app.use('/family', FamilyRoute);
app.use('/dynasty', DynastyRoute);
app.use('/location', LocationRoute);


const initialize = async () => {
  await Delete();
  await initDynasty();
  await initIberianFamilies();
  await initIberianLocations();
}

initialize();

app.listen(port, () => {
  console.log(`App running on port ${port}. pg port access from ${process.env.PGPORT}`);
});

export default app;
