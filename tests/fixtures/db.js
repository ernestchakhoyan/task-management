const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const defaultUserId = new mongoose.Types.ObjectId;
const userTwoId = new mongoose.Types.ObjectId;
const defaultUser = {
    _id: defaultUserId,
    name: "Joker",
    email: "joker@test.com",
    password: "Joker123!",
    tokens: [ {
        token: jwt.sign({ _id: defaultUserId }, process.env.JWT_SECRET_KEY)
    } ]
};

const userTwo = {
    _id: defaultUserId,
    name: "IronMan",
    email: "iron@man.com",
    password: "IronMan123!",
    tokens: [ {
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET_KEY)
    } ]
};

const taskOne = {
    _id: new mongoose.Types.ObjectId,
    description: "Task one",
    completed: false,
    owner: defaultUserId
};
const taskTwo = {
    _id: new mongoose.Types.ObjectId,
    description: "Task two",
    completed: true,
    owner: defaultUserId
};

const taskThree = {
    _id: new mongoose.Types.ObjectId,
    description: "Task three",
    completed: false,
    owner: defaultUserId
};

const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(defaultUser).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    defaultUser,
    userTwo,
    defaultUserId,
    setupDatabase,
    taskOne,
    taskTwo,
    taskThree
}