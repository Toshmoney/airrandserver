const Transaction = require("../model/Transaction.model");
const Wallet = require("../model/Wallet.model");


const fundWallet = async (req, res) => {
    const user = req.user;
    const { amount, reference } = req.body;

    if (!amount || !reference) {
        return res.status(400).json({
            message: "Reference or amount is missing",
            success: false,
        });
    }

    try {
        let wallet = await Wallet.findOne({ user: user });

        if (!wallet) {
            wallet = new Wallet({
                user: user,
                balance: 0,
            });
        }

        // Verify payment with Paystack API
        const payment = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const paymentData = payment.data.data;

        if (!paymentData.status || paymentData.status !== "success") {
            return res.status(422).json({
                message: "Payment verification failed",
                success: false,
            });
        }

        // Update wallet and transaction status
        const amountPaid = amount / 100;
        wallet.balance += amountPaid;

        const transaction = new Transaction({
            user: user,
            amount: amountPaid,
            TransactionType: "credit",
            TransactionStatus: "completed",
            details: `Wallet funding with ${amountPaid}`,
            reference_number: reference,
        });

        await Promise.all([wallet.save(), transaction.save()]);

        return res.status(200).json({
            message: "Wallet funded successfully",
            success: true,
            data: {
                balance: wallet.balance,
                transaction: transaction,
            },
        });
    } catch (error) {
        console.error("Error funding wallet:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};


