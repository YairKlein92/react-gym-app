const express = require('express');
const router = express.Router();

// @route GET api/users/test
// @desc Tests users route
// @access Public

router.get('/test', (req, res) => res.json({ msg: 'Users works' })); // the servers.js contains the routes/api/ already

module.exports = router; // so that server.js can pick it up
