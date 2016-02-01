var express = require('express');
var router = express.Router();

router.get('/seed/data/grupos', require('../seeds/grupos'));
