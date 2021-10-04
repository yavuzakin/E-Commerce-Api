const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();
const userRoute = require('./routes/users');
const productRoute = require('./routes/products');
const orderRoute = require('./routes/orders');
const cartRoute = require('./routes/carts');
const authRoute = require('./routes/auth');

// To be able to use dotenv file
dotenv.config();

// To be able to take json objects inside request body
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log(`DB connection is successfull`))
    .catch(err => console.log(err))

// middleware
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/carts', cartRoute);
app.use('/api/auth', authRoute);

app.listen(process.env.PORT, () => {
    console.log(`Listening port number ${process.env.PORT}`);
})