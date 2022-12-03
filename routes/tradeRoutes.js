const express = require('express');
const controller = require('../controllers/tradeController');
const router =  express.Router();
const {isLoggedIn, isAuthor} = require('../middlewares/auth')
const {validateId} = require('../middlewares/validator');



// GET /trades ... list of trades and categories
router.get('/', controller.trades);


// GET /trades/newtrade ... gets form page for new trade
router.get('/newtrade',isLoggedIn,controller.newtrade);

// POST /trades create a new trade
router.post('/', isLoggedIn,controller.create);


// GET /trades/:id .... detail page identified by ID
router.get('/:id',validateId,controller.detail);


// DELETE /trades/:id ... Delete trade identified by ID
router.delete('/:id',validateId,isLoggedIn,isAuthor, controller.delete);


// Update Routes
// GET /trades/:id/edit .. get form to edit identified by ID
router.get('/:id/edit',validateId, isLoggedIn,isAuthor,controller.edit);
// PUT /trades/:id  .. PUT request to update the fields of item identified by ID
router.put('/:id',validateId,isLoggedIn,isAuthor,controller.update);



module.exports = router;