const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  response.status(200).json(users);
});

usersRouter.post("/", async (request, response) => {
  const { name, username, password } = request.body;

  if (username === "" || username === undefined) {
    return response.status(400).json({
      error: "username and password are required",
    });
  }

  if (password === "" || password === undefined) {
    return response.status(400).json({
      error: "username and password are required",
    });
  }

  if (typeof password !== "string") {
    return response.status(400).json({ error: "password has to be a string" });
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: "password should be at least 3 characters long",
    });
  }

  if (username.length < 3) {
    return response.status(400).json({
      error: "username should be at least 3 characters long",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({
    name,
    username,
    passwordHash: passwordHash,
  });

  await user.save();
  response.status(201).json(user);
});

module.exports = usersRouter;
