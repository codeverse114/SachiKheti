import express from 'express';
import prisma from '../prisma.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to generate unique order number e.g. SK-2026-8921
const generateOrderNumber = () => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SK-2026-${randomSuffix}`;
};

// POST /api/orders (Create Order)
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      address,
      city = 'Fatehabad',
      pincode = '',
      items,
      totalAmount,
      paymentMethod = 'WHATSAPP',
      notes = '',
      razorpayId = null
    } = req.body;

    if (!customerName || !customerPhone || !address || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide all required delivery details and cart items.' });
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        address,
        city,
        pincode,
        items: typeof items === 'object' ? JSON.stringify(items) : items,
        totalAmount: parseFloat(totalAmount),
        paymentMethod,
        paymentStatus: paymentMethod === 'RAZORPAY' && razorpayId ? 'COMPLETED' : 'PENDING',
        orderStatus: paymentMethod === 'RAZORPAY' ? 'CONFIRMED' : 'PENDING',
        razorpayId,
        notes,
      }
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

// GET /api/orders (Admin Only - List All Orders)
router.get('/', verifyAdminToken, async (req, res) => {
  try {
    const { status, paymentMethod } = req.query;
    const where = {};

    if (status && status !== 'all') {
      where.orderStatus = status;
    }

    if (paymentMethod && paymentMethod !== 'all') {
      where.paymentMethod = paymentMethod;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Parse JSON string items for client convenience
    const formattedOrders = orders.map(order => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    }));

    res.json({ success: true, count: formattedOrders.length, data: formattedOrders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// GET /api/orders/track/:orderNumber (Public Order Tracking)
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: req.params.orderNumber },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'No order found with this tracking number' });
    }

    const formattedOrder = {
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    };

    res.json({ success: true, data: formattedOrder });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ success: false, message: 'Failed to track order' });
  }
});

// PATCH /api/orders/:id/status (Admin Only)
router.patch('/:id/status', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    res.json({ success: true, message: 'Order status updated', data: updated });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

export default router;
