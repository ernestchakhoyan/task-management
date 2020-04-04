const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400);
        res.send(e);
    }
});

router.get("/tasks", auth, async (req, res) => {
    try {
        const { user } = req;
        await user.populate("tasks").execPopulate();
        const { tasks } = user;
        res.send(tasks);
    } catch (e) {
        res.status(500).send();
    }
});

router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

router.patch("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;
    const allowedUpdates = [ "description", "completed" ];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(404).send({ error: "Invalid task updates" });
    }

    try {
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[ update ] = req.body[ update ]);
        task.save();

        res.status(200).send(task);
    } catch (e) {
        res.status(500).send();
    }
});

router.delete("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id});
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;