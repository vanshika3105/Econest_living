import Product from '../models/Product.js';

// POST /api/products — create a new product (vendor only)
export const createProduct = async (req, res) => {
  try {
    const vendorId = req.user.uid;
    const vendorName = req.user.name || req.user.email || 'Vendor';

    const {
      name, price, category, desc, image, material,
      ecoScore, stock, tag, certifications, carbonFootprint,
      dimensions,
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price and category are required.' });
    }

    const product = await Product.create({
      name,
      price: Number(price),
      category,
      desc: desc || '',
      image: image || '',
      material: material || '',
      ecoScore: ecoScore != null ? Number(ecoScore) : 75,
      stock: stock != null ? Number(stock) : 0,
      tag: tag || '',
      certifications: Array.isArray(certifications) ? certifications : [],
      carbonFootprint: carbonFootprint || 'Low',
      dimensions: dimensions || '',
      vendorId,
      vendorName,
      status: 'active',
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// GET /api/products/mine — vendor's own products
export const getVendorProducts = async (req, res) => {
  try {
    const vendorId = req.user.uid;
    const products = await Product.find({ vendorId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// GET /api/products — all active products (public — for customer shop)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// DELETE /api/products/:id — vendor deletes their own product
export const deleteProduct = async (req, res) => {
  try {
    const vendorId = req.user.uid;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.vendorId !== vendorId) {
      return res.status(403).json({ message: 'Not authorised to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
