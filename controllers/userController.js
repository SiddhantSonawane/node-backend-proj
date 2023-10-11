const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  // try{
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User is already registered");
    }
    //for storing a password in our database we need to hash it
    const hashedpassword = await bcrypt.hash(password, 10);
    console.log('hashed password ', hashedpassword)
  
    // now create the user
    const user = await User.create({
      username,
      email,
      password: hashedpassword,
    });
  
    console.log(`User Created: ${user}`);
    if (user) {
      res.status(201).json({ _id: user.id, email: user.email });
    } else {
      res.status(400);
      throw new Error("Invalid User Data");
    }
    res.json({ message: "Register A new user!" });
  // }catch(error){
  //   console.error('Error during user creation:', error.message);
  //   res.status(500).json({ message: 'Internal Server Error' });
  // }
});

const loginUser = asyncHandler(async (req, res) => {
  //   console.log("api hitting");
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const user = await User.findOne({ email });
  //now for logging in compare the password with the hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
