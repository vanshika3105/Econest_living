import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import YourMainApp from './App'; // Your current app

export default function AppWithAuth() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<YourMainApp />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

// ─── DATA ───────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 1, name: "BambooFlex Foldable Bed", category: "Beds", price: 18999, material: "Bamboo", ecoScore: 92, stock: 15, supplierId: 1, image: "🛏️", desc: "Space-saving foldable bed crafted from certified bamboo. Folds flat in 30 seconds.", certifications: ["FSC", "GreenGuard"], carbonFootprint: "Low", dimensions: "190×90 cm (folded: 10 cm)", tag: "Bestseller" },
  { id: 2, name: "RecycloDesk Pro", price: 8499, category: "Desks", material: "Reclaimed Wood", ecoScore: 88, stock: 22, supplierId: 1, image: "🪑", desc: "Work-from-home desk made from reclaimed teak wood. Adjustable height.", certifications: ["FSC", "ISO14001"], carbonFootprint: "Very Low", dimensions: "120×60 cm, adjustable 70–110 cm", tag: "WFH Pick" },
  { id: 3, name: "ModuShelf Stack Set", price: 5999, category: "Storage", material: "Recycled Metal", ecoScore: 85, stock: 30, supplierId: 2, image: "🗄️", desc: "Stackable modular shelving in recycled steel. Mix & match configurations.", certifications: ["ISO14001"], carbonFootprint: "Medium", dimensions: "40×30×80 cm per unit", tag: "Modular" },
  { id: 4, name: "ZenSofa Convertible", price: 24999, category: "Sofas", material: "Bamboo + Recycled Fabric", ecoScore: 90, stock: 8, supplierId: 2, image: "🛋️", desc: "Sofa-to-bed convertible in 3 moves. Upholstered in recycled PET fabric.", certifications: ["FSC", "OEKO-TEX"], carbonFootprint: "Low", dimensions: "210×85 cm (bed: 210×130 cm)", tag: "Convertible" },
  { id: 5, name: "FoldDine Table", price: 7299, category: "Tables", material: "Bamboo", ecoScore: 94, stock: 18, supplierId: 1, image: "🪵", desc: "Wall-mounted fold-down dining table. Seats 4 when open, invisible when closed.", certifications: ["FSC", "GreenGuard"], carbonFootprint: "Very Low", dimensions: "120×75 cm (fold depth: 8 cm)", tag: "Space Saver" },
  { id: 6, name: "EcoWard Modular", price: 15499, category: "Wardrobes", material: "Reclaimed Wood", ecoScore: 87, stock: 10, supplierId: 3, image: "🚪", desc: "Fully modular wardrobe with reclaimed wood panels. Add units as needed.", certifications: ["FSC"], carbonFootprint: "Low", dimensions: "100×50×200 cm per section", tag: "Customizable" },
  { id: 7, name: "SlimTrunk Storage Bench", price: 4599, category: "Storage", material: "Bamboo", ecoScore: 91, stock: 25, supplierId: 3, image: "📦", desc: "Dual-function storage bench. Hidden compartment, seats 2 comfortably.", certifications: ["FSC", "GreenGuard"], carbonFootprint: "Very Low", dimensions: "120×40×45 cm", tag: "Multi-Use" },
  { id: 8, name: "NestNook Study Chair", price: 6999, category: "Chairs", material: "Recycled Metal + Bamboo", ecoScore: 83, stock: 20, supplierId: 2, image: "💺", desc: "Ergonomic study chair with bamboo back and recycled steel frame.", certifications: ["ISO14001", "GreenGuard"], carbonFootprint: "Low", dimensions: "45×45×85 cm, lumbar support included", tag: "Ergonomic" },
];

const CATEGORIES = ["All", "Beds", "Desks", "Storage", "Sofas", "Tables", "Wardrobes", "Chairs"];
const MATERIALS = ["All Materials", "Bamboo", "Reclaimed Wood", "Recycled Metal", "Bamboo + Recycled Fabric", "Recycled Metal + Bamboo"];

const ECO_SCORE_COLOR = (score) => score >= 90 ? "#22c55e" : score >= 80 ? "#84cc16" : "#facc15";

// ─── UTILITY ────────────────────────────────────────────────────────────────
const formatPrice = (p) => `₹${p.toLocaleString("en-IN")}`;

// ─── SUBCOMPONENTS ──────────────────────────────────────────────────────────

function EcoScoreBadge({ score }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: `conic-gradient(${ECO_SCORE_COLOR(score)} ${score * 3.6}deg, #e5e7eb 0deg)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 0 3px white, 0 0 0 4px ${ECO_SCORE_COLOR(score)}33`
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%", background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontWeight: 700, color: ECO_SCORE_COLOR(score), fontFamily: "monospace"
        }}>{score}</div>
      </div>
      <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>Eco Score</span>
    </div>
  );
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2800); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: "#1a3a2a", color: "white", padding: "14px 22px",
      borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      display: "flex", alignItems: "center", gap: 12,
      animation: "slideUp 0.3s ease", fontSize: 14, fontWeight: 500
    }}>
      <span style={{ fontSize: 20 }}>🌿</span> {msg}
    </div>
  );
}

function StarRating({ rating = 4.2, count = 128 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.floor(rating) ? "#f59e0b" : "#d1d5db" }}>★</span>
      ))}
      <span style={{ color: "#6b7280" }}>({count})</span>
    </div>
  );
}

// ─── PAGES ──────────────────────────────────────────────────────────────────

function HeroSection({ onShop }) {
  return (
    <section style={{
      minHeight: "92vh", display: "flex", alignItems: "center",
      background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 40%, #f7fee7 100%)",
      position: "relative", overflow: "hidden", padding: "60px 0"
    }}>
      {/* Decorative blobs */}
      <div style={{ position:"absolute", top:-80, right:-80, width:400, height:400, borderRadius:"50%", background:"rgba(34,197,94,0.08)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-60, left:-60, width:300, height:300, borderRadius:"50%", background:"rgba(132,204,22,0.1)", pointerEvents:"none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", width: "100%" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ fontSize: 12 }}>🌿</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", letterSpacing: 1, textTransform: "uppercase" }}>Eco-Certified & D2C</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2.2rem, 4vw, 3.6rem)", fontWeight: 800, color: "#14532d", lineHeight: 1.1, marginBottom: 20 }}>
            Compact Living.<br />
            <span style={{ color: "#16a34a" }}>Eco-Conscious</span><br />
            Home Furniture.
          </h1>
          <p style={{ fontSize: 17, color: "#374151", lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
            Space-saving furniture made from bamboo, reclaimed wood & recycled materials — designed for modern urban homes. Every purchase verified eco-certified.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button onClick={onShop} style={{
              background: "#16a34a", color: "white", border: "none",
              padding: "15px 32px", borderRadius: 50, fontSize: 15, fontWeight: 700,
              cursor: "pointer", boxShadow: "0 4px 20px rgba(22,163,74,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s"
            }} onMouseOver={e => e.target.style.transform="translateY(-2px)"}
               onMouseOut={e => e.target.style.transform="translateY(0)"}>
              Shop Collection →
            </button>
            <button onClick={() => document.getElementById("sustainability")?.scrollIntoView({behavior:"smooth"})} style={{
              background: "transparent", color: "#16a34a", border: "2px solid #16a34a",
              padding: "15px 32px", borderRadius: 50, fontSize: 15, fontWeight: 700, cursor: "pointer"
            }}>
              Our Mission
            </button>
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 44 }}>
            {[["500+","Products"], ["10K+","Happy Customers"], ["99%","Eco Certified"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#14532d", fontFamily: "'Playfair Display', serif" }}>{n}</div>
                <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {PRODUCTS.slice(0,4).map((p, i) => (
            <div key={p.id} style={{
              background: "white", borderRadius: 20, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              transform: i % 2 === 1 ? "translateY(20px)" : "translateY(0)",
              border: "1px solid rgba(34,197,94,0.15)"
            }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{p.image}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>{formatPrice(p.price)}</div>
              <div style={{ marginTop: 8 }}>
                <EcoScoreBadge score={p.ecoScore} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SustainabilitySection() {
  const features = [
    { icon: "🌳", title: "FSC Certified Materials", desc: "All wood sourced from responsibly managed forests with full chain-of-custody certification." },
    { icon: "♻️", title: "Recycled Components", desc: "Up to 70% recycled metal and reclaimed wood in our product range. Zero waste manufacturing." },
    { icon: "📊", title: "Live Eco Scores", desc: "Every product gets a 0–100 eco score based on material, carbon footprint & certification." },
    { icon: "🚚", title: "Carbon-Neutral Delivery", desc: "We offset 100% of delivery emissions through verified carbon credit programs." },
    { icon: "🔄", title: "Buy-Back Program", desc: "Return old furniture for recycling and earn store credits on your next purchase." },
    { icon: "✅", title: "Admin Verified", desc: "All suppliers pass strict sustainability audits before listing products on EcoNest." },
  ];
  return (
    <section id="sustainability" style={{ padding: "80px 32px", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", letterSpacing: 2, textTransform: "uppercase" }}>Why EcoNest</span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800, color: "#14532d", marginTop: 8 }}>
            Sustainability at Every Step
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {features.map(f => (
            <div key={f.title} style={{
              background: "white", borderRadius: 20, padding: 28,
              border: "1px solid #e5e7eb", transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseOver={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(0,0,0,0.1)"; }}
            onMouseOut={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1f2937", marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, onAdd, onView }) {
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };
  return (
    <div style={{
      background: "white", borderRadius: 20, overflow: "hidden",
      border: "1px solid #e5e7eb", transition: "transform 0.2s, box-shadow 0.2s",
      display: "flex", flexDirection: "column"
    }}
    onMouseOver={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 16px 48px rgba(0,0,0,0.1)"; }}
    onMouseOut={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}>
      {/* Image area */}
      <div style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #f7fee7 100%)",
        padding: 32, textAlign: "center", position: "relative"
      }}>
        <div style={{ fontSize: 64 }}>{product.image}</div>
        {product.tag && (
          <span style={{
            position: "absolute", top: 12, left: 12,
            background: "#16a34a", color: "white", fontSize: 10, fontWeight: 700,
            padding: "3px 10px", borderRadius: 100, letterSpacing: 0.5
          }}>{product.tag}</span>
        )}
        <span style={{
          position: "absolute", top: 12, right: 12,
          background: product.stock > 5 ? "#dcfce7" : "#fef2f2",
          color: product.stock > 5 ? "#16a34a" : "#dc2626",
          fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100
        }}>{product.stock > 5 ? `In Stock` : `Only ${product.stock} left`}</span>
      </div>

      <div style={{ padding: "20px 22px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{product.category} • {product.material}</div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1f2937", marginBottom: 6 }}>{product.name}</h3>
        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5, marginBottom: 12, flex: 1 }}>{product.desc}</p>
        <StarRating />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, marginBottom: 16 }}>
          <EcoScoreBadge score={product.ecoScore} />
          <div style={{ fontSize: 20, fontWeight: 800, color: "#14532d", fontFamily: "'Playfair Display', serif" }}>{formatPrice(product.price)}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onView(product)} style={{
            flex: 1, background: "transparent", border: "2px solid #e5e7eb",
            color: "#374151", borderRadius: 10, padding: "10px 0", fontSize: 13, fontWeight: 600, cursor: "pointer"
          }}>View Details</button>
          <button onClick={handleAdd} style={{
            flex: 2, background: added ? "#dcfce7" : "#16a34a", color: added ? "#16a34a" : "white",
            border: "none", borderRadius: 10, padding: "10px 0", fontSize: 13, fontWeight: 700,
            cursor: "pointer", transition: "all 0.2s"
          }}>{added ? "✓ Added!" : "Add to Cart"}</button>
        </div>
      </div>
    </div>
  );
}

function ProductCatalog({ onAddToCart, user }) {
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
  if (sort === "price-asc") filtered.sort((a,b) => a.price - b.price);
  if (sort === "price-desc") filtered.sort((a,b) => b.price - a.price);
  if (sort === "eco-desc") filtered.sort((a,b) => b.ecoScore - a.ecoScore);

  return (
    <section style={{ padding: "60px 32px", background: "white", minHeight: "80vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2rem", fontWeight: 800, color: "#14532d", marginBottom: 8 }}>Our Collection</h2>
        <p style={{ color: "#6b7280", marginBottom: 32 }}>Every piece eco-verified and space-optimized for modern urban living</p>

        {/* Filters */}
        <div style={{ background: "#f8fafc", borderRadius: 16, padding: 20, marginBottom: 36, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍  Search products..."
            style={{ flex: 2, minWidth: 160, padding: "10px 16px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, outline: "none" }}
          />
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, background: "white" }}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={material} onChange={e => setMaterial(e.target.value)} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, background: "white" }}>
            {MATERIALS.map(m => <option key={m}>{m}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, background: "white" }}>
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="eco-desc">Best Eco Score</option>
          </select>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>Min Eco:</span>
            <input type="range" min={0} max={95} step={5} value={minEco} onChange={e => setMinEco(+e.target.value)} style={{ width: 80 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", minWidth: 28 }}>{minEco}+</span>
          </div>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>{filtered.length} products</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onAdd={onAddToCart} onView={setViewProduct} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>
            <div style={{ fontSize: 48 }}>🌿</div>
            <p style={{ fontSize: 16, marginTop: 12 }}>No products match your filters.</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {viewProduct && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={() => setViewProduct(null)}>
          <div style={{ background: "white", borderRadius: 24, maxWidth: 600, width: "100%", overflow: "hidden", maxHeight: "90vh", overflowY: "auto" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ background: "linear-gradient(135deg, #f0fdf4, #f7fee7)", padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 80 }}>{viewProduct.image}</div>
            </div>
            <div style={{ padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: "#14532d" }}>{viewProduct.name}</h2>
                  <p style={{ color: "#6b7280", fontSize: 13 }}>{viewProduct.category} • {viewProduct.material}</p>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#16a34a" }}>{formatPrice(viewProduct.price)}</div>
              </div>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, marginBottom: 20 }}>{viewProduct.desc}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  ["📐 Dimensions", viewProduct.dimensions],
                  ["🍃 Carbon Footprint", viewProduct.carbonFootprint],
                  ["📦 In Stock", `${viewProduct.stock} units`],
                  ["✅ Certifications", viewProduct.certifications.join(", ")],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: "#f8fafc", borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1f2937" }}>{v}</div>
                  </div>
                ))}
              </div>
              <EcoScoreBadge score={viewProduct.ecoScore} />
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={() => { onAddToCart(viewProduct); setViewProduct(null); }} style={{
                  flex: 1, background: "#16a34a", color: "white", border: "none",
                  borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer"
                }}>Add to Cart 🛒</button>
                <button onClick={() => setViewProduct(null)} style={{
                  background: "transparent", border: "2px solid #e5e7eb", color: "#6b7280",
                  borderRadius: 12, padding: "14px 20px", cursor: "pointer", fontSize: 14
                }}>✕</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function CartPage({ cart, onUpdate, onRemove, user, onCheckout }) {
  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const savings = Math.round(total * 0.05);

  if (!user) return (
    <div style={{ padding: 80, textAlign: "center" }}>
      <div style={{ fontSize: 64 }}>🔒</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#14532d", marginTop: 16 }}>Please login to view your cart</h2>
    </div>
  );

  if (cart.length === 0) return (
    <div style={{ padding: 80, textAlign: "center" }}>
      <div style={{ fontSize: 64 }}>🛒</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#14532d", marginTop: 16 }}>Your cart is empty</h2>
      <p style={{ color: "#6b7280", marginTop: 8 }}>Add some eco-friendly furniture to get started!</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 32px" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 800, color: "#14532d", marginBottom: 32 }}>Your Cart</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {cart.map(({ product, qty }) => (
            <div key={product.id} style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #e5e7eb", display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ background: "linear-gradient(135deg, #f0fdf4, #f7fee7)", borderRadius: 12, padding: 16, fontSize: 36 }}>{product.image}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", marginBottom: 2 }}>{product.name}</h3>
                <p style={{ fontSize: 12, color: "#9ca3af" }}>{product.material} • Eco Score: {product.ecoScore}</p>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#16a34a", marginTop: 4 }}>{formatPrice(product.price)}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => onUpdate(product.id, qty - 1)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontWeight: 700, fontSize: 16 }}>−</button>
                <span style={{ fontWeight: 700, width: 24, textAlign: "center" }}>{qty}</span>
                <button onClick={() => onUpdate(product.id, qty + 1)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontWeight: 700, fontSize: 16 }}>+</button>
              </div>
              <button onClick={() => onRemove(product.id)} style={{ background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Remove</button>
            </div>
          ))}
        </div>

        <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1px solid #e5e7eb", position: "sticky", top: 100 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 800, color: "#14532d", marginBottom: 20 }}>Order Summary</h3>
          {cart.map(({ product, qty }) => (
            <div key={product.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
              <span>{product.name} ×{qty}</span>
              <span>{formatPrice(product.price * qty)}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #e5e7eb", margin: "16px 0", paddingTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#16a34a", marginBottom: 8 }}>
              <span>🌿 Eco Discount (5%)</span>
              <span>-{formatPrice(savings)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
              <span>Delivery</span>
              <span style={{ color: "#16a34a", fontWeight: 600 }}>Free</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18, color: "#14532d", marginTop: 12 }}>
              <span>Total</span>
              <span>{formatPrice(total - savings)}</span>
            </div>
          </div>
          <button onClick={onCheckout} style={{
            width: "100%", background: "#16a34a", color: "white", border: "none",
            borderRadius: 12, padding: "16px 0", fontSize: 15, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 20px rgba(22,163,74,0.3)", marginTop: 8
          }}>Proceed to Checkout →</button>
          <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "#9ca3af" }}>🔒 Secure checkout via Razorpay</div>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage({ cart, user, onPlaceOrder }) {
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: "", address: "", city: "", pincode: "", state: "" });
  const [payMethod, setPayMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);

  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const savings = Math.round(total * 0.05);
  const finalTotal = total - savings;

  const handleSubmit = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onPlaceOrder({ form, payMethod, total: finalTotal, items: cart });
    }, 2000);
  };

  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, boxSizing: "border-box", outline: "none", marginTop: 6 };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 800, color: "#14532d", marginBottom: 32 }}>Checkout</h2>

      {/* Steps */}
      <div style={{ display: "flex", gap: 0, marginBottom: 36 }}>
        {["Shipping", "Payment", "Review"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: step > i + 1 ? "#16a34a" : step === i + 1 ? "#16a34a" : "#e5e7eb",
              color: step >= i + 1 ? "white" : "#9ca3af", fontWeight: 700, fontSize: 14
            }}>{step > i + 1 ? "✓" : i + 1}</div>
            <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 600, color: step === i + 1 ? "#16a34a" : "#9ca3af" }}>{s}</span>
            {i < 2 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? "#16a34a" : "#e5e7eb", margin: "0 12px" }} />}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 28 }}>
        <div>
          {step === 1 && (
            <div style={{ background: "white", borderRadius: 20, padding: 28, border: "1px solid #e5e7eb" }}>
              <h3 style={{ fontWeight: 700, color: "#1f2937", marginBottom: 20 }}>Shipping Information</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[["Full Name","name"],["Email","email"],["Phone","phone"],["Address","address"],["City","city"],["Pincode","pincode"]].map(([label, key]) => (
                  <div key={key} style={{ gridColumn: key === "address" ? "1/-1" : "auto" }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</label>
                    <input value={form[key]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))} style={inputStyle} placeholder={`Enter ${label}`} />
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(2)} style={{ marginTop: 24, background: "#16a34a", color: "white", border: "none", borderRadius: 12, padding: "13px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ background: "white", borderRadius: 20, padding: 28, border: "1px solid #e5e7eb" }}>
              <h3 style={{ fontWeight: 700, color: "#1f2937", marginBottom: 20 }}>Payment Method</h3>
              <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>🔒 Secured by Razorpay — 256-bit SSL encrypted</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[["upi","📱 UPI / QR Code"],["card","💳 Credit / Debit Card"],["netbanking","🏦 Net Banking"],["cod","📦 Cash on Delivery"]].map(([val, label]) => (
                  <label key={val} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: 16,
                    border: `2px solid ${payMethod === val ? "#16a34a" : "#e5e7eb"}`,
                    borderRadius: 12, cursor: "pointer",
                    background: payMethod === val ? "#f0fdf4" : "white"
                  }}>
                    <input type="radio" checked={payMethod === val} onChange={() => setPayMethod(val)} style={{ accentColor: "#16a34a" }} />
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#1f2937" }}>{label}</span>
                  </label>
                ))}
              </div>
              {payMethod === "upi" && (
                <div style={{ marginTop: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>UPI ID</label>
                  <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" style={inputStyle} />
                </div>
              )}
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button onClick={() => setStep(1)} style={{ background: "transparent", border: "2px solid #e5e7eb", color: "#6b7280", borderRadius: 12, padding: "13px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>← Back</button>
                <button onClick={() => setStep(3)} style={{ background: "#16a34a", color: "white", border: "none", borderRadius: 12, padding: "13px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Review Order →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ background: "white", borderRadius: 20, padding: 28, border: "1px solid #e5e7eb" }}>
              <h3 style={{ fontWeight: 700, color: "#1f2937", marginBottom: 20 }}>Review Your Order</h3>
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Delivering to</p>
                <p style={{ fontWeight: 600, color: "#1f2937", fontSize: 14 }}>{form.name} • {form.phone}</p>
                <p style={{ color: "#6b7280", fontSize: 13 }}>{form.address}, {form.city} - {form.pincode}</p>
              </div>
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>Payment</p>
                <p style={{ fontWeight: 600, color: "#1f2937", fontSize: 14 }}>{payMethod === "upi" ? `UPI: ${upiId}` : payMethod === "card" ? "Credit/Debit Card" : payMethod === "netbanking" ? "Net Banking" : "Cash on Delivery"}</p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setStep(2)} style={{ background: "transparent", border: "2px solid #e5e7eb", color: "#6b7280", borderRadius: 12, padding: "13px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>← Back</button>
                <button onClick={handleSubmit} disabled={processing} style={{
                  flex: 1, background: processing ? "#9ca3af" : "#16a34a", color: "white", border: "none",
                  borderRadius: 12, padding: "13px 0", fontSize: 15, fontWeight: 700, cursor: "pointer"
                }}>{processing ? "⟳ Processing..." : `Place Order · ${formatPrice(finalTotal)}`}</button>
              </div>
            </div>
          )}
        </div>

        {/* Mini summary */}
        <div style={{ background: "white", borderRadius: 20, padding: 20, border: "1px solid #e5e7eb", height: "fit-content" }}>
          <h4 style={{ fontWeight: 700, color: "#1f2937", marginBottom: 16 }}>Items ({cart.length})</h4>
          {cart.map(({ product, qty }) => (
            <div key={product.id} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>{product.image}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#1f2937" }}>{product.name}</p>
                <p style={{ fontSize: 11, color: "#9ca3af" }}>×{qty}</p>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>{formatPrice(product.price * qty)}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12, marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, color: "#14532d" }}>
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderSuccess({ order, onContinue }) {
  const orderId = `ECN-${Date.now().toString().slice(-6)}`;
  return (
    <div style={{ maxWidth: 600, margin: "80px auto", padding: "0 32px", textAlign: "center" }}>
      <div style={{ width: 80, height: 80, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 36 }}>✅</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: "#14532d", marginBottom: 8 }}>Order Placed!</h2>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>Thank you for choosing eco-friendly furniture. Your order has been confirmed and forwarded to the supplier.</p>
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: "#9ca3af" }}>Order ID</p>
        <p style={{ fontWeight: 800, fontSize: 20, color: "#16a34a", fontFamily: "monospace" }}>{orderId}</p>
        <p style={{ fontSize: 13, color: "#374151", marginTop: 12 }}>📦 Estimated delivery: 5–7 business days</p>
        <p style={{ fontSize: 13, color: "#374151" }}>🌿 Your purchase offsets approximately 2.3 kg CO₂</p>
        <p style={{ fontSize: 13, color: "#374151" }}>💌 Confirmation sent to {order.form.email}</p>
      </div>
      <button onClick={onContinue} style={{ background: "#16a34a", color: "white", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Continue Shopping →</button>
    </div>
  );
}

function OrderTracker({ orders }) {
  if (orders.length === 0) return (
    <div style={{ padding: 80, textAlign: "center" }}>
      <div style={{ fontSize: 56 }}>📦</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#14532d", marginTop: 16 }}>No Orders Yet</h2>
      <p style={{ color: "#6b7280" }}>Place your first order to track it here.</p>
    </div>
  );

  const STAGES = ["Order Confirmed", "Processing", "Dispatched", "Out for Delivery", "Delivered"];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 32px" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 800, color: "#14532d", marginBottom: 32 }}>Track Your Orders</h2>
      {orders.map((order, idx) => {
        const stage = Math.min(2, Math.floor((Date.now() - order.timestamp) / 10000));
        return (
          <div key={idx} style={{ background: "white", borderRadius: 20, padding: 28, border: "1px solid #e5e7eb", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 12, color: "#9ca3af" }}>Order ID</p>
                <p style={{ fontWeight: 700, fontFamily: "monospace", color: "#16a34a" }}>{order.orderId}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 12, color: "#9ca3af" }}>Total</p>
                <p style={{ fontWeight: 800, color: "#14532d" }}>{formatPrice(order.total)}</p>
              </div>
            </div>
            {/* Progress */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
              {STAGES.map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: i <= stage ? "#16a34a" : "#e5e7eb",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: i <= stage ? "white" : "#9ca3af", fontSize: 12, fontWeight: 700
                    }}>{i < stage ? "✓" : i + 1}</div>
                    <span style={{ fontSize: 9, color: i <= stage ? "#16a34a" : "#9ca3af", marginTop: 4, textAlign: "center", maxWidth: 60 }}>{s}</span>
                  </div>
                  {i < STAGES.length - 1 && <div style={{ flex: 1, height: 2, background: i < stage ? "#16a34a" : "#e5e7eb", margin: "0 4px 18px" }} />}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {order.items.map(({ product, qty }) => (
                <span key={product.id} style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "4px 10px", fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
                  {product.image} {product.name} ×{qty}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AuthModal({ onLogin, onClose }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");

  const USERS = [{ email: "user@econest.com", password: "eco123", name: "Eco User", role: "customer" }];

  const handleSubmit = () => {
    setError("");
    if (mode === "login") {
      const found = USERS.find(u => u.email === form.email && u.password === form.password);
      if (found) { onLogin(found); onClose(); }
      else setError("Invalid email or password");
    } else {
      if (!form.name || !form.email || !form.password) { setError("Please fill all fields"); return; }
      onLogin({ email: form.email, name: form.name, role: "customer" });
      onClose();
    }
  };

  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, boxSizing: "border-box", marginTop: 6, outline: "none" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div style={{ background: "white", borderRadius: 24, width: "100%", maxWidth: 420, overflow: "hidden" }} onClick={e => e.stopPropagation()}>
        <div style={{ background: "linear-gradient(135deg, #f0fdf4, #f7fee7)", padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 40 }}>🌿</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#14532d", marginTop: 8 }}>EcoNest Living</h2>
          <div style={{ display: "flex", background: "white", borderRadius: 50, padding: 4, marginTop: 16, gap: 4 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: "8px 0", borderRadius: 50, border: "none",
                background: mode === m ? "#16a34a" : "transparent",
                color: mode === m ? "white" : "#6b7280", fontWeight: 700, cursor: "pointer", fontSize: 14
              }}>{m === "login" ? "Login" : "Register"}</button>
            ))}
          </div>
        </div>
        <div style={{ padding: 28 }}>
          {error && <div style={{ background: "#fef2f2", color: "#dc2626", borderRadius: 8, padding: "8px 12px", fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}
          {mode === "register" && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Full Name</label>
              <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} style={inputStyle} placeholder="Your full name" />
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} style={inputStyle} placeholder="you@email.com" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} style={inputStyle} placeholder="••••••••" />
          </div>
          {mode === "login" && <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>Demo: user@econest.com / eco123</p>}
          <button onClick={handleSubmit} style={{ width: "100%", background: "#16a34a", color: "white", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            {mode === "login" ? "Login to EcoNest →" : "Create Account →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SupplierDashboard({ user }) {
  const myProducts = PRODUCTS.filter(p => p.supplierId === 1);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "Beds", desc: "" });
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <div style={{ width: 52, height: 52, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏭</div>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: "#14532d" }}>Supplier Dashboard</h2>
          <p style={{ color: "#6b7280", fontSize: 14 }}>GreenWood Eco Suppliers Pvt Ltd • <span style={{ color: "#16a34a", fontWeight: 700 }}>✓ Verified</span></p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[["📦","Active Products", myProducts.length], ["📊","Total Stock", myProducts.reduce((s,p)=>s+p.stock,0)], ["⭐","Avg Eco Score", Math.round(myProducts.reduce((s,p)=>s+p.ecoScore,0)/myProducts.length)], ["✅","Certifications", "FSC, ISO"]].map(([icon, label, val]) => (
          <div key={label} style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #e5e7eb", textAlign: "center" }}>
            <div style={{ fontSize: 24 }}>{icon}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: "#14532d", margin: "6px 0" }}>{val}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28 }}>
        {/* Products list */}
        <div>
          <h3 style={{ fontWeight: 700, color: "#1f2937", marginBottom: 16 }}>My Products</h3>
          {myProducts.map(p => (
            <div key={p.id} style={{ background: "white", borderRadius: 16, padding: 18, border: "1px solid #e5e7eb", marginBottom: 12, display: "flex", gap: 14, alignItems: "center" }}>
              <span style={{ fontSize: 28 }}>{p.image}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: "#1f2937", fontSize: 14 }}>{p.name}</p>
                <p style={{ fontSize: 12, color: "#9ca3af" }}>{p.category} • Stock: {p.stock}</p>
              </div>
              <EcoScoreBadge score={p.ecoScore} />
              <span style={{ fontWeight: 700, color: "#16a34a" }}>{formatPrice(p.price)}</span>
              <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100 }}>Active</span>
            </div>
          ))}
        </div>

        {/* Add new product */}
        <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1px solid #e5e7eb", height: "fit-content" }}>
          <h3 style={{ fontWeight: 700, color: "#1f2937", marginBottom: 20 }}>+ List New Product</h3>
          {submitted ? (
            <div style={{ textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: 40 }}>⏳</div>
              <p style={{ fontWeight: 600, color: "#16a34a", marginTop: 12 }}>Submitted for Admin Review</p>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>Your product will be listed after sustainability verification.</p>
              <button onClick={() => setSubmitted(false)} style={{ marginTop: 16, background: "transparent", border: "1px solid #16a34a", color: "#16a34a", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>List Another</button>
            </div>
          ) : (
            <>
              {[["Product Name","name"],["Price (₹)","price"],["Description","desc"]].map(([label, key]) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</label>
                  {key === "desc"
                    ? <textarea value={newProduct[key]} onChange={e => setNewProduct(f=>({...f,[key]:e.target.value}))} rows={3} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 13, boxSizing: "border-box", resize: "none", marginTop: 6, outline: "none" }} />
                    : <input value={newProduct[key]} onChange={e => setNewProduct(f=>({...f,[key]:e.target.value}))} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 13, boxSizing: "border-box", marginTop: 6, outline: "none" }} />
                  }
                </div>
              ))}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Category</label>
                <select value={newProduct.category} onChange={e => setNewProduct(f=>({...f,category:e.target.value}))} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 13, marginTop: 6 }}>
                  {CATEGORIES.filter(c=>c!=="All").map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: 10, padding: 10, marginBottom: 16, fontSize: 12, color: "#92400e" }}>
                ⚠️ Product will be reviewed by Admin before listing. Eco certifications required.
              </div>
              <button onClick={() => setSubmitted(true)} style={{ width: "100%", background: "#16a34a", color: "white", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Submit for Review →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const pendingProducts = [
    { name: "BambooLight Lamp", supplier: "EcoSupply Co.", category: "Lighting", status: "pending" },
    { name: "RecycleRug Set", supplier: "GreenHome Ltd.", category: "Decor", status: "pending" },
  ];
  const pendingSuppliers = [
    { name: "NatureWood Pvt Ltd", email: "info@naturewood.com", certs: "FSC, ISO14001", status: "pending" },
  ];

  const stats = [
    ["👥", "Total Users", "1,284"],
    ["🏭", "Verified Suppliers", "24"],
    ["📦", "Total Orders", "4,891"],
    ["💰", "Monthly Revenue", "₹38.4L"],
    ["🌿", "Avg Eco Score", "87.3"],
    ["⚠️", "Pending Reviews", "3"],
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <div style={{ width: 52, height: 52, background: "#dbeafe", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🛡️</div>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: "#1e3a5f" }}>Admin Control Panel</h2>
          <p style={{ color: "#6b7280", fontSize: 14 }}>EcoNest Living — System Administration</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e5e7eb", marginBottom: 28 }}>
        {["overview","suppliers","products","orders"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "10px 20px", border: "none", background: "transparent",
            borderBottom: tab === t ? "3px solid #16a34a" : "3px solid transparent",
            color: tab === t ? "#16a34a" : "#6b7280", fontWeight: 700, cursor: "pointer",
            fontSize: 14, textTransform: "capitalize", marginBottom: -2
          }}>{t}</button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
            {stats.map(([icon, label, val]) => (
              <div key={label} style={{ background: "white", borderRadius: 16, padding: 22, border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 24 }}>{icon}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: "#1f2937", margin: "6px 0" }}>{val}</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontWeight: 700, color: "#1f2937", marginBottom: 16 }}>Recent Activity</h3>
            {["Order ECN-291847 placed — ZenSofa Convertible × 1", "New supplier NatureWood Pvt Ltd registered — Pending verification", "EcoWard Modular restocked (10 units) by Supplier #3", "Admin approved RecycloDesk Pro listing — Eco Score: 88"].map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", marginTop: 6, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: "#374151" }}>{a}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "suppliers" && (
        <div>
          <h3 style={{ fontWeight: 700, color: "#1f2937", marginBottom: 16 }}>Pending Supplier Verification</h3>
          {pendingSuppliers.map((s, i) => (
            <div key={i} style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #e5e7eb", marginBottom: 12, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏭</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: "#1f2937" }}>{s.name}</p>
                <p style={{ fontSize: 13, color: "#6b7280" }}>{s.email} • Certs: {s.certs}</p>
              </div>
              <span style={{ background: "#fefce8", color: "#92400e", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100 }}>Pending</span>
              <button style={{ background: "#dcfce7", color: "#16a34a", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>✓ Approve</button>
              <button style={{ background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>✕ Reject</button>
            </div>
          ))}
          <h3 style={{ fontWeight: 700, color: "#1f2937", margin: "24px 0 16px" }}>All Products</h3>
          {PRODUCTS.map(p => (
            <div key={p.id} style={{ background: "white", borderRadius: 14, padding: 16, border: "1px solid #e5e7eb", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 22 }}>{p.image}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: "#1f2937" }}>{p.name}</p>
                <p style={{ fontSize: 12, color: "#9ca3af" }}>{p.category} • Eco: {p.ecoScore}</p>
              </div>
              <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>Approved</span>
            </div>
          ))}
        </div>
      )}

      {tab === "products" && (
        <div>
          <h3 style={{ fontWeight: 700, color: "#1f2937", marginBottom: 16 }}>Products Pending Review</h3>
          {pendingProducts.map((p, i) => (
            <div key={i} style={{ background: "white", borderRadius: 16, padding: 20, border: "2px solid #fde68a", marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 28 }}>📋</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: "#1f2937" }}>{p.name}</p>
                <p style={{ fontSize: 13, color: "#6b7280" }}>{p.supplier} • {p.category}</p>
              </div>
              <button style={{ background: "#dcfce7", color: "#16a34a", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, cursor: "pointer", fontSize: 13, marginRight: 8 }}>✓ Approve & Calculate Eco Score</button>
              <button style={{ background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>✕ Reject</button>
            </div>
          ))}
        </div>
      )}

      {tab === "orders" && (
        <div>
          <h3 style={{ fontWeight: 700, color: "#1f2937", marginBottom: 16 }}>Order Management</h3>
          {[
            { id: "ECN-291847", customer: "Rahul Sharma", items: "ZenSofa ×1", amount: "₹23,749", status: "Dispatched", date: "16 Feb 2026" },
            { id: "ECN-291843", customer: "Priya Singh", items: "RecycloDesk ×1, NestNook ×2", amount: "₹22,497", status: "Processing", date: "16 Feb 2026" },
            { id: "ECN-291840", customer: "Aditya Kumar", items: "FoldDine Table ×1", amount: "₹6,924", status: "Delivered", date: "14 Feb 2026" },
          ].map(o => (
            <div key={o.id} style={{ background: "white", borderRadius: 14, padding: 18, border: "1px solid #e5e7eb", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontFamily: "monospace", color: "#16a34a", fontSize: 14 }}>{o.id}</p>
                <p style={{ fontSize: 13, color: "#6b7280" }}>{o.customer} • {o.items}</p>
                <p style={{ fontSize: 12, color: "#9ca3af" }}>{o.date}</p>
              </div>
              <span style={{ fontWeight: 800, color: "#14532d" }}>{o.amount}</span>
              <span style={{
                background: o.status === "Delivered" ? "#dcfce7" : o.status === "Dispatched" ? "#dbeafe" : "#fefce8",
                color: o.status === "Delivered" ? "#16a34a" : o.status === "Dispatched" ? "#2563eb" : "#92400e",
                fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100
              }}>{o.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: "#14532d", color: "white", padding: "60px 32px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, marginBottom: 12 }}>🌿 EcoNest Living</div>
            <p style={{ color: "#86efac", fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>Compact, eco-friendly home furniture for modern urban lifestyles. D2C platform connecting eco-certified suppliers directly to you.</p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {["📘", "📸", "📌"].map((icon, i) => (
                <div key={i} style={{ width: 36, height: 36, background: "rgba(255,255,255,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>{icon}</div>
              ))}
            </div>
          </div>
          {[
            ["Quick Links", [["Shop",()=>setPage("shop")],["Track Order",()=>setPage("orders")],["Sustainability",()=>{}],["About",()=>{}]]],
            ["Categories", [["Beds",()=>{}],["Sofas",()=>{}],["Desks",()=>{}],["Storage",()=>{}]]],
            ["Contact", [["📧 hello@econest.in"],["📞 1800-ECO-NEST"],["📍 Mumbai, India"],["⏰ Mon–Sat 9AM–6PM"]]],
          ].map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "#86efac" }}>{title}</h4>
              {links.map(([label, fn], i) => (
                <p key={i} onClick={fn} style={{ fontSize: 14, color: "#d1fae5", marginBottom: 8, cursor: fn ? "pointer" : "default" }}>{label}</p>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 13, color: "#86efac" }}>© 2026 EcoNest Living. Built sustainably for a greener world.</p>
          <div style={{ display: "flex", gap: 12 }}>
            {["FSC®", "GreenGuard", "ISO14001"].map(cert => (
              <span key={cert} style={{ background: "rgba(255,255,255,0.1)", color: "#d1fae5", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100 }}>{cert}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAuth, setShowAuth] = useState(false);
  const [toast, setToast] = useState(null);
  const [userRole, setUserRole] = useState("customer"); // customer | supplier | admin

  const showToast = (msg) => { setToast(msg); };

  const addToCart = (product) => {
    if (!user) { setShowAuth(true); return; }
    setCart(c => {
      const ex = c.find(i => i.product.id === product.id);
      if (ex) return c.map(i => i.product.id === product.id ? {...i, qty: i.qty+1} : i);
      return [...c, { product, qty: 1 }];
    });
    showToast(`${product.name} added to cart!`);
  };

  const updateCart = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(c => c.map(i => i.product.id === id ? {...i, qty} : i));
  };

  const removeFromCart = (id) => setCart(c => c.filter(i => i.product.id !== id));

  const placeOrder = (orderData) => {
    const order = { ...orderData, orderId: `ECN-${Date.now().toString().slice(-6)}`, timestamp: Date.now() };
    setOrders(o => [...o, order]);
    setCart([]);
    setPage("order-success");
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const navLinks = [
    { label: "Home", page: "home" },
    { label: "Shop", page: "shop" },
    { label: "Track Order", page: "orders" },
    ...(user && userRole === "supplier" ? [{ label: "Supplier", page: "supplier" }] : []),
    ...(user && userRole === "admin" ? [{ label: "Admin", page: "admin" }] : []),
  ];

  return (
    <div style={{ fontFamily: "'Lato', 'Helvetica Neue', sans-serif", background: "#fafafa", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lato:wght@400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #16a34a; border-radius: 3px; }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e5e7eb", padding: "0 32px"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 64 }}>
          <div onClick={() => setPage("home")} style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: "#14532d", cursor: "pointer", marginRight: 40, display: "flex", alignItems: "center", gap: 6 }}>
            🌿 EcoNest Living
          </div>
          <div style={{ display: "flex", gap: 2, flex: 1 }}>
            {navLinks.map(l => (
              <button key={l.page} onClick={() => setPage(l.page)} style={{
                padding: "8px 16px", border: "none", background: "transparent",
                color: page === l.page ? "#16a34a" : "#374151",
                fontWeight: page === l.page ? 700 : 600, cursor: "pointer", fontSize: 14,
                borderRadius: 8, background: page === l.page ? "#f0fdf4" : "transparent"
              }}>{l.label}</button>
            ))}
          </div>

          {/* Role Switcher (Demo) */}
          <div style={{ display: "flex", gap: 6, marginRight: 16, background: "#f8fafc", borderRadius: 20, padding: 3 }}>
            {["customer","supplier","admin"].map(r => (
              <button key={r} onClick={() => { setUserRole(r); if(r !== "customer") setPage(r); else setPage("home"); }} style={{
                padding: "4px 12px", border: "none", borderRadius: 20, fontSize: 11, fontWeight: 700,
                background: userRole === r ? "#16a34a" : "transparent", color: userRole === r ? "white" : "#9ca3af", cursor: "pointer", textTransform: "capitalize"
              }}>{r}</button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={() => { setPage("cart"); }} style={{
              position: "relative", background: "transparent", border: "none", cursor: "pointer", padding: "6px 10px"
            }}>
              <span style={{ fontSize: 20 }}>🛒</span>
              {cartCount > 0 && <span style={{ position: "absolute", top: 0, right: 0, background: "#16a34a", color: "white", width: 18, height: 18, borderRadius: "50%", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
            </button>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 34, height: 34, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#16a34a", fontSize: 14 }}>{user.name?.[0]}</div>
                <button onClick={() => setUser(null)} style={{ fontSize: 12, color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>Logout</button>
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)} style={{ background: "#16a34a", color: "white", border: "none", borderRadius: 20, padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Login</button>
            )}
          </div>
        </div>
      </nav>

      {/* Pages */}
      {page === "home" && <>
        <HeroSection onShop={() => setPage("shop")} />
        <SustainabilitySection />
        <div style={{ padding: "60px 32px", background: "white" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 800, color: "#14532d", marginBottom: 8 }}>Featured Products</h2>
            <p style={{ color: "#6b7280", marginBottom: 32 }}>Handpicked, eco-verified furniture for your space</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
              {PRODUCTS.slice(0,4).map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} onView={() => setPage("shop")} />)}
            </div>
            <div style={{ textAlign: "center", marginTop: 36 }}>
              <button onClick={() => setPage("shop")} style={{ background: "#16a34a", color: "white", border: "none", borderRadius: 50, padding: "14px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>View Full Collection →</button>
            </div>
          </div>
        </div>
      </>}

      {page === "shop" && <ProductCatalog onAddToCart={addToCart} user={user} />}
      {page === "cart" && <CartPage cart={cart} onUpdate={updateCart} onRemove={removeFromCart} user={user} onCheckout={() => setPage("checkout")} />}
      {page === "checkout" && <CheckoutPage cart={cart} user={user} onPlaceOrder={placeOrder} />}
      {page === "order-success" && <OrderSuccess order={orders[orders.length-1]} onContinue={() => setPage("shop")} />}
      {page === "orders" && <OrderTracker orders={orders} />}
      {page === "supplier" && <SupplierDashboard user={user} />}
      {page === "admin" && <AdminDashboard />}

      <Footer setPage={setPage} />

      {showAuth && <AuthModal onLogin={setUser} onClose={() => setShowAuth(false)} />}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
