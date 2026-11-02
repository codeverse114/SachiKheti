import express from 'express';
import prisma from '../prisma.js';

const router = express.Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Fetch categories error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

export default router;
