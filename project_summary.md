# EcoNest Living: Project Documentation & Business Strategy

EcoNest Living is a specialized D2C (Direct-to-Consumer) e-commerce platform dedicated to sustainable, eco-friendly, and compact furniture designed for modern urban environments.

---

## 1. Business Strategy & Model
### **Market Positioning**
- **Niche Focus:** Sustainable, zero-waste, and space-saving furniture.
- **Target Audience:** Eco-conscious urban dwellers, minimalists, and renters.
- **Value Proposition:** High-quality furniture made from bamboo and reclaimed wood, combined with a "circular economy" approach (Rentals and Social Proof).

### **Revenue Streams**
- **Direct Sales:** E-commerce sales of furniture items.
- **Rental Model:** Subscription-based furniture rental for temporary urban housing.
- **Vendor Marketplace:** A platform for sustainable suppliers to reach a curated audience.

---

## 2. ERP (Enterprise Resource Planning)
The platform integrates core business processes into a centralized dashboard:
- **Product Management:** Vendor-side inventory controls and product lifecycle management.
- **Order Management:** Automated order processing from checkout to delivery tracking.
- **User/Role Management:** Role-based access for Customers, Suppliers (Vendors), and Admins.

---

## 3. CRM (Customer Relationship Management)
EcoNest employs a 5-stage Customer Lifecycle Funnel tracking system:
1. **Acquisition:** Tracking new user signups via Firebase Auth.
2. **Engagement:** Monitoring user activities (product views, cart additions) through `UserActivity` logs.
3. **Conversion:** Real-time analysis of purchase and rental events.
4. **Retention:** Loyalty programs including Eco-points, carbon offset tracking, and rental renewals.
5. **Loyalty:** A tiered membership system based on "EcoScore" and community participation.
6. **Community Feedback:** A robust star-rating and review system providing social proof and direct customer communication.

---

## 4. SCM (Supply Chain Management)
- **Vendor Integration:** Dedicated vendor portal for listing products and managing fulfillments.
- **Sustainability Tracking:** Every product is assigned an "EcoScore" and carbon offset metric.
- **Rental Logistics:** Automated tracking of rental durations, end-dates, and renewal workflows.

---

## 5. Technology Stack
- **Frontend:** React 19 (Vite) with Custom Vanilla CSS for a premium, high-performance UI.
- **Backend:** Node.js & Express.js (RESTful API architecture).
- **Database:** MongoDB (NoSQL) for flexible schema management of products, orders, and activities.
- **Authentication:** Firebase Auth (Google SS0 & Email/Password) with MongoDB role synchronization.
- **Payment:** Simulated Razorpay Gateway integration for secure transaction flows.
- **Monitoring:** Integrated CRM tracking module for business intelligence.

---

## 6. E-Commerce & E-Business Classification
- **Classification:** **B2C (Business to Consumer)** & **Marketplace (B2B2C)**.
- **Type:** **Pure-Play E-business** with an integrated D2C brand strategy.
- **Economic Model:** Circular Economy integrated into a standard E-commerce framework, prioritizing environmental impact alongside profitability.
