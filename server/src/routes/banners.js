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

// POST /api/banners (Admin Only - Create Banner)
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const { title, message, isActive = true, link } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    const newBanner = await prisma.banner.create({
      data: {
        title: title.trim(),
        message: message.trim(),
        isActive: Boolean(isActive),
        link: link ? link.trim() : null,
      }
    });

    res.status(201).json({ success: true, message: 'Banner created successfully', data: newBanner });
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({ success: false, message: 'Failed to create banner' });
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

// DELETE /api/banners/:id (Admin Only - Delete Banner)
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.banner.delete({
      where: { id }
    });
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete banner' });
  }
});

export default router;
