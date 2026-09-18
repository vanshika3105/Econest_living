import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true },
  vendorId: { type: String, required: true },
  vendorName: { type: String, default: '' },
  items: [{
    productId: { type: String },
    productName: { type: String },
    quantity: { type: Number, required: true },
    unitCost: { type: Number, required: true },
    totalCost: { type: Number }
  }],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Confirmed', 'In Transit', 'Received', 'Cancelled'],
    default: 'Draft'
  },
  expectedDelivery: { type: Date },
  actualDelivery: { type: Date },
  notes: { type: String, default: '' },
  createdBy: { type: String, default: 'admin' }
}, { timestamps: true });

export const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

// Supplier Performance tracking
const supplierMetricSchema = new mongoose.Schema({
  vendorId: { type: String, required: true },
  vendorName: { type: String, default: '' },
  totalOrders: { type: Number, default: 0 },
  completedOrders: { type: Number, default: 0 },
  avgLeadTimeDays: { type: Number, default: 0 },
  onTimeDeliveryRate: { type: Number, default: 100 }, // percentage
  qualityScore: { type: Number, default: 85 }, // 0-100
  returnRate: { type: Number, default: 0 }, // percentage
  lastOrderDate: { type: Date },
  lastEvaluation: { type: Date, default: Date.now }
}, { timestamps: true });

export const SupplierMetric = mongoose.model('SupplierMetric', supplierMetricSchema);

// Inventory Alerts
const inventoryAlertSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String },
  type: { type: String, enum: ['low_stock', 'out_of_stock', 'overstock', 'reorder'], default: 'low_stock' },
  currentStock: { type: Number, default: 0 },
  threshold: { type: Number, default: 5 },
  resolved: { type: Boolean, default: false },
  resolvedAt: { type: Date },
}, { timestamps: true });

export const InventoryAlert = mongoose.model('InventoryAlert', inventoryAlertSchema);
