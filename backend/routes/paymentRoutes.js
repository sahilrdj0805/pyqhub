import express from 'express';
import { protect } from '../middlewares/auth.js';
import User from '../models/User.js';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const router = express.Router();

// Create Stripe Checkout Session
router.post('/create-checkout-session', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email,
            client_reference_id: user._id.toString(),
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'PYQ Hub PRO',
                            description: 'Unlimited access to all PYQ papers forever.',
                        },
                        unit_amount: 999, // $9.99
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/payment-cancel`,
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ message: "Payment processing failed" });
    }
});

// Verify Stripe Session
router.post('/verify-session', protect, async (req, res) => {
    try {
        const { session_id } = req.body;
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            const user = await User.findById(req.user.id);
            if (user && !user.isPro) {
                user.isPro = true;
                await user.save();
            }
            return res.json({ success: true, message: "Successfully upgraded to PRO!" });
        }
        
        res.status(400).json({ success: false, message: "Payment not completed" });
    } catch (error) {
        console.error('Stripe verify error:', error);
        res.status(500).json({ message: "Failed to verify session" });
    }
});

// Create Razorpay Order
router.post('/create-razorpay-order', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const options = {
            amount: 999 * 100, // ₹999 (amount in smallest currency unit, paise)
            currency: "INR",
            receipt: `receipt_${user._id}`,
        };

        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });
    } catch (error) {
        console.error('Razorpay order error:', error);
        res.status(500).json({ message: "Failed to create Razorpay order" });
    }
});

// Verify Razorpay Payment
router.post('/verify-razorpay-payment', protect, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            const user = await User.findById(req.user.id);
            if (user && !user.isPro) {
                user.isPro = true;
                await user.save();
            }
            return res.json({ success: true, message: "Successfully upgraded to PRO!" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error('Razorpay verify error:', error);
        res.status(500).json({ message: "Failed to verify payment" });
    }
});

// Refresh Credits Endpoint (Check if 3 days have passed)
router.post('/refresh-credits', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const now = new Date();
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
        
        // If they are not pro, and 3 days have passed since last reset
        if (!user.isPro && (now - new Date(user.lastCreditReset)) > threeDaysMs) {
            user.credits = 500;
            user.lastCreditReset = now;
            await user.save();
            return res.json({ refreshed: true, credits: 500, message: "Credits refilled to 500!" });
        }
        
        res.json({ refreshed: false, credits: user.credits, isPro: user.isPro });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to refresh credits" });
    }
});

// Pre-flight check for credits
router.get('/check-credits', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const now = new Date();
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
        
        // Auto-refill if 3 days have passed and not Pro
        if (!user.isPro && (now - new Date(user.lastCreditReset)) > threeDaysMs) {
            user.credits = 500;
            user.lastCreditReset = now;
            await user.save();
        }

        if (user.isPro) return res.json({ allowed: true, isPro: true });
        if (user.credits >= 50) return res.json({ allowed: true, credits: user.credits, isPro: false });
        
        return res.status(402).json({ allowed: false, message: "Out of credits", credits: user.credits, isPro: false });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
