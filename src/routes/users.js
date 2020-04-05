const express = require("express");
const router = new express.Router();
const multer = require("multer");
const User = require("../models/user");
const auth = require("../middleware/auth");

router.post("/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findCredentials(email, password);
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (e) {
        res.status(401).send(e);
    }
});

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(item => item.token !== req.token);

        await req.user.save();
        res.send();
    } catch (e) {
        console.log(e);
        res.status(401).send(e);
    }
});

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get("/users/me", auth, async (req, res) => {
    try {
        res.status(200).send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [ "name", "email", "password", "age" ];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates" });
    }

    try {
        const user = req.user;

        updates.forEach((update) => user[ update ] = req.body[ update ]);

        await user.save();
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
});

router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

const avatar = multer({
    dest: "avatars",
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error("Please upload an  image"))
        }

        cb(undefined, true);
    }
});
router.post("/users/me/avatar", avatar.single("avatar"), async (req, res) => {
    res.send();
});

module.exports = router;