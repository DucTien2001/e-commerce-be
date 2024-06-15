'use strict';

import express from 'express';
import accessRouter from './access.route';
import { apiKey, permission } from '../auth/checkAuth';

const router = express.Router();

// Check apikey
router.use(apiKey);
// Check permission
router.use(permission('0000'));

// router.use('/v1/api/product', require('./product'));
router.use('/v1/api', accessRouter);

// router.get('/', (req, res, next) => {
//   return res.status(200).json({
//     messsage: 'Test',
//   });
// });
export default router;
