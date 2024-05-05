require("dotenv").config();
const userRouter = require("express").Router();
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleweres/auth");

userRouter.get("/", async (req, res) => {
  const users = await User.find();
  res.send({ users: users });
});

userRouter.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).send(`user already exists`);

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) throw new Error();

      let user = await User.create({ name, email, password: hash, role });
    //   await user.save();
      res
        .status(200)
        .json({ message: "User created successfully", user: user });
    });
  } catch (error) {
    res
      .status(401)
      .send({ def: `From Catch --> /register`, error: error.message });
  }

});

userRouter.post("/login", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user)
      return res.status(400).send({ error: "User not found Please Register" });

    let match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send({ error: "Invalid credentials" });

    // jwt.sign({ user }, process.env.SECRET_KEY, (err, token) => {
    //     if(err) throw new Error();

    //     res.status(200).json({ message: "Login successful", token: token });
    // })
    let token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: { user },
      },
      process.env.SECRET_KEY
    );
    res.status(200).json({ message: "Login successful", token: token , user : user});
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

module.exports = userRouter;
