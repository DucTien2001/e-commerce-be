'use strict';

import mongoose from 'mongoose';
import config from '../config/config.mongodb';

const { db } = config;
const { host, name, port } = db;

const connectString = `mongodb://${host}:${port}/${name}`;

mongoose
  .connect(connectString)
  .then((_) => console.log('Connected MongoDB Success'))
  .catch((err) => console.log(err, '===== connect error ====='));

// dev
if (1 === 1) {
  mongoose.set('debug', true);
  mongoose.set('debug', { color: true });
}

export default mongoose;
