const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize the app
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// MongoDB connection
mongoose.connect('mongodb://localhost:27017/customizedFootwear', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Cart item schema
const cartItemSchema = new mongoose.Schema({
    type: String,
    color: String,
    leather: String,
    additionalInfo: String,
    footWidth: Number,
    footHeight: Number,
    price: Number,
    imageUrl: String
});

// User schema
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

// Cart item model
const CartItem = mongoose.model('CartItem', cartItemSchema);

// User model
const User = mongoose.model('User', userSchema);

// User registration
app.post('/api/signup', async (req, res) => {
    const { email, password,confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match!" });
    }
  
    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Account with this email already exists!" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });

        // Save the user to the database
        await newUser.save();
        res.status(201).json({ message: "You have successfully created an account." });
    } catch (error) {
        console.error("Signup error:", error); // Log the error
        res.status(500).json({ message: "Signup failed, please try again later." });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
  
    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
  
    // Generate JWT token (or session) on successful login
    const token = jwt.sign({ email: user.email }, 'secret-key', { expiresIn: '1h' });
  
    return res.json({ message: 'You have successfully logged in', token });
  });
  
// Middleware for authentication
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, 'secret-key', (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.userId = decoded.id;
        next();
    });
};

// Get user profile
app.get('/api/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId); // Use req.userId to find the user
        if (!user) return res.sendStatus(404);
        res.json({ email: user.email });
    } catch (error) {
        console.error("Profile fetch error:", error); // Log the error
        res.status(500).json({ message: "Failed to load profile." });
    }
});
// Get cart items
app.get('/api/cart', async (req, res) => {
    try {
        const items = await CartItem.find();
        res.json(items);
    } catch (error) {
        res.status(500).send(error);
    }
});
app.get('/api/cart/count', async (req, res) => {
    try {
        const count = await CartItem.countDocuments(); // Count the number of cart items
        res.json({ count });
    } catch (error) {
        console.error("Error fetching cart count:", error);
        res.status(500).send(error);
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'footwear.html'));
});


// Add item to cart
app.post('/api/cart', async (req, res) => {
    const newItem = new CartItem(req.body);
    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Remove item from cart
app.delete('/api/cart/:id', async (req, res) => {
    try {
        const removedItem = await CartItem.findByIdAndDelete(req.params.id);
        res.json(removedItem);
    } catch (error) {
        res.status(500).send(error);
    }
});
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
