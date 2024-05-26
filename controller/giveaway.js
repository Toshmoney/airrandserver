const Wallet = require("../model/Wallet.model");
const Giveaway = require("../model/giveAway.model");

const createGiveaway = async (req, res) => {
    try {
        const { amount } = req.body;
        const giverId = req.user._id;

        // Validate the amount
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        // Fetch the giver's wallet
        let giverWallet = await Wallet.findOne({ user: giverId });
        if (!giverWallet) {
            giverWallet = new Wallet({
                user: giverId,
                balance: 0,
            });
        }

        // Check if giver has sufficient balance
        if (giverWallet.balance < amount) {
            return res.status(400).json({ error: "Insufficient funds in giver's wallet" });
        }

        // Create the giveaway
        const giveaway = new Giveaway({
            giver: giverId,
            amount
        });

        await giveaway.save();

        return res.status(201).json({ message: "Giveaway created successfully!", giveaway });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message || "Error while creating the giveaway" });
    }
};


const bidForGiveaway = async (req, res) => {
    try {
        const { giveawayId } = req.params;
        const userId = req.user._id;

        // Fetch the giveaway
        const giveaway = await Giveaway.findById(giveawayId);
        if (!giveaway || giveaway.status !== "open") {
            return res.status(404).json({ error: "Giveaway not found or closed" });
        }

        // Check if user already bid
        if (giveaway.bids.some(bid => bid.user.toString() === userId.toString())) {
            return res.status(400).json({ error: "You have already bid for this giveaway" });
        }

        // Add bid to the giveaway
        giveaway.bids.push({ user: userId });
        await giveaway.save();

        return res.status(201).json({ message: "Bid placed successfully!", giveaway });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message || "Error while placing the bid" });
    }
};


const awardGiveaway = async (req, res) => {
    try {
        const { giveawayId, winnerId } = req.params;
        const giverId = req.user._id;

        // Fetch the giveaway
        const giveaway = await Giveaway.findOne({ _id: giveawayId, giver: giverId });
        if (!giveaway || giveaway.status !== "open") {
            return res.status(404).json({ error: "Giveaway not found or already closed/awarded" });
        }

        // Validate winner is in the bid list
        if (!giveaway.bids.some(bid => bid.user.toString() === winnerId.toString())) {
            return res.status(400).json({ error: "Selected winner did not bid for this giveaway" });
        }

        // Fetch the winner's wallet
        let winnerWallet = await Wallet.findOne({ user: winnerId });
        if (!winnerWallet) {
            winnerWallet = new Wallet({
                user: winnerId,
                balance: 0,
            });
        }

        // Fetch the giver's wallet
        let giverWallet = await Wallet.findOne({ user: giverId });
        if (!giverWallet) {
            giverWallet = new Wallet({
                user: giverId,
                balance: 0,
            });
        }

        // Deduct amount from giver's wallet
        giverWallet.balance -= giveaway.amount;
        await giverWallet.save();

        // Add amount to winner's wallet
        winnerWallet.balance += giveaway.amount;
        await winnerWallet.save();

        // Update giveaway status
        giveaway.status = "awarded";
        giveaway.winner = winnerId;
        await giveaway.save();

        // Create transaction records for both giver and winner
        const giverTransaction = new Transaction({
            user: giverId,
            amount: giveaway.amount,
            TransactionType: "debit",
            TransactionStatus: "completed",
            details: `Gave away ${giveaway.amount} to ${winnerId}`
        });

        const winnerTransaction = new Transaction({
            user: winnerId,
            amount: giveaway.amount,
            TransactionType: "credit",
            TransactionStatus: "completed",
            details: `Received ${giveaway.amount} from ${giverId}`
        });

        await giverTransaction.save();
        await winnerTransaction.save();

        return res.status(200).json({ message: "Giveaway awarded successfully!", giveaway });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message || "Error while awarding the giveaway" });
    }
};

const getGiveaway = async (req, res) => {
    try {
        const { giveawayId } = req.params;
        const giveaway = await Giveaway.findById(giveawayId).populate('bids.user', 'name').populate('giver', 'name');

        if (!giveaway) {
            return res.status(404).json({ error: "Giveaway not found" });
        }

        return res.status(200).json({ giveaway });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message || "Error while fetching the giveaway" });
    }
};

const editGiveaway = async (req, res) => {
    try {
        const { giveawayId } = req.params;
        const { amount } = req.body;
        const giverId = req.user._id;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        let giveaway = await Giveaway.findOne({ _id: giveawayId, giver: giverId });
        if (!giveaway || giveaway.status !== "open") {
            return res.status(404).json({ error: "Giveaway not found or cannot be edited" });
        }

        let giverWallet = await Wallet.findOne({ user: giverId });
        if (!giverWallet) {
            giverWallet = new Wallet({
                user: giverId,
                balance: 0,
            });
        }

        if (giverWallet.balance < amount) {
            return res.status(400).json({ error: "Insufficient funds in giver's wallet" });
        }

        giveaway.amount = amount;
        await giveaway.save();

        return res.status(200).json({ message: "Giveaway updated successfully!", giveaway });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message || "Error while updating the giveaway" });
    }
};

const deleteGiveaway = async (req, res) => {
    try {
        const { giveawayId } = req.params;
        const giverId = req.user._id;

        let giveaway = await Giveaway.findOne({ _id: giveawayId, giver: giverId });
        if (!giveaway || giveaway.status !== "open") {
            return res.status(404).json({ error: "Giveaway not found or cannot be deleted" });
        }

        await Giveaway.findByIdAndDelete(giveawayId);

        return res.status(200).json({ message: "Giveaway deleted successfully!" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message || "Error while deleting the giveaway" });
    }
};

const getAllGiveaways = async (req, res) => {
    try {
        const giveaways = await Giveaway.find().populate('giver', 'name').populate('bids.user', 'name');
        
        if (giveaways.length === 0) {
            return res.status(404).json({ error: "No giveaways found" });
        }

        return res.status(200).json({ giveaways });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message || "Error while fetching giveaways" });
    }
};



module.exports = {
    awardGiveaway,
    createGiveaway,
    bidForGiveaway,
    getGiveaway,
    editGiveaway,
    deleteGiveaway,
    getAllGiveaways
}