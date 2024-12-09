import mongoose from "mongoose";

const WalletModel = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    publicAddress: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
}, { timestamps: true });

const Wallet = mongoose.model('Wallet',WalletModel);

export default Wallet;