import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

let razorpayInstance = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && !process.env.RAZORPAY_KEY_ID.includes('placeholder')) {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (err) {
    console.warn('Razorpay initialization fallback to sandbox mode:', err.message);
  }
}

// POST /api/payment/razorpay/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // convert rupees to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    if (razorpayInstance) {
      const order = await razorpayInstance.orders.create(options);
      return res.json({
        success: true,
        order,
        key: process.env.RAZORPAY_KEY_ID,
      });
    }

    // Mock / Sandbox fallback for testing when real keys are pending
    const mockOrder = {
      id: `order_mock_${Date.now()}`,
      entity: 'order',
      amount: options.amount,
      amount_paid: 0,
      amount_due: options.amount,
      currency: options.currency,
      receipt: options.receipt,
      status: 'created',
      isMock: true,
    };

    return res.json({
      success: true,
      order: mockOrder,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_sachikheti',
      mock: true,
      message: 'Razorpay order created in simulated sandbox mode.',
    });
  } catch (error) {
    console.error('Razorpay create-order error:', error);
    res.status(500).json({ success: false, message: 'Failed to initiate Razorpay payment' });
  }
});

// POST /api/payment/razorpay/verify
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Sandbox bypass
    if (razorpay_order_id && razorpay_order_id.startsWith('order_mock_')) {
      return res.json({
        success: true,
        verified: true,
        paymentId: razorpay_payment_id || `pay_mock_${Date.now()}`,
        message: 'Sandbox payment verified successfully',
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: 'Razorpay secret not configured on server' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      return res.json({
        success: true,
        verified: true,
        paymentId: razorpay_payment_id,
        message: 'Payment verified successfully',
      });
    } else {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Invalid signature. Payment verification failed.',
      });
    }
  } catch (error) {
    console.error('Razorpay verification error:', error);
    res.status(500).json({ success: false, message: 'Error verifying payment' });
  }
});

export default router;
