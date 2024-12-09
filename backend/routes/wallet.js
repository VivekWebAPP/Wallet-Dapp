import express from 'express';
import { body, validationResult } from 'express-validator';
import findToken from '../middleware/findToken.js';
import Wallet from '../models/walletModel.js';

const router = express.Router();

router.get('/allWallet', findToken, async (req, res) => {
    try {
        const userId = await req.user;
        if (!userId) {
            return res.status(400).json({ message: 'Invalid token' });
        }
        const wallets = await Wallet.find({ user: userId });
        res.status(200).send({ wallet: wallets });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: 'Internal Error Occurred' });
    }
});

router.post('/createNewWallet', findToken, [
    body('name').isString().isLength(3).withMessage('Enter A Valid Name'),
    body('publicAddress').isString().withMessage('Enter A Valid Public Address'),
    body('balance').isNumeric().withMessage('Enter A Valid Balance'),
], async (req, res) => {
    try {
        const error = validationResult(req.body);
        if (!error.isEmpty()) {
            return res.status(400).send({ error: error.array });
        }
        const userId = await req.user;
        if (!userId) {
            return res.status(400).send({ message: 'Invalid token' });
        }
        const { name, publicAddress, balance } = req.body;
        const wallet = await Wallet.create({
            name,
            publicAddress,
            balance,
            user: userId,
        });
        await wallet.save();
        res.status(201).send({ wallet: wallet });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: 'Internal Error Occurred' });
    }
});

router.put('/updateTheWallet/:id', findToken, [
    body('name').isString().isLength(3).withMessage('Enter A Valid Name'),
    body('publicAddress').isString().withMessage('Enter A Valid Public Address'),
    body('balance').isNumeric().withMessage('Enter A Valid Balance')
], async (req, res) => {
    try {
        const userId = await req.user;
        if (!userId) {
            return res.status(400).send({ message: 'Invalid token' });
        }
        const error = validationResult(req.body);
        if (!error.isEmpty()) {
            return res.status(400).send({ error: error.array });
        }
        const walletId = req.params.id;
        const upatedWallet = {}
        let wallet = await Wallet.findById(walletId);
        const { name, publicAddress, balance } = req.body;
        if (name) {
            upatedWallet.name = name
        }
        if (publicAddress) {
            upatedWallet.publicAddress = publicAddress;
        }
        if (balance) {
            upatedWallet.balance = balance;
        }
        wallet = await Project.findByIdAndUpdate(walletId, upatedWallet, { new: true });
        res.status(200).send({ wallet });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: 'Internal Error Occurred' });
    }
});

router.delete('/removeAWallet/:id', findToken, async (req, res) => {
    try {
        const userId = await req.user;
        if (!userId) {
            return res.status(400).send({ message: 'Invalid token' });
        }
        const walletId = req.params.id;
        const wallet = await Wallet.findByIdAndDelete(walletId);
        res.status(200).send({ wallet: 'Wallet Removed Successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: 'Internal Error Occurred' })
    }
});

export default router;