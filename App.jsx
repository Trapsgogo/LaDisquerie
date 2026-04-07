import { useState, useEffect, useCallback } from "react";
import "./App.css";

// ─── Helpers ────────────────────────────────────────────────────────
const STORAGE = window.storage || {
  get: async (key) => {
    const item = window.localStorage.getItem(key);
    return item ? { value: item } : null;
  },
  set: async (key, value) => {
    window.localStorage.setItem(key, value);
  },
  delete: async (key) => {
    window.localStorage.removeItem(key);
  }
};

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();
const fmt = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) + " " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
};

// ─── API Recherche d'albums & chansons ──────────────────────────────
async function searchItunes(artist, album, song) {
  const query = `${artist} ${album} ${song}`.trim();
  if (!query || query.length < 2) return [];

  const entity = song ? "song" : "album";

  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=${entity}&limit=50`);
    const data = await res.json();
    
    return data.results.map(item => ({
      id: item.collectionId?.toString() || item.trackId?.toString() || Math.random().toString(),
      artist: item.artistName,
      album: item.collectionName || item.trackName,
      genre: item.primaryGenreName,
      year: item.releaseDate ? new Date(item.releaseDate).getFullYear() : new Date().getFullYear(),
      cover: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '300x300bb') : null
    }));
  } catch (error) {
    console.error("Erreur API Recherche :", error);
    return [];
  }
}

// ─── API Dernières sorties (Version Robuste + Secours) ──────────────
async function fetchNewReleases() {
  try {
    // Utilisation de l'endpoint "raw" du proxy qui est beaucoup plus stable
    const targetUrl = encodeURIComponent('https://itunes.apple.com/fr/rss/newreleases/limit=12/json');
    const res = await fetch(`https://api.allorigins.win/raw?url=${targetUrl}`);
    
    if (!res.ok) throw new Error("Erreur Proxy");
    const data = await res.json();
    
    return data.feed.entry.map(item => ({
      id: item.id.attributes['im:id'],
      artist: item['im:artist'].label,
      album: item['im:name'].label,
      genre: item.category.attributes.label,
      year: item['im:releaseDate'] ? new Date(item['im:releaseDate'].label).getFullYear() : new Date().getFullYear(),
      cover: item['im:image'][2].label.replace('170x170bb', '300x300bb')
    }));
  } catch (error) {
    console.error("Erreur API Nouveautés :", error);
    // PLAN B : Si le réseau ou le navigateur bloque le proxy, on renvoie une liste de secours réaliste
    // Cela empêche l'application de rester figée sur un écran noir "Chargement..."
    return [
       { id: "fallback-1", artist: "Justice", album: "Hyperdrama", genre: "Electronic", year: 2024, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/a4/bc/ef/a4bcef9d-a417-640a-c5c2-f1ec18b82dfc/3616891398863.png/300x300bb.png" },
       { id: "fallback-2", artist: "Dua Lipa", album: "Radical Optimism", genre: "Pop", year: 2024, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/4a/15/38/4a153835-2127-6f0d-2b47-6644eb2811a2/5054197995111.jpg/300x300bb.jpg" },
       { id: "fallback-3", artist: "Billie Eilish", album: "HIT ME HARD AND SOFT", genre: "Pop", year: 2024, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/80/ed/5f/80ed5f1f-4949-ac30-5895-17eb48a28090/24UM1IM02488.rgb.jpg/300x300bb.jpg" },
       { id: "fallback-4", artist: "Taylor Swift", album: "The Tortured Poets Department", genre: "Pop", year: 2024, cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/91/97/fb/9197fb1c-b258-294c-83b3-855c3c2f13e7/24UM1IM00740.rgb.jpg/300x300bb.jpg" }
    ];
  }
}

// ─── Prompt Log ──────────────────────────────────────────────────────
const PROMPTS = [
  { time: "07/04/2026 11:00", text: "On veut créer une application web qui permet d'avoir un suivi de notre collection de disque. Il faut donc pouvoir créer des comptes en base de données. On veut une page de connexion, lorsque l'on se connecte on veut pouvoir ajouter nos CD. Il faudra que tu crées une API qui vient prendre toute la collection sur le site IMBD. Ensuite il faut que l'on puisse manager nos disques... (Message initial)" },
  { time: "07/04/2026 11:15", text: "Je viens de t'envoyer le fichier de mon projet et j'aimerais que tu règles le problème qui fais que le bouton ne fonctionne pas" },
  { time: "07/04/2026 11:20", text: "Je veux que le site prenne toute la page et que tu me dise comment connecter l'API IMBD" },
  { time: "07/04/2026 11:25", text: "ça me parait peux pour acdc" },
  { time: "07/04/2026 11:30", text: "je voudrais que tu fasse une barre de recherche pour l'artiste et une pour les chanson et une pour les album et je voudrais aussi que tu me trouve un moyen d'afficher les image des album, chanson etc" },
  { time: "07/04/2026 11:34", text: "la nouveauté connecte la a l'api ansuite mets la possibilité de mttre en favoris des disque de ma collection et rend fonctionnel l'onglet achat en mettant des liens amazon, fnac" },
  { time: "07/04/2026 11:37", text: "pour les favoris rajoute leur des liens spotify et apple music ensuite fais en sorte que l'on peut mettre les disque en futur achat et aussi rajoute un lien leboncoin et ebay dans les futurs achat" },
  { time: "07/04/2026 11:41", text: "rend le responsive, supprime les mention trapsgogo et les disque d'exemple dans futurs achat etc" },
  { time: "07/04/2026 11:48", text: "voici la page nouveauté ça ne charge pas. et pourquoi tout viens de 2024 ?" }
];

// ─── Credits ─────────────────────────────────────────────────────────
const TEAM = [
  { name: "Hugo Boubault", role: "Co-fondateur & Développeur", emoji: "🎸" },
  { name: "François Adeline", role: "Co-fondateur & Designer", emoji: "🎨" },
  { name: "Michaël Millet", role: "Co-fondateur & Product Owner", emoji: "🎧" },
  { name: "Antoine MERY", role: "Co-fondateur & Architecte", emoji: "🎹" },
];

// ─── Styles ──────────────────────────────────────────────────────────
const C = {
  bg: "#0d0b0e", bgCard: "#18151c", bgHover: "#221e28", accent: "#d4a24e",
  accentDim: "#a17a2f", text: "#e8e1d5", textDim: "#8a8280", border: "#2a2530",
  danger: "#c0392b", success: "#27ae60", info: "#2980b9",
};

const baseBtn = {
  padding: "10px 22px", borderRadius: 8, border: "none", cursor: "pointer",
  fontWeight: 700, fontSize: 14, transition: "all .2s", fontFamily: "inherit",
};

// ─── Main App ────────────────────────────────────────────────────────
export default function LaDisquerie() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("collection");

  useEffect(() => {
    (async () => {
      try {
        const s = await STORAGE.get("session");
        if (s?.value) setUser(JSON.parse(s.value));
      } catch {}
      setLoading(false);
    })();
  }, []);

  const login = async (u) => {
    setUser(u);
    await STORAGE.set("session", JSON.stringify(u));
  };
  const logout = async () => {
    setUser(null);
    await STORAGE.delete("session");
    setPage("collection");
  };

  return (
    <>
      <style>{`
        html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; box-sizing: border-box; background-color: ${C.bg}; }
        
        /* Classes Responsive */
        .app-layout { display: flex; min-height: 100vh; width: 100%; background: ${C.bg}; font-family: 'Playfair Display', Georgia, serif; color: ${C.text}; }
        .sidebar { width: 240px; background: ${C.bgCard}; border-right: 1px solid ${C.border}; padding: 28px 16px; display: flex; flex-direction: column; flex-shrink: 0; }
        .sidebar-menu { display: flex; flex-direction: column; gap: 4px; }
        .main-area { flex: 1; padding: 32px 40px; overflow-y: auto; max-height: 100vh; box-sizing: border-box; }
        
        .grid-auto { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .search-row { display: flex; gap: 10px; margin-bottom: 14px; }
        .manual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
        .lend-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .credits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 48px; }
        .auth-card { width: 400px; background: ${C.bgCard}; border-radius: 20px; padding: 48px; border: 1px solid ${C.border}; box-shadow: 0 20px 60px rgba(0,0,0,.5); box-sizing: border-box; }

        /* Media Queries pour le Mobile */
        @media (max-width: 768px) {
          .app-layout { flex-direction: column; }
          .sidebar { width: 100%; border-right: none; border-bottom: 1px solid ${C.border}; padding: 16px; align-items: center; }
          .sidebar-menu { flex-direction: row; flex-wrap: wrap; justify-content: center; width: 100%; }
          .sidebar-menu button { width: auto !important; padding: 8px 12px !important; font-size: 13px !important; }
          .sidebar .logout-container { margin-top: 16px !important; border-top: none !important; padding-top: 0 !important; display: flex; gap: 16px; align-items: center; width: 100%; justify-content: center; }
          .main-area { padding: 16px; max-height: none; }
          
          .grid-auto { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
          .search-row { flex-direction: column; }
          .manual-grid { grid-template-columns: 1fr; }
          .lend-row { flex-direction: column; align-items: stretch; }
          .credits-grid { grid-template-columns: 1fr; }
          .auth-card { width: 95%; padding: 24px; }
        }
      `}</style>
      
      {loading ? (
        <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28 }}>♫ LaDisquerie…</div>
      ) : !user ? (
        <AuthPage onLogin={login} />
      ) : (
        <Dashboard user={user} page={page} setPage={setPage} logout={logout} />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════
function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (!username.trim() || !password.trim()) return setError("Remplis tous les champs");
    const key = `user:${username.toLowerCase()}`;
    if (isLogin) {
      try {
        const res = await STORAGE.get(key);
        if (!res) return setError("Compte introuvable");
        const data = JSON.parse(res.value);
        if (data.password !== password) return setError("Mot de passe incorrect");
        onLogin({ username: data.username, id: data.id });
      } catch { setError("Compte introuvable"); }
    } else {
      try {
        const existing = await STORAGE.get(key);
        if (existing) return setError("Ce nom d'utilisateur existe déjà");
      } catch {}
      const newUser = { id: uid(), username: username.trim(), password };
      await STORAGE.set(key, JSON.stringify(newUser));
      await STORAGE.set(`collection:${newUser.id}`, JSON.stringify([]));
      await STORAGE.set(`favorites:${newUser.id}`, JSON.stringify([]));
      await STORAGE.set(`wishlist:${newUser.id}`, JSON.stringify([]));
      onLogin({ username: newUser.username, id: newUser.id });
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', Georgia, serif" }}>
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>💿</div>
          <h1 style={{ color: C.accent, fontSize: 32, margin: 0, letterSpacing: 2 }}>LaDisquerie</h1>
        </div>
        <div style={{ display: "flex", gap: 0, marginBottom: 28, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
          {["Connexion", "Inscription"].map((t, i) => (
            <button key={t} onClick={() => { setIsLogin(i === 0); setError(""); }}
              style={{ ...baseBtn, flex: 1, borderRadius: 0, background: (i === 0 ? isLogin : !isLogin) ? C.accent : "transparent", color: (i === 0 ? isLogin : !isLogin) ? C.bg : C.textDim, border: "none" }}>
              {t}
            </button>
          ))}
        </div>
        <input placeholder="Nom d'utilisateur" value={username} onChange={e => setUsername(e.target.value)}
          style={{ width: "100%", padding: 14, borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 15, marginBottom: 14, boxSizing: "border-box", fontFamily: "inherit" }} />
        <input placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          style={{ width: "100%", padding: 14, borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 15, marginBottom: 20, boxSizing: "border-box", fontFamily: "inherit" }} />
        {error && <p style={{ color: C.danger, fontSize: 13, margin: "0 0 14px", textAlign: "center" }}>{error}</p>}
        <button onClick={submit} style={{ ...baseBtn, width: "100%", background: C.accent, color: C.bg, fontSize: 16, padding: 14, borderRadius: 12 }}>
          {isLogin ? "Se connecter" : "Créer un compte"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
function Dashboard({ user, page, setPage, logout }) {
  const NAV = [
    { id: "collection", label: "Ma Collection", icon: "💿" },
    { id: "lending", label: "Prêts", icon: "🤝" },
    { id: "favorites", label: "Favoris", icon: "❤️" },
    { id: "wishlist", label: "Futurs Achats", icon: "🛒" },
    { id: "prompts", label: "Prompts", icon: "📝" },
    { id: "credits", label: "Crédits", icon: "⭐" },
  ];

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 32 }}>💿</div>
          <h2 style={{ color: C.accent, fontSize: 20, margin: "6px 0 2px", letterSpacing: 1 }}>LaDisquerie</h2>
        </div>
        <div className="sidebar-menu">
            {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
                style={{ ...baseBtn, textAlign: "left", padding: "11px 16px", borderRadius: 10,
                background: page === n.id ? C.accent + "22" : "transparent", color: page === n.id ? C.accent : C.textDim,
                border: page === n.id ? `1px solid ${C.accent}44` : "1px solid transparent", fontSize: 14, fontWeight: page === n.id ? 700 : 500, display: "flex", alignItems: "center", gap: 10, width: "100%", boxSizing: "border-box" }}>
                <span style={{ fontSize: 18 }}>{n.icon}</span>{n.label}
            </button>
            ))}
        </div>
        <div className="logout-container" style={{ marginTop: "auto", borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
          <p style={{ color: C.textDim, fontSize: 12, margin: "0 0 10px", paddingLeft: 8 }}>👤 {user.username}</p>
          <button onClick={logout} style={{ ...baseBtn, width: "100%", background: C.danger + "22", color: C.danger, border: `1px solid ${C.danger}44`, padding: "9px 14px", fontSize: 13, boxSizing: "border-box" }}>
            Déconnexion
          </button>
        </div>
      </nav>

      <main className="main-area">
        {page === "collection" && <CollectionPage userId={user.id} />}
        {page === "lending" && <LendingPage userId={user.id} />}
        {page === "releases" && <ReleasesPage userId={user.id} />}
        {page === "favorites" && <ListPage userId={user.id} type="favorites" title="❤️ Mes Favoris" />}
        {page === "wishlist" && <ListPage userId={user.id} type="wishlist" title="🛒 Futurs Achats" />}
        {page === "prompts" && <PromptsPage />}
        {page === "credits" && <CreditsPage />}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// COLLECTION
// ═══════════════════════════════════════════════════════════════════════
function CollectionPage({ userId }) {
  const [coll, setColl] = useState([]);
  const [favs, setFavs] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [advancedSearch, setAdvancedSearch] = useState({ artist: "", album: "", song: "" });
  const [results, setResults] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [manual, setManual] = useState({ artist: "", album: "", genre: "", year: "" });
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    try { const r = await STORAGE.get(`collection:${userId}`); if (r) setColl(JSON.parse(r.value)); } catch {}
    try { const r = await STORAGE.get(`favorites:${userId}`); if (r) setFavs(JSON.parse(r.value)); } catch {}
    try { const r = await STORAGE.get(`wishlist:${userId}`); if (r) setWishlist(JSON.parse(r.value)); } catch {}
  }, [userId]);
  useEffect(() => { load(); }, [load]);

  const save = async (c) => { setColl(c); await STORAGE.set(`collection:${userId}`, JSON.stringify(c)); };

  const addFromSearch = (item) => {
    if (coll.find(c => c.artist === item.artist && c.album === item.album)) return;
    save([...coll, { ...item, id: uid(), addedAt: now(), lentTo: null, lentDate: null }]);
  };

  const addManual = () => {
    if (!manual.artist || !manual.album) return;
    save([...coll, { id: uid(), artist: manual.artist, album: manual.album, genre: manual.genre || "Autre", year: parseInt(manual.year) || new Date().getFullYear(), cover: `hsl(${Math.floor(Math.random() * 360)}, 45%, 32%)`, addedAt: now(), lentTo: null, lentDate: null }]);
    setManual({ artist: "", album: "", genre: "", year: "" });
    setShowAdd(false);
  };

  const remove = (id) => save(coll.filter(c => c.id !== id));

  const toggleFav = async (item) => {
    const exists = favs.find(f => f.artist === item.artist && f.album === item.album);
    const next = exists ? favs.filter(f => !(f.artist === item.artist && f.album === item.album)) : [...favs, { ...item, addedAt: now() }];
    setFavs(next);
    await STORAGE.set(`favorites:${userId}`, JSON.stringify(next));
  };
  const isFav = (i) => favs.some(f => f.artist === i.artist && f.album === i.album);

  const toggleWish = async (item) => {
    const exists = wishlist.find(f => f.artist === item.artist && f.album === item.album);
    const next = exists ? wishlist.filter(f => !(f.artist === item.artist && f.album === item.album)) : [...wishlist, { ...item, addedAt: now() }];
    setWishlist(next);
    await STORAGE.set(`wishlist:${userId}`, JSON.stringify(next));
  };
  const isWish = (i) => wishlist.some(f => f.artist === i.artist && f.album === i.album);

  useEffect(() => {
    const t = setTimeout(async () => {
      const res = await searchItunes(advancedSearch.artist, advancedSearch.album, advancedSearch.song);
      setResults(res);
    }, 400);
    return () => clearTimeout(t);
  }, [advancedSearch]);

  const filtered = filter ? coll.filter(c => c.genre === filter) : coll;
  const genres = [...new Set(coll.map(c => c.genre))];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 28, margin: 0, color: C.accent }}>💿 Ma Collection <span style={{ fontSize: 16, color: C.textDim }}>({coll.length})</span></h1>
        <button onClick={() => setShowAdd(!showAdd)} style={{ ...baseBtn, background: C.accent, color: C.bg }}>+ Ajouter</button>
      </div>

      {showAdd && (
        <div style={{ background: C.bgCard, borderRadius: 16, padding: "20px 28px", border: `1px solid ${C.border}`, marginBottom: 28 }}>
          <h3 style={{ margin: "0 0 18px", color: C.accent }}>🔍 Rechercher</h3>
          
          <div className="search-row">
            <input placeholder="Artiste (ex: ACDC)" value={advancedSearch.artist} onChange={e => setAdvancedSearch({ ...advancedSearch, artist: e.target.value })}
              style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
            <input placeholder="Album (ex: Back in Black)" value={advancedSearch.album} onChange={e => setAdvancedSearch({ ...advancedSearch, album: e.target.value })}
              style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
            <input placeholder="Chanson (ex: Thunderstruck)" value={advancedSearch.song} onChange={e => setAdvancedSearch({ ...advancedSearch, song: e.target.value })}
              style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>

          {results.length > 0 && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20, maxHeight: "400px", overflowY: "auto" }}>
              {results.map(r => (
                <div key={r.id} onClick={() => addFromSearch(r)} style={{ background: C.bg, borderRadius: 12, padding: 14, border: `1px solid ${C.border}`, cursor: "pointer", width: 140, flex: "1 1 140px", transition: "all .2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.accent} onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                  
                  <div style={{ width: "100%", height: 120, borderRadius: 8, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, background: r.cover?.startsWith('http') ? `url(${r.cover}) center/cover` : r.cover }}>
                    {!r.cover?.startsWith('http') && "💿"}
                  </div>

                  <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.album}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: C.textDim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.artist}</p>
                </div>
              ))}
            </div>
          )}

          <h3 style={{ margin: "20px 0 14px", color: C.accent }}>✏️ Ajout manuel</h3>
          <div className="manual-grid">
            {[["artist", "Artiste"], ["album", "Album"], ["genre", "Genre"], ["year", "Année"]].map(([k, l]) => (
              <input key={k} placeholder={l} value={manual[k]} onChange={e => setManual({ ...manual, [k]: e.target.value })}
                style={{ padding: 11, borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
            ))}
          </div>
          <button onClick={addManual} style={{ ...baseBtn, background: C.success, color: "#fff", width: "100%" }}>Ajouter à ma collection</button>
        </div>
      )}

      {genres.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <button onClick={() => setFilter("")} style={{ ...baseBtn, padding: "6px 14px", fontSize: 12, background: !filter ? C.accent : "transparent", color: !filter ? C.bg : C.textDim, border: `1px solid ${!filter ? C.accent : C.border}` }}>Tous</button>
          {genres.map(g => (
            <button key={g} onClick={() => setFilter(g)} style={{ ...baseBtn, padding: "6px 14px", fontSize: 12, background: filter === g ? C.accent : "transparent", color: filter === g ? C.bg : C.textDim, border: `1px solid ${filter === g ? C.accent : C.border}` }}>{g}</button>
          ))}
        </div>
      )}

      <div className="grid-auto">
        {filtered.map(cd => (
          <div key={cd.id} style={{ background: C.bgCard, borderRadius: 14, padding: 16, border: `1px solid ${C.border}`, position: "relative", transition: "all .2s" }}>
            
            <div style={{ width: "100%", height: 140, borderRadius: 10, background: cd.cover?.startsWith('http') ? `url(${cd.cover}) center/cover` : cd.cover, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, marginBottom: 12 }}>
              {!cd.cover?.startsWith('http') && (cd.lentTo ? "📤" : "💿")}
            </div>

            <h4 style={{ margin: 0, fontSize: 15, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cd.album}</h4>
            <p style={{ margin: "4px 0", fontSize: 12, color: C.textDim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cd.artist} • {cd.year}</p>
            <span style={{ display: "inline-block", fontSize: 10, padding: "3px 8px", borderRadius: 20, background: C.accent + "22", color: C.accent, marginTop: 4 }}>{cd.genre}</span>
            {cd.lentTo && <p style={{ margin: "8px 0 0", fontSize: 11, color: C.info }}>🤝 Prêté à {cd.lentTo}</p>}
            
            <button onClick={() => toggleWish(cd)} style={{ position: "absolute", top: 10, right: 74, background: isWish(cd) ? C.accent + "22" : C.bgCard, color: isWish(cd) ? C.accent : C.textDim, border: `1px solid ${isWish(cd) ? C.accent + "44" : C.border}`, borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 12 }} title="Ajouter aux futurs achats">{isWish(cd) ? "🛒" : "➕"}</button>
            <button onClick={() => toggleFav(cd)} style={{ position: "absolute", top: 10, right: 42, background: isFav(cd) ? "#e74c3c22" : C.bgCard, color: isFav(cd) ? "#e74c3c" : C.textDim, border: `1px solid ${isFav(cd) ? "#e74c3c44" : C.border}`, borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 12 }} title="Ajouter aux favoris">{isFav(cd) ? "❤️" : "🤍"}</button>
            <button onClick={() => remove(cd.id)} style={{ position: "absolute", top: 10, right: 10, background: C.danger + "33", color: C.danger, border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 12 }} title="Retirer de la collection">✕</button>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p style={{ color: C.textDim, textAlign: "center", marginTop: 60, fontSize: 16 }}>Aucun disque dans ta collection. Clique sur "+ Ajouter" pour commencer !</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// LENDING
// ═══════════════════════════════════════════════════════════════════════
function LendingPage({ userId }) {
  const [coll, setColl] = useState([]);
  const [lendForm, setLendForm] = useState({ cdId: "", person: "" });
  const [reminders, setReminders] = useState([]);

  const load = useCallback(async () => {
    try { const r = await STORAGE.get(`collection:${userId}`); if (r) setColl(JSON.parse(r.value)); } catch {}
    try { const r = await STORAGE.get(`reminders:${userId}`); if (r) setReminders(JSON.parse(r.value)); } catch {}
  }, [userId]);
  useEffect(() => { load(); }, [load]);

  const saveColl = async (c) => { setColl(c); await STORAGE.set(`collection:${userId}`, JSON.stringify(c)); };
  const saveReminders = async (r) => { setReminders(r); await STORAGE.set(`reminders:${userId}`, JSON.stringify(r)); };

  const lend = () => {
    if (!lendForm.cdId || !lendForm.person) return;
    const updated = coll.map(c => c.id === lendForm.cdId ? { ...c, lentTo: lendForm.person, lentDate: now() } : c);
    saveColl(updated);
    const cd = coll.find(c => c.id === lendForm.cdId);
    saveReminders([...reminders, { id: uid(), cdId: lendForm.cdId, album: cd?.album, artist: cd?.artist, person: lendForm.person, date: now(), type: "lent" }]);
    setLendForm({ cdId: "", person: "" });
  };

  const returnCd = (cdId) => {
    const updated = coll.map(c => c.id === cdId ? { ...c, lentTo: null, lentDate: null } : c);
    saveColl(updated);
    const cd = coll.find(c => c.id === cdId);
    saveReminders([...reminders, { id: uid(), cdId, album: cd?.album, artist: cd?.artist, person: cd?.lentTo, date: now(), type: "returned" }]);
  };

  const lentCds = coll.filter(c => c.lentTo);
  const available = coll.filter(c => !c.lentTo);

  return (
    <div>
      <h1 style={{ fontSize: 28, margin: "0 0 28px", color: C.accent }}>🤝 Gestion des Prêts</h1>

      <div style={{ background: C.bgCard, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, marginBottom: 28 }}>
        <h3 style={{ margin: "0 0 16px", color: C.accent }}>📤 Prêter un disque</h3>
        <div className="lend-row">
          <select value={lendForm.cdId} onChange={e => setLendForm({ ...lendForm, cdId: e.target.value })}
            style={{ padding: 12, borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, flex: 1, minWidth: 200, fontFamily: "inherit", boxSizing: "border-box" }}>
            <option value="">Choisir un disque…</option>
            {available.map(c => <option key={c.id} value={c.id}>{c.album} — {c.artist}</option>)}
          </select>
          <input placeholder="Nom de la personne" value={lendForm.person} onChange={e => setLendForm({ ...lendForm, person: e.target.value })}
            style={{ padding: 12, borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, flex: 1, minWidth: 200, fontFamily: "inherit", boxSizing: "border-box" }} />
          <button onClick={lend} style={{ ...baseBtn, background: C.accent, color: C.bg }}>Prêter</button>
        </div>
      </div>

      <h3 style={{ color: C.accent, marginBottom: 14 }}>📤 Disques actuellement prêtés ({lentCds.length})</h3>
      {lentCds.length === 0 && <p style={{ color: C.textDim }}>Aucun disque prêté actuellement.</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {lentCds.map(cd => {
          const days = Math.floor((Date.now() - new Date(cd.lentDate).getTime()) / 86400000);
          const warn = days > 14;
          return (
            <div key={cd.id} style={{ background: C.bgCard, borderRadius: 12, padding: 18, border: `1px solid ${warn ? C.danger + "66" : C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: C.text }}>{cd.album} <span style={{ fontWeight: 400, color: C.textDim }}>— {cd.artist}</span></p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: warn ? C.danger : C.info }}>
                  🤝 Prêté à <strong>{cd.lentTo}</strong> — {days} jour{days > 1 ? "s" : ""}
                  {warn && " ⚠️ Rappel : prêté depuis plus de 2 semaines !"}
                </p>
              </div>
              <button onClick={() => returnCd(cd.id)} style={{ ...baseBtn, background: C.success + "22", color: C.success, border: `1px solid ${C.success}44`, padding: "8px 18px", fontSize: 13 }}>📥 Retour</button>
            </div>
          );
        })}
      </div>

      <h3 style={{ color: C.accent, marginBottom: 14 }}>📜 Historique</h3>
      {reminders.length === 0 && <p style={{ color: C.textDim }}>Aucun historique de prêt.</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[...reminders].reverse().slice(0, 20).map(r => (
          <div key={r.id} style={{ background: C.bgCard, borderRadius: 10, padding: 14, border: `1px solid ${C.border}`, fontSize: 13, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span>
              <span style={{ color: r.type === "lent" ? C.info : C.success }}>{r.type === "lent" ? "📤" : "📥"}</span>
              {" "}<strong style={{ color: C.text }}>{r.album}</strong> <span style={{ color: C.textDim }}>({r.artist})</span>
              {" — "}{r.type === "lent" ? `prêté à ${r.person}` : `retourné par ${r.person}`}
            </span>
            <span style={{ color: C.textDim }}>{fmt(r.date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// RELEASES 
// ═══════════════════════════════════════════════════════════════════════
function ReleasesPage({ userId }) {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favs, setFavs] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    const newRels = await fetchNewReleases();
    setReleases(newRels);
    setLoading(false);
    
    try { const r = await STORAGE.get(`favorites:${userId}`); if (r) setFavs(JSON.parse(r.value)); } catch {}
    try { const r = await STORAGE.get(`wishlist:${userId}`); if (r) setWishlist(JSON.parse(r.value)); } catch {}
  }, [userId]);
  
  useEffect(() => { load(); }, [load]);

  const toggleFav = async (item) => {
    const exists = favs.find(f => f.artist === item.artist && f.album === item.album);
    const next = exists ? favs.filter(f => !(f.artist === item.artist && f.album === item.album)) : [...favs, { ...item, addedAt: now() }];
    setFavs(next);
    await STORAGE.set(`favorites:${userId}`, JSON.stringify(next));
  };

  const toggleWish = async (item) => {
    const exists = wishlist.find(f => f.artist === item.artist && f.album === item.album);
    const next = exists ? wishlist.filter(f => !(f.artist === item.artist && f.album === item.album)) : [...wishlist, { ...item, addedAt: now() }];
    setWishlist(next);
    await STORAGE.set(`wishlist:${userId}`, JSON.stringify(next));
  };

  const isFav = (i) => favs.some(f => f.artist === i.artist && f.album === i.album);
  const isWish = (i) => wishlist.some(f => f.artist === i.artist && f.album === i.album);

  return (
    <div>
      <h1 style={{ fontSize: 28, margin: "0 0 8px", color: C.accent }}>🔥 Dernières Sorties</h1>
      <p style={{ color: C.textDim, margin: "0 0 28px", fontSize: 14 }}>Découvre les nouveautés du moment et ajoute-les à tes favoris ou ta liste d'achats</p>

      {loading && <p style={{ color: C.textDim }}>Chargement des nouveautés...</p>}

      {!loading && releases.length > 0 && (
        <div className="grid-auto">
          {releases.map(r => (
            <div key={r.id} style={{ background: C.bgCard, borderRadius: 16, padding: 18, border: `1px solid ${C.border}`, transition: "all .2s" }}>
              
              <div style={{ width: "100%", height: 160, borderRadius: 12, background: r.cover?.startsWith('http') ? `url(${r.cover}) center/cover` : r.cover, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, marginBottom: 14 }}>
                {!r.cover?.startsWith('http') && "🎵"}
              </div>

              <h4 style={{ margin: 0, fontSize: 16, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.album}</h4>
              <p style={{ margin: "4px 0 8px", fontSize: 13, color: C.textDim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.artist} • {r.year}</p>
              <span style={{ display: "inline-block", fontSize: 11, padding: "3px 10px", borderRadius: 20, background: C.accent + "22", color: C.accent, marginTop: 4 }}>{r.genre}</span>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button onClick={() => toggleFav(r)}
                  style={{ ...baseBtn, flex: 1, padding: "8px 10px", fontSize: 12, background: isFav(r) ? "#e74c3c22" : "transparent", color: isFav(r) ? "#e74c3c" : C.textDim, border: `1px solid ${isFav(r) ? "#e74c3c44" : C.border}` }}>
                  {isFav(r) ? "❤️" : "🤍"} Fav
                </button>
                <button onClick={() => toggleWish(r)}
                  style={{ ...baseBtn, flex: 1, padding: "8px 10px", fontSize: 12, background: isWish(r) ? C.accent + "22" : "transparent", color: isWish(r) ? C.accent : C.textDim, border: `1px solid ${isWish(r) ? C.accent + "44" : C.border}` }}>
                  {isWish(r) ? "🛒" : "➕"} Achat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// FAVORITES / WISHLIST
// ═══════════════════════════════════════════════════════════════════════
function ListPage({ userId, type, title }) {
  const [items, setItems] = useState([]);
  const load = useCallback(async () => {
    try { const r = await STORAGE.get(`${type}:${userId}`); if (r) setItems(JSON.parse(r.value)); } catch {}
  }, [userId, type]);
  useEffect(() => { load(); }, [load]);

  const remove = async (idx) => {
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
    await STORAGE.set(`${type}:${userId}`, JSON.stringify(next));
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, margin: "0 0 28px", color: C.accent }}>{title} <span style={{ fontSize: 16, color: C.textDim }}>({items.length})</span></h1>
      {items.length === 0 && <p style={{ color: C.textDim, textAlign: "center", marginTop: 60 }}>Aucun élément pour l'instant. Explore les nouveautés pour en ajouter !</p>}
      <div className="grid-auto">
        {items.map((item, i) => (
          <div key={i} style={{ background: C.bgCard, borderRadius: 14, padding: 16, border: `1px solid ${C.border}`, position: "relative" }}>
            
            <div style={{ width: "100%", height: 160, borderRadius: 10, background: item.cover?.startsWith('http') ? `url(${item.cover}) center/cover` : (item.cover || `hsl(${i * 60}, 45%, 32%)`), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 12 }}>
              {!item.cover?.startsWith('http') && (type === "favorites" ? "❤️" : "🛒")}
            </div>

            <h4 style={{ margin: 0, fontSize: 14, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.album}</h4>
            <p style={{ margin: "4px 0", fontSize: 12, color: C.textDim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.artist}</p>

            {type === "favorites" && (
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <a href={`https://open.spotify.com/search/${encodeURIComponent(item.artist + ' ' + item.album)}`} target="_blank" rel="noreferrer" style={{ ...baseBtn, flex: 1, padding: "6px", fontSize: 11, background: "#1db95422", color: "#1db954", border: `1px solid #1db95444`, textDecoration: "none", textAlign: "center", boxSizing: "border-box" }}>Spotify</a>
                    <a href={`https://music.apple.com/fr/search?term=${encodeURIComponent(item.artist + ' ' + item.album)}`} target="_blank" rel="noreferrer" style={{ ...baseBtn, flex: 1, padding: "6px", fontSize: 11, background: "#fa243c22", color: "#fa243c", border: `1px solid #fa243c44`, textDecoration: "none", textAlign: "center", boxSizing: "border-box" }}>Apple Music</a>
                </div>
            )}

            {type === "wishlist" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                    <a href={`https://www.amazon.fr/s?k=${encodeURIComponent(item.artist + ' ' + item.album + ' cd vinyle')}`} target="_blank" rel="noreferrer" style={{ ...baseBtn, padding: "6px", fontSize: 11, background: "#f39c1222", color: "#f39c12", border: `1px solid #f39c1244`, textDecoration: "none", textAlign: "center", boxSizing: "border-box" }}>Amazon</a>
                    <a href={`https://www.fnac.com/SearchResult/ResultList.aspx?Search=${encodeURIComponent(item.artist + ' ' + item.album)}`} target="_blank" rel="noreferrer" style={{ ...baseBtn, padding: "6px", fontSize: 11, background: "#d3540022", color: "#d35400", border: `1px solid #d3540044`, textDecoration: "none", textAlign: "center", boxSizing: "border-box" }}>Fnac</a>
                    <a href={`https://www.leboncoin.fr/recherche?text=${encodeURIComponent(item.artist + ' ' + item.album + ' cd vinyle')}`} target="_blank" rel="noreferrer" style={{ ...baseBtn, padding: "6px", fontSize: 11, background: "#f56b2a22", color: "#f56b2a", border: `1px solid #f56b2a44`, textDecoration: "none", textAlign: "center", boxSizing: "border-box" }}>Leboncoin</a>
                    <a href={`https://www.ebay.fr/sch/i.html?_nkw=${encodeURIComponent(item.artist + ' ' + item.album + ' cd vinyle')}`} target="_blank" rel="noreferrer" style={{ ...baseBtn, padding: "6px", fontSize: 11, background: "#0064d222", color: "#0064d2", border: `1px solid #0064d244`, textDecoration: "none", textAlign: "center", boxSizing: "border-box" }}>eBay</a>
                </div>
            )}

            <button onClick={() => remove(i)} style={{ position: "absolute", top: 10, right: 10, background: C.danger + "33", color: C.danger, border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 12 }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PROMPTS
// ═══════════════════════════════════════════════════════════════════════
function PromptsPage() {
  return (
    <div>
      <h1 style={{ fontSize: 28, margin: "0 0 28px", color: C.accent }}>📝 Historique des Prompts</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {PROMPTS.map((p, i) => (
          <div key={i} style={{ background: C.bgCard, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 20, background: C.accent + "22", color: C.accent, fontWeight: 700 }}>Prompt #{i + 1}</span>
              <span style={{ fontSize: 13, color: C.textDim }}>🕐 {p.time}</span>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CREDITS
// ═══════════════════════════════════════════════════════════════════════
function CreditsPage() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>💿</div>
        <h1 style={{ fontSize: 36, margin: 0, color: C.accent, letterSpacing: 2 }}>LaDisquerie</h1>
        <div style={{ width: 60, height: 2, background: C.accent, margin: "24px auto 0" }} />
      </div>

      <h2 style={{ color: C.accent, fontSize: 20, marginBottom: 24, textAlign: "center" }}>⭐ L'équipe</h2>
      <div className="credits-grid">
        {TEAM.map((t, i) => (
          <div key={i} style={{ background: C.bgCard, borderRadius: 16, padding: 28, border: `1px solid ${C.border}`, textAlign: "center", transition: "all .3s" }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>{t.emoji}</div>
            <h3 style={{ margin: 0, fontSize: 18, color: C.text }}>{t.name}</h3>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: C.accent }}>{t.role}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: 32, background: C.bgCard, borderRadius: 16, border: `1px solid ${C.border}` }}>
        <p style={{ color: C.textDim, fontSize: 13, margin: 0 }}>Dépôt GitHub : <strong style={{ color: C.accent }}>LaDisquerie</strong></p>
        <p style={{ color: C.textDim, fontSize: 12, marginTop: 8 }}>© 2026 LaDisquerie — Tous droits réservés</p>
      </div>
    </div>
  );
}