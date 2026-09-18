import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { User } from '../models/User.js';
import { PurchaseOrder, SupplierMetric, InventoryAlert } from '../models/SCM.js';
import { Review } from '../models/Review.js';

// ═══════════════════════════════════════════════════════════════
// LIVE ORDER TRACKING
// ═══════════════════════════════════════════════════════════════

const ORDER_PIPELINE = ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

// GET /api/admin/orders — All orders with full tracking info
export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
};

// PUT /api/admin/orders/:orderId/status — Update order status (step forward in pipeline)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note, carrier, trackingNumber, estimatedDelivery, location } = req.body;

    if (!status) return res.status(400).json({ error: 'Status is required' });
    if (!ORDER_PIPELINE.includes(status) && status !== 'Cancelled') {
      return res.status(400).json({ error: `Invalid status. Valid: ${ORDER_PIPELINE.join(', ')}, Cancelled` });
    }

    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Update status
    order.status = status;
    order.trackingHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`,
      updatedBy: req.mongoUser?.name || req.user?.email || 'admin',
      location: location || ''
    });

    // Optional fields
    if (carrier) order.carrier = carrier;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);

    if (status === 'Cancelled') {
      order.cancelledAt = new Date();
      order.cancelReason = note || 'Cancelled by admin';
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order', details: error.message });
  }
};

// PUT /api/admin/orders/:orderId/notes — Add admin notes
export const addOrderNotes = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { notes } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId },
      { adminNotes: notes },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add notes', details: error.message });
  }
};

// GET /api/admin/orders/live — Live tracking data (all active orders)
export const getLiveTrackingOrders = async (req, res) => {
  try {
    const activeOrders = await Order.find({
      status: { $nin: ['Delivered', 'Cancelled'] }
    }).sort({ createdAt: -1 });
    res.json(activeOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch live orders', details: error.message });
  }
};


// ═══════════════════════════════════════════════════════════════
// ADMIN BUSINESS CONTROLS
// ═══════════════════════════════════════════════════════════════

// PUT /api/admin/users/:userId/role — Change user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if (!['customer', 'supplier', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role', details: error.message });
  }
};

// DELETE /api/admin/users/:userId — Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
};

// PUT /api/admin/products/:productId/status — Approve/reject/suspend product
export const updateProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const { status } = req.body;
    if (!['active', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid product status' });
    }
    const product = await Product.findByIdAndUpdate(productId, { status }, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product status', details: error.message });
  }
};

// PUT /api/admin/products/:productId/stock — Update product stock
export const updateProductStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(productId, { stock: Number(stock) }, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Check for low stock alert
    if (stock <= 5) {
      await InventoryAlert.findOneAndUpdate(
        { productId, resolved: false },
        {
          productId,
          productName: product.name,
          type: stock === 0 ? 'out_of_stock' : 'low_stock',
          currentStock: stock,
          threshold: 5
        },
        { upsert: true, new: true }
      );
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stock', details: error.message });
  }
};

// DELETE /api/admin/products/:productId — Admin delete product
export const adminDeleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted by admin' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
};

// GET /api/admin/dashboard — Complete business dashboard data
export const getBusinessDashboard = async (req, res) => {
  try {
    const [orders, products, users] = await Promise.all([
      Order.find().sort({ createdAt: -1 }),
      Product.find(),
      User.find()
    ]);

    const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const thisMonth = new Date(); thisMonth.setDate(1);
    const monthlyOrders = orders.filter(o => new Date(o.createdAt) >= thisMonth);
    const monthlyRevenue = monthlyOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);

    const statusCounts = {};
    orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });

    const lowStockProducts = products.filter(p => p.stock <= 5);
    const outOfStockProducts = products.filter(p => p.stock === 0);

    // Daily revenue for last 7 days
    const dailyRevenue = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0,0,0,0);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const dayOrders = orders.filter(o => {
        const cd = new Date(o.createdAt);
        return cd >= d && cd < next;
      });
      dailyRevenue.push({
        date: d.toISOString().slice(0, 10),
        revenue: dayOrders.reduce((s, o) => s + (o.totalAmount || 0), 0),
        orders: dayOrders.length
      });
    }

    // Category distribution
    const categoryDist = {};
    products.forEach(p => { categoryDist[p.category] = (categoryDist[p.category] || 0) + 1; });

    res.json({
      totalRevenue,
      monthlyRevenue,
      totalOrders: orders.length,
      monthlyOrders: monthlyOrders.length,
      totalUsers: users.length,
      totalProducts: products.length,
      statusCounts,
      lowStockProducts: lowStockProducts.length,
      outOfStockProducts: outOfStockProducts.length,
      lowStockList: lowStockProducts.map(p => ({ _id: p._id, name: p.name, stock: p.stock, category: p.category })),
      dailyRevenue,
      categoryDistribution: categoryDist,
      activeOrders: orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length,
      customerCount: users.filter(u => u.role === 'customer').length,
      vendorCount: users.filter(u => u.role === 'supplier').length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard', details: error.message });
  }
};

// ═══════════════════════════════════════════════════════════════
// SUPPLY CHAIN MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// GET /api/admin/scm/overview — SCM Dashboard data
export const getSCMOverview = async (req, res) => {
  try {
    const [products, users, purchaseOrders, alerts] = await Promise.all([
      Product.find(),
      User.find({ role: 'supplier' }),
      PurchaseOrder.find().sort({ createdAt: -1 }),
      InventoryAlert.find({ resolved: false }).sort({ createdAt: -1 })
    ]);

    // Inventory summary
    const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
    const totalValue = products.reduce((s, p) => s + ((p.stock || 0) * (p.price || 0)), 0);
    const lowStock = products.filter(p => p.stock <= 5 && p.stock > 0);
    const outOfStock = products.filter(p => p.stock === 0);

    // Category inventory
    const categoryInventory = {};
    products.forEach(p => {
      if (!categoryInventory[p.category]) {
        categoryInventory[p.category] = { count: 0, stock: 0, value: 0 };
      }
      categoryInventory[p.category].count++;
      categoryInventory[p.category].stock += p.stock || 0;
      categoryInventory[p.category].value += (p.stock || 0) * (p.price || 0);
    });

    // Build supplier metrics from products if no stored metrics exist
    const supplierData = users.map(v => {
      const vProducts = products.filter(p => p.vendorId === v._id?.toString() || p.vendorName === v.name);
      return {
        _id: v._id,
        name: v.name,
        email: v.email,
        productCount: vProducts.length,
        totalStock: vProducts.reduce((s, p) => s + (p.stock || 0), 0),
        avgEcoScore: vProducts.length ? Math.round(vProducts.reduce((s, p) => s + (p.ecoScore || 0), 0) / vProducts.length) : 0,
        categories: [...new Set(vProducts.map(p => p.category))],
      };
    });

    // PO Summary
    const poCounts = {};
    purchaseOrders.forEach(po => { poCounts[po.status] = (poCounts[po.status] || 0) + 1; });

    res.json({
      inventory: {
        totalProducts: products.length,
        totalStock,
        totalValue,
        lowStockCount: lowStock.length,
        outOfStockCount: outOfStock.length,
        lowStockProducts: lowStock.map(p => ({ _id: p._id, name: p.name, stock: p.stock, category: p.category, vendorName: p.vendorName })),
        outOfStockProducts: outOfStock.map(p => ({ _id: p._id, name: p.name, category: p.category, vendorName: p.vendorName })),
        categoryInventory
      },
      suppliers: supplierData,
      purchaseOrders: purchaseOrders.slice(0, 20),
      poStatusCounts: poCounts,
      alerts: alerts.slice(0, 20),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SCM data', details: error.message });
  }
};

// POST /api/admin/scm/purchase-orders — Create purchase order
export const createPurchaseOrder = async (req, res) => {
  try {
    const { vendorId, vendorName, items, expectedDelivery, notes } = req.body;
    const poNumber = `PO-${Date.now().toString().slice(-8)}`;
    const totalAmount = items.reduce((s, i) => s + (i.quantity * i.unitCost), 0);
    
    items.forEach(i => { i.totalCost = i.quantity * i.unitCost; });

    const po = await PurchaseOrder.create({
      poNumber,
      vendorId,
      vendorName,
      items,
      totalAmount,
      expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : undefined,
      notes,
      createdBy: req.mongoUser?.name || 'admin'
    });

    res.status(201).json(po);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create PO', details: error.message });
  }
};

// PUT /api/admin/scm/purchase-orders/:poId/status — Update PO status
export const updatePurchaseOrderStatus = async (req, res) => {
  try {
    const { poId } = req.params;
    const { status } = req.body;
    const validStatuses = ['Draft', 'Sent', 'Confirmed', 'In Transit', 'Received', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Valid: ${validStatuses.join(', ')}` });
    }

    const update = { status };
    if (status === 'Received') update.actualDelivery = new Date();

    const po = await PurchaseOrder.findByIdAndUpdate(poId, update, { new: true });
    if (!po) return res.status(404).json({ error: 'Purchase order not found' });

    // If received, update product stock
    if (status === 'Received') {
      for (const item of po.items) {
        if (item.productId) {
          await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
        }
      }
    }

    res.json(po);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update PO', details: error.message });
  }
};

// GET /api/admin/scm/alerts — Inventory alerts
export const getInventoryAlerts = async (req, res) => {
  try {
    // Auto-generate alerts from current stock levels
    const products = await Product.find();
    for (const p of products) {
      if (p.stock <= 5) {
        await InventoryAlert.findOneAndUpdate(
          { productId: p._id, resolved: false },
          {
            productId: p._id,
            productName: p.name,
            type: p.stock === 0 ? 'out_of_stock' : 'low_stock',
            currentStock: p.stock,
            threshold: 5
          },
          { upsert: true, new: true }
        );
      }
    }

    const alerts = await InventoryAlert.find({ resolved: false }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts', details: error.message });
  }
};

// PUT /api/admin/scm/alerts/:alertId/resolve — Resolve an alert
export const resolveAlert = async (req, res) => {
  try {
    const alert = await InventoryAlert.findByIdAndUpdate(
      req.params.alertId,
      { resolved: true, resolvedAt: new Date() },
      { new: true }
    );
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve alert', details: error.message });
  }
};

// GET /api/admin/crm/reviews-analysis — Sentiment/keyword analysis of reviews
export const getReviewAnalysis = async (req, res) => {
  try {
    const reviews = await Review.find();
    if (reviews.length === 0) {
      return res.json({ total: 0, averageRating: 0, good: 0, bad: 0, neutral: 0, suggestions: [] });
    }

    const total = reviews.length;
    const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1);
    const good = reviews.filter(r => r.rating >= 4).length;
    const neutral = reviews.filter(r => r.rating === 3).length;
    const bad = reviews.filter(r => r.rating <= 2).length;

    // Improvement keywords to watch for in negative reviews
    const keywords = ['quality', 'delivery', 'price', 'packing', 'service', 'shipping', 'late', 'damaged', 'broken', 'slow', 'expensive'];
    const badComments = reviews.filter(r => r.rating <= 2).map(r => r.comment.toLowerCase());
    
    const feedbackCounts = {};
    badComments.forEach(comment => {
      keywords.forEach(kw => {
        if (comment.includes(kw)) {
          feedbackCounts[kw] = (feedbackCounts[kw] || 0) + 1;
        }
      });
    });

    const recentKeywords = Object.entries(feedbackCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([keyword, count]) => ({ keyword, count }));

    // Generate suggestions based on top issues
    const suggestions = [];
    if (bad > 0) {
      if (feedbackCounts.delivery || feedbackCounts.late || feedbackCounts.shipping || feedbackCounts.slow) {
        suggestions.push("Strengthen logistics partnerships to reduce delays.");
      }
      if (feedbackCounts.damaged || feedbackCounts.broken || feedbackCounts.quality) {
        suggestions.push("Upgrade item packaging materials or review supplier manufacturing standards.");
      }
      if (feedbackCounts.expensive || feedbackCounts.price) {
        suggestions.push("Perform a price review for high-churn/bad-review items.");
      }
      if (suggestions.length === 0) {
        suggestions.push("Manually investigate recent 1-2 star reviews to identify specific service gaps.");
      }
    } else {
      suggestions.push("Keep maintaining current service levels. Consider rewarding loyal reviewers.");
    }

    res.json({
      total,
      averageRating: parseFloat(averageRating),
      good,
      bad,
      neutral,
      sentimentDistribution: {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
      },
      recentKeywords,
      suggestions: [...new Set(suggestions)],
      ratingTrend: await getRatingTrend()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze reviews', details: error.message });
  }
};

async function getRatingTrend() {
  const trend = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0,0,0,0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);

    const dayReviews = await Review.find({
      createdAt: { $gte: d, $lt: next }
    });

    const avg = dayReviews.length === 0 ? 0 : 
      dayReviews.reduce((acc, r) => acc + r.rating, 0) / dayReviews.length;

    trend.push({
      date: d.toISOString().slice(5, 10),
      avg: parseFloat(avg.toFixed(1)),
      count: dayReviews.length
    });
  }
  return trend;
}
