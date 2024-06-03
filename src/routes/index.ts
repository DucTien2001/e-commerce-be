'use strict'
import express from 'express';

const router = express.Router()

router.get('/', (req, res, next) => {
  return res.status(200).json({
    messsage: 'Test',
  });
});

export default router