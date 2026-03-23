import { useState, useEffect, useCallback } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import API from './services/api';

// Role display metadata
const ROLE_META = {
  customer: { label: "User", color: "#16a34a", bg: "#f0fdf4", icon: "User" },
  supplier: { label: "Vendor", color: "#f59e0b", bg: "#fefce8", icon: "Factory" },
  admin: { label: "Admin", color: "#3b82f6", bg: "#eff6ff", icon: "Shield" },
};


// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────

const T = {
  green: "#16a34a",
  greenDark: "#15803d",
  greenLight: "#f0fdf4",
  greenMid: "#dcfce7",
  navy: "#0f172a",
  navyMid: "#1e293b",
  slate: "#475569",
  muted: "#64748b",
  border: "#f1f5f9",
  borderMid: "#e2e8f0",
  bg: "#f8fafc",
  white: "#ffffff",
  red: "#ef4444",
  redLight: "#fef2f2",
  amber: "#f59e0b",
  amberLight: "#fefce8",
  blue: "#3b82f6",
  blueLight: "#eff6ff",
};

// ─── ICONS ──────────────────────────────────────────────────────────────────

const Icon = {
  Leaf: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a3.5 3.5 0 0 1-3.5 3.5c-1.2 0-2.31-.56-3.07-1.44M11 20H3c0-3.11 3.69-4.07 3.69-4.07M11 20c.1-.71.18-1.44.25-2.19.12-1.31.18-2.61.18-3.81 0-2.42-.45-4.83-1.63-7" /></svg>,
  Check: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  Cart: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>,
  User: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Package: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4 7.5 4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.29 7 12 12 20.71 7" /><line x1="12" y1="22" x2="12" y2="12" /></svg>,
  Search: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  ChevronRight: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>,
  Shield: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  Trash: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
  Plus: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  Minus: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  Truck: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
  Globe: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
  Clock: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  Star: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  Factory: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-8l-4-4-4 4v8" /><path d="M12 21v-4l-4-4-4 4v8" /><path d="M21 21H3" /></svg>,
  Trend: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
  Award: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>,
  Alert: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  CreditCard: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
  Smartphone: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>,
  Bank: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M3 10h18" /><path d="M5 6l7-3 7 3" /><path d="M4 10v11" /><path d="M20 10v11" /><path d="M8 14v3" /><path d="M12 14v3" /><path d="M16 14v3" /></svg>,
  Menu: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
  X: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Users: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  Tag: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>,
  Eye: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
  MapPin: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  Phone: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
  Mail: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
  ChevronLeft: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>,
  LogOut: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  EyeOff: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>,
  BarChart: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
};

// helper: icon with fixed size
const Ic = ({ name, size = 20, color, style = {} }) => {
  const C = Icon[name];
  return <C width={size} height={size} style={{ color, flexShrink: 0, ...style }} />;
};

// ─── DATA ───────────────────────────────────────────────────────────────────

// ─── PRODUCT IMAGES ───────────────────────────────────────────────────────────
// Three independent CDN sources per product so at least one always renders.
// Source A: Unsplash (photo IDs verified stable as of 2025)
// Source B: picsum.photos (deterministic seed-based, always online)
// Source C: inline SVG data URI rendered by browser with no network at all

const PRODUCT_IMAGES = {
  // id → [primaryURL, fallbackURL, svgDataURI]
  1: [ // Bed
    "https://images.unsplash.com/photo-1655149555319-54dcacd6fc52?auto=format&fit=crop&w=900&q=80",
    "https://picsum.photos/seed/bed-bamboo/900/600",
    null,
  ],
  2: [ // Desk
    "https://images.unsplash.com/photo-1724093835399-72d8e0eb1f3a?auto=format&fit=crop&w=900&q=80",
    "https://picsum.photos/seed/reclaimed-desk/900/600",
    null,
  ],
  3: [ // Shelf / Storage
    "https://images.unsplash.com/photo-1620225950093-8a84336daf79?auto=format&fit=crop&w=900&q=80",
    "https://picsum.photos/seed/modular-shelf/900/600",
    null,
  ],
  4: [ // Sofa
    "https://images.unsplash.com/photo-1699901524286-41a46a4cd5c8?auto=format&fit=crop&w=900&q=80",
    "https://picsum.photos/seed/zen-sofa/900/600",
    null,
  ],
  5: [ // Dining table
    "https://images.unsplash.com/photo-1629811568222-38d011568222?auto=format&fit=crop&w=900&q=80",
    "https://picsum.photos/seed/fold-table/900/600",
    null,
  ],
  6: [ // Wardrobe
    "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80",
    "https://picsum.photos/seed/ecoward/900/600",
    null,
  ],
  7: [ // Storage bench
    "https://images.unsplash.com/photo-1549419163-b89531144565?auto=format&fit=crop&w=900&q=80",
    "https://picsum.photos/seed/storage-bench/900/600",
    null,
  ],
  8: [ // Chair
    "https://images.unsplash.com/photo-1561769278-25e779530972?auto=format&fit=crop&w=900&q=80",
    "https://picsum.photos/seed/study-chair/900/600",
    null,
  ],
};

// SVG placeholder rendered entirely in-browser — zero network, zero broken image
function makeSVGPlaceholder(label, accent = "#dcfce7") {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='600' viewBox='0 0 900 600'>
    <rect width='900' height='600' fill='${accent}'/>
    <rect x='320' y='180' width='260' height='180' rx='12' fill='%23ffffff' opacity='0.6'/>
    <rect x='360' y='200' width='180' height='12' rx='6' fill='%2316a34a' opacity='0.5'/>
    <rect x='360' y='224' width='120' height='10' rx='5' fill='%2316a34a' opacity='0.3'/>
    <rect x='340' y='260' width='220' height='80' rx='8' fill='%2316a34a' opacity='0.15'/>
    <text x='450' y='310' font-family='sans-serif' font-size='22' font-weight='700' fill='%2316a34a' text-anchor='middle' opacity='0.7'>${encodeURIComponent(label)}</text>
    <circle cx='450' cy='420' r='32' fill='%2316a34a' opacity='0.12'/>
    <text x='450' y='427' font-family='sans-serif' font-size='22' text-anchor='middle' fill='%2316a34a' opacity='0.6'>🌿</text>
  </svg>`;
  return `data:image/svg+xml,${svg}`;
}

const PRODUCTS = [
  {
    id: 1, name: "BambooFlex Foldable Bed", category: "Beds", price: 18999,
    material: "Bamboo", ecoScore: 92, stock: 15, supplierId: 1,
    images: PRODUCT_IMAGES[1],
    desc: "Space-saving foldable bed crafted from certified bamboo. Folds flat in 30 seconds.",
    certifications: ["FSC", "GreenGuard"], carbonFootprint: "Low",
    dimensions: "190×90 cm (folded: 10 cm)", tag: "Bestseller", rating: 4.8, reviews: 214,
    accentColor: "#f9fafb",
  },
  {
    id: 2, name: "RecycloDesk Pro", category: "Desks", price: 8499,
    material: "Reclaimed Wood", ecoScore: 88, stock: 22, supplierId: 1,
    images: PRODUCT_IMAGES[2],
    desc: "Work-from-home desk made from reclaimed teak wood. Adjustable height.",
    certifications: ["FSC", "ISO14001"], carbonFootprint: "Very Low",
    dimensions: "120×60 cm, adjustable 70–110 cm", tag: "WFH Pick", rating: 4.6, reviews: 183,
    accentColor: "#fcfcfd",
  },
  {
    id: 3, name: "ModuShelf Stack Set", category: "Storage", price: 5999,
    material: "Recycled Metal", ecoScore: 85, stock: 30, supplierId: 2,
    images: PRODUCT_IMAGES[3],
    desc: "Stackable modular shelving in recycled steel. Mix & match configurations.",
    certifications: ["ISO14001"], carbonFootprint: "Medium",
    dimensions: "40×30×80 cm per unit", tag: "Modular", rating: 4.4, reviews: 97,
    accentColor: "#f9fafb",
  },
  {
    id: 4, name: "ZenSofa Convertible", category: "Sofas", price: 24999,
    material: "Bamboo + Recycled Fabric", ecoScore: 90, stock: 8, supplierId: 2,
    images: PRODUCT_IMAGES[4],
    desc: "Sofa-to-bed convertible in 3 moves. Upholstered in recycled PET fabric.",
    certifications: ["FSC", "OEKO-TEX"], carbonFootprint: "Low",
    dimensions: "210×85 cm (bed: 210×130 cm)", tag: "Convertible", rating: 4.9, reviews: 311,
    accentColor: "#f8fafc",
  },
  {
    id: 5, name: "FoldDine Table", category: "Tables", price: 7299,
    material: "Bamboo", ecoScore: 94, stock: 18, supplierId: 1,
    images: PRODUCT_IMAGES[5],
    desc: "Wall-mounted fold-down dining table. Seats 4 when open, invisible when closed.",
    certifications: ["FSC", "GreenGuard"], carbonFootprint: "Very Low",
    dimensions: "120×75 cm (fold depth: 8 cm)", tag: "Space Saver", rating: 4.7, reviews: 152,
    accentColor: "#fcfcfd",
  },
  {
    id: 6, name: "EcoWard Modular", category: "Wardrobes", price: 15499,
    material: "Reclaimed Wood", ecoScore: 87, stock: 10, supplierId: 3,
    images: PRODUCT_IMAGES[6],
    desc: "Fully modular wardrobe with reclaimed wood panels. Add units as needed.",
    certifications: ["FSC"], carbonFootprint: "Low",
    dimensions: "100×50×200 cm per section", tag: "Customizable", rating: 4.5, reviews: 88,
    accentColor: "#f9fafb",
  },
  {
    id: 7, name: "SlimTrunk Storage Bench", category: "Storage", price: 4599,
    material: "Bamboo", ecoScore: 91, stock: 25, supplierId: 3,
    images: PRODUCT_IMAGES[7],
    desc: "Dual-function storage bench. Hidden compartment, seats 2 comfortably.",
    certifications: ["FSC", "GreenGuard"], carbonFootprint: "Very Low",
    dimensions: "120×40×45 cm", tag: "Multi-Use", rating: 4.6, reviews: 129,
    accentColor: "#fcfcfd",
  },
  {
    id: 8, name: "NestNook Study Chair", category: "Chairs", price: 6999,
    material: "Recycled Metal + Bamboo", ecoScore: 83, stock: 20, supplierId: 2,
    images: PRODUCT_IMAGES[8],
    desc: "Ergonomic study chair with bamboo back and recycled steel frame.",
    certifications: ["ISO14001", "GreenGuard"], carbonFootprint: "Low",
    dimensions: "45×45×85 cm, lumbar support included", tag: "Ergonomic", rating: 4.3, reviews: 76,
    accentColor: "#f9fafb",
  },
];

// Convenience: every product gets a .image property pointing to its primary URL
PRODUCTS.forEach(p => { p.image = p.images[0]; p.imageFallback = p.images[1]; });

const CATEGORIES = ["All", "Beds", "Desks", "Storage", "Sofas", "Tables", "Wardrobes", "Chairs"];
const MATERIALS = ["All Materials", "Bamboo", "Reclaimed Wood", "Recycled Metal", "Bamboo + Recycled Fabric", "Recycled Metal + Bamboo"];

const formatPrice = (p) => `₹${p.toLocaleString("en-IN")}`;
const ecoColor = (s) => s >= 90 ? T.green : s >= 80 ? "#84cc16" : T.amber;

// ─── SHARED UI ───────────────────────────────────────────────────────────────

function Badge({ children, color = T.green, bg }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: bg || color + "18",
      color,
      fontSize: 11, fontWeight: 700,
      padding: "4px 10px", borderRadius: 100,
      letterSpacing: 0.4,
    }}>{children}</span>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", full, disabled, style: s = {}, icon }) {
  const sizes = { sm: "8px 16px", md: "12px 24px", lg: "16px 36px", xl: "18px 44px" };
  const variants = {
    primary: { background: T.green, color: "#fff", border: "none", boxShadow: `0 6px 20px ${T.green}30` },
    dark: { background: T.navy, color: "#fff", border: "none", boxShadow: `0 6px 20px ${T.navy}20` },
    outline: { background: "transparent", color: T.navy, border: `1.5px solid ${T.borderMid}` },
    ghost: { background: "transparent", color: T.muted, border: "none" },
    danger: { background: T.redLight, color: T.red, border: "none" },
    success: { background: T.greenLight, color: T.green, border: `1.5px solid ${T.green}40` },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: sizes[size],
        borderRadius: 12, fontSize: size === "sm" ? 13 : size === "lg" || size === "xl" ? 16 : 14,
        fontFamily: "'Poppins', sans-serif", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease", width: full ? "100%" : undefined,
        opacity: disabled ? 0.6 : 1,
        ...variants[variant], ...s,
      }}
      onMouseOver={e => { if (!disabled) e.currentTarget.style.filter = "brightness(1.08)"; }}
      onMouseOut={e => { e.currentTarget.style.filter = ""; }}
    >
      {icon && <span style={{ display: "flex" }}>{icon}</span>}
      {children}
    </button>
  );
}

function Card({ children, style = {}, hover = true, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: T.white, borderRadius: 20, border: `1px solid ${T.border}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        transition: "all 0.25s ease", ...style,
      }}
      onMouseOver={e => { if (hover) { e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.09)"; e.currentTarget.style.transform = "translateY(-3px)"; } }}
      onMouseOut={e => { if (hover) { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = ""; } }}
    >{children}</div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      {label && <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: T.navyMid, marginBottom: 8 }}>{label}</label>}
      <input {...props} style={{
        width: "100%", padding: "13px 16px",
        border: `1.5px solid ${T.borderMid}`, borderRadius: 12,
        fontSize: 14, outline: "none", background: T.bg,
        color: T.navy, boxSizing: "border-box", fontFamily: "'Inter', sans-serif",
        transition: "all 0.2s ease", ...props.style,
      }}
        onFocus={e => { e.target.style.borderColor = T.green; e.target.style.background = "#fff"; e.target.style.boxShadow = `0 0 0 3px ${T.green}15`; }}
        onBlur={e => { e.target.style.borderColor = T.borderMid; e.target.style.background = T.bg; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div>
      {label && <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: T.navyMid, marginBottom: 8 }}>{label}</label>}
      <select {...props} style={{
        width: "100%", padding: "13px 16px",
        border: `1.5px solid ${T.borderMid}`, borderRadius: 12,
        fontSize: 14, outline: "none", background: T.bg,
        color: T.navy, boxSizing: "border-box",
        transition: "all 0.2s ease", ...props.style,
      }}>{children}</select>
    </div>
  );
}

function EcoScore({ score }) {
  const c = ecoColor(score);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: `conic-gradient(${c} ${score * 3.6}deg, #f1f5f9 0deg)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 0 2px white, 0 0 0 3px ${c}40`,
      }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: c }}>{score}</div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>ECO SCORE</div>
      </div>
    </div>
  );
}

function Stars({ rating = 4.5, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ic key={i} name="Star" size={12} color={i <= Math.round(rating) ? T.amber : T.borderMid} />
      ))}
      <span style={{ fontSize: 12, color: T.muted, marginLeft: 2 }}>{rating}</span>
      {count && <span style={{ fontSize: 12, color: T.muted }}>({count})</span>}
    </div>
  );
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2800); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: T.navy, color: "white", padding: "14px 22px",
      borderRadius: 16, boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
      display: "flex", alignItems: "center", gap: 12, fontSize: 14, fontWeight: 600,
      animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <span style={{ display: "flex", color: "#22c55e" }}><Ic name="Check" size={18} /></span> {msg}
    </div>
  );
}

// ─── NAVBAR — role-aware ─────────────────────────────────────────────────────

function Navbar({ page, setPage, cart }) {
  const { user, logout } = useAuth();
  const [dropOpen, setDropOpen] = useState(false);
  const cartQty = cart.reduce((s, i) => s + i.qty, 0);
  const role = user?.role || "guest";
  const meta = ROLE_META[role] || {};

  // Per-role nav links
  const NAV_LINKS = {
    customer: [
      { id: "shop", label: "Shop", icon: "Leaf" },
      { id: "cart", label: "Cart", icon: "Cart" },
      { id: "orders", label: "My Orders", icon: "Package" },
    ],
    supplier: [
      { id: "vendor-home", label: "Dashboard", icon: "BarChart" },
      { id: "vendor-products", label: "My Products", icon: "Package" },
      { id: "vendor-add", label: "Add Product", icon: "Plus" },
    ],
    admin: [
      { id: "admin-home", label: "Overview", icon: "BarChart" },
      { id: "admin-users", label: "Users", icon: "Users" },
      { id: "admin-orders", label: "Orders", icon: "Package" },
      { id: "admin-vendors", label: "Vendors", icon: "Factory" },
    ],
    guest: [
      { id: "shop", label: "Shop", icon: "Leaf" },
    ],
  };

  const links = NAV_LINKS[role] || NAV_LINKS.guest;
  const homeId = role === "supplier" ? "vendor-home" : role === "admin" ? "admin-home" : "shop";

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 1000, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>

        {/* Logo */}
        <div onClick={() => setPage(homeId)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, background: T.greenLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic name="Leaf" size={18} color={T.green} />
          </div>
          <span style={{ fontSize: 22, fontWeight: 900, color: T.navy, fontFamily: "'Poppins', sans-serif", letterSpacing: -0.5 }}>EcoNest</span>
          {user && (
            <span style={{ fontSize: 10, fontWeight: 800, background: meta.bg, color: meta.color, padding: "3px 10px", borderRadius: 100, border: `1px solid ${meta.color}25` }}>
              {meta.label}
            </span>
          )}
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "center" }} className="desktop-nav">
          {links.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 10, border: "none",
              background: page === l.id ? (meta.bg || T.greenLight) : "transparent",
              color: page === l.id ? (meta.color || T.green) : T.muted,
              fontSize: 14, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Poppins', sans-serif", transition: "all 0.2s",
            }}>
              <Ic name={l.icon} size={14} />{l.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {/* Cart badge — customers only */}
          {role === "customer" && (
            <button onClick={() => setPage("cart")} style={{
              position: "relative", background: page === "cart" ? T.greenLight : T.bg,
              border: "none", borderRadius: 12, width: 44, height: 44,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: page === "cart" ? T.green : T.muted, transition: "all 0.2s",
            }}>
              <Ic name="Cart" size={20} />
              {cartQty > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4, background: T.red, color: "white", fontSize: 10, fontWeight: 800, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>{cartQty}</span>
              )}
            </button>
          )}

          {/* User avatar / sign-in */}
          {user ? (
            <div style={{ position: "relative" }}>
              <div onClick={() => setDropOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 14px 5px 6px", background: T.bg, borderRadius: 40, border: `1px solid ${T.borderMid}`, cursor: "pointer" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${meta.color || T.green},${meta.color || T.greenDark}bb)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 800 }}>
                  {(user.name?.[0] || "U").toUpperCase()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>{user.name?.split(" ")[0]}</span>
                <Ic name="ChevronRight" size={12} color={T.muted} style={{ transform: dropOpen ? "rotate(-90deg)" : "rotate(90deg)", transition: "transform 0.2s" }} />
              </div>

              {dropOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: T.white, borderRadius: 16, border: `1px solid ${T.border}`, boxShadow: "0 16px 48px rgba(0,0,0,0.12)", minWidth: 210, overflow: "hidden", zIndex: 600 }} onClick={() => setDropOpen(false)}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, background: meta.bg || T.greenLight }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: T.navy }}>{user.name}</p>
                    <p style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{user.email}</p>
                    <div style={{ marginTop: 7 }}><Badge color={meta.color || T.green}>{meta.label || "User"}</Badge></div>
                  </div>
                  <div style={{ padding: 8 }}>
                    <button onClick={() => setPage(homeId)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", background: "none", color: T.navy, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}
                      onMouseOver={e => e.currentTarget.style.background = T.bg} onMouseOut={e => e.currentTarget.style.background = "none"}>
                      <Ic name="BarChart" size={14} color={T.muted} /> My Dashboard
                    </button>
                    <button onClick={() => { logout(); setPage("login"); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", background: "none", color: T.red, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}
                      onMouseOver={e => e.currentTarget.style.background = T.redLight} onMouseOut={e => e.currentTarget.style.background = "none"}>
                      <Ic name="LogOut" size={14} color={T.red} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="outline" size="sm" onClick={() => setPage("login")}>Sign In</Btn>
              <Btn size="sm" onClick={() => setPage("register")}>Register</Btn>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}


// ─── HERO ────────────────────────────────────────────────────────────────────

function HeroSection({ onShop }) {
  return (
    <section style={{
      minHeight: "92vh", display: "flex", alignItems: "center",
      background: "linear-gradient(140deg, #f0fdf4 0%, #dcfce7 50%, #f7fee7 100%)",
      position: "relative", overflow: "hidden", padding: "80px 0",
    }}>
      <div style={{ position: "absolute", top: -100, right: -100, width: 600, height: 600, borderRadius: "50%", background: "rgba(34,197,94,0.07)", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 500, height: 500, borderRadius: "50%", background: "rgba(132,204,22,0.09)", filter: "blur(70px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", width: "100%", position: "relative", zIndex: 1 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 100, padding: "8px 18px", marginBottom: 28 }}>
            <Ic name="Leaf" size={14} color={T.green} />
            <span style={{ fontSize: 12, fontWeight: 800, color: T.green, letterSpacing: 1.5, textTransform: "uppercase" }}>Eco-Certified D2C Furniture</span>
          </div>

          <h1 style={{ fontSize: "clamp(2.4rem,4.5vw,3.8rem)", fontWeight: 800, color: T.navy, lineHeight: 1.08, marginBottom: 24, fontFamily: "'Poppins', sans-serif" }}>
            Compact Living.<br />
            <span style={{ color: T.green }}>Eco-Conscious</span><br />
            Home Design.
          </h1>

          <p style={{ fontSize: 17, color: T.slate, lineHeight: 1.75, marginBottom: 36, maxWidth: 500 }}>
            Space-saving furniture from bamboo, reclaimed wood & recycled materials. Designed for modern urban homes with zero-waste philosophy.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
            <Btn onClick={onShop} size="xl" style={{ borderRadius: 100, boxShadow: `0 12px 30px ${T.green}40` }}>
              <Ic name="Leaf" size={18} />
              Explore Collection
            </Btn>
            <Btn variant="outline" size="xl" style={{ borderRadius: 100 }}>
              Our Philosophy
            </Btn>
          </div>

          <div style={{ display: "flex", gap: 48 }}>
            {[["500+", "Products"], ["12K+", "Happy Customers"], ["99%", "Eco Rated"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 26, fontWeight: 800, color: T.navy, fontFamily: "'Poppins', sans-serif" }}>{n}</div>
                <div style={{ fontSize: 12, color: T.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Product image grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {PRODUCTS.slice(4, 8).map((p, i) => (
            <div key={p.id} style={{
              background: "white", borderRadius: 20,
              boxShadow: "0 16px 40px rgba(0,0,0,0.09)",
              transform: i % 2 === 1 ? "translateY(28px)" : "translateY(0)",
              border: `1px solid ${T.border}`, overflow: "hidden",
              transition: "all 0.3s ease",
            }}
              onMouseOver={e => { e.currentTarget.style.transform = i % 2 === 1 ? "translateY(20px) scale(1.02)" : "translateY(-6px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 24px 48px rgba(0,0,0,0.14)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = i % 2 === 1 ? "translateY(28px)" : "translateY(0)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.09)"; }}
            >
              <ProductImage src={p.image} fallback={p.imageFallback} alt={p.name} height={145} accent={p.accentColor} label={p.category} />
              <div style={{ padding: "12px 14px 14px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.navyMid, marginBottom: 4, lineHeight: 1.3, fontFamily: "'Poppins', sans-serif" }}>{p.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 13, color: T.green, fontWeight: 800, fontFamily: "'Poppins', sans-serif" }}>{formatPrice(p.price)}</div>
                  <div style={{ fontSize: 10, background: T.greenLight, color: T.green, padding: "3px 8px", borderRadius: 100, fontWeight: 700 }}>Eco {p.ecoScore}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SUSTAINABILITY ──────────────────────────────────────────────────────────

function SustainabilitySection() {
  const points = [
    { icon: "Leaf", title: "Carbon Neutral", desc: "Every purchase offsets its entire production footprint through certified reforestation.", color: T.green },
    { icon: "Shield", title: "Lifetime Quality", desc: "Built to last generations using traditional joinery and superior eco-materials.", color: T.blue },
    { icon: "Truck", title: "Circular Delivery", desc: "Zero-plastic packaging and optimized logistics to minimize transport emissions.", color: T.amber },
  ];

  return (
    <section style={{ padding: "100px 32px", background: T.bg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <Badge color={T.green}>Our Promise</Badge>
          <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.8rem)", fontWeight: 800, color: T.navy, margin: "16px 0 16px", fontFamily: "'Poppins', sans-serif" }}>Living in Harmony</h2>
          <p style={{ maxWidth: 520, margin: "0 auto", fontSize: 16, color: T.muted, lineHeight: 1.7 }}>We believe home furniture should be a force for good. Our three pillars ensure a better world.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 28 }}>
          {points.map((p) => (
            <Card key={p.title} style={{ padding: 40 }}>
              <div style={{ width: 56, height: 56, background: p.color + "15", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <Ic name={p.icon} size={24} color={p.color} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: T.navy, marginBottom: 12, fontFamily: "'Poppins', sans-serif" }}>{p.title}</h3>
              <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.7 }}>{p.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PRODUCT IMAGE — 3-source waterfall + guaranteed SVG fallback ─────────────

// Beautiful SVG card rendered entirely in-browser. Zero network. Always shows.
function SVGImageCard({ label, accent = "#dcfce7", height = 240 }) {
  const icons = {
    Beds: "🛏️", Desks: "🖥️", Storage: "📦", Sofas: "🛋️",
    Tables: "🍽️", Wardrobes: "👗", Chairs: "🪑", default: "🌿",
  };
  const emoji = icons[label] || icons.default;
  return (
    <div style={{
      width: "100%", height, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`,
      position: "relative", overflow: "hidden",
    }}>
      {/* decorative circles */}
      <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
      <div style={{ position: "absolute", bottom: -20, left: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(22,163,74,0.1)" }} />
      {/* icon */}
      <div style={{ fontSize: 52, marginBottom: 12, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))" }}>{emoji}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#15803d", fontFamily: "'Poppins',sans-serif", textAlign: "center", padding: "0 16px", lineHeight: 1.3 }}>{label}</div>
      <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
        {["FSC", "Eco"].map(t => (
          <span key={t} style={{ fontSize: 10, fontWeight: 700, background: "rgba(22,163,74,0.15)", color: "#15803d", padding: "3px 8px", borderRadius: 100, border: "1px solid rgba(22,163,74,0.25)" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function ProductImage({ src, fallback, alt, height = 240, borderRadius = 0, accent, label, onClick }) {
  // State machine: 0 = trying src, 1 = trying fallback, 2 = show SVG
  const [stage, setStage] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const currentSrc = stage === 0 ? src : stage === 1 ? fallback : null;

  const handleError = () => {
    if (stage === 0 && fallback) setStage(1);
    else setStage(2); // both URLs failed → show SVG
  };

  if (stage === 2 || !currentSrc) {
    return (
      <div style={{ height, overflow: "hidden", borderRadius, cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
        <SVGImageCard label={label || alt} accent={accent} height={height} />
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height, overflow: "hidden", borderRadius, cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
      {/* shimmer shown while loading */}
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0, borderRadius,
          background: "linear-gradient(90deg,#f0f5f0 25%,#e2ede2 50%,#f0f5f0 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite linear",
        }}>
          {/* hint icon while loading */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.35 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
          </div>
        </div>
      )}
      <img
        key={currentSrc}
        src={currentSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        style={{
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center",
          display: "block", borderRadius,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease, transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      />
    </div>
  );
}

// ─── PRODUCT CARD ────────────────────────────────────────────────────────────

function ProductCard({ product, onAdd, onView }) {
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const accent = product.accentColor || T.greenLight;
  const isLowStock = product.stock <= 5;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: T.white,
        borderRadius: 22,
        overflow: "hidden",
        border: `1px solid ${hovered ? T.green + "40" : T.border}`,
        transition: "all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)",
        display: "flex",
        flexDirection: "column",
        boxShadow: hovered
          ? "0 20px 48px rgba(22,163,74,0.12), 0 8px 16px rgba(0,0,0,0.06)"
          : "0 2px 10px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        position: "relative",
      }}
    >
      {/* ── Image area ── */}
      <div style={{ position: "relative", height: 240, overflow: "hidden", cursor: "pointer" }}
        onClick={() => onView(product)}>

        <ProductImage
          src={product.image}
          fallback={product.imageFallback}
          alt={product.name}
          height={240}
          accent={product.accentColor}
          label={product.category}
        />

        {/* Zoom overlay on hover */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.22) 0%, transparent 55%)",
          transition: "opacity 0.3s",
          opacity: hovered ? 1 : 0,
        }} />

        {/* Quick-view button on hover */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: hovered ? 1 : 0, transition: "opacity 0.25s ease",
          pointerEvents: hovered ? "auto" : "none",
        }}>
          <button
            onClick={(e) => { e.stopPropagation(); onView(product); }}
            style={{
              background: "rgba(255,255,255,0.95)",
              border: "none", borderRadius: 12,
              padding: "10px 20px", fontSize: 13, fontWeight: 700,
              color: T.navy, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              fontFamily: "'Poppins', sans-serif",
              transform: hovered ? "translateY(0)" : "translateY(8px)",
              transition: "transform 0.25s ease",
            }}
          >
            <Ic name="Eye" size={15} color={T.green} /> Quick View
          </button>
        </div>

        {/* Tag badge */}
        {product.tag && (
          <div style={{
            position: "absolute", top: 14, left: 14,
            background: T.green,
            color: "white", fontSize: 10, fontWeight: 800,
            padding: "5px 12px", borderRadius: 100,
            letterSpacing: 0.5, fontFamily: "'Poppins', sans-serif",
            boxShadow: `0 4px 12px ${T.green}50`,
          }}>
            {product.tag}
          </div>
        )}

        {/* Stock indicator */}
        <div style={{
          position: "absolute", top: 14, right: 14,
          background: isLowStock ? "rgba(239,68,68,0.92)" : "rgba(255,255,255,0.92)",
          color: isLowStock ? "white" : T.green,
          fontSize: 10, fontWeight: 800, padding: "5px 11px", borderRadius: 100,
          backdropFilter: "blur(6px)",
          border: isLowStock ? "none" : `1px solid ${T.green}40`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}>
          {isLowStock ? `Only ${product.stock} left` : "In Stock"}
        </div>

        {/* Wishlist heart */}
        <button
          onClick={(e) => { e.stopPropagation(); setWishlisted(w => !w); }}
          style={{
            position: "absolute", bottom: 14, right: 14,
            width: 34, height: 34, borderRadius: "50%",
            background: "rgba(255,255,255,0.92)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(6px)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            opacity: hovered || wishlisted ? 1 : 0,
            transition: "opacity 0.2s, transform 0.2s",
            transform: wishlisted ? "scale(1.15)" : "scale(1)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24"
            fill={wishlisted ? "#ef4444" : "none"}
            stroke={wishlisted ? "#ef4444" : T.muted}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* ── Content area ── */}
      <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Category + material */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6, marginBottom: 8,
        }}>
          <span style={{
            fontSize: 10, color: T.muted, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: 1.2,
          }}>{product.category}</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: T.borderMid, flexShrink: 0 }} />
          <span style={{
            fontSize: 10, color: T.muted, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: 0.8,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{product.material}</span>
        </div>

        {/* Product name */}
        <h3
          onClick={() => onView(product)}
          style={{
            fontSize: 15, fontWeight: 700, color: T.navy,
            lineHeight: 1.38, fontFamily: "'Poppins', sans-serif",
            cursor: "pointer", marginBottom: 7,
            transition: "color 0.2s",
          }}
          onMouseOver={e => e.currentTarget.style.color = T.green}
          onMouseOut={e => e.currentTarget.style.color = T.navy}
        >
          {product.name}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: 12.5, color: T.muted, lineHeight: 1.65,
          marginBottom: 12, flex: 1,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {product.desc}
        </p>

        {/* Stars */}
        <div style={{ marginBottom: 14 }}>
          <Stars rating={product.rating} count={product.reviews} />
        </div>

        {/* Eco score + Price row */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          background: accent,
          borderRadius: 12, padding: "10px 14px",
          marginBottom: 14,
          border: `1px solid ${T.green}18`,
        }}>
          <EcoScore score={product.ecoScore} />
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, color: T.green, fontFamily: "'Poppins', sans-serif", lineHeight: 1 }}>
              {formatPrice(product.price)}
            </div>
            <div style={{ fontSize: 10, color: T.muted, textAlign: "right", marginTop: 2 }}>incl. taxes</div>
          </div>
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onView(product)}
            style={{
              flex: 1, padding: "11px 0",
              background: "transparent",
              border: `1.5px solid ${T.borderMid}`,
              borderRadius: 11, fontSize: 13, fontWeight: 700,
              color: T.navyMid, cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = T.green; e.currentTarget.style.color = T.green; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.color = T.navyMid; }}
          >
            <Ic name="Eye" size={14} /> Details
          </button>

          <button
            onClick={handleAdd}
            style={{
              flex: 2, padding: "11px 0",
              background: added
                ? T.greenLight
                : `linear-gradient(135deg, ${T.green} 0%, ${T.greenDark} 100%)`,
              border: added ? `1.5px solid ${T.green}60` : "none",
              borderRadius: 11, fontSize: 13, fontWeight: 800,
              color: added ? T.green : "white",
              cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
              transition: "all 0.25s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              boxShadow: added ? "none" : `0 4px 16px ${T.green}40`,
              transform: added ? "scale(0.98)" : "scale(1)",
            }}
            onMouseOver={e => { if (!added) { e.currentTarget.style.boxShadow = `0 6px 20px ${T.green}55`; e.currentTarget.style.transform = "scale(1.02)"; } }}
            onMouseOut={e => { if (!added) { e.currentTarget.style.boxShadow = `0 4px 16px ${T.green}40`; e.currentTarget.style.transform = "scale(1)"; } }}
          >
            <Ic name={added ? "Check" : "Cart"} size={14} />
            {added ? "Added to Cart!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT CATALOG ─────────────────────────────────────────────────────────

function ProductCatalog({ onAddToCart }) {
  const [category, setCategory] = useState("All");
  const [material, setMaterial] = useState("All Materials");
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");
  const [minEco, setMinEco] = useState(0);
  const [viewProduct, setViewProduct] = useState(null);

  let filtered = PRODUCTS.filter(p => {
    if (category !== "All" && p.category !== category) return false;
    if (material !== "All Materials" && p.material !== material) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.desc.toLowerCase().includes(search.toLowerCase())) return false;
    if (p.ecoScore < minEco) return false;
    return true;
  });
  if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (sort === "eco-desc") filtered.sort((a, b) => b.ecoScore - a.ecoScore);

  return (
    <section style={{ padding: "80px 32px 100px", background: T.white }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 44, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.greenLight, border: `1px solid ${T.green}25`, borderRadius: 100, padding: "6px 14px", marginBottom: 12 }}>
              <Ic name="Leaf" size={13} color={T.green} />
              <span style={{ fontSize: 11, fontWeight: 800, color: T.green, textTransform: "uppercase", letterSpacing: 1.5 }}>Eco-Certified Collection</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.6rem,2.5vw,2.4rem)", fontWeight: 800, color: T.navy, fontFamily: "'Poppins', sans-serif", marginBottom: 6 }}>Our Collection</h2>
            <p style={{ color: T.muted, fontSize: 15 }}>Eco-verified pieces optimised for modern living</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: T.muted, fontWeight: 600 }}>Showing</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: T.navy }}>{filtered.length}</span>
            <span style={{ fontSize: 13, color: T.muted, fontWeight: 600 }}>products</span>
          </div>
        </div>

        {/* Filters */}
        <div style={{ background: T.bg, borderRadius: 20, padding: "24px 28px", marginBottom: 40, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end", border: `1px solid ${T.border}` }}>
          {/* Search */}
          <div style={{ flex: 2, minWidth: 220, position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><Ic name="Search" size={16} color={T.muted} /></span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              style={{ width: "100%", padding: "12px 14px 12px 42px", border: `1.5px solid ${T.borderMid}`, borderRadius: 12, fontSize: 14, outline: "none", background: T.white, boxSizing: "border-box" }} />
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <Select value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </Select>
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <Select value={material} onChange={e => setMaterial(e.target.value)}>
              {MATERIALS.map(m => <option key={m}>{m}</option>)}
            </Select>
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <Select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low–High</option>
              <option value="price-desc">Price: High–Low</option>
              <option value="eco-desc">Best Eco Score</option>
            </Select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: T.white, padding: "10px 18px", borderRadius: 12, border: `1.5px solid ${T.borderMid}`, minWidth: 220 }}>
            <span style={{ fontSize: 12, color: T.muted, fontWeight: 600, whiteSpace: "nowrap" }}>Eco ≥</span>
            <input type="range" min={0} max={95} step={5} value={minEco} onChange={e => setMinEco(+e.target.value)} style={{ flex: 1, accentColor: T.green }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: T.green, minWidth: 28 }}>{minEco}</span>
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              padding: "8px 18px", borderRadius: 100, border: "none", fontSize: 13, fontWeight: 700,
              background: category === c ? T.green : T.bg,
              color: category === c ? "white" : T.muted,
              cursor: "pointer", transition: "all 0.2s", fontFamily: "'Poppins', sans-serif",
            }}>{c}</button>
          ))}
        </div>

        {/* Product Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
          gap: 32,
        }}>
          {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={onAddToCart} onView={setViewProduct} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "96px 0 64px" }}>
            <div style={{ width: 80, height: 80, background: T.bg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Ic name="Search" size={36} color={T.borderMid} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: T.navy, fontFamily: "'Poppins', sans-serif", marginBottom: 8 }}>No products found</h3>
            <p style={{ fontSize: 14, color: T.muted, marginBottom: 24 }}>Try adjusting your filters or search term.</p>
            <button
              onClick={() => { setSearch(""); setCategory("All"); setMaterial("All Materials"); setMinEco(0); }}
              style={{ padding: "10px 24px", background: T.green, color: "white", border: "none", borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {viewProduct && <ProductModal product={viewProduct} onClose={() => setViewProduct(null)} onAdd={onAddToCart} />}
    </section>
  );
}

// ─── PRODUCT MODAL ───────────────────────────────────────────────────────────

function ProductModal({ product, onClose, onAdd }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1200);
  };

  const accent = product.accentColor || T.greenLight;

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.72)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        style={{ background: T.white, borderRadius: 28, maxWidth: 840, width: "100%", overflow: "hidden", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 48px 96px rgba(0,0,0,0.28)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <div style={{ position: "relative", height: 380 }}>
          <ProductImage
            src={product.image}
            fallback={product.imageFallback}
            alt={product.name}
            height={380}
            accent={product.accentColor}
            label={product.name}
          />
          {/* Gradient overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />

          {/* Price on image */}
          <div style={{
            position: "absolute", bottom: 24, left: 28,
            background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
            borderRadius: 14, padding: "10px 18px",
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.green, fontFamily: "'Poppins', sans-serif", lineHeight: 1 }}>{formatPrice(product.price)}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>incl. all taxes</div>
          </div>

          {/* Tag */}
          {product.tag && (
            <div style={{ position: "absolute", top: 20, left: 20, background: T.green, color: "white", fontSize: 11, fontWeight: 800, padding: "6px 14px", borderRadius: 100, fontFamily: "'Poppins', sans-serif", boxShadow: `0 4px 12px ${T.green}50` }}>
              {product.tag}
            </div>
          )}

          {/* Close */}
          <button onClick={onClose} style={{
            position: "absolute", top: 20, right: 20,
            background: "rgba(255,255,255,0.92)", border: "none", borderRadius: "50%",
            width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", backdropFilter: "blur(6px)", boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}>
            <Ic name="X" size={18} color={T.navy} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "32px 36px 36px" }}>
          {/* Name + category */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>
              {product.category} · {product.material}
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: T.navy, fontFamily: "'Poppins', sans-serif", lineHeight: 1.2, marginBottom: 10 }}>{product.name}</h2>
            <Stars rating={product.rating} count={product.reviews} />
          </div>

          <p style={{ fontSize: 15, color: T.slate, lineHeight: 1.8, marginBottom: 28 }}>{product.desc}</p>

          {/* Spec grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(172px,1fr))", gap: 12, marginBottom: 28 }}>
            {[
              ["Dimensions", product.dimensions],
              ["Carbon Footprint", product.carbonFootprint],
              ["In Stock", `${product.stock} units`],
              ["Certifications", product.certifications.join(", ")],
            ].map(([k, v]) => (
              <div key={k} style={{ background: accent, borderRadius: 14, padding: "14px 16px", border: `1px solid ${T.green}18` }}>
                <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.navyMid, lineHeight: 1.3 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <EcoScore score={product.ecoScore} />
            <button
              onClick={handleAdd}
              style={{
                flex: 1, padding: "15px 0",
                background: added ? T.greenLight : `linear-gradient(135deg, ${T.green}, ${T.greenDark})`,
                border: added ? `1.5px solid ${T.green}50` : "none",
                borderRadius: 14, fontSize: 15, fontWeight: 800,
                color: added ? T.green : "white",
                cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: added ? "none" : `0 8px 24px ${T.green}40`,
                transition: "all 0.25s ease",
              }}
            >
              <Ic name={added ? "Check" : "Cart"} size={18} />
              {added ? "Added to Cart!" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CART PAGE ───────────────────────────────────────────────────────────────

function CartPage({ cart, onUpdate, onRemove, user, onCheckout, setPage }) {
  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "120px 20px" }}>
        <div style={{ width: 88, height: 88, background: T.bg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Ic name="Cart" size={36} color={T.muted} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: T.navy, marginBottom: 12, fontFamily: "'Poppins', sans-serif" }}>Your cart is empty</h2>
        <p style={{ color: T.muted, marginBottom: 28, fontSize: 16 }}>Looks like you haven't started your sustainable journey yet.</p>
        <Btn onClick={() => setPage("shop")} size="lg" style={{ borderRadius: 100 }}><Ic name="Leaf" size={16} /> Start Shopping</Btn>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 32px" }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: T.navy, marginBottom: 36, fontFamily: "'Poppins', sans-serif" }}>Shopping Cart</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 48, alignItems: "start" }}>
        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {cart.map(item => (
            <Card key={item.product.id} hover={false} style={{ padding: 20, display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{ width: 110, flexShrink: 0 }}>
                <ProductImage
                  src={item.product.image}
                  fallback={item.product.imageFallback}
                  alt={item.product.name}
                  height={110}
                  borderRadius={14}
                  accent={item.product.accentColor}
                  label={item.product.category}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: T.navy, fontFamily: "'Poppins', sans-serif" }}>{item.product.name}</h3>
                    <p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{item.product.material}</p>
                  </div>
                  <button onClick={() => onRemove(item.product.id)} style={{ background: "none", border: "none", color: T.red, cursor: "pointer", padding: 6, borderRadius: 8, display: "flex" }}
                    onMouseOver={e => e.currentTarget.style.background = T.redLight}
                    onMouseOut={e => e.currentTarget.style.background = "none"}>
                    <Ic name="Trash" size={16} />
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", background: T.bg, borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}` }}>
                    <button onClick={() => onUpdate(item.product.id, item.qty - 1)} style={{ padding: "8px 14px", background: "none", border: "none", cursor: "pointer", color: T.navy, display: "flex" }}>
                      <Ic name="Minus" size={14} />
                    </button>
                    <span style={{ padding: "0 14px", fontWeight: 800, fontSize: 15, color: T.navy }}>{item.qty}</span>
                    <button onClick={() => onUpdate(item.product.id, item.qty + 1)} style={{ padding: "8px 14px", background: "none", border: "none", cursor: "pointer", color: T.navy, display: "flex" }}>
                      <Ic name="Plus" size={14} />
                    </button>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: T.navy }}>{formatPrice(item.product.price * item.qty)}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div style={{ background: T.white, borderRadius: 20, padding: 28, border: `1px solid ${T.border}`, position: "sticky", top: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: T.navy, marginBottom: 24, fontFamily: "'Poppins', sans-serif" }}>Order Summary</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
            {cart.map(i => (
              <div key={i.product.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: T.muted }}>{i.product.name} × {i.qty}</span>
                <span style={{ fontWeight: 700, color: T.navy }}>{formatPrice(i.product.price * i.qty)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <span style={{ color: T.muted }}>Shipping</span>
              <span style={{ fontWeight: 700, color: T.green }}>FREE</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 0" }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: T.navy }}>Total</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: T.green }}>{formatPrice(total)}</span>
          </div>
          <div style={{ background: T.greenLight, borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
            <Ic name="Leaf" size={16} color={T.green} />
            <span style={{ fontSize: 12, color: T.green, fontWeight: 600 }}>Your order offsets {Math.round(total / 1000)} kg CO₂</span>
          </div>
          <Btn full size="lg" onClick={onCheckout} variant="dark" style={{ borderRadius: 14, marginBottom: 12 }}>
            Proceed to Checkout <Ic name="ChevronRight" size={16} />
          </Btn>
          <Btn full variant="ghost" onClick={() => setPage("shop")} style={{ color: T.muted }}>
            Continue Shopping
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── CHECKOUT ────────────────────────────────────────────────────────────────

function CheckoutPage({ cart, user, onPlaceOrder }) {
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: "", address: "", city: "", pincode: "", state: "" });
  const [payMethod, setPayMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);

  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const handlePlaceOrder = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onPlaceOrder({ form, payMethod, total, items: cart });
    }, 2000);
  };

  const steps = ["Shipping", "Payment", "Review"];

  const payMethods = [
    { id: "upi", label: "UPI", icon: "Smartphone" },
    { id: "card", label: "Card", icon: "CreditCard" },
    { id: "netbanking", label: "Net Banking", icon: "Bank" },
    { id: "cod", label: "Cash on Delivery", icon: "Truck" },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 32px" }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: T.navy, marginBottom: 40, fontFamily: "'Poppins', sans-serif" }}>Checkout</h2>

      {/* Step Indicator */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 48, maxWidth: 480 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: step > i + 1 ? T.green : step === i + 1 ? T.navy : T.bg,
                color: step >= i + 1 ? "white" : T.muted,
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15,
                border: step === i + 1 ? "none" : `2px solid ${T.borderMid}`,
              }}>
                {step > i + 1 ? <Ic name="Check" size={18} /> : i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: step === i + 1 ? T.navy : T.muted, whiteSpace: "nowrap" }}>{s}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? T.green : T.borderMid, margin: "0 8px", marginTop: -20 }} />}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 48, alignItems: "start" }}>
        <div>
          {/* Step 1: Shipping */}
          {step === 1 && (
            <Card hover={false} style={{ padding: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: T.navy, marginBottom: 24, fontFamily: "'Poppins', sans-serif" }}>Delivery Address</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ gridColumn: "1/-1" }}>
                  <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
                </div>
                <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
                <Input label="Phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
                <div style={{ gridColumn: "1/-1" }}>
                  <Input label="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Street address, apartment..." />
                </div>
                <Input label="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Mumbai" />
                <Input label="Pincode" value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} placeholder="400001" />
                <div style={{ gridColumn: "1/-1" }}>
                  <Select label="State" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}>
                    <option value="">Select state</option>
                    {["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Rajasthan", "West Bengal", "Uttar Pradesh"].map(s => <option key={s}>{s}</option>)}
                  </Select>
                </div>
              </div>
              <Btn full size="lg" style={{ marginTop: 28, borderRadius: 14 }} onClick={() => setStep(2)}>
                Continue to Payment <Ic name="ChevronRight" size={16} />
              </Btn>
            </Card>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <Card hover={false} style={{ padding: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: T.navy, marginBottom: 24, fontFamily: "'Poppins', sans-serif" }}>Payment Method</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                {payMethods.map(m => (
                  <div key={m.id} onClick={() => setPayMethod(m.id)} style={{
                    display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 14, cursor: "pointer",
                    border: `2px solid ${payMethod === m.id ? T.green : T.borderMid}`,
                    background: payMethod === m.id ? T.greenLight : T.white,
                    transition: "all 0.2s",
                  }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: payMethod === m.id ? T.green + "20" : T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Ic name={m.icon} size={18} color={payMethod === m.id ? T.green : T.muted} />
                    </div>
                    <span style={{ fontWeight: 700, color: payMethod === m.id ? T.green : T.navy, fontSize: 15 }}>{m.label}</span>
                    <div style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", border: `2px solid ${payMethod === m.id ? T.green : T.borderMid}`, background: payMethod === m.id ? T.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {payMethod === m.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
                    </div>
                  </div>
                ))}
              </div>
              {payMethod === "upi" && (
                <Input label="UPI ID" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" style={{ marginBottom: 16 }} />
              )}
              <div style={{ display: "flex", gap: 12 }}>
                <Btn variant="outline" onClick={() => setStep(1)} style={{ flex: 1, borderRadius: 14 }}>
                  <Ic name="ChevronLeft" size={16} /> Back
                </Btn>
                <Btn onClick={() => setStep(3)} style={{ flex: 2, borderRadius: 14 }} size="lg">
                  Review Order <Ic name="ChevronRight" size={16} />
                </Btn>
              </div>
            </Card>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <Card hover={false} style={{ padding: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: T.navy, marginBottom: 24, fontFamily: "'Poppins', sans-serif" }}>Review & Place Order</h3>
              <div style={{ background: T.bg, borderRadius: 14, padding: 20, marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Delivery To</p>
                <p style={{ fontWeight: 700, color: T.navy, fontSize: 15 }}>{form.name}</p>
                <p style={{ color: T.muted, fontSize: 14, marginTop: 4 }}>{form.address}, {form.city}, {form.state} - {form.pincode}</p>
                <p style={{ color: T.muted, fontSize: 14, marginTop: 2 }}>{form.phone} · {form.email}</p>
              </div>
              <div style={{ background: T.bg, borderRadius: 14, padding: 20, marginBottom: 24 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Payment</p>
                <p style={{ fontWeight: 700, color: T.navy }}>{payMethods.find(m => m.id === payMethod)?.label}</p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <Btn variant="outline" onClick={() => setStep(2)} style={{ flex: 1, borderRadius: 14 }}>
                  <Ic name="ChevronLeft" size={16} /> Back
                </Btn>
                <Btn onClick={handlePlaceOrder} disabled={processing} style={{ flex: 2, borderRadius: 14 }} size="lg">
                  {processing ? "Processing..." : `Place Order · ${formatPrice(total)}`}
                </Btn>
              </div>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <Card hover={false} style={{ padding: 28, position: "sticky", top: 100 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: T.navy, marginBottom: 20, fontFamily: "'Poppins', sans-serif" }}>Order Items</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
            {cart.map(i => (
              <div key={i.product.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <img src={i.product.image} alt="" style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
                  onError={e => { e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200"; }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: T.navy, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{i.product.name}</p>
                  <p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Qty: {i.qty}</p>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: T.navy, flexShrink: 0 }}>{formatPrice(i.product.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
              <span style={{ color: T.muted }}>Subtotal</span>
              <span style={{ fontWeight: 700 }}>{formatPrice(total)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 16 }}>
              <span style={{ color: T.muted }}>Shipping</span>
              <span style={{ fontWeight: 700, color: T.green }}>FREE</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 }}>
              <span style={{ fontWeight: 800, color: T.navy }}>Total</span>
              <span style={{ fontWeight: 800, color: T.green }}>{formatPrice(total)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── ORDER SUCCESS ────────────────────────────────────────────────────────────

function OrderSuccess({ order, onContinue, setPage }) {
  return (
    <div style={{ maxWidth: 600, margin: "80px auto", padding: "0 32px", textAlign: "center" }}>
      <div style={{ width: 96, height: 96, background: T.greenLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", border: `3px solid ${T.green}30` }}>
        <Ic name="Check" size={44} color={T.green} />
      </div>
      <Badge color={T.green}>Order Confirmed</Badge>
      <h1 style={{ fontSize: 30, fontWeight: 800, color: T.navy, margin: "16px 0 12px", fontFamily: "'Poppins', sans-serif" }}>Order Placed!</h1>
      <p style={{ fontSize: 16, color: T.muted, marginBottom: 32, lineHeight: 1.7 }}>Your sustainable furniture is on its way. We'll send you updates as your order progresses.</p>

      {order && (
        <Card hover={false} style={{ padding: 24, marginBottom: 32, textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 12, color: T.muted, fontWeight: 600, textTransform: "uppercase" }}>Order ID</p>
              <p style={{ fontWeight: 800, color: T.green, fontSize: 18, fontFamily: "monospace" }}>{order.orderId}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 12, color: T.muted, fontWeight: 600, textTransform: "uppercase" }}>Total</p>
              <p style={{ fontWeight: 800, color: T.navy, fontSize: 18 }}>{formatPrice(order.total)}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {order.items?.map(({ product, qty }) => (
              <div key={product.id} style={{ background: T.bg, padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, color: T.navy }}>
                {product.name} ×{qty}
              </div>
            ))}
          </div>
        </Card>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Btn variant="outline" size="lg" onClick={() => setPage("orders")} style={{ borderRadius: 100 }}>
          <Ic name="Package" size={16} /> Track Order
        </Btn>
        <Btn size="lg" onClick={onContinue} style={{ borderRadius: 100 }}>
          <Ic name="Leaf" size={16} /> Continue Shopping
        </Btn>
      </div>
    </div>
  );
}

// ─── ORDER TRACKER ───────────────────────────────────────────────────────────

const ORDER_STAGES = ["Ordered", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

function OrderTracker({ orders }) {
  if (orders.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "120px 20px" }}>
        <div style={{ width: 88, height: 88, background: T.bg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Ic name="Package" size={36} color={T.muted} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: T.navy, marginBottom: 12, fontFamily: "'Poppins', sans-serif" }}>No orders yet</h2>
        <p style={{ color: T.muted }}>Your order history will appear here.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px" }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: T.navy, marginBottom: 36, fontFamily: "'Poppins', sans-serif" }}>My Orders</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {orders.map((order, idx) => {
          const stage = Math.min(2, Math.floor((Date.now() - order.timestamp) / 5000));
          return (
            <Card key={order.orderId} hover={false} style={{ overflow: "hidden" }}>
              {/* Order Header */}
              <div style={{ padding: "20px 28px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <p style={{ fontSize: 12, color: T.muted, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Order ID</p>
                  <p style={{ fontWeight: 800, color: T.green, fontFamily: "monospace", fontSize: 16 }}>{order.orderId}</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 12, color: T.muted, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Status</p>
                  <Badge color={T.green}>{ORDER_STAGES[stage]}</Badge>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 12, color: T.muted, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Total</p>
                  <p style={{ fontWeight: 800, color: T.navy, fontSize: 18 }}>{formatPrice(order.total)}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ padding: "28px 28px 20px" }}>
                <div style={{ position: "relative", marginBottom: 32 }}>
                  {/* Line */}
                  <div style={{ position: "absolute", top: 18, left: "4%", right: "4%", height: 3, background: T.borderMid, borderRadius: 100 }} />
                  <div style={{ position: "absolute", top: 18, left: "4%", height: 3, background: T.green, borderRadius: 100, width: `${Math.max(0, (stage / (ORDER_STAGES.length - 1)) * 92)}%`, transition: "width 0.6s ease" }} />

                  <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                    {ORDER_STAGES.map((s, i) => (
                      <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flex: 1 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%", zIndex: 1, position: "relative",
                          background: i <= stage ? T.green : T.white,
                          border: `3px solid ${i <= stage ? T.green : T.borderMid}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.4s",
                          boxShadow: i === stage ? `0 0 0 4px ${T.green}20` : "none",
                        }}>
                          {i < stage
                            ? <Ic name="Check" size={16} color="white" />
                            : <span style={{ fontSize: 11, fontWeight: 800, color: i <= stage ? "white" : T.muted }}>{i + 1}</span>
                          }
                        </div>
                        <span style={{ fontSize: 11, fontWeight: i <= stage ? 700 : 600, color: i <= stage ? T.green : T.muted, textAlign: "center", lineHeight: 1.3 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items */}
                <div style={{ background: T.bg, borderRadius: 14, padding: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", marginBottom: 12 }}>Shipment Contents</p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {order.items?.map(({ product, qty }) => (
                      <div key={product.id} style={{ background: T.white, padding: "8px 14px", borderRadius: 10, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                        <img src={product.image} alt="" style={{ width: 24, height: 24, borderRadius: 4, objectFit: "cover" }}
                          onError={e => { e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=100"; }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: T.navy }}>{product.name} ×{qty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// DEMO ACCOUNTS
// ════════════════════════════════════════════════════════════════════════════

const DEMO_ACCOUNTS = [
  { email: "user@econest.com", password: "eco123", name: "Eco User", role: "customer" },
  { email: "vendor@econest.com", password: "vendor123", name: "GreenWood Eco", role: "supplier" },
  { email: "admin@econest.com", password: "admin123", name: "Admin EcoNest", role: "admin" },
];

// ════════════════════════════════════════════════════════════════════════════
// PROTECTED PAGE WRAPPER
// ════════════════════════════════════════════════════════════════════════════

function ProtectedPage({ allowedRole, setPage, children }) {
  const { user } = useAuth();
  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <div style={{ width: 72, height: 72, background: T.redLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Ic name="Shield" size={32} color={T.red} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: T.navy, fontFamily: "'Poppins',sans-serif", marginBottom: 12 }}>Sign in required</h2>
        <p style={{ color: T.muted, marginBottom: 24 }}>Please sign in to access this page.</p>
        <Btn onClick={() => setPage("login")} size="lg" style={{ borderRadius: 100 }}>Go to Sign In</Btn>
      </div>
    );
  }
  if (allowedRole && user.role !== allowedRole) {
    const meta = ROLE_META[user.role] || {};
    const home = user.role === "supplier" ? "vendor-home" : user.role === "admin" ? "admin-home" : "shop";
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <div style={{ width: 72, height: 72, background: T.redLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Ic name="Shield" size={32} color={T.red} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: T.navy, fontFamily: "'Poppins',sans-serif", marginBottom: 12 }}>Access Restricted</h2>
        <p style={{ color: T.muted, marginBottom: 24, lineHeight: 1.7 }}>
          This page is not available for <strong>{meta.label}</strong> accounts.
        </p>
        <Btn onClick={() => setPage(home)} size="lg" style={{ borderRadius: 100 }}>Go to my Dashboard</Btn>
      </div>
    );
  }
  return children;
}

// ════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ════════════════════════════════════════════════════════════════════════════

function LoginPage({ setPage }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", role: "customer" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ROLE_OPTS = [
    { value: "customer", label: "User", icon: "User", desc: "Browse & buy eco furniture" },
    { value: "supplier", label: "Vendor", icon: "Factory", desc: "List & sell products" },
    { value: "admin", label: "Admin", icon: "Shield", desc: "Manage the platform" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Please fill all fields."); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const role = user?.role || form.role || 'customer';
      if (role === "supplier") setPage("vendor-home");
      else if (role === "admin") setPage("admin-home");
      else setPage("shop");
    } catch (err) {
      if (err.message) {
        setError(err.message);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* ── Left branding panel ── */}
      <div style={{ flex: 1, background: "linear-gradient(145deg,#f0fdf4,#dcfce7,#f7fee7)", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(34,197,94,0.08)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 400, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 44 }}>
            <div style={{ width: 44, height: 44, background: "white", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(22,163,74,0.2)" }}>
              <Ic name="Leaf" size={24} color={T.green} />
            </div>
            <span style={{ fontSize: 26, fontWeight: 900, color: T.navy, fontFamily: "'Poppins',sans-serif" }}>EcoNest</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, color: T.navy, lineHeight: 1.15, marginBottom: 14, fontFamily: "'Poppins',sans-serif" }}>
            Welcome back to<br /><span style={{ color: T.green }}>sustainable living.</span>
          </h1>
          <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.75, marginBottom: 36 }}>Sign in with your role to access your personalised dashboard.</p>
          {ROLE_OPTS.map(r => {
            const m = ROLE_META[r.value] || {};
            return (
              <div key={r.value} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, padding: "12px 16px", borderRadius: 13, background: "rgba(255,255,255,0.65)", border: `1px solid ${m.color}22` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Ic name={r.icon} size={18} color={m.color} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>{r.label}</p>
                  <p style={{ fontSize: 11, color: T.muted }}>{r.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ width: 480, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 52px", background: T.white, overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: T.navy, marginBottom: 6, fontFamily: "'Poppins',sans-serif" }}>Sign In</h2>
          <p style={{ fontSize: 14, color: T.muted, marginBottom: 28 }}>
            No account?{" "}
            <button onClick={() => setPage("register")} style={{ background: "none", border: "none", color: T.green, fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>Register here</button>
          </p>

          {error && (
            <div style={{ background: T.redLight, color: T.red, borderRadius: 12, padding: "12px 15px", fontSize: 13, marginBottom: 20, display: "flex", gap: 8, alignItems: "flex-start", border: `1px solid ${T.red}25` }}>
              <Ic name="Alert" size={15} color={T.red} style={{ marginTop: 1, flexShrink: 0 }} />{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role selector */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: T.navyMid, marginBottom: 10, fontFamily: "'Poppins',sans-serif" }}>
                Select Your Role <span style={{ color: T.red }}>*</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {ROLE_OPTS.map(r => {
                  const m = ROLE_META[r.value] || {};
                  const active = form.role === r.value;
                  return (
                    <button key={r.value} type="button" onClick={() => setForm(f => ({ ...f, role: r.value }))} style={{
                      padding: "12px 8px", borderRadius: 12, cursor: "pointer", transition: "all 0.18s",
                      border: `2px solid ${active ? m.color : T.borderMid}`,
                      background: active ? m.bg : T.bg,
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    }}>
                      <Ic name={r.icon} size={20} color={active ? m.color : T.muted} />
                      <span style={{ fontSize: 12, fontWeight: 800, color: active ? m.color : T.muted, fontFamily: "'Poppins',sans-serif" }}>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: T.navyMid, marginBottom: 8 }}>Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com"
                style={{ width: "100%", padding: "13px 15px", border: `1.5px solid ${T.borderMid}`, borderRadius: 12, fontSize: 14, outline: "none", background: T.bg, boxSizing: "border-box", fontFamily: "'Inter',sans-serif" }}
                onFocus={e => { e.target.style.borderColor = T.green; e.target.style.background = T.white; }}
                onBlur={e => { e.target.style.borderColor = T.borderMid; e.target.style.background = T.bg; }} />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: T.navyMid, marginBottom: 8 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••"
                  style={{ width: "100%", padding: "13px 44px 13px 15px", border: `1.5px solid ${T.borderMid}`, borderRadius: 12, fontSize: 14, outline: "none", background: T.bg, boxSizing: "border-box", fontFamily: "'Inter',sans-serif" }}
                  onFocus={e => { e.target.style.borderColor = T.green; e.target.style.background = T.white; }}
                  onBlur={e => { e.target.style.borderColor = T.borderMid; e.target.style.background = T.bg; }} />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", color: T.muted }}>
                  <Ic name={showPw ? "EyeOff" : "Eye"} size={17} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "15px", borderRadius: 13, border: "none",
              background: loading ? T.muted : `linear-gradient(135deg,${T.green},${T.greenDark})`,
              color: "white", fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Poppins',sans-serif", boxShadow: loading ? "none" : `0 8px 24px ${T.green}35`, transition: "all 0.2s",
            }}>{loading ? "Signing in…" : "Sign In"}</button>
          </form>

          <div style={{ marginTop: 20, background: T.greenLight, borderRadius: 11, padding: "13px 15px", fontSize: 12, color: T.green, border: `1px solid ${T.green}25`, lineHeight: 1.85 }}>
            <strong style={{ display: "block", marginBottom: 3 }}>Demo Accounts:</strong>
            User: user@econest.com / eco123<br />
            Vendor: vendor@econest.com / vendor123<br />
            Admin: admin@econest.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// REGISTER PAGE
// ════════════════════════════════════════════════════════════════════════════

const RegisterField = ({ label, fkey, type = "text", placeholder, toggle, form, setForm, errors, showPw, setShowPw }) => (
  <div>
    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: T.navyMid, marginBottom: 8, fontFamily: "'Poppins',sans-serif" }}>{label}<span style={{ color: T.red }}> *</span></label>
    <div style={{ position: "relative" }}>
      <input type={toggle ? (showPw ? "text" : "password") : type} value={form[fkey]} onChange={e => setForm(f => ({ ...f, [fkey]: e.target.value }))} placeholder={placeholder}
        style={{ width: "100%", padding: `13px ${toggle ? 44 : 15}px 13px 15px`, border: `1.5px solid ${errors[fkey] ? T.red : T.borderMid}`, borderRadius: 12, fontSize: 14, outline: "none", background: errors[fkey] ? T.redLight : T.bg, boxSizing: "border-box", fontFamily: "'Inter',sans-serif" }}
        onFocus={e => { if (!errors[fkey]) { e.target.style.borderColor = T.green; e.target.style.background = T.white; } }}
        onBlur={e => { if (!errors[fkey]) { e.target.style.borderColor = T.borderMid; e.target.style.background = T.bg; } }} />
      {toggle && <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", color: T.muted }}><Ic name={showPw ? "EyeOff" : "Eye"} size={17} /></button>}
    </div>
    {errors[fkey] && <p style={{ fontSize: 11, color: T.red, marginTop: 4 }}>{errors[fkey]}</p>}
  </div>
);

function RegisterPage({ setPage }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "customer" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const ROLE_OPTS = [
    { value: "customer", label: "User", icon: "User", desc: "I want to buy eco furniture" },
    { value: "supplier", label: "Vendor", icon: "Factory", desc: "I want to sell products" },
    { value: "admin", label: "Admin", icon: "Shield", desc: "Platform administrator" },
  ];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(); setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      const user = await register(form.email, form.password, form.name, form.role);
      const role = user?.role || form.role || 'customer';
      if (role === "supplier") setPage("vendor-home");
      else if (role === "admin") setPage("admin-home");
      else setPage("shop");
    } catch (err) {
      if (err.message) {
        setErrors({ email: err.message });
      } else {
        setErrors({ email: 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left panel */}
      <div style={{ flex: 1, background: "linear-gradient(145deg,#f0fdf4,#dcfce7)", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(34,197,94,0.09)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 400, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
            <div style={{ width: 44, height: 44, background: "white", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(22,163,74,0.2)" }}>
              <Ic name="Leaf" size={24} color={T.green} />
            </div>
            <span style={{ fontSize: 26, fontWeight: 900, color: T.navy, fontFamily: "'Poppins',sans-serif" }}>EcoNest</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, color: T.navy, lineHeight: 1.15, marginBottom: 14, fontFamily: "'Poppins',sans-serif" }}>
            Join the future of<br /><span style={{ color: T.green }}>sustainable homes.</span>
          </h1>
          <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.75, marginBottom: 30 }}>Create your free account and choose your role to get started.</p>
          {[["Free delivery", "On all orders above ₹999"], ["Eco guarantee", "FSC & ISO certified products"], ["Easy returns", "30-day hassle-free returns"]].map(([t, d]) => (
            <div key={t} style={{ display: "flex", gap: 12, marginBottom: 13, padding: "11px 15px", borderRadius: 12, background: "rgba(255,255,255,0.65)" }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: `${T.green}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ic name="Check" size={13} color={T.green} /></div>
              <div><p style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>{t}</p><p style={{ fontSize: 11, color: T.muted }}>{d}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 520, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 52px", background: T.white, overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: T.navy, marginBottom: 6, fontFamily: "'Poppins',sans-serif" }}>Create Account</h2>
          <p style={{ fontSize: 14, color: T.muted, marginBottom: 28 }}>
            Already a member?{" "}
            <button onClick={() => setPage("login")} style={{ background: "none", border: "none", color: T.green, fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>Sign in</button>
          </p>

          <form onSubmit={handleSubmit}>
            {/* Role selector */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: T.navyMid, marginBottom: 10, fontFamily: "'Poppins',sans-serif" }}>I am a… <span style={{ color: T.red }}>*</span></label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ROLE_OPTS.map(r => {
                  const m = ROLE_META[r.value] || {};
                  const active = form.role === r.value;
                  return (
                    <button key={r.value} type="button" onClick={() => setForm(f => ({ ...f, role: r.value }))} style={{
                      padding: "12px 15px", borderRadius: 12, cursor: "pointer", transition: "all 0.18s", textAlign: "left",
                      border: `2px solid ${active ? m.color : T.borderMid}`,
                      background: active ? m.bg : T.bg,
                      display: "flex", alignItems: "center", gap: 12,
                    }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: active ? `${m.color}20` : T.border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Ic name={r.icon} size={17} color={active ? m.color : T.muted} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 800, color: active ? m.color : T.navy, fontFamily: "'Poppins',sans-serif" }}>{r.label}</p>
                        <p style={{ fontSize: 11, color: T.muted }}>{r.desc}</p>
                      </div>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${active ? m.color : T.borderMid}`, background: active ? m.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {active && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "white" }} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <RegisterField label="Full Name" fkey="name" type="text" placeholder="Jane Doe" form={form} setForm={setForm} errors={errors} />
              <RegisterField label="Email Address" fkey="email" type="email" placeholder="you@example.com" form={form} setForm={setForm} errors={errors} />
              <RegisterField label="Password" fkey="password" type="password" placeholder="Min. 6 characters" toggle form={form} setForm={setForm} errors={errors} showPw={showPw} setShowPw={setShowPw} />
              <RegisterField label="Confirm Password" fkey="confirmPassword" type="password" placeholder="Re-enter password" toggle form={form} setForm={setForm} errors={errors} showPw={showPw} setShowPw={setShowPw} />
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "15px", borderRadius: 13, border: "none", marginTop: 22,
              background: loading ? T.muted : `linear-gradient(135deg,${T.green},${T.greenDark})`,
              color: "white", fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Poppins',sans-serif", boxShadow: loading ? "none" : `0 8px 24px ${T.green}35`, transition: "all 0.2s",
            }}>{loading ? "Creating account…" : "Create My Account"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// USER — UserDashboard
// ════════════════════════════════════════════════════════════════════════════

function UserDashboard({ setPage, orders, cart }) {
  const { user } = useAuth();
  const stats = [
    { icon: "Package", label: "Orders Placed", val: orders.length, color: T.green, page: "orders" },
    { icon: "Cart", label: "Items in Cart", val: cart.length, color: T.amber, page: "cart" },
    { icon: "Leaf", label: "CO₂ Offset kg", val: orders.reduce((s, o) => s + Math.round((o.total || 0) / 1000), 0), color: "#84cc16", page: null },
    { icon: "Award", label: "Eco Points", val: 150 + orders.length * 25, color: T.blue, page: null },
  ];
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg,${T.green},${T.greenDark})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 22, fontWeight: 800 }}>
          {(user?.name?.[0] || "U").toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: T.navy, fontFamily: "'Poppins',sans-serif" }}>Welcome, {user?.name?.split(" ")[0]}!</h2>
          <p style={{ color: T.muted, fontSize: 14 }}>Your EcoNest dashboard</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginBottom: 32 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ padding: 24, cursor: s.page ? "pointer" : "default" }} onClick={s.page ? () => setPage(s.page) : undefined}>
            <div style={{ width: 44, height: 44, background: s.color + "18", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}><Ic name={s.icon} size={22} color={s.color} /></div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.navy, fontFamily: "'Poppins',sans-serif" }}>{s.val}</div>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card hover={false} style={{ padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: T.navy, marginBottom: 16, fontFamily: "'Poppins',sans-serif" }}>Quick Actions</h3>
          {[["Browse eco products", "shop", "Leaf"], ["View my orders", "orders", "Package"], ["Go to cart", "cart", "Cart"]].map(([l, p, ic]) => (
            <button key={l} onClick={() => setPage(p)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 15px", borderRadius: 11, border: `1px solid ${T.border}`, background: T.bg, cursor: "pointer", marginBottom: 8, fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600, color: T.navy, transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = T.green; e.currentTarget.style.background = T.greenLight; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.bg; }}>
              <Ic name={ic} size={16} color={T.green} />{l}<Ic name="ChevronRight" size={14} color={T.muted} style={{ marginLeft: "auto" }} />
            </button>
          ))}
        </Card>
        <Card hover={false} style={{ padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: T.navy, marginBottom: 16, fontFamily: "'Poppins',sans-serif" }}>Your Eco Impact</h3>
          <div style={{ background: T.greenLight, borderRadius: 13, padding: "20px", textAlign: "center", border: `1px solid ${T.green}20` }}>
            <div style={{ fontSize: 40 }}>🌱</div>
            <p style={{ fontSize: 14, fontWeight: 700, color: T.green, marginTop: 10 }}>
              {orders.length > 0 ? `${orders.length} order${orders.length > 1 ? "s" : ""} placed!` : "Start your eco journey"}
            </p>
            <p style={{ fontSize: 12, color: T.muted, marginTop: 6, lineHeight: 1.6 }}>Every purchase offsets carbon and plants a tree.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// VENDOR — VendorDashboard, MyProducts, AddProduct (each as a separate section)
// ════════════════════════════════════════════════════════════════════════════

function VendorDashboard({ setPage }) {
  const { user } = useAuth();
  const myProducts = PRODUCTS.filter(p => p.supplierId === 1);
  const stats = [
    { icon: "Package", label: "Active Products", val: myProducts.length, color: T.green },
    { icon: "Trend", label: "Total Views", val: "2,421", color: T.blue },
    { icon: "Leaf", label: "Avg Eco Score", val: Math.round(myProducts.reduce((s, p) => s + p.ecoScore, 0) / myProducts.length), color: "#84cc16" },
    { icon: "Award", label: "Certifications", val: "FSC, ISO", color: T.amber },
  ];
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
        <div style={{ width: 60, height: 60, background: T.amberLight, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ic name="Factory" size={28} color={T.amber} />
        </div>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: T.navy, fontFamily: "'Poppins',sans-serif" }}>Vendor Dashboard</h2>
          <p style={{ color: T.muted, fontSize: 14 }}>{user?.name} · <Badge color={T.green}>Verified Partner</Badge></p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginBottom: 36 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ padding: 24 }}>
            <div style={{ width: 44, height: 44, background: s.color + "15", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><Ic name={s.icon} size={22} color={s.color} /></div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.navy, fontFamily: "'Poppins',sans-serif" }}>{s.val}</div>
            <div style={{ fontSize: 12, color: T.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
        <Card style={{ padding: 24 }} onClick={() => setPage("vendor-products")}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, background: T.greenLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic name="Package" size={20} color={T.green} /></div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: T.navy, fontFamily: "'Poppins',sans-serif" }}>My Products</h3>
          </div>
          <p style={{ fontSize: 13, color: T.muted }}>View and manage your product inventory</p>
        </Card>
        <Card style={{ padding: 24 }} onClick={() => setPage("vendor-add")}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, background: T.amberLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic name="Plus" size={20} color={T.amber} /></div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: T.navy, fontFamily: "'Poppins',sans-serif" }}>Add Product</h3>
          </div>
          <p style={{ fontSize: 13, color: T.muted }}>List a new eco-certified product for review</p>
        </Card>
      </div>

      <Card hover={false} style={{ padding: 26 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: T.navy, marginBottom: 18, fontFamily: "'Poppins',sans-serif" }}>Recent Activity</h3>
        {[
          { msg: "RecycloDesk Pro — 3 new orders today", time: "2h ago", c: T.green },
          { msg: "BambooFlex Bed restocked — 15 units added", time: "1d ago", c: T.blue },
          { msg: "FSC certification renewed for 2026", time: "3d ago", c: T.amber },
        ].map((a, i, arr) => (
          <div key={i} style={{ display: "flex", gap: 14, padding: "13px 0", borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.c, marginTop: 6, flexShrink: 0 }} />
            <div><p style={{ fontSize: 13, color: T.navyMid }}>{a.msg}</p><p style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{a.time}</p></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function MyProductsPage() {
  const myProducts = PRODUCTS.filter(p => p.supplierId === 1);
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 32px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: T.navy, marginBottom: 28, fontFamily: "'Poppins',sans-serif" }}>My Products</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {myProducts.map(p => (
          <Card key={p.id} hover={false} style={{ padding: "16px 22px", display: "flex", gap: 16, alignItems: "center" }}>
            <img src={p.image} alt="" style={{ width: 64, height: 64, borderRadius: 12, objectFit: "cover", flexShrink: 0 }}
              onError={e => { e.target.src = "https://picsum.photos/seed/" + p.id + "/200"; }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, color: T.navy, fontSize: 15, fontFamily: "'Poppins',sans-serif" }}>{p.name}</p>
              <p style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>{p.category} · {p.stock} units in stock</p>
            </div>
            <EcoScore score={p.ecoScore} />
            <p style={{ fontWeight: 800, color: T.green, fontSize: 16 }}>{formatPrice(p.price)}</p>
            <Badge color={T.green}>Live</Badge>
            <Btn variant="outline" size="sm">Edit</Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AddProductPage() {
  const [form, setForm] = useState({ name: "", price: "", category: "Beds", desc: "", image: "" });
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <div style={{ maxWidth: 520, margin: "80px auto", padding: "0 32px", textAlign: "center" }}>
      <div style={{ width: 80, height: 80, background: T.amberLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px" }}>
        <Ic name="Clock" size={36} color={T.amber} />
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: T.navy, fontFamily: "'Poppins',sans-serif", marginBottom: 10 }}>Awaiting Verification</h2>
      <p style={{ color: T.muted, lineHeight: 1.7 }}>Our sustainability team will review your listing in 24–48 hours.</p>
      <Btn variant="outline" onClick={() => setSubmitted(false)} style={{ marginTop: 24 }}>List Another Product</Btn>
    </div>
  );

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 32px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: T.navy, marginBottom: 28, fontFamily: "'Poppins',sans-serif" }}>Add New Product</h2>
      <Card hover={false} style={{ padding: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Input label="Product Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. BambooFlex Chair" />
          <Input label="Price (₹)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. 12999" />
          <Select label="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
          </Select>
          <Input label="Image URL" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://images.unsplash.com/..." />
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: T.navyMid, marginBottom: 8 }}>Description</label>
            <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={4}
              style={{ width: "100%", padding: "13px 15px", border: `1.5px solid ${T.borderMid}`, borderRadius: 12, fontSize: 14, outline: "none", background: T.bg, boxSizing: "border-box", resize: "none", fontFamily: "'Inter',sans-serif" }}
              placeholder="Describe eco materials, certifications, dimensions…" />
          </div>
          <div style={{ background: T.amberLight, border: `1px solid ${T.amber}40`, borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#92400e", display: "flex", gap: 10 }}>
            <Ic name="Alert" size={15} color={T.amber} />FSC or ISO certification documents required for eco-score calculation.
          </div>
          <Btn full size="lg" onClick={() => setSubmitted(true)} style={{ borderRadius: 14 }}>Submit for Review</Btn>
        </div>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ADMIN — Overview, Users, Orders, Vendors (each as a separate page)
// ════════════════════════════════════════════════════════════════════════════

const MOCK_USERS = [
  { name: "Priya Sharma", email: "priya@example.com", role: "Customer", orders: 4, joined: "Jan 2026" },
  { name: "Rahul Verma", email: "rahul@example.com", role: "Customer", orders: 1, joined: "Feb 2026" },
  { name: "GreenWood Eco", email: "info@greenwood.com", role: "Vendor", orders: 0, joined: "Dec 2025" },
  { name: "NatureWood Ltd", email: "info@naturewood.com", role: "Vendor", orders: 0, joined: "Mar 2026" },
];

const MOCK_ORDERS_ADMIN = [
  { id: "ECN-948271", user: "Priya Sharma", total: 26998, status: "Delivered", items: 2, date: "Mar 10, 2026" },
  { id: "ECN-384720", user: "Rahul Verma", total: 8499, status: "Shipped", items: 1, date: "Mar 18, 2026" },
  { id: "ECN-019283", user: "Anjali Gupta", total: 47997, status: "Packed", items: 3, date: "Mar 20, 2026" },
  { id: "ECN-573841", user: "Vikram Nair", total: 6999, status: "Ordered", items: 1, date: "Mar 21, 2026" },
];

const STATUS_BADGE = {
  Delivered: { color: T.green, bg: T.greenLight },
  Shipped: { color: T.blue, bg: T.blueLight },
  Packed: { color: T.amber, bg: T.amberLight },
  Ordered: { color: T.muted, bg: T.bg },
};

function AdminOverviewPage() {
  const stats = [
    { icon: "Users", label: "Total Users", val: "1,284", color: T.green },
    { icon: "Package", label: "Total Orders", val: "4,891", color: T.blue },
    { icon: "Trend", label: "Monthly Revenue", val: "₹38.4L", color: T.green },
    { icon: "Leaf", label: "Avg Eco Score", val: "87.3", color: "#84cc16" },
    { icon: "Alert", label: "Pending Reviews", val: "3", color: T.red },
  ];
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
        <div style={{ width: 60, height: 60, background: T.blueLight, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ic name="Shield" size={28} color={T.blue} />
        </div>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: T.navy, fontFamily: "'Poppins',sans-serif" }}>Admin Overview</h2>
          <p style={{ color: T.muted, fontSize: 14 }}>EcoNest Living — Global System Administration</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20, marginBottom: 36 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ padding: 24, textAlign: "center" }}>
            <div style={{ width: 48, height: 48, background: s.color + "15", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Ic name={s.icon} size={22} color={s.color} /></div>
            <div style={{ fontSize: 26, fontWeight: 800, color: T.navy, fontFamily: "'Poppins',sans-serif" }}>{s.val}</div>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
          </Card>
        ))}
      </div>
      <Card hover={false} style={{ padding: 28 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: T.navy, marginBottom: 20, fontFamily: "'Poppins',sans-serif" }}>System Activity Log</h3>
        {[
          { msg: "Order ECN-019283 placed — ZenSofa Convertible × 2", time: "2h ago", c: T.green },
          { msg: "New supplier NatureWood Pvt Ltd registered — Pending verification", time: "5h ago", c: T.amber },
          { msg: "EcoWard Modular restocked (10 units) by Supplier #3", time: "1d ago", c: T.blue },
          { msg: "Admin approved RecycloDesk Pro listing — Eco Score: 88", time: "2d ago", c: T.green },
        ].map((a, i, arr) => (
          <div key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.c, marginTop: 7, flexShrink: 0 }} />
            <div><p style={{ fontSize: 14, color: T.navyMid }}>{a.msg}</p><p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{a.time}</p></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function AdminUsersPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: T.navy, marginBottom: 28, fontFamily: "'Poppins',sans-serif" }}>All Users ({MOCK_USERS.length})</h2>
      <Card hover={false} style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.bg }}>
              {["User", "Email", "Role", "Orders", "Joined", "Actions"].map(h => (
                <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((u, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${T.border}` }}>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${T.green},${T.greenDark})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 800 }}>{u.name[0]}</div>
                    <span style={{ fontWeight: 700, color: T.navy, fontSize: 14 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: "16px 20px", fontSize: 13, color: T.muted }}>{u.email}</td>
                <td style={{ padding: "16px 20px" }}><Badge color={u.role === "Vendor" ? T.blue : T.green}>{u.role}</Badge></td>
                <td style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700 }}>{u.orders}</td>
                <td style={{ padding: "16px 20px", fontSize: 13, color: T.muted }}>{u.joined}</td>
                <td style={{ padding: "16px 20px" }}><Btn variant="outline" size="sm">View</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function AdminOrdersPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: T.navy, marginBottom: 28, fontFamily: "'Poppins',sans-serif" }}>All Orders</h2>
      <Card hover={false} style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.bg }}>
              {["Order ID", "Customer", "Total", "Items", "Status", "Date", "Actions"].map(h => (
                <th key={h} style={{ padding: "14px 18px", textAlign: "left", fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_ORDERS_ADMIN.map((o, i) => {
              const sc = STATUS_BADGE[o.status] || { color: T.muted, bg: T.bg };
              return (
                <tr key={i} style={{ borderTop: `1px solid ${T.border}` }}>
                  <td style={{ padding: "16px 18px", fontFamily: "monospace", fontWeight: 700, color: T.green }}>{o.id}</td>
                  <td style={{ padding: "16px 18px", fontSize: 13, fontWeight: 600, color: T.navy }}>{o.user}</td>
                  <td style={{ padding: "16px 18px", fontSize: 14, fontWeight: 800 }}>{formatPrice(o.total)}</td>
                  <td style={{ padding: "16px 18px", fontSize: 13, color: T.muted }}>{o.items} item{o.items > 1 ? "s" : ""}</td>
                  <td style={{ padding: "16px 18px" }}><span style={{ background: sc.bg, color: sc.color, padding: "5px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>{o.status}</span></td>
                  <td style={{ padding: "16px 18px", fontSize: 13, color: T.muted }}>{o.date}</td>
                  <td style={{ padding: "16px 18px" }}><Btn variant="outline" size="sm">Details</Btn></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function AdminVendorsPage() {
  const [pending] = useState([{ name: "NatureWood Pvt Ltd", email: "info@naturewood.com", certs: "FSC, ISO14001" }]);
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 32px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: T.navy, marginBottom: 28, fontFamily: "'Poppins',sans-serif" }}>Vendor Management</h2>
      <h3 style={{ fontSize: 17, fontWeight: 800, color: T.navy, marginBottom: 16, fontFamily: "'Poppins',sans-serif" }}>Verification Queue</h3>
      {pending.map((s, i) => (
        <Card key={i} hover={false} style={{ padding: 22, display: "flex", alignItems: "center", gap: 18, marginBottom: 14, border: `1.5px solid ${T.amber}40` }}>
          <div style={{ width: 48, height: 48, background: T.amberLight, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ic name="Factory" size={22} color={T.amber} /></div>
          <div style={{ flex: 1 }}><p style={{ fontWeight: 800, color: T.navy, fontSize: 14 }}>{s.name}</p><p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{s.email} · Certs: {s.certs}</p></div>
          <Badge color={T.amber}>Pending</Badge>
          <div style={{ display: "flex", gap: 8 }}><Btn size="sm">Approve</Btn><Btn variant="danger" size="sm">Reject</Btn></div>
        </Card>
      ))}
      <h3 style={{ fontSize: 17, fontWeight: 800, color: T.navy, margin: "32px 0 16px", fontFamily: "'Poppins',sans-serif" }}>Active Vendors</h3>
      {[
        { name: "GreenWood Eco Suppliers", email: "info@greenwood.com", products: 4, certs: "FSC, ISO14001" },
        { name: "EcoHome Crafts", email: "info@ecohome.com", products: 2, certs: "FSC" },
        { name: "ReNest Makers", email: "info@renest.com", products: 2, certs: "ISO14001, GreenGuard" },
      ].map((v, i) => (
        <Card key={i} hover={false} style={{ padding: 22, display: "flex", alignItems: "center", gap: 18, marginBottom: 12 }}>
          <div style={{ width: 48, height: 48, background: T.greenLight, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic name="Factory" size={22} color={T.green} /></div>
          <div style={{ flex: 1 }}><p style={{ fontWeight: 800, color: T.navy, fontSize: 14 }}>{v.name}</p><p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{v.email} · {v.products} products · {v.certs}</p></div>
          <Badge color={T.green}>Verified</Badge>
          <Btn variant="outline" size="sm">Manage</Btn>
        </Card>
      ))}
    </div>
  );
}


// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer({ setPage }) {
  return (
    <footer style={{ background: T.navy, color: "white", padding: "80px 32px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 56, marginBottom: 64 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, background: T.greenLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic name="Leaf" size={18} color={T.green} />
              </div>
              <span style={{ fontSize: 22, fontWeight: 900, color: "white", fontFamily: "'Poppins', sans-serif" }}>EcoNest</span>
            </div>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, maxWidth: 300 }}>Modern urban furniture designed for a sustainable future. Connecting conscious consumers with certified eco-friendly craftsmen.</p>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              {["Globe", "User", "Mail"].map((ic, i) => (
                <div key={i} style={{ width: 40, height: 40, background: "rgba(255,255,255,0.06)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseOver={e => e.currentTarget.style.background = T.green}
                  onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}>
                  <Ic name={ic} size={16} color="white" />
                </div>
              ))}
            </div>
          </div>

          {[
            {
              title: "Platform",
              links: [["Shop Collection", () => setPage("shop")], ["Sustainability Guide", null], ["Supplier Program", null], ["Eco-Impact Reports", null]]
            },
            {
              title: "Customer Care",
              links: [["Order Tracking", () => setPage("orders")], ["Return Policy", null], ["Warranty", null], ["FAQs", null]]
            },
            {
              title: "Contact",
              links: [["hello@econest.in", null], ["1800-ECO-NEST", null], ["Mumbai HQ, India", null], ["Mon–Sat: 9AM–6PM", null]]
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 style={{ fontWeight: 800, marginBottom: 20, fontSize: 15, color: "white", fontFamily: "'Poppins', sans-serif" }}>{title}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {links.map(([label, fn], i) => (
                  <p key={i} onClick={fn || undefined} style={{ fontSize: 14, color: "#94a3b8", cursor: fn ? "pointer" : "default", transition: "color 0.2s" }}
                    onMouseOver={e => { if (fn) e.currentTarget.style.color = "#86efac"; }}
                    onMouseOut={e => { if (fn) e.currentTarget.style.color = "#94a3b8"; }}>
                    {label}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontSize: 13, color: "#86efac" }}>© 2026 EcoNest Living. Built sustainably for a greener world.</p>
          <div style={{ display: "flex", gap: 10 }}>
            {["FSC®", "GreenGuard", "ISO14001"].map(cert => (
              <span key={cert} style={{ background: "rgba(255,255,255,0.08)", color: "#d1fae5", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100 }}>{cert}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

function AppInner() {
  const { user, logout } = useAuth();
  const role = user?.role || "guest";

  // Set initial page based on role
  const [page, setPage] = useState(() => {
    if (!user) return "login";
    if (user.role === "supplier") return "vendor-home";
    if (user.role === "admin") return "admin-home";
    return "shop";
  });

  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);

  const notify = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const formatCartPayload = (cartItems) => cartItems.map(i => ({
    productId: i.product.id ? i.product.id.toString() : "unknown",
    name: i.product.name,
    price: i.product.price,
    image: i.product.image,
    qty: i.qty
  }));

  const parseOrderFromBackend = (order) => ({
    ...order,
    total: order.totalAmount,
    timestamp: new Date(order.createdAt).getTime(),
    items: (order.items || []).map(i => ({
      product: PRODUCTS.find(p => p.id.toString() === i.productId) || { id: i.productId, name: i.name, price: i.price, image: i.image },
      qty: i.qty
    }))
  });

  useEffect(() => {
    if (user && user.role === "customer") {
      API.get('/cart').then(res => {
        if (res.data?.items) {
          const loadedCart = res.data.items.map(item => {
            const fullProduct = PRODUCTS.find(p => p.id.toString() === item.productId) || {
              id: item.productId, name: item.name, price: item.price, image: item.image, accentColor: T.greenLight
            };
            return { product: fullProduct, qty: item.qty };
          });
          setCart(loadedCart);
        }
      }).catch(err => console.error("Failed fetching cart:", err));

      API.get('/orders').then(res => setOrders(res.data?.map(parseOrderFromBackend) || [])).catch(console.error);
    } else {
      setCart([]);
      setOrders([]);
    }
  }, [user]);

  const addToCart = useCallback((product) => {
    if (!user) { setPage("login"); return; }
    if (user.role !== "customer") { notify("Only customers can add to cart."); return; }
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      const newCart = ex 
        ? prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { product, qty: 1 }];
      API.post('/cart', { items: formatCartPayload(newCart) }).catch(console.error);
      return newCart;
    });
    notify(`${product.name} added to cart!`);
  }, [user, notify]);

  const updateCart = useCallback((pid, qty) => {
    if (qty <= 0) { 
      setCart(prev => {
        const newCart = prev.filter(i => i.product.id !== pid);
        API.post('/cart', { items: formatCartPayload(newCart) }).catch(console.error);
        return newCart;
      });
      return; 
    }
    setCart(prev => {
      const newCart = prev.map(i => i.product.id === pid ? { ...i, qty } : i);
      API.post('/cart', { items: formatCartPayload(newCart) }).catch(console.error);
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((pid) => {
    setCart(prev => {
      const newCart = prev.filter(i => i.product.id !== pid);
      API.post('/cart', { items: formatCartPayload(newCart) }).catch(console.error);
      return newCart;
    });
    notify("Item removed from cart");
  }, [notify]);

  const placeOrder = useCallback(async (orderDetails) => {
    try {
      const orderPayload = {
        items: formatCartPayload(orderDetails.items),
        totalAmount: orderDetails.total,
        shippingAddress: orderDetails.form,
        paymentMethod: orderDetails.payMethod
      };
      const res = await API.post('/orders', orderPayload);
      setOrders(prev => [parseOrderFromBackend(res.data), ...prev]);
      setCart([]);
      await API.post('/cart', { items: [] }).catch(console.error);
      setPage("success");
    } catch (err) {
      notify("Failed to place order.");
      console.error(err);
    }
  }, [notify]);

  const noNavPages = ["login", "register"];
  const noFooterPages = ["login", "register", "vendor-home", "vendor-products", "vendor-add", "admin-home", "admin-users", "admin-orders", "admin-vendors"];

  return (
    <div style={{ minHeight: "100vh", background: T.white, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; color: #0f172a; background: #fff; -webkit-font-smoothing: antialiased; }
        ::placeholder { color: #94a3b8; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 100px; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        table { font-family: 'Inter', sans-serif; }
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
        img { display: block; }
      `}</style>

      {!noNavPages.includes(page) && (
        <Navbar page={page} setPage={setPage} cart={cart} />
      )}

      <main style={{ minHeight: "60vh" }}>

        {/* ── AUTH ─────────────────────────────────────────────────── */}
        {page === "login" && <LoginPage setPage={setPage} />}
        {page === "register" && <RegisterPage setPage={setPage} />}

        {/* ── CUSTOMER PAGES ───────────────────────────────────────── */}
        {page === "shop" && (
          <ProtectedPage allowedRole="customer" setPage={setPage}>
            <div>
              <HeroSection onShop={() => document.querySelector("[data-catalog]")?.scrollIntoView({ behavior: "smooth" })} />
              <SustainabilitySection />
              <div data-catalog=""><ProductCatalog onAddToCart={addToCart} /></div>
            </div>
          </ProtectedPage>
        )}
        {page === "user-dashboard" && (
          <ProtectedPage allowedRole="customer" setPage={setPage}>
            <UserDashboard setPage={setPage} orders={orders} cart={cart} />
          </ProtectedPage>
        )}
        {page === "cart" && (
          <ProtectedPage allowedRole="customer" setPage={setPage}>
            <CartPage cart={cart} onUpdate={updateCart} onRemove={removeFromCart} user={user} onCheckout={() => setPage("checkout")} setPage={setPage} />
          </ProtectedPage>
        )}
        {page === "checkout" && (
          <ProtectedPage allowedRole="customer" setPage={setPage}>
            <CheckoutPage cart={cart} user={user} onPlaceOrder={placeOrder} />
          </ProtectedPage>
        )}
        {page === "success" && (
          <ProtectedPage allowedRole="customer" setPage={setPage}>
            <OrderSuccess order={orders[0]} onContinue={() => setPage("shop")} setPage={setPage} />
          </ProtectedPage>
        )}
        {page === "orders" && (
          <ProtectedPage allowedRole="customer" setPage={setPage}>
            <OrderTracker orders={orders} />
          </ProtectedPage>
        )}

        {/* ── VENDOR PAGES ─────────────────────────────────────────── */}
        {page === "vendor-home" && (
          <ProtectedPage allowedRole="supplier" setPage={setPage}>
            <VendorDashboard setPage={setPage} />
          </ProtectedPage>
        )}
        {page === "vendor-products" && (
          <ProtectedPage allowedRole="supplier" setPage={setPage}>
            <MyProductsPage />
          </ProtectedPage>
        )}
        {page === "vendor-add" && (
          <ProtectedPage allowedRole="supplier" setPage={setPage}>
            <AddProductPage />
          </ProtectedPage>
        )}

        {/* ── ADMIN PAGES ──────────────────────────────────────────── */}
        {page === "admin-home" && (
          <ProtectedPage allowedRole="admin" setPage={setPage}>
            <AdminOverviewPage />
          </ProtectedPage>
        )}
        {page === "admin-users" && (
          <ProtectedPage allowedRole="admin" setPage={setPage}>
            <AdminUsersPage />
          </ProtectedPage>
        )}
        {page === "admin-orders" && (
          <ProtectedPage allowedRole="admin" setPage={setPage}>
            <AdminOrdersPage />
          </ProtectedPage>
        )}
        {page === "admin-vendors" && (
          <ProtectedPage allowedRole="admin" setPage={setPage}>
            <AdminVendorsPage />
          </ProtectedPage>
        )}

      </main>

      {!noFooterPages.includes(page) && <Footer setPage={setPage} />}

      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
