const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send(req.session);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.send(req.user);
});

module.exports = router;