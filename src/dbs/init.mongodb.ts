'use strict';

import mongoose from 'mongoose';

import config from '../config/config.mongodb';

const { db } = config;
const { host, name, port } = db;

const connectString = `mongodb://${host}:${port}/${name}`;

// mongoose
//   .connect(connectString, {
//     maxPoolSize: 50,
//   })
//   .then((_) => {
//     console.log('Connected MongoDB Success');
//     countConnect();
//   })
//   .catch((err) => console.log(err, '===== connect error ====='));

// dev
class Database {
  static instance: any;
  constructor() {
    this.connect();
  }

  // connect
  connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => {
        console.log('Connected MongoDB Success');
      })
      .catch((err) => console.log(err, '===== connect error ====='));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();

export default instanceMongoDB;
