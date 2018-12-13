import { Router } from 'express';
import fakeDB from './fake-db.js';
const router = new Router();

router.get('/', (req, res) => {
  res.statusCode = 200;
  res.json(fakeDB);
});

export default router;
