'use strict';
import dotenv from 'dotenv';

dotenv.config();

// level 0
// const config = {
//     app: {
//         port: 3000
//     },
//     db: {
//         host: 'localhost',
//         port: 27017,
//         name: "db"
//     }
// }

// level 1
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 8000,
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'shopDEV',
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },
  db: {
    host: process.env.PRO_DB_HOST || 'localhost',
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || 'shopDEV',
  },
};

const config = { dev, pro };

const NODE_ENV = process.env.NODE_ENV as 'dev' | 'pro';
const env = NODE_ENV || 'dev';

export default config[env];
