import { Router } from 'express';
const router = new Router();

// Remove this
import fakeDB from '../fake-db.js';

router.get('/', (req, res) => {
  res.statusCode = 200;
  res.json(fakeDB);
});

module.exports = router;
