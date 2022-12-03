const express = require('express');
const controller = require('../controllers/mainController');
const router =  express.Router();

//GET / landing page of the website
router.get('/', controller.index);


//GET /about ... gets about page
router.get('/about', controller.about);


//GET /contact ... gets contact page
router.get('/contact', controller.contact);
module.exports = router;