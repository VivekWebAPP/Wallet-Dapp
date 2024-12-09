import express from 'express';
import User from '../models/UserModels.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import findToken from '../middleware/findToken.js';

dotenv.config();

const router = express.Router();

router.post('/sigin', [
    body('name').isString().isLength(5).withMessage('Enter A Valid Name'),
    body('username').isString().isLength(3).withMessage('Enter A Valid Username'),
    body('email').isEmail().withMessage('Enter A Valid Email'),
    body('password').isString().isLength(8).withMessage('Enter A Valid Password'),
], async (req, res) => {
    try {
        const error = validationResult(req.body);
        if (!error.isEmpty()) {
            return res.status(400).send({ error: error.array() })
        }
        const { name, username, email, password } = req.body;
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).send({ error: "Email Already Exist" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            name: name,
            username: username,
            email: email,
            password: hashedPassword,
        });
        const data = {
            userId: {
                id: user.id
            }
        };

        const secret = process.env.SECRET;
        const token = jwt.sign(data, secret);
        res.status(200).send({ token: token })
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: 'Internal Error Occurred' });
    }
});

router.post('/login', [
    body('email').isEmail().withMessage('Enter A Valid Email'),
    body('password').isString().isLength(8).withMessage('Enter A Valid Password'),
], async (req, res) => {
    try {
        const error = validationResult(req.body);
        if (!error.isEmpty()) {
            return res.status(400).send({ error: error.array() })
        }
        const { email, password } = req.body;
        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).send({ error: "Email Does Not Exist" })
        }
        const matchedPassword = bcrypt.compare(password, user.password);
        if (!matchedPassword) {
            return res.status(400).send({ error: "Invalid Password" });
        }
        const data = {
            userId: {
                id: user.id,
            }
        }
        const secret = process.env.SECRET;
        const token = jwt.sign(data, secret);
        res.status(200).send({ token: token });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: 'Internal Error Occurred' });
    }
});

router.get('/getUserDetails', findToken, async (req, res) => {
    try {
        const userId = await req.user;
        if (!userId) {
            return res.status(400).send({ error: "Invalid Token" })
        }
        const user = await User.findById(userId);
        res.status(200).send({ user: user })
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: 'Internal Error Occurred' });
    }
});

export default router;