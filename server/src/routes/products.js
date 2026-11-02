import express from 'express';
import prisma from '../prisma.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, featured } = req.query;

    const where = {};

    if (category && category !== 'all') {
      where.category = { slug: category };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search } },
        { titlePunjabi: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, namePunjabi: true, slug: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true }
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Fetch product detail error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
});

// POST /api/products (Admin Only)
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const {
      title,
      titlePunjabi,
      description,
      price,
      unit,
      imageUrl,
      categoryId,
      inStock = true,
      stockCount = 50,
      featured = false,
      specs
    } = req.body;

    if (!title || !price || !categoryId) {
      return res.status(400).json({ success: false, message: 'Title, price, and category are required.' });
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        titlePunjabi: titlePunjabi || title,
        description: description || '',
        price: parseFloat(price),
        unit: unit || 'Unit',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
        categoryId,
        inStock: Boolean(inStock),
        stockCount: parseInt(stockCount, 10) || 0,
        featured: Boolean(featured),
        specs: typeof specs === 'object' ? JSON.stringify(specs) : specs || null,
      },
      include: { category: true }
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
});

// PUT /api/products/:id (Admin Only)
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      titlePunjabi,
      description,
      price,
      unit,
      imageUrl,
      categoryId,
      inStock,
      stockCount,
      featured,
      specs
    } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (titlePunjabi !== undefined) updateData.titlePunjabi = titlePunjabi;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (unit !== undefined) updateData.unit = unit;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (inStock !== undefined) updateData.inStock = Boolean(inStock);
    if (stockCount !== undefined) updateData.stockCount = parseInt(stockCount, 10);
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (specs !== undefined) {
      updateData.specs = typeof specs === 'object' ? JSON.stringify(specs) : specs;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true }
    });

    res.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
});

// DELETE /api/products/:id (Admin Only)
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id }
    });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

export default router;
