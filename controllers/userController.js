const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc Register the User
// @route Post /api/users
// @access public
// we need to wrap the async function inside asyncHandler and now we dont have to write try-catch block in all functions
// So now when ever an exception occurs it is going to pass to error handler.
const registerUser = asyncHandler(async (req, res) => {
    console.log("Request Body:", req.body);

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    console.log("Email: ", email);

    const userAvailable = await User.findOne({ email: email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered!");
    }

    const saltrounds = 10;
    // Hash password
    const hashPassword = await bcrypt.hash(password, saltrounds);
    console.log("Hashed Password: ", hashPassword);
    const user = await User.create({
        username,
        email,
        password: hashPassword
    })
    console.log(`User Created ${user}`);
    if (user) {
        res.status(201).json({ _id: user.id, email: user.email })
    } else {
        res.status(400);
        throw new Error("User data was not valid");
    }

    res.status(200).json({ message: "Registered the User" })
});

// @desc Login the User
// @route Post /api/users
// @access public
// we need to wrap the async function inside asyncHandler and now we dont have to write try-catch block in all functions
// So now when ever an exception occurs it is going to pass to error handler.
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!")
    }

    const user = await User.findOne({ email: email });

    // compare the password with hash password
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            }
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );
        res.status(200).json({ message: "User Login Success", accessToken: accessToken });
    } else {
        res.status(401);
        throw new Error("Email or Password are not correct!");
    }
});

// @desc Current User
// @route Get /api/users
// @access private
// we need to wrap the async function inside asyncHandler and now we dont have to write try-catch block in all functions
// So now when ever an exception occurs it is going to pass to error handler.
const currentUser = asyncHandler(async (req, res) => {
    // let userDetails = req.user;
    // const user = await User.findOne({ email: userDetails.email });
    // res.status(200).json({ id: user._id, name: user.username, email: user.email });
    res.status(200).json(req.user);
});

module.exports = { registerUser, loginUser, currentUser }