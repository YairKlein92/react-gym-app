const express = require('express');
const router = express.Router();

// @route GET api/posts/test
// @desc Tests posts route
// @access Public

router.get('/test', (req, res) => res.json({ msg: 'Posts works' })); // the servers.js contains the routes/api/ already

module.exports = router; // so that server.js can pick it up
