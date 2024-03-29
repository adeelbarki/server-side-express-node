var express = require('express');
var router = express.Router('');
var CustomerService = require('../services/service.customer');


// Get Customer Listing
router.get('/', async (req, res, next) => {
    res.json({
        error: "Invalid customer UID."
    });
});


// Adds new customer to the List 
router.post('/', async (req, res, next) => {
    const body = req.body;

    try {
        const customer = await CustomerService.create(body)

        if(body.guid != null) {
            customer.guid = body.guid;
        }
        res.cookie('guid', customer.guid, {maxAge: 900000, httpOnly: true});

        // Create the customer
        return res.status(201).json({ customer: customer });
    }
    catch(err){
        if(err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }

        // Unexpected Error
        return next(err);
    }
})

// Retrieve a customer by ID 
router.get('/:id', async (req, res, next) => {
    
    try {
        const customer = await CustomerService.retrieve(req.params.id);

        return res.json({ customer: customer });
    }
    catch(err) {
        // Unexpected error
        return next(err);
    }
});

// Update customer
router.put('/:id', async (req, res, next) => {
    try {
        const customer = await CustomerService.update(req.param.id, req.body);

        return res.json({ customer: customer });
    }
    catch(err) {
        return next(err);
    }
});

// Delete customer
router.delete('/:id', async (req, res, next) => {
    try {
        const customer = await CustomerService.delete(req.params.id);

        return res.json({ success: true });
    }
    catch(err){
        return next(err);
    }
});

module.exports = router;