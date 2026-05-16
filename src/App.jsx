import { useState, useEffect, useCallback } from “react”;

// ─── TRIP DATA (read-only, same for everyone) ─────────────────────────────────
const TRIP_LEGS = [
{ id: “l1”, date: “2026-08-03”, from: “Waterloo”, to: “Ottawa”, distanceKm: 490, type: “driving”, notes: “Head east on Hwy 401 then north. Start of the adventure!”,
hotels: [
{ name: “Lord Elgin Hotel”, stars: 4, priceCAD: 220, highlight: “Historic landmark steps from Parliament Hill”, url: “https://www.booking.com/search.html?ss=Lord+Elgin+Hotel+Ottawa” },
{ name: “Novotel Ottawa”, stars: 4, priceCAD: 195, highlight: “Family suites, indoor pool, central location”, url: “https://www.booking.com/search.html?ss=Novotel+Ottawa” },
{ name: “Hampton Inn Ottawa”, stars: 3, priceCAD: 155, highlight: “Free breakfast, spacious rooms, great value”, url: “https://www.booking.com/search.html?ss=Hampton+Inn+Ottawa” },
],
eats: [
{ name: “ByWard Market”, type: “Market / Street Food”, price: 20, note: “Famous beaver tails & local vendors” },
{ name: “Zak’s Diner”, type: “All-day Diner”, price: 55, note: “Classic 1950s diner, great burgers” },
{ name: “The Elgin Street Diner”, type: “Comfort Food”, price: 50, note: “Local favourite, huge portions, 24/7” },
],
events: [
{ name: “Parliament Hill”, cost: “Free”, note: “Changing of the guard at 10am in summer” },
{ name: “Canadian Museum of History”, cost: “$20/adult $10/child”, note: “Stunning building, great kids section” },
{ name: “Rideau Canal”, cost: “Free”, note: “Scenic walk or boat cruise along the UNESCO canal” },
{ name: “Canadian Museum of Nature”, cost: “$17/adult $12/child”, note: “Dinosaurs and minerals — kids adore it” },
]
},
{ id: “l2”, date: “2026-08-04”, from: “Ottawa”, to: “Quebec City”, distanceKm: 450, type: “driving”, notes: “Follow Hwy 417 east then Hwy 20 into Old Quebec.”,
hotels: [
{ name: “Fairmont Le Chateau Frontenac”, stars: 5, priceCAD: 480, highlight: “Most famous hotel in Canada — castle on a cliff”, url: “https://www.booking.com/search.html?ss=Chateau+Frontenac+Quebec+City” },
{ name: “Hotel PUR Quebec”, stars: 4, priceCAD: 210, highlight: “Modern design, rooftop pool, close to Old Town”, url: “https://www.booking.com/search.html?ss=Hotel+PUR+Quebec+City” },
{ name: “Auberge Saint-Antoine”, stars: 4, priceCAD: 295, highlight: “Boutique luxury in the heart of Old Quebec”, url: “https://www.booking.com/search.html?ss=Auberge+Saint+Antoine+Quebec” },
],
eats: [
{ name: “Le Chic Shack”, type: “Burgers & Poutine”, price: 60, note: “Best poutine in Quebec City, family-friendly” },
{ name: “Casse-Crepe Breton”, type: “Creperie”, price: 45, note: “Charming creperie in Old Town, kids love it” },
{ name: “Buffet de l’Antiquaire”, type: “Quebecois cuisine”, price: 65, note: “Classic local dishes, hearty portions” },
],
events: [
{ name: “Fortifications of Quebec”, cost: “Free”, note: “Walk the old city walls with spectacular views” },
{ name: “Plains of Abraham”, cost: “Free”, note: “Historic battlefield park, great for kids” },
{ name: “Montmorency Falls”, cost: “$12/adult Free/child”, note: “Higher than Niagara! 10 min from Old Town” },
{ name: “Old Quebec Walking Tour”, cost: “$25/person”, note: “Cobblestone streets, horse-drawn carriages” },
]
},
{ id: “l3”, date: “2026-08-05”, from: “Quebec City”, to: “Quebec City”, distanceKm: 0, type: “rest”, notes: “Full day to explore Quebec City.”,
hotels: [],
eats: [
{ name: “Paillard”, type: “Bakery & Cafe”, price: 40, note: “Stunning pastries & sandwiches” },
{ name: “Le Lapin Saute”, type: “Quebecois Bistro”, price: 80, note: “Rabbit dishes & local specialties in Old Town” },
],
events: [
{ name: “Aquarium du Quebec”, cost: “$25/adult $15/child”, note: “Walruses & polar bears — brilliant for kids” },
{ name: “Village Vacances Valcartier”, cost: “$45/person”, note: “Massive water park 20 min from Old Town” },
{ name: “Ile d’Orleans Day Trip”, cost: “Free (toll bridge)”, note: “Scenic island with farms, wineries & views” },
]
},
{ id: “l4”, date: “2026-08-06”, from: “Quebec City”, to: “Tadoussac”, distanceKm: 215, type: “driving”, notes: “Scenic drive along the St. Lawrence north shore. Free ferry at Baie-Sainte-Catherine.”,
hotels: [
{ name: “Hotel Tadoussac”, stars: 3, priceCAD: 175, highlight: “Iconic red-roofed hotel overlooking the fjord”, url: “https://www.booking.com/search.html?ss=Hotel+Tadoussac” },
{ name: “Auberge La Maison Hovington”, stars: 3, priceCAD: 140, highlight: “Cozy family inn near the whale watching boats”, url: “https://www.booking.com/search.html?ss=Auberge+Hovington+Tadoussac” },
],
eats: [
{ name: “Cafe Boheme”, type: “Cafe & Light meals”, price: 40, note: “Charming local cafe in the village” },
{ name: “La Galouine”, type: “Seafood”, price: 70, note: “Fresh St. Lawrence seafood with fjord views” },
],
events: [
{ name: “Whale Watching Cruise”, cost: “$65/adult $35/child”, note: “Blue whales & belugas — unmissable! Book ahead” },
{ name: “Saguenay Fjord Kayak”, cost: “$55/person”, note: “Paddle the dramatic fjord, guided tours available” },
{ name: “Parc National du Fjord”, cost: “$9/adult Free/child”, note: “Stunning hiking trails above the fjord” },
]
},
{ id: “l5”, date: “2026-08-07”, from: “Tadoussac”, to: “Club Med Charlevoix”, distanceKm: 120, type: “driving”, notes: “Short scenic drive south to Club Med. Check in and settle in for the week!”,
hotels: [{ name: “Club Med Charlevoix”, stars: 4, priceCAD: 350, highlight: “All-inclusive — meals, activities & kids clubs all included!”, url: “https://www.clubmed.ca/r/charlevoix/y” }],
eats: [{ name: “Club Med dining (included)”, type: “All-inclusive”, price: 0, note: “All meals, snacks & drinks included in Club Med” }],
events: [
{ name: “Club Med Activities (included)”, cost: “Included”, note: “Kids club, shows, sports — all in” },
{ name: “Baie-Saint-Paul Village”, cost: “Free”, note: “Charming artists village 10 min away” },
]
},
{ id: “l6”, date: “2026-08-08”, from: “Club Med”, to: “Club Med”, distanceKm: 0, type: “rest”, notes: “Day 2 at Club Med.”, hotels: [], eats: [], events: [{ name: “Resort Activities”, cost: “Included”, note: “Full day of Club Med fun” }] },
{ id: “l7”, date: “2026-08-09”, from: “Club Med”, to: “Club Med”, distanceKm: 0, type: “rest”, notes: “Day 3 at Club Med.”, hotels: [], eats: [], events: [{ name: “Explore Charlevoix”, cost: “Varies”, note: “Day trip to Baie-Saint-Paul or Les Eboulements” }] },
{ id: “l8”, date: “2026-08-10”, from: “Club Med”, to: “Club Med”, distanceKm: 0, type: “rest”, notes: “Day 4 at Club Med.”, hotels: [], eats: [], events: [{ name: “Spa & Relax”, cost: “Incl/extra”, note: “Spa day while kids are in club” }] },
{ id: “l9”, date: “2026-08-11”, from: “Club Med”, to: “Club Med”, distanceKm: 0, type: “rest”, notes: “Day 5 at Club Med.”, hotels: [], eats: [], events: [{ name: “Whale watching from shore”, cost: “Free”, note: “Sometimes visible from Cap-de-la-Madeleine lookout” }] },
{ id: “l10”, date: “2026-08-12”, from: “Club Med”, to: “Club Med”, distanceKm: 0, type: “rest”, notes: “Day 6 — last full day, savour it!”, hotels: [], eats: [], events: [{ name: “Last Resort Day”, cost: “Included”, note: “Make the most of the final day at Club Med” }] },
{ id: “l11”, date: “2026-08-13”, from: “Club Med Charlevoix”, to: “Mont-Tremblant”, distanceKm: 370, type: “driving”, notes: “Drive south-west via Hwy 138 & 40. Stunning Quebec countryside.”,
hotels: [
{ name: “Fairmont Tremblant”, stars: 5, priceCAD: 420, highlight: “Ski village resort with pools, spa & mountain views”, url: “https://www.booking.com/search.html?ss=Fairmont+Tremblant” },
{ name: “Hotel Mont Tremblant”, stars: 3, priceCAD: 180, highlight: “Great value, close to the pedestrian village”, url: “https://www.booking.com/search.html?ss=Hotel+Mont+Tremblant” },
{ name: “Le Westin Resort Tremblant”, stars: 4, priceCAD: 310, highlight: “Family suites, outdoor heated pool”, url: “https://www.booking.com/search.html?ss=Westin+Tremblant” },
],
eats: [
{ name: “Creperie Catherine”, type: “Creperie”, price: 50, note: “Cozy creperie in the pedestrian village” },
{ name: “Forge Bar & Grill”, type: “Grill / Pub”, price: 75, note: “Great burgers and local beers in the village” },
{ name: “La Savoie”, type: “Fondue”, price: 90, note: “Fun fondue — kids love it” },
],
events: [
{ name: “Luge at Tremblant”, cost: “$25/person”, note: “Summer luge run on the mountain” },
{ name: “Aquaclub La Source”, cost: “$35/person”, note: “Water park at the resort base” },
{ name: “Tremblant Village”, cost: “Free”, note: “Shops, restaurants & street performers” },
{ name: “Mountain Gondola”, cost: “$22/adult $14/child”, note: “Panoramic Laurentian views” },
]
},
{ id: “l12”, date: “2026-08-14”, from: “Mont-Tremblant”, to: “Kingston”, distanceKm: 430, type: “driving”, notes: “Drive west via Hwy 50 & 417 then south on Hwy 15 to Kingston.”,
hotels: [
{ name: “Holiday Inn Kingston”, stars: 3, priceCAD: 150, highlight: “Indoor pool, family rooms, easy highway access”, url: “https://www.booking.com/search.html?ss=Holiday+Inn+Kingston+Ontario” },
{ name: “Four Points Sheraton Kingston”, stars: 3, priceCAD: 165, highlight: “Downtown, walking distance to waterfront”, url: “https://www.booking.com/search.html?ss=Four+Points+Sheraton+Kingston” },
{ name: “Delta Hotels Kingston Waterfront”, stars: 4, priceCAD: 240, highlight: “On the waterfront, stunning views”, url: “https://www.booking.com/search.html?ss=Delta+Hotels+Kingston+Waterfront” },
],
eats: [
{ name: “Pan Chancho Bakery”, type: “Bakery”, price: 45, note: “Iconic Kingston bakery, fresh pastries” },
{ name: “The Pilot House”, type: “Pub & Grill”, price: 65, note: “Waterfront patio, great fish and chips” },
{ name: “Chez Piggy”, type: “Eclectic / Local”, price: 80, note: “Kingston institution in a historic courtyard” },
],
events: [
{ name: “Fort Henry National Historic Site”, cost: “$22/adult $12/child”, note: “Redcoats, cannon demos — kids go crazy for it” },
{ name: “1000 Islands Cruise”, cost: “$30/adult $18/child”, note: “Beautiful boat cruise through the islands” },
{ name: “Pump House Steam Museum”, cost: “$8/adult $5/child”, note: “Fascinating Victorian steam engines” },
]
},
{ id: “l13”, date: “2026-08-15”, from: “Kingston”, to: “Waterloo”, distanceKm: 310, type: “driving”, notes: “Final leg home! Hwy 401 west to Hwy 8. You made it!”,
hotels: [],
eats: [{ name: “Stop anywhere on the 401”, type: “Your choice”, price: 50, note: “Celebrate the last drive home!” }],
events: [{ name: “Home sweet home!”, cost: “Free”, note: “Unpack, relax, and relive the memories” }]
},
];

const TYPE_CFG = { driving: { color: “#3b82f6”, label: “Driving” }, rest: { color: “#8b5cf6”, label: “Stay / Rest” } };
const SECTIONS = [“Home”, “Schedule”, “Hotels”, “Eats”, “Events”, “Packing”, “Expenses”, “Info”];
const ICONS = { Home: “🏠”, Schedule: “📅”, Hotels: “🏨”, Eats: “🍽️”, Events: “🎉”, Packing: “🧳”, Expenses: “💰”, Info: “📋” };

const DEFAULT_PACKING = {
1: [“T-shirts (x5)”, “Shorts”, “Jeans”, “Underwear”, “Socks”, “Pajamas”, “Swimsuits”, “Light jacket”, “Rain jacket”, “Shoes”, “Sandals”],
2: [“Shampoo”, “Conditioner”, “Body wash”, “Toothbrushes”, “Toothpaste”, “Deodorant”, “Sunscreen SPF50+”, “First aid kit”, “Hand sanitizer”, “Insect repellent”],
3: [“Car seat/booster”, “Kids snacks”, “Activity books”, “Crayons & markers”, “Tablet & headphones”, “Stuffed animal”, “Change of clothes x2”, “Kids sunscreen”, “Baby wipes”],
4: [“Car phone mount”, “Phone charger cables”, “Power bank”, “Jumper cables”, “Roadside kit”, “Car trash bags”, “Paper towels”, “Blanket”],
5: [“Phone chargers”, “iPad/tablet”, “Camera”, “Earbuds”, “Portable speaker”, “Memory cards”],
};

const SHARED_KEY = “roadtrip2026-shared-v1”;
const SHARED_DEFAULTS = {
kpl: “11”, gasPrice: “1.75”, hotelNight: “200”, foodDay: “120”, actDay: “80”, clubMed: “5000”,
expenses: [],
packing: [
{ id: 1, name: “Clothing”, items: [] }, { id: 2, name: “Toiletries”, items: [] },
{ id: 3, name: “Kids”, items: [] }, { id: 4, name: “Car Essentials”, items: [] },
{ id: 5, name: “Electronics”, items: [] },
],
infoItems: [],
notes: [],
lastUpdated: null,
lastUpdatedBy: null,
};

function uuid() { return Math.random().toString(36).slice(2, 9); }
function fmtDate(d) { if (!d) return “”; return new Date(d + “T12:00:00”).toLocaleDateString(“en-CA”, { weekday: “short”, month: “short”, day: “numeric” }); }
function catColor(c) { return ({ Gas: “#f59e0b”, Food: “#10b981”, Hotels: “#6366f1”, “Club Med”: “#ec4899”, Activities: “#ec4899”, Shopping: “#8b5cf6”, Other: “#64748b” })[c] || “#64748b”; }
function timeAgo(ts) {
if (!ts) return “never”;
const s = Math.floor((Date.now() - ts) / 1000);
if (s < 60) return “just now”;
if (s < 3600) return Math.floor(s / 60) + “m ago”;
if (s < 86400) return Math.floor(s / 3600) + “h ago”;
return Math.floor(s / 86400) + “d ago”;
}

export default function App() {
const [shared, setShared] = useState(null);
const [tab, setTab] = useState(“Home”);
const [syncing, setSyncing] = useState(false);
const [syncStatus, setSyncStatus] = useState(“loading”);
const [userName, setUserName] = useState(””);
const [nameSet, setNameSet] = useState(false);
const [lastSyncTime, setLastSyncTime] = useState(null);

// ── Load from shared storage ──────────────────────────────────────────────
const loadFromStorage = useCallback(async () => {
try {
const result = await window.storage.get(SHARED_KEY, true);
if (result && result.value) {
const parsed = JSON.parse(result.value);
setShared(parsed);
setSyncStatus(“synced”);
setLastSyncTime(Date.now());
} else {
// First time: seed defaults with packing items
const seeded = {
…SHARED_DEFAULTS,
packing: SHARED_DEFAULTS.packing.map(c => ({
…c, items: (DEFAULT_PACKING[c.id] || []).map(n => ({ id: uuid(), name: n, checked: false }))
}))
};
await window.storage.set(SHARED_KEY, JSON.stringify(seeded), true);
setShared(seeded);
setSyncStatus(“synced”);
setLastSyncTime(Date.now());
}
} catch (e) {
setSyncStatus(“error”);
}
}, []);

// ── Save to shared storage ────────────────────────────────────────────────
const saveToStorage = useCallback(async (newState) => {
setSyncing(true);
setSyncStatus(“saving”);
try {
const toSave = { …newState, lastUpdated: Date.now(), lastUpdatedBy: userName || “Traveller” };
await window.storage.set(SHARED_KEY, JSON.stringify(toSave), true);
setShared(toSave);
setSyncStatus(“synced”);
setLastSyncTime(Date.now());
} catch (e) {
setSyncStatus(“error”);
}
setSyncing(false);
}, [userName]);

// ── Update a field and sync ───────────────────────────────────────────────
const upd = useCallback((key, val) => {
setShared(prev => {
const next = { …prev, [key]: typeof val === “function” ? val(prev[key]) : val };
saveToStorage(next);
return next;
});
}, [saveToStorage]);

// ── Poll for remote changes every 15s ────────────────────────────────────
useEffect(() => {
loadFromStorage();
const interval = setInterval(async () => {
try {
const result = await window.storage.get(SHARED_KEY, true);
if (result && result.value) {
const parsed = JSON.parse(result.value);
if (parsed.lastUpdated && parsed.lastUpdated !== shared?.lastUpdated) {
setShared(parsed);
setSyncStatus(“synced”);
setLastSyncTime(Date.now());
}
}
} catch (e) {}
}, 15000);
return () => clearInterval(interval);
}, [shared?.lastUpdated]);

// ── Name gate ─────────────────────────────────────────────────────────────
if (!nameSet) {
return (
<div style={{ background: “#020817”, minHeight: “100vh”, display: “flex”, alignItems: “center”, justifyContent: “center” }}>
<div style={{ background: “#1e293b”, borderRadius: 20, padding: 28, width: “100%”, maxWidth: 360, border: “1px solid #334155”, textAlign: “center”, fontFamily: “Georgia, serif” }}>
<div style={{ fontSize: 48, marginBottom: 12 }}>🚗</div>
<h2 style={{ color: “#f8fafc”, fontSize: 20, margin: “0 0 6px” }}>Ontario & Quebec 2026</h2>
<p style={{ color: “#64748b”, fontSize: 13, margin: “0 0 20px” }}>Enter your name so collaborators know who made changes</p>
<input
style={{ width: “100%”, background: “#0f172a”, border: “1px solid #3b82f6”, borderRadius: 10, padding: “11px 13px”, color: “#f8fafc”, fontSize: 15, boxSizing: “border-box”, outline: “none”, fontFamily: “inherit”, marginBottom: 12, textAlign: “center” }}
placeholder=“Your name (e.g. Sarah)”
value={userName}
onChange={e => setUserName(e.target.value)}
onKeyDown={e => { if (e.key === “Enter” && userName.trim()) setNameSet(true); }}
autoFocus
/>
<button
style={{ width: “100%”, background: userName.trim() ? “#3b82f6” : “#334155”, color: “#fff”, border: “none”, borderRadius: 10, padding: “11px”, fontSize: 15, fontWeight: 700, cursor: “pointer”, fontFamily: “inherit” }}
onClick={() => { if (userName.trim()) setNameSet(true); }}
>Enter Trip Planner</button>
<p style={{ color: “#475569”, fontSize: 11, margin: “12px 0 0” }}>All changes sync instantly with collaborators</p>
</div>
</div>
);
}

// ── Loading ───────────────────────────────────────────────────────────────
if (!shared) {
return (
<div style={{ background: “#020817”, minHeight: “100vh”, display: “flex”, alignItems: “center”, justifyContent: “center”, fontFamily: “Georgia, serif” }}>
<div style={{ textAlign: “center” }}>
<div style={{ color: “#3b82f6”, fontSize: 40, marginBottom: 12 }}>🔄</div>
<p style={{ color: “#94a3b8”, fontSize: 14 }}>Loading shared trip data…</p>
</div>
</div>
);
}

// ── Derived budget values ─────────────────────────────────────────────────
const kpl = parseFloat(shared.kpl) || 11;
const gp = parseFloat(shared.gasPrice) || 1.75;
const hn = parseFloat(shared.hotelNight) || 200;
const fd = parseFloat(shared.foodDay) || 120;
const ad = parseFloat(shared.actDay) || 80;
const cm = parseFloat(shared.clubMed) || 5000;
const totalKm = TRIP_LEGS.reduce((a, l) => a + l.distanceKm, 0);
const gasCost = (totalKm / kpl) * gp;
const drivingLegs = TRIP_LEGS.filter(l => l.distanceKm > 0);
const hotelCost = 7 * hn;
const foodCost = (TRIP_LEGS.length - 6) * fd;
const actCost = TRIP_LEGS.length * ad;
const grandTotal = gasCost + hotelCost + foodCost + actCost + cm;
const legGas = (leg) => (leg.distanceKm / kpl) * gp;

// ── Styles ────────────────────────────────────────────────────────────────
const ph = { width: “100%”, maxWidth: 430, margin: “0 auto”, minHeight: “100vh”, background: “#0f172a”, display: “flex”, flexDirection: “column”, fontFamily: “Georgia, serif” };
const hdr = { background: “linear-gradient(135deg,#1e3a5f,#0f172a)”, padding: “44px 20px 12px”, borderBottom: “1px solid #1e3a5f” };
const cnt = { flex: 1, overflowY: “auto”, padding: “14px 14px 88px”, scrollbarWidth: “none” };
const nav = { position: “fixed”, bottom: 0, left: “50%”, transform: “translateX(-50%)”, width: “100%”, maxWidth: 430, background: “#0f172a”, borderTop: “1px solid #1e3a5f”, display: “flex”, zIndex: 100 };
const cd = { background: “#1e293b”, borderRadius: 14, padding: 14, marginBottom: 10, border: “1px solid #334155” };
const inp = { width: “100%”, background: “#0f172a”, border: “1px solid #334155”, borderRadius: 9, padding: “9px 11px”, color: “#f8fafc”, fontSize: 13, boxSizing: “border-box”, outline: “none”, fontFamily: “inherit” };
const bt = (c = “#3b82f6”) => ({ background: c, color: “#fff”, border: “none”, borderRadius: 9, padding: “9px 14px”, fontSize: 13, fontWeight: 700, cursor: “pointer”, width: “100%”, fontFamily: “inherit” });
const lb = { color: “#94a3b8”, fontSize: 10, marginBottom: 3, display: “block”, textTransform: “uppercase”, letterSpacing: 1 };
const tg = (c) => ({ background: c + “22”, color: c, border: “1px solid “ + c + “44”, borderRadius: 20, padding: “2px 8px”, fontSize: 10, fontWeight: 700 });

const MAP_W = 360, MAP_H = 200;
const minLon = -81.0, maxLon = -69.0, minLat = 43.0, maxLat = 49.0;
const mxf = (lon) => ((lon - minLon) / (maxLon - minLon)) * MAP_W;
const myf = (lat) => MAP_H - ((lat - minLat) / (maxLat - minLat)) * MAP_H;
const MAP_STOPS = [
{ name: “Waterloo”, lon: -80.52, lat: 43.47, lx: -8, ly: 0, anchor: “end” },
{ name: “Ottawa”, lon: -75.70, lat: 45.42, lx: 0, ly: -12, anchor: “middle” },
{ name: “Quebec City”, lon: -71.21, lat: 46.81, lx: 8, ly: -10, anchor: “start” },
{ name: “Tadoussac”, lon: -69.72, lat: 48.14, lx: 8, ly: 0, anchor: “start” },
{ name: “Club Med”, lon: -70.48, lat: 47.44, lx: -8, ly: 10, anchor: “end” },
{ name: “Tremblant”, lon: -74.58, lat: 46.12, lx: -8, ly: 10, anchor: “end” },
{ name: “Kingston”, lon: -76.49, lat: 44.23, lx: 8, ly: -10, anchor: “start” },
];
const spts = MAP_STOPS.map(s => ({ …s, x: mxf(s.lon), y: myf(s.lat) }));
const loop = […spts, spts[0]];
const poly = loop.map(p => p.x.toFixed(1) + “,” + p.y.toFixed(1)).join(” “);
const dotC = [”#10b981”,”#3b82f6”,”#3b82f6”,”#8b5cf6”,”#ec4899”,”#3b82f6”,”#3b82f6”];

// ── Sync status badge ─────────────────────────────────────────────────────
function SyncBadge() {
const cfg = {
synced: { color: “#10b981”, text: “Synced” },
saving: { color: “#f59e0b”, text: “Saving…” },
error:  { color: “#ef4444”, text: “Sync error” },
loading:{ color: “#64748b”, text: “Loading…” },
}[syncStatus] || { color: “#64748b”, text: “…” };
return (
<div style={{ display: “flex”, alignItems: “center”, gap: 5 }}>
<div style={{ width: 7, height: 7, borderRadius: “50%”, background: cfg.color }} />
<span style={{ color: cfg.color, fontSize: 10, fontWeight: 700 }}>{cfg.text}</span>
{shared.lastUpdatedBy && syncStatus === “synced” && (
<span style={{ color: “#475569”, fontSize: 10 }}>· {shared.lastUpdatedBy} {timeAgo(shared.lastUpdated)}</span>
)}
</div>
);
}

// ── Collab banner (shows when someone else updated) ───────────────────────
function CollabBanner() {
if (!shared.lastUpdatedBy || shared.lastUpdatedBy === userName) return null;
if (!lastSyncTime || Date.now() - lastSyncTime > 30000) return null;
return (
<div style={{ background: “#3b82f615”, border: “1px solid #3b82f630”, borderRadius: 9, padding: “8px 12px”, marginBottom: 10, display: “flex”, alignItems: “center”, gap: 8 }}>
<span style={{ fontSize: 14 }}>👥</span>
<span style={{ color: “#93c5fd”, fontSize: 12 }}><strong>{shared.lastUpdatedBy}</strong> just updated the trip plan</span>
</div>
);
}

// ── HOME ──────────────────────────────────────────────────────────────────
function HomeTab() {
const tripStart = new Date(“2026-08-03T00:00:00”);
const daysLeft = Math.ceil((tripStart - new Date()) / 86400000);
const months = Math.floor(Math.max(0, daysLeft) / 30);
const days = Math.max(0, daysLeft) % 30;
const started = daysLeft <= 0;

```
return (
  <div>
    <CollabBanner />
    <div style={{ background: "linear-gradient(135deg,#0d1f3c,#0c1528)", border: "1px solid #3b82f630", borderRadius: 14, padding: "20px 14px 16px", marginBottom: 10, textAlign: "center" }}>
      <p style={{ color: "#475569", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, margin: "0 0 4px" }}>Summer 2026 - Ontario and Quebec</p>
      <h2 style={{ color: "#f8fafc", fontSize: 18, margin: "0 0 16px", fontStyle: "italic" }}>The Great Road Trip</h2>
      {!started ? (
        <>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 10 }}>
            {[[months,"Months"],[days,"Days"]].map(([v,l]) => (
              <div key={l} style={{ background: "#0f172a", borderRadius: 12, padding: "12px 20px", border: "1px solid #3b82f640" }}>
                <div style={{ color: "#60a5fa", fontSize: 42, fontWeight: 900, lineHeight: 1 }}>{v}</div>
                <div style={{ color: "#475569", fontSize: 9, textTransform: "uppercase", letterSpacing: 1, marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#3b82f615", borderRadius: 9, padding: "6px 12px", display: "inline-block" }}>
            <span style={{ color: "#93c5fd", fontSize: 12, fontWeight: 700 }}>Departs August 3 2026 - {daysLeft} days away!</span>
          </div>
        </>
      ) : (
        <div style={{ background: "#10b98120", borderRadius: 12, padding: "12px 20px", border: "1px solid #10b98140" }}>
          <div style={{ color: "#34d399", fontSize: 42, fontWeight: 900 }}>Day {Math.min(13, Math.abs(daysLeft) + 1)}</div>
          <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>of 13 - You are on the road!</div>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 14 }}>
        {[["📅","13","days"],["📍","7","stops"],["🚗",totalKm.toLocaleString(),"km"],["👪","4","people"]].map(([ic,v,l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16 }}>{ic}</div>
            <div style={{ color: "#f8fafc", fontWeight: 900, fontSize: 14 }}>{v}</div>
            <div style={{ color: "#475569", fontSize: 9, textTransform: "uppercase" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>

    {/* SVG Route Map */}
    <div style={cd}>
      <p style={{ ...lb, marginBottom: 8 }}>Route Map</p>
      <div style={{ background: "#071020", borderRadius: 10, overflow: "hidden", border: "1px solid #1e3a5f" }}>
        <svg width="100%" viewBox="-20 -20 400 240" style={{ display: "block" }}>
          <rect x="-20" y="-20" width="400" height="240" fill="#071020" />
          {[0,1,2,3].map(i => <line key={i} x1="-20" y1={i*55} x2="380" y2={i*55} stroke="#1e3a5f" strokeWidth="0.5" opacity="0.5" />)}
          <polyline points={poly} fill="none" stroke="#1e3a5f" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={poly} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
          <polyline points={poly} fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="7 4" strokeLinecap="round" strokeLinejoin="round" />
          {loop.slice(0,-1).map((p,i) => { const n=loop[i+1]; const mx2=(p.x+n.x)/2, my2=(p.y+n.y)/2; const ang=Math.atan2(n.y-p.y,n.x-p.x)*180/Math.PI; return (<g key={i} transform={"translate("+mx2+","+my2+") rotate("+ang+")"}><polygon points="-4,-3 4,0 -4,3" fill="#60a5fa" opacity="0.8" /></g>); })}
          {spts.map((p,i) => (<g key={i}><circle cx={p.x} cy={p.y} r="12" fill={dotC[i]} opacity="0.15" /><circle cx={p.x} cy={p.y} r="7" fill={dotC[i]} stroke="#071020" strokeWidth="2" /><text x={p.x} y={p.y+0.5} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8" fontWeight="bold">{i+1}</text><text x={p.x+p.lx} y={p.y+p.ly} textAnchor={p.anchor} fill={i===4?"#f9a8d4":"#93c5fd"} fontSize="9" fontWeight="700">{p.name}</text></g>))}
          <text x={spts[0].x-3} y={spts[0].y+17} textAnchor="end" fill="#10b981" fontSize="7.5" opacity="0.8">return home</text>
        </svg>
      </div>
      <p style={{ ...lb, margin: "10px 0 8px" }}>Driving Legs</p>
      {drivingLegs.map((leg,i) => (
        <div key={leg.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: dotC[Math.min(i,dotC.length-1)], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 9, flexShrink: 0 }}>{i+1}</div>
          <div style={{ flex: 1, background: "#0f172a", borderRadius: 9, padding: "7px 11px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#f8fafc", fontWeight: 700, fontSize: 12 }}>{leg.from} to {leg.to}</span>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <span style={{ color: "#60a5fa", fontSize: 10 }}>{leg.distanceKm} km</span>
                <a href={"https://www.google.com/maps/dir/"+encodeURIComponent(leg.from+", Canada")+"/"+encodeURIComponent(leg.to+", Canada")} target="_blank" rel="noreferrer" style={{ background: "#1e3a5f", color: "#93c5fd", borderRadius: 5, padding: "2px 7px", fontSize: 9, fontWeight: 700, textDecoration: "none" }}>Map</a>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
              <span style={{ color: "#64748b", fontSize: 9 }}>{fmtDate(leg.date)}</span>
              <span style={{ color: "#f59e0b", fontSize: 9 }}>Est. gas ${legGas(leg).toFixed(0)} CAD</span>
            </div>
          </div>
        </div>
      ))}
      <div style={{ background: "#0f172a", borderRadius: 9, padding: "9px 11px", marginTop: 4, display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#94a3b8", fontSize: 12 }}>Total distance</span>
        <span style={{ color: "#f8fafc", fontWeight: 900, fontSize: 12 }}>{totalKm.toLocaleString()} km - ${gasCost.toFixed(0)} CAD gas</span>
      </div>
      <a href="https://www.google.com/maps/dir/Waterloo,Ontario/Ottawa,Ontario/Quebec+City,Quebec/Tadoussac,Quebec/Baie-Saint-Paul,Quebec/Mont-Tremblant,Quebec/Kingston,Ontario/Waterloo,Ontario" target="_blank" rel="noreferrer" style={{ ...bt("#10b981"), display: "block", textDecoration: "none", textAlign: "center", marginTop: 10 }}>Full Route in Google Maps</a>
    </div>

    {/* Budget summary */}
    <div style={cd}>
      <p style={{ ...lb, marginBottom: 10 }}>Estimated Budget</p>
      {[["Gas (total trip)",gasCost,"#f59e0b"],["Hotels (~7 nights)",hotelCost,"#6366f1"],["Food (~7 days)",foodCost,"#10b981"],["Activities",actCost,"#ec4899"],["Club Med (6 nights)",cm,"#3b82f6"]].map(([l,v,c]) => (
        <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1e3a5f" }}>
          <span style={{ color: "#cbd5e1", fontSize: 12 }}>{l}</span>
          <span style={{ color: c, fontWeight: 900 }}>${v.toFixed(0)} CAD</span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, background: "#0f172a", borderRadius: 9, padding: "10px 12px" }}>
        <span style={{ color: "#f8fafc", fontWeight: 700 }}>Grand Total (est.)</span>
        <span style={{ color: "#34d399", fontWeight: 900, fontSize: 20 }}>${grandTotal.toFixed(0)} CAD</span>
      </div>
    </div>
  </div>
);
```

}

// ── SCHEDULE ──────────────────────────────────────────────────────────────
function ScheduleTab() {
const [open, setOpen] = useState(null);
return (
<div>
<CollabBanner />
<p style={{ color: “#f8fafc”, fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Trip Schedule</p>
<p style={{ color: “#64748b”, fontSize: 12, marginBottom: 14 }}>Aug 3-15, 2026 - tap any day for details</p>
{TRIP_LEGS.map((leg) => {
const cfg = TYPE_CFG[leg.type] || TYPE_CFG.driving;
const isOpen = open === leg.id;
return (
<div key={leg.id} style={{ …cd, borderLeft: “4px solid “+cfg.color, cursor: “pointer” }} onClick={() => setOpen(isOpen ? null : leg.id)}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “flex-start” }}>
<div style={{ flex: 1 }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 6, marginBottom: 4 }}>
<span style={tg(cfg.color)}>{leg.type===“driving”?“🚗”:“😴”} {cfg.label}</span>
{leg.distanceKm > 0 && <span style={{ color: “#64748b”, fontSize: 10 }}>{leg.distanceKm} km</span>}
</div>
<p style={{ color: “#f8fafc”, fontWeight: 700, margin: 0, fontSize: 14 }}>{leg.from===leg.to?“Stay in “+leg.from:leg.from+” to “+leg.to}</p>
<p style={{ color: “#64748b”, fontSize: 11, margin: “2px 0 0” }}>{fmtDate(leg.date)}</p>
</div>
<div style={{ textAlign: “right” }}>
{leg.distanceKm > 0 && <p style={{ color: “#f59e0b”, fontWeight: 700, margin: “0 0 4px”, fontSize: 12 }}>Gas ${legGas(leg).toFixed(0)}</p>}
<span style={{ color: “#475569” }}>{isOpen?“▲”:“▼”}</span>
</div>
</div>
{isOpen && (
<div onClick={e=>e.stopPropagation()} style={{ marginTop: 10, paddingTop: 10, borderTop: “1px solid #334155” }}>
<p style={{ color: “#94a3b8”, fontSize: 12, margin: “0 0 10px”, fontStyle: “italic” }}>{leg.notes}</p>
{leg.distanceKm > 0 && (<div style={{ background: “#0f172a”, borderRadius: 9, padding: “8px 11px”, marginBottom: 10 }}><p style={{ color: “#f59e0b”, fontSize: 11, fontWeight: 700, margin: “0 0 4px” }}>Gas estimate</p><div style={{ display: “flex”, justifyContent: “space-between” }}><span style={{ color: “#94a3b8”, fontSize: 11 }}>{leg.distanceKm} km / {kpl} kpl x ${gp}/L</span><span style={{ color: “#fbbf24”, fontWeight: 900 }}>${legGas(leg).toFixed(2)} CAD</span></div></div>)}
{leg.distanceKm > 0 && (<a href={“https://www.google.com/maps/dir/”+encodeURIComponent(leg.from+”, Canada”)+”/”+encodeURIComponent(leg.to+”, Canada”)} target=”_blank” rel=“noreferrer” style={{ …bt(”#1e3a5f”), display: “block”, textDecoration: “none”, textAlign: “center”, marginBottom: 10, border: “1px solid #3b82f640” }}>Open in Google Maps</a>)}
{leg.hotels.length > 0 && (<div style={{ marginBottom: 10 }}><p style={{ color: “#6366f1”, fontSize: 10, textTransform: “uppercase”, letterSpacing: 1, margin: “0 0 6px”, fontWeight: 700 }}>Suggested Hotels</p>{leg.hotels.map((h,j) => (<div key={j} style={{ background: “#0f172a”, borderRadius: 9, padding: “9px 11px”, marginBottom: 5 }}><div style={{ display: “flex”, justifyContent: “space-between” }}><div style={{ flex: 1 }}><p style={{ color: “#f8fafc”, fontWeight: 700, margin: 0, fontSize: 12 }}>{h.name}</p><p style={{ color: “#fbbf24”, fontSize: 11, margin: “2px 0” }}>{“★”.repeat(h.stars)}</p><p style={{ color: “#94a3b8”, fontSize: 11, margin: 0 }}>{h.highlight}</p></div><div style={{ textAlign: “right”, marginLeft: 8 }}><p style={{ color: “#34d399”, fontWeight: 900, margin: 0 }}>${h.priceCAD}</p><p style={{ color: “#64748b”, fontSize: 9, margin: 0 }}>/night CAD</p></div></div><a href={h.url} target=”_blank” rel=“noreferrer” style={{ …bt(”#334155”), display: “block”, textDecoration: “none”, textAlign: “center”, marginTop: 6, padding: “5px” }}>Book Now</a></div>))}</div>)}
{leg.eats.length > 0 && (<div style={{ marginBottom: 10 }}><p style={{ color: “#f59e0b”, fontSize: 10, textTransform: “uppercase”, letterSpacing: 1, margin: “0 0 6px”, fontWeight: 700 }}>Where to Eat</p>{leg.eats.map((e,j) => (<div key={j} style={{ background: “#0f172a”, borderRadius: 9, padding: “8px 11px”, marginBottom: 5 }}><div style={{ display: “flex”, justifyContent: “space-between” }}><div style={{ flex: 1 }}><p style={{ color: “#f8fafc”, fontWeight: 700, margin: 0, fontSize: 12 }}>{e.name}</p><p style={{ color: “#94a3b8”, fontSize: 10, margin: “2px 0 0” }}>{e.type} - {e.note}</p></div><span style={{ color: “#34d399”, fontWeight: 700, marginLeft: 8, fontSize: 12 }}>{e.price===0?“Included”:”$”+e.price}</span></div></div>))}</div>)}
{leg.events.length > 0 && (<div><p style={{ color: “#ec4899”, fontSize: 10, textTransform: “uppercase”, letterSpacing: 1, margin: “0 0 6px”, fontWeight: 700 }}>Things To Do</p>{leg.events.map((ev,j) => (<div key={j} style={{ background: “#0f172a”, borderRadius: 9, padding: “8px 11px”, marginBottom: 5 }}><div style={{ display: “flex”, justifyContent: “space-between” }}><div style={{ flex: 1 }}><p style={{ color: “#f8fafc”, fontWeight: 700, margin: 0, fontSize: 12 }}>{ev.name}</p><p style={{ color: “#94a3b8”, fontSize: 10, margin: “2px 0 0” }}>{ev.note}</p></div><span style={tg(”#ec4899”)}>{ev.cost}</span></div></div>))}</div>)}
</div>
)}
</div>
);
})}
</div>
);
}

// ── HOTELS ────────────────────────────────────────────────────────────────
function HotelsTab() {
return (
<div>
<CollabBanner />
<p style={{ color: “#f8fafc”, fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Hotel Suggestions</p>
<p style={{ color: “#64748b”, fontSize: 12, marginBottom: 10 }}>2 adults + 2 children - 3 beds - all prices CAD/night</p>
<div style={{ …cd, border: “1px solid #6366f130” }}>
<span style={lb}>Budget per night (CAD)</span>
<input type=“number” style={inp} value={shared.hotelNight} onChange={e => upd(“hotelNight”, e.target.value)} />
</div>
{TRIP_LEGS.filter(l => l.hotels.length > 0).map(leg => (
<div key={leg.id} style={{ marginBottom: 6 }}>
<p style={{ color: “#60a5fa”, fontWeight: 700, fontSize: 13, margin: “0 0 6px” }}>{leg.to} - {fmtDate(leg.date)}</p>
{leg.hotels.map((h,j) => {
const ok = h.priceCAD <= hn;
return (
<div key={j} style={{ …cd, marginBottom: 7, borderLeft: “4px solid “+(ok?”#10b981”:”#f59e0b”) }}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “flex-start” }}>
<div style={{ flex: 1 }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 6, marginBottom: 3 }}>
<p style={{ color: “#f8fafc”, fontWeight: 700, margin: 0, fontSize: 13 }}>{h.name}</p>
{ok && <span style={tg(”#10b981”)}>On budget</span>}
</div>
<p style={{ color: “#fbbf24”, fontSize: 12, margin: “0 0 3px” }}>{“★”.repeat(h.stars)}</p>
<p style={{ color: “#94a3b8”, fontSize: 12, margin: 0 }}>{h.highlight}</p>
</div>
<div style={{ textAlign: “right”, marginLeft: 10 }}>
<p style={{ color: ok?”#34d399”:”#f87171”, fontWeight: 900, fontSize: 18, margin: 0 }}>${h.priceCAD}</p>
<p style={{ color: “#64748b”, fontSize: 9, margin: 0 }}>/night CAD</p>
</div>
</div>
<a href={h.url} target=”_blank” rel=“noreferrer” style={{ …bt(”#334155”), display: “block”, textDecoration: “none”, textAlign: “center”, marginTop: 8, padding: “7px” }}>Book on Booking.com</a>
</div>
);
})}
</div>
))}
</div>
);
}

// ── EATS ──────────────────────────────────────────────────────────────────
function EatsTab() {
return (
<div>
<CollabBanner />
<p style={{ color: “#f8fafc”, fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Places to Eat</p>
<p style={{ color: “#64748b”, fontSize: 12, marginBottom: 10 }}>Family-friendly picks at every stop</p>
<div style={{ …cd, border: “1px solid #f59e0b33” }}>
<span style={lb}>Daily food budget (CAD)</span>
<input type=“number” style={inp} value={shared.foodDay} onChange={e => upd(“foodDay”, e.target.value)} />
</div>
{TRIP_LEGS.filter(l => l.eats.length > 0).map(leg => (
<div key={leg.id} style={{ marginBottom: 6 }}>
<p style={{ color: “#f59e0b”, fontWeight: 700, fontSize: 13, margin: “0 0 6px” }}>{leg.to===leg.from?leg.from:leg.to} - {fmtDate(leg.date)}</p>
{leg.eats.map((e,j) => (
<div key={j} style={{ …cd, borderLeft: “4px solid #f59e0b”, marginBottom: 7 }}>
<div style={{ display: “flex”, justifyContent: “space-between” }}>
<div style={{ flex: 1 }}>
<p style={{ color: “#f8fafc”, fontWeight: 700, margin: 0, fontSize: 13 }}>{e.name}</p>
<span style={tg(”#f59e0b”)}>{e.type}</span>
<p style={{ color: “#94a3b8”, fontSize: 12, margin: “5px 0 0” }}>{e.note}</p>
</div>
<p style={{ color: e.price===0?”#6366f1”:”#34d399”, fontWeight: 900, fontSize: 17, margin: 0, marginLeft: 10 }}>{e.price===0?“Incl.”:”$”+e.price}</p>
</div>
</div>
))}
</div>
))}
</div>
);
}

// ── EVENTS ────────────────────────────────────────────────────────────────
function EventsTab() {
return (
<div>
<CollabBanner />
<p style={{ color: “#f8fafc”, fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Events and Sights</p>
<p style={{ color: “#64748b”, fontSize: 12, marginBottom: 10 }}>Things to do at every stop</p>
<div style={{ …cd, border: “1px solid #ec489933” }}>
<span style={lb}>Daily activities budget (CAD)</span>
<input type=“number” style={inp} value={shared.actDay} onChange={e => upd(“actDay”, e.target.value)} />
</div>
{TRIP_LEGS.filter(l => l.events.length > 0).map(leg => (
<div key={leg.id} style={{ marginBottom: 6 }}>
<p style={{ color: “#ec4899”, fontWeight: 700, fontSize: 13, margin: “0 0 6px” }}>{leg.to===leg.from?leg.from:leg.to} - {fmtDate(leg.date)}</p>
{leg.events.map((ev,j) => (
<div key={j} style={{ …cd, borderLeft: “4px solid #ec4899”, marginBottom: 7 }}>
<div style={{ display: “flex”, justifyContent: “space-between” }}>
<div style={{ flex: 1 }}>
<p style={{ color: “#f8fafc”, fontWeight: 700, margin: 0, fontSize: 13 }}>{ev.name}</p>
<p style={{ color: “#94a3b8”, fontSize: 12, margin: “4px 0 0” }}>{ev.note}</p>
</div>
<span style={{ …tg(”#ec4899”), marginLeft: 8, whiteSpace: “nowrap”, alignSelf: “flex-start” }}>{ev.cost}</span>
</div>
</div>
))}
</div>
))}
</div>
);
}

// ── PACKING ───────────────────────────────────────────────────────────────
function PackingTab() {
const [newItems, setNewItems] = useState({});
const [newCat, setNewCat] = useState(””);
const all = shared.packing.flatMap(c => c.items);
const packed = all.filter(i => i.checked).length;
return (
<div>
<CollabBanner />
<p style={{ color: “#f8fafc”, fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Packing List</p>
<div style={{ …cd, background: “#10b98115”, border: “1px solid #10b98130” }}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center” }}>
<span style={{ color: “#34d399”, fontWeight: 700 }}>{packed} / {all.length} packed</span>
<div style={{ background: “#0f172a”, borderRadius: 100, height: 7, width: 120, overflow: “hidden” }}>
<div style={{ height: “100%”, background: “#10b981”, width: (all.length?(packed/all.length*100):0)+”%”, transition: “width .3s” }} />
</div>
</div>
</div>
<button style={{ …bt(”#334155”), marginBottom: 10, border: “1px solid #475569” }} onClick={() => upd(“packing”, shared.packing.map(c => ({ …c, items: (DEFAULT_PACKING[c.id]||[]).map(n=>({id:uuid(),name:n,checked:false})) })))}>Reset to Defaults</button>
{shared.packing.map(cat => (
<div key={cat.id} style={cd}>
<div style={{ display: “flex”, justifyContent: “space-between”, marginBottom: 8 }}>
<p style={{ color: “#f8fafc”, fontWeight: 700, margin: 0 }}>{cat.name}</p>
<span style={{ color: “#64748b”, fontSize: 11 }}>{cat.items.filter(i=>i.checked).length}/{cat.items.length}</span>
</div>
{cat.items.map(item => (
<div key={item.id} style={{ display: “flex”, alignItems: “center”, gap: 9, marginBottom: 7 }}>
<input type=“checkbox” checked={item.checked} onChange={() => upd(“packing”, shared.packing.map(c => c.id===cat.id?{…c,items:c.items.map(i=>i.id===item.id?{…i,checked:!i.checked}:i)}:c))} style={{ width: 16, height: 16, cursor: “pointer” }} />
<span style={{ color: item.checked?”#475569”:”#cbd5e1”, textDecoration: item.checked?“line-through”:“none”, flex: 1, fontSize: 13 }}>{item.name}</span>
<button onClick={() => upd(“packing”, shared.packing.map(c => c.id===cat.id?{…c,items:c.items.filter(i=>i.id!==item.id)}:c))} style={{ background: “none”, border: “none”, color: “#475569”, cursor: “pointer”, fontSize: 15, padding: 0 }}>x</button>
</div>
))}
<div style={{ display: “flex”, gap: 7 }}>
<input style={{ …inp, flex: 1 }} placeholder=“Add item…” value={newItems[cat.id]||””} onChange={e=>setNewItems(n=>({…n,[cat.id]:e.target.value}))} onKeyDown={e=>{if(e.key===“Enter”&&(newItems[cat.id]||””).trim()){upd(“packing”,shared.packing.map(c=>c.id===cat.id?{…c,items:[…c.items,{id:uuid(),name:newItems[cat.id].trim(),checked:false}]}:c));setNewItems(n=>({…n,[cat.id]:””}));}}} />
<button style={{ …bt(), width: 36, padding: 0 }} onClick={() => {if((newItems[cat.id]||””).trim()){upd(“packing”,shared.packing.map(c=>c.id===cat.id?{…c,items:[…c.items,{id:uuid(),name:newItems[cat.id].trim(),checked:false}]}:c));setNewItems(n=>({…n,[cat.id]:””}));}}}>+</button>
</div>
</div>
))}
<div style={cd}>
<span style={lb}>Add Category</span>
<div style={{ display: “flex”, gap: 7 }}>
<input style={{ …inp, flex: 1 }} placeholder=“Category name” value={newCat} onChange={e=>setNewCat(e.target.value)} onKeyDown={e=>{if(e.key===“Enter”&&newCat.trim()){upd(“packing”,[…shared.packing,{id:uuid(),name:newCat.trim(),items:[]}]);setNewCat(””);}}} />
<button style={{ …bt(), width: 36, padding: 0 }} onClick={() => {if(newCat.trim()){upd(“packing”,[…shared.packing,{id:uuid(),name:newCat.trim(),items:[]}]);setNewCat(””);}}}>+</button>
</div>
</div>
</div>
);
}

// ── EXPENSES ──────────────────────────────────────────────────────────────
function ExpensesTab() {
const [newExp, setNewExp] = useState({ date:””, description:””, category:“Gas”, amount:”” });
const total = shared.expenses.reduce((a,e)=>a+parseFloat(e.amount||0),0);
const expCats = [“Gas”,“Food”,“Hotels”,“Club Med”,“Activities”,“Shopping”,“Other”];
return (
<div>
<CollabBanner />
<p style={{ color: “#f8fafc”, fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Expenses</p>
<div style={{ …cd, background: “#10b98110”, border: “1px solid #10b98130”, textAlign: “center” }}>
<p style={{ color: “#64748b”, fontSize: 10, textTransform: “uppercase”, letterSpacing: 1, margin: “0 0 4px” }}>Actual Spent So Far</p>
<p style={{ color: “#34d399”, fontSize: 32, fontWeight: 900, margin: “0 0 4px” }}>${total.toFixed(2)} CAD</p>
<p style={{ color: total<=grandTotal?”#60a5fa”:”#f87171”, fontSize: 12, margin: 0 }}>${Math.abs(grandTotal-total).toFixed(0)} {total<=grandTotal?“under”:“over”} ${grandTotal.toFixed(0)} estimate</p>
</div>
<div style={cd}>
<p style={{ …lb, marginBottom: 10 }}>Budget Settings</p>
<div style={{ display: “flex”, gap: 7, marginBottom: 7 }}>
<div style={{ flex: 1 }}><span style={lb}>Hotel/night</span><input type=“number” style={inp} value={shared.hotelNight} onChange={e=>upd(“hotelNight”,e.target.value)} /></div>
<div style={{ flex: 1 }}><span style={lb}>Food/day</span><input type=“number” style={inp} value={shared.foodDay} onChange={e=>upd(“foodDay”,e.target.value)} /></div>
</div>
<div style={{ display: “flex”, gap: 7, marginBottom: 7 }}>
<div style={{ flex: 1 }}><span style={lb}>Activities/day</span><input type=“number” style={inp} value={shared.actDay} onChange={e=>upd(“actDay”,e.target.value)} /></div>
<div style={{ flex: 1 }}><span style={lb}>Club Med total</span><input type=“number” style={inp} value={shared.clubMed} onChange={e=>upd(“clubMed”,e.target.value)} /></div>
</div>
<div style={{ display: “flex”, gap: 7 }}>
<div style={{ flex: 1 }}><span style={lb}>Fuel (km/L)</span><input type=“number” style={inp} value={shared.kpl} onChange={e=>upd(“kpl”,e.target.value)} /></div>
<div style={{ flex: 1 }}><span style={lb}>Gas price ($/L)</span><input type=“number” style={inp} value={shared.gasPrice} onChange={e=>upd(“gasPrice”,e.target.value)} /></div>
</div>
</div>
<div style={{ …cd, border: “1px solid #10b98130” }}>
<p style={{ color: “#34d399”, fontSize: 10, textTransform: “uppercase”, letterSpacing: 1, margin: “0 0 8px”, fontWeight: 700 }}>Estimated Budget</p>
{[[“Gas”,gasCost,”#f59e0b”],[“Hotels (~7 nights)”,hotelCost,”#6366f1”],[“Food (~7 days)”,foodCost,”#10b981”],[“Activities”,actCost,”#ec4899”],[“Club Med (6 nights)”,cm,”#3b82f6”]].map(([l,v,c])=>(<div key={l} style={{ display:“flex”,justifyContent:“space-between”,padding:“6px 0”,borderBottom:“1px solid #1e3a5f” }}><span style={{ color:”#cbd5e1”,fontSize:12 }}>{l}</span><span style={{ color:c,fontWeight:700 }}>${v.toFixed(0)} CAD</span></div>))}
<div style={{ display: “flex”, justifyContent: “space-between”, marginTop: 8, padding: “8px 10px”, background: “#0f172a”, borderRadius: 9 }}>
<span style={{ color: “#f8fafc”, fontWeight: 700 }}>Total Estimated</span>
<span style={{ color: “#34d399”, fontWeight: 900, fontSize: 18 }}>${grandTotal.toFixed(0)} CAD</span>
</div>
</div>
<div style={cd}>
<p style={{ …lb, marginBottom: 8 }}>Log Expense</p>
<input type=“date” style={{ …inp, marginBottom: 7 }} value={newExp.date} onChange={e=>setNewExp(n=>({…n,date:e.target.value}))} />
<input style={{ …inp, marginBottom: 7 }} placeholder=“Description” value={newExp.description} onChange={e=>setNewExp(n=>({…n,description:e.target.value}))} />
<select style={{ …inp, marginBottom: 7 }} value={newExp.category} onChange={e=>setNewExp(n=>({…n,category:e.target.value}))}>{expCats.map(c=><option key={c}>{c}</option>)}</select>
<input type=“number” style={{ …inp, marginBottom: 9 }} placeholder=“Amount (CAD)” value={newExp.amount} onChange={e=>setNewExp(n=>({…n,amount:e.target.value}))} />
<button style={bt()} onClick={()=>{if(newExp.description&&newExp.amount){upd(“expenses”,[…shared.expenses,{…newExp,id:uuid(),addedBy:userName}]);setNewExp({date:””,description:””,category:“Gas”,amount:””});}}}>+ Add Expense</button>
</div>
{[…shared.expenses].reverse().map(exp=>(
<div key={exp.id} style={{ …cd, borderLeft: “4px solid “+catColor(exp.category) }}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center” }}>
<div>
<p style={{ color: “#f8fafc”, fontWeight: 600, margin: 0, fontSize: 13 }}>{exp.description}</p>
<div style={{ display: “flex”, gap: 7, alignItems: “center”, marginTop: 3, flexWrap: “wrap” }}>
<span style={tg(catColor(exp.category))}>{exp.category}</span>
{exp.date&&<span style={{ color:”#64748b”,fontSize:10 }}>{fmtDate(exp.date)}</span>}
{exp.addedBy&&<span style={{ color:”#475569”,fontSize:10 }}>by {exp.addedBy}</span>}
</div>
</div>
<div style={{ display: “flex”, alignItems: “center”, gap: 7 }}>
<span style={{ color: “#34d399”, fontWeight: 700, fontSize: 16 }}>${parseFloat(exp.amount).toFixed(2)}</span>
<button onClick={()=>upd(“expenses”,shared.expenses.filter(x=>x.id!==exp.id))} style={{ background:“none”,border:“none”,color:”#64748b”,cursor:“pointer”,fontSize:17 }}>x</button>
</div>
</div>
</div>
))}
</div>
);
}

// ── INFO ──────────────────────────────────────────────────────────────────
function InfoTab() {
const [newItem, setNewItem] = useState({ category:“Emergency Contacts”, title:””, value:””, note:”” });
const [expanded, setExpanded] = useState(null);
const infoCats = [“Emergency Contacts”,“Documents”,“Medical”,“Car & Insurance”,“Reservations”,“Other”];
const icColors = { “Emergency Contacts”:”#ef4444”,“Documents”:”#3b82f6”,“Medical”:”#10b981”,“Car & Insurance”:”#f59e0b”,“Reservations”:”#8b5cf6”,“Other”:”#64748b” };
const grouped = infoCats.reduce((acc,cat)=>{ const items=shared.infoItems.filter(i=>i.category===cat); if(items.length>0)acc[cat]=items; return acc; },{});
return (
<div>
<CollabBanner />
<p style={{ color: “#f8fafc”, fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Important Info</p>
<p style={{ color: “#64748b”, fontSize: 12, marginBottom: 12 }}>Contacts, documents and key trip details</p>
{(grouped[“Emergency Contacts”]||[]).length>0&&(<div style={{ …cd,background:”#ef444415”,border:“1px solid #ef444430” }}><p style={{ color:”#ef4444”,fontSize:10,textTransform:“uppercase”,letterSpacing:1,margin:“0 0 8px”,fontWeight:700 }}>Emergency Contacts</p>{grouped[“Emergency Contacts”].map(item=>(<div key={item.id} style={{ display:“flex”,justifyContent:“space-between”,alignItems:“center”,padding:“7px 0”,borderBottom:“1px solid #ef444420” }}><div><p style={{ color:”#f8fafc”,fontWeight:700,margin:0,fontSize:13 }}>{item.title}</p>{item.note&&<p style={{ color:”#94a3b8”,fontSize:11,margin:“2px 0 0” }}>{item.note}</p>}</div><a href={“tel:”+item.value} style={{ color:”#ef4444”,fontWeight:700,textDecoration:“none”,background:”#ef444420”,borderRadius:7,padding:“3px 9px” }}>{item.value}</a></div>))}</div>)}
<div style={cd}>
<p style={{ …lb, marginBottom: 8 }}>Add Information</p>
<select style={{ …inp,marginBottom:7 }} value={newItem.category} onChange={e=>setNewItem(n=>({…n,category:e.target.value}))}>{infoCats.map(c=><option key={c}>{c}</option>)}</select>
<input style={{ …inp,marginBottom:7 }} placeholder=“Title” value={newItem.title} onChange={e=>setNewItem(n=>({…n,title:e.target.value}))} />
<input style={{ …inp,marginBottom:7 }} placeholder=“Value / Number / Code” value={newItem.value} onChange={e=>setNewItem(n=>({…n,value:e.target.value}))} />
<input style={{ …inp,marginBottom:9 }} placeholder=“Notes (optional)” value={newItem.note} onChange={e=>setNewItem(n=>({…n,note:e.target.value}))} />
<button style={bt(”#6366f1”)} onClick={()=>{if(newItem.title.trim()){upd(“infoItems”,[…shared.infoItems,{…newItem,id:uuid(),addedBy:userName}]);setNewItem({category:newItem.category,title:””,value:””,note:””});}}}>+ Add Info</button>
</div>
{Object.entries(grouped).filter(([cat])=>cat!==“Emergency Contacts”).map(([cat,items])=>(<div key={cat} style={cd}><p style={{ color:icColors[cat]||”#64748b”,fontSize:10,textTransform:“uppercase”,letterSpacing:1,margin:“0 0 8px”,fontWeight:700 }}>{cat}</p>{items.map(item=>(<div key={item.id} style={{ borderBottom:“1px solid #1e3a5f” }}><div style={{ display:“flex”,justifyContent:“space-between”,alignItems:“center”,padding:“7px 0”,cursor:“pointer” }} onClick={()=>setExpanded(expanded===item.id?null:item.id)}><div style={{ flex:1 }}><p style={{ color:”#f8fafc”,fontWeight:600,margin:0,fontSize:13 }}>{item.title}</p>{expanded===item.id&&item.value&&<p style={{ color:”#60a5fa”,fontWeight:700,margin:“3px 0 0”,fontFamily:“monospace” }}>{item.value}</p>}{expanded!==item.id&&<p style={{ color:”#475569”,fontSize:11,margin:“2px 0 0” }}>Tap to reveal</p>}</div><div style={{ display:“flex”,alignItems:“center”,gap:7 }}><span style={{ color:”#475569” }}>{expanded===item.id?”^”:“v”}</span><button onClick={e=>{e.stopPropagation();upd(“infoItems”,shared.infoItems.filter(x=>x.id!==item.id));}} style={{ background:“none”,border:“none”,color:”#475569”,cursor:“pointer”,fontSize:17,padding:0 }}>x</button></div></div></div>))}</div>))}
{shared.infoItems.length===0&&<div style={{ textAlign:“center”,marginTop:30 }}><p style={{ color:”#475569” }}>No info saved yet</p></div>}
</div>
);
}

const TABS = { Home:HomeTab, Schedule:ScheduleTab, Hotels:HotelsTab, Eats:EatsTab, Events:EventsTab, Packing:PackingTab, Expenses:ExpensesTab, Info:InfoTab };
const ActiveTab = TABS[tab];

return (
<div style={{ background: “#020817”, minHeight: “100vh”, display: “flex”, justifyContent: “center” }}>
<div style={ph}>
<div style={hdr}>
<div style={{ display: “flex”, alignItems: “center”, justifyContent: “space-between” }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 10 }}>
<div style={{ width: 34, height: 34, borderRadius: 9, background: “linear-gradient(135deg,#3b82f6,#6366f1)”, display: “flex”, alignItems: “center”, justifyContent: “center”, fontSize: 17 }}>🚗</div>
<div>
<h1 style={{ color: “#f8fafc”, fontSize: 15, fontWeight: 900, margin: 0 }}>Ontario & Quebec 2026</h1>
<p style={{ color: “#475569”, fontSize: 11, margin: 0 }}>{ICONS[tab]} {tab} · Hi, {userName}!</p>
</div>
</div>
<div style={{ textAlign: “right” }}>
<SyncBadge />
<button onClick={loadFromStorage} style={{ background: “none”, border: “none”, color: “#3b82f6”, fontSize: 11, cursor: “pointer”, marginTop: 2, padding: 0 }}>Refresh</button>
</div>
</div>
</div>
<div style={cnt}><ActiveTab /></div>
<div style={nav}>
{SECTIONS.map(s => (
<button key={s} onClick={()=>setTab(s)} style={{ flex:1,background:“none”,border:“none”,cursor:“pointer”,padding:“7px 1px”,display:“flex”,flexDirection:“column”,alignItems:“center”,gap:2 }}>
<span style={{ fontSize:15,filter:tab===s?“none”:“grayscale(1) opacity(0.4)” }}>{ICONS[s]}</span>
<span style={{ fontSize:8,color:tab===s?”#60a5fa”:”#475569”,fontWeight:tab===s?700:400 }}>{s}</span>
</button>
))}
</div>
</div>
</div>
);
}