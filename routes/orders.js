const router = require('express').Router();
const Order = require('../models/Order');
const { verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken } = require('./verifyToken');

// Create order
router.post('/', verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch(err) {
        res.status(500).json(err);
    }
})

// Update order
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedOrder);
    } catch(err) {
        res.status(500).json(err);
    }
})

// Delete order
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json('Order has been deleted');
    } catch(err) {
        res.status(500).json(err);
    }
})

// Get user's order
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.status(200).json(orders);
    } catch(err) {
        res.status(500).json(err);
    }
})

// Get all orders
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch(err) {
        res.status(500).json(err);
    }
})

// Get last 2 months's incomes
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const secondPreviousMonth = new Date(date.setMonth(date.getMonth() - 2));

    try {
        const data = await Order.aggregate([
            { $match: { createdAt: { $gte: secondPreviousMonth } } },
            { 
                $project: {
                    month: { $month: '$createdAt' },
                    sales: '$amount' 
                }
            },
            { 
                $group: {
                    _id: '$month',
                    total: { $sum: '$sales' }
                }
            }
        ])
        res.status(200).json(data);
    } catch(err) {
        res.status(500).json(err);
    }
})



module.exports = router;