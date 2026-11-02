import express from 'express';
import prisma from '../prisma.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/banners (Public)
router.get('/', async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: banners });
  } catch (error) {
    console.error('Fetch banners error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch banners' });
  }
});

// PUT /api/banners/:id (Admin Only)
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, isActive, link } = req.body;

    const updated = await prisma.banner.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(message !== undefined && { message }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(link !== undefined && { link }),
      },
    });

    res.json({ success: true, message: 'Banner updated', data: updated });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ success: false, message: 'Failed to update banner' });
  }
});

export default router;
