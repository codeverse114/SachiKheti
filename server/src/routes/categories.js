import express from 'express';
import prisma from '../prisma.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to generate URL-safe slug
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET /api/categories - public
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

// POST /api/categories (Admin Only) - Create a new category
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const { name, slug, description, icon, namePunjabi } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const finalSlug = (slug && slug.trim()) ? slug.trim().toLowerCase() : generateSlug(name);

    // Check if slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug: finalSlug }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: `Category with slug "${finalSlug}" already exists.` });
    }

    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
        namePunjabi: (namePunjabi && namePunjabi.trim()) ? namePunjabi.trim() : name.trim(),
        slug: finalSlug,
        description: description ? description.trim() : null,
        icon: icon ? icon.trim() : 'tag',
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    res.status(201).json({ success: true, message: 'Category created successfully', data: newCategory });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
});

// PUT /api/categories/:id (Admin Only) - Update a category
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon, namePunjabi } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (namePunjabi !== undefined) updateData.namePunjabi = namePunjabi.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (icon !== undefined) updateData.icon = icon ? icon.trim() : null;
    if (slug !== undefined && slug.trim()) {
      updateData.slug = slug.trim().toLowerCase();
    }

    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    res.json({ success: true, message: 'Category updated successfully', data: updated });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ success: false, message: 'Failed to update category' });
  }
});

// DELETE /api/categories/:id (Admin Only) - Delete a category
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id }
    });
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

export default router;
