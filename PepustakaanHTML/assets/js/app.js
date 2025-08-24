/* -----------------------------
   DATA DEMO
------------------------------ */
const books = [
  {
    id: "B001",
    title: "Algoritma & Pemrograman",
    author: "Wahyudi S.",
    year: 2022,
    rating: 4.6,
    category: "Teknologi",
    tags: ["coding", "dasar", "struktur data"],
    available: 6,
    pop: 88,
    color: "linear-gradient(120deg,#6ee7ff,#a78bfa)"
  },
  {
    id: "B002",
    title: "Sejarah Nusantara",
    author: "Dini A. Pramudita",
    year: 2020,
    rating: 4.2,
    category: "Sejarah",
    tags: ["kerajaan", "budaya"],
    available: 3,
    pop: 64,
    color: "linear-gradient(120deg,#a78bfa,#f472b6)"
  },
  {
    id: "B003",
    title: "Matematika Diskrit",
    author: "R. Kurnia",
    year: 2024,
    rating: 4.8,
    category: "Sains",
    tags: ["graf", "logika", "kombinatorik"],
    available: 5,
    pop: 97,
    color: "linear-gradient(120deg,#60a5fa,#34d399)"
  },
  {
    id: "B004",
    title: "Psikologi Komunikasi",
    author: "A. Nasution",
    year: 2019,
    rating: 4.1,
    category: "Sosial",
    tags: ["komunikasi", "perilaku"],
    available: 2,
    pop: 51,
    color: "linear-gradient(120deg,#f59e0b,#ef4444)"
  },
  {
    id: "B005",
    title: "Dasar Basis Data",
    author: "N. Lestari",
    year: 2023,
    rating: 4.7,
    category: "Teknologi",
    tags: ["sql", "rdbms", "normalisasi"],
    available: 7,
    pop: 90,
    color: "linear-gradient(120deg,#34d399,#6ee7ff)"
  },
  {
    id: "B006",
    title: "Sastra & Semiotika",
    author: "M. Hadinata",
    year: 2018,
    rating: 3.9,
    category: "Sastra",
    tags: ["analisis", "teks"],
    available: 4,
    pop: 40,
    color: "linear-gradient(120deg,#f472b6,#60a5fa)"
  },
  {
    id: "B007",
    title: "Fisika Modern",
    author: "T. Prakoso",
    year: 2021,
    rating: 4.5,
    category: "Sains",
    tags: ["relativitas", "kuantum"],
    available: 3,
    pop: 76,
    color: "linear-gradient(120deg,#60a5fa,#a78bfa)"
  },
  {
    id: "B008",
    title: "Ekonomi Mikro",
    author: "S. Hartono",
    year: 2019,
    rating: 4.0,
    category: "Ekonomi",
    tags: ["pasar", "permintaan"],
    available: 6,
    pop: 58,
    color: "linear-gradient(120deg,#6ee7ff,#34d399)"
  },
];

/* -----------------------------
   STATE & STORAGE
------------------------------ */
const state = {
  query: "",
  category: "Semua",
  sort: "terbaru",
  cart: loadJSON("cart", []),
  favorites: new Set(loadJSON("favorites", [])),
  theme: localStorage.getItem("theme") || "dark",
};

function saveJSON(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}
function loadJSON(key, fallback){
  try{
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(fallback) ? (v ?? fallback) : (v || fallback);
  }catch(e){ return fallback }
}

/* -----------------------------
   HELPERS
------------------------------ */
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function showToast(msg, timeout=2000){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=> t.classList.remove("show"), timeout);
}

function formatStars(rating){
  const filled = "★".repeat(Math.round(rating));
  const empty = "☆".repeat(5 - Math.round(rating));
  return `${filled}${empty} (${rating.toFixed(1)})`;
}

/* -----------------------------
   RENDER UI
------------------------------ */
const categories = ["Semua","Teknologi","Sains","Sejarah","Sosial","Sastra","Ekonomi"];

function renderCategoryChips(){
  const wrap = $("#categoryChips");
  wrap.innerHTML = "";
  categories.forEach(cat=>{
    const b = document.createElement("button");
    b.className = "chip" + (state.category===cat ? " active" : "");
    b.textContent = cat;
    b.onclick = ()=>{
      state.category = cat;
      renderAll();
    };
    wrap.appendChild(b);
  });
}

function filteredBooks(){
  let list = [...books];
  // filter kategori
  if(state.category!=="Semua"){
    list = list.filter(b => b.category === state.category);
  }
  // search
  const q = state.query.trim().toLowerCase();
  if(q){
    list = list.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  // sort
  if(state.sort==="terbaru") list.sort((a,b)=> b.year - a.year);
  if(state.sort==="populer") list.sort((a,b)=> b.pop - a.pop);
  if(state.sort==="az") list.sort((a,b)=> a.title.localeCompare(b.title));
  return list;
}

function renderBooks(){
  const grid = $("#booksGrid");
  const list = filteredBooks();
  grid.innerHTML = "";

  if(list.length===0){
    grid.innerHTML = `<div class="card" style="grid-column:1/-1; padding:22px;">
      Tidak ada buku yang cocok dengan pencarian.
    </div>`;
    return;
  }

  list.forEach(b=>{
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="cover" style="background:${b.color}">
        <div>${b.title.split(" ").slice(0,2).join(" ")}</div>
      </div>
      <div class="meta">
        <div class="title">${b.title}</div>
        <div class="author">oleh ${b.author} • ${b.year}</div>
        <div class="tags">
          ${b.tags.map(t=>`<span class="tag">#${t}</span>`).join("")}
        </div>
        <div class="tags" style="margin-top:-4px">
          <span class="tag">${b.category}</span>
          <span class="tag">${formatStars(b.rating)}</span>
          <span class="tag">${b.available} tersedia</span>
        </div>
        <div class="actions">
          <button class="primary" data-act="add">Pinjam</button>
          <button class="outline" data-act="detail">Detail</button>
          <button class="heart ${state.favorites.has(b.id) ? "active":""}" data-act="fav">❤</button>
        </div>
      </div>
    `;
    card.querySelector('[data-act="add"]').onclick = ()=> addToCart(b.id);
    card.querySelector('[data-act="detail"]').onclick = ()=> openModal(b.id);
    card.querySelector('[data-act="fav"]').onclick = (e)=> toggleFavorite(b.id,e.currentTarget);
    grid.appendChild(card);
  });
}

function renderCategories(){
  const wrap = $("#categoryGrid");
  wrap.innerHTML = "";
  categories.filter(c=>c!=="Semua").forEach(cat=>{
    const count = books.filter(b=>b.category===cat).length;
    const available = books.filter(b=>b.category===cat).reduce((s,b)=>s+b.available,0);
    const el = document.createElement("div");
    el.className = "cat-card";
    el.innerHTML = `
      <div class="cat-title">${cat}</div>
      <div class="cat-desc">${count} judul • ${available} eksemplar tersedia</div>
      <a href="#koleksi" class="cat-link">Lihat</a>
    `;
    el.querySelector(".cat-link").onclick = ()=>{
      state.category = cat;
      renderCategoryChips();
      renderBooks();
    };
    wrap.appendChild(el);
  });
}

function renderStats(){
  $("#statBuku").textContent = books.length;
  $("#statTersedia").textContent = books.reduce((s,b)=>s+b.available,0);
  const totalBorrowed = state.cart.reduce((s,it)=> s+it.qty, 0);
  $("#statDipinjam").textContent = totalBorrowed;
}

function renderCart(){
  const list = $("#cartList");
  list.innerHTML = "";
  let total = 0;

  if(state.cart.length===0){
    list.innerHTML = `<div class="cart-empty">Keranjang kosong. Tambahkan buku untuk dipinjam.</div>`;
  }

  state.cart.forEach(item=>{
    const b = books.find(x=>x.id===item.id);
    total += item.qty;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <div class="cart-title">${b.title}</div>
        <div class="cart-sub">${b.author} • ${b.year}</div>
      </div>
      <div class="item-controls">
        <button class="qty-btn" data-act="min">-</button>
        <div>${item.qty}</div>
        <button class="qty-btn" data-act="plus">+</button>
        <button class="qty-btn" data-act="del" title="Hapus">×</button>
      </div>
    `;
    row.querySelector('[data-act="min"]').onclick = ()=> changeQty(item.id, -1);
    row.querySelector('[data-act="plus"]').onclick = ()=> changeQty(item.id, +1);
    row.querySelector('[data-act="del"]').onclick = ()=> removeFromCart(item.id);
    list.appendChild(row);
  });

  $("#cartTotal").textContent = total;
  $("#cartBadge").textContent = total;
}

/* -----------------------------
   CART LOGIC
------------------------------ */
function addToCart(id){
  const found = state.cart.find(x=>x.id===id);
  if(found){
    changeQty(id, +1);
  }else{
    state.cart.push({id, qty:1});
  }
  saveJSON("cart", state.cart);
  renderCart();
  showToast("Ditambahkan ke keranjang.");
}

function changeQty(id, delta){
  const idx = state.cart.findIndex(x=>x.id===id);
  if(idx<0) return;
  state.cart[idx].qty += delta;
  if(state.cart[idx].qty<=0) state.cart.splice(idx,1);
  saveJSON("cart", state.cart);
  renderCart();
}

function removeFromCart(id){
  const before = state.cart.length;
  state.cart = state.cart.filter(x=>x.id!==id);
  if(state.cart.length !== before){
    saveJSON("cart", state.cart);
    renderCart();
    showToast("Item dihapus.");
  }
}

/* -----------------------------
   FAVORITES
------------------------------ */
function toggleFavorite(id, btn){
  if(state.favorites.has(id)){
    state.favorites.delete(id);
    btn && btn.classList.remove("active");
    showToast("Dihapus dari favorit.");
  }else{
    state.favorites.add(id);
    btn && btn.classList.add("active");
    showToast("Ditambahkan ke favorit.");
  }
  saveJSON("favorites", Array.from(state.favorites));
}

/* -----------------------------
   MODAL
------------------------------ */
let currentModalId = null;

function openModal(id){
  currentModalId = id;
  const b = books.find(x=>x.id===id);
  $("#modalTitle").textContent = b.title;
  $("#modalBody").innerHTML = `
    <div class="modal-cover" style="background:${b.color}"></div>
    <div class="modal-meta">
      <div class="line"><strong>Penulis:</strong> ${b.author}</div>
      <div class="line"><strong>Tahun:</strong> ${b.year}</div>
      <div class="line"><strong>Kategori:</strong> ${b.category}</div>
      <div class="line"><strong>Rating:</strong> ${formatStars(b.rating)}</div>
      <div class="line"><strong>Tag:</strong> ${b.tags.map(t=>`<span class="tag">#${t}</span>`).join(" ")} </div>
      <div class="line"><strong>Stok:</strong> ${b.available} tersedia</div>
      <p class="muted" style="margin-top:8px">
        Deskripsi singkat: Buku <em>${b.title}</em> menyediakan materi padat dan contoh aplikatif. 
        Cocok untuk pelajar dan umum.
      </p>
    </div>
  `;
  $("#modalFav").classList.toggle("active", state.favorites.has(id));
  $("#bookModal").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  $("#bookModal").classList.remove("show");
  document.body.style.overflow = "";
}

/* -----------------------------
   THEME
------------------------------ */
function applyTheme(){
  document.body.classList.toggle("light", state.theme==="light");
}
function toggleTheme(){
  state.theme = state.theme==="light" ? "dark" : "light";
  localStorage.setItem("theme", state.theme);
  applyTheme();
}

/* -----------------------------
   INIT
------------------------------ */
function renderAll(){
  renderCategoryChips();
  renderBooks();
  renderCategories();
  renderStats();
}

function init(){
  // year
  $("#year").textContent = new Date().getFullYear();

  // theme
  applyTheme();

  // search
  $("#searchInput").addEventListener("input", (e)=>{
    state.query = e.target.value;
    renderAll();
  });
  $("#clearSearch").onclick = ()=>{
    $("#searchInput").value = "";
    state.query = "";
    renderAll();
  };

  // sort
  $("#sortSelect").addEventListener("change", (e)=>{
    state.sort = e.target.value;
    renderAll();
  });

  // drawer
  $("#openCart").onclick = ()=> $("#cartDrawer").classList.add("open");
  $("#closeCart").onclick = ()=> $("#cartDrawer").classList.remove("open");

  // modal
  $("#closeModal").onclick = closeModal;
  $("#bookModal").addEventListener("click", (e)=>{
    if(e.target.id==="bookModal") closeModal();
  });

  // modal actions
  $("#modalAddCart").onclick = ()=>{
    if(currentModalId) addToCart(currentModalId);
  };
  $("#modalFav").onclick = ()=>{
    if(!currentModalId) return;
    toggleFavorite(currentModalId, $("#modalFav"));
    $("#modalFav").textContent = state.favorites.has(currentModalId) ? "❤ Di Favorit" : "❤ Favorit";
  };

  // theme toggle
  $("#themeToggle").onclick = toggleTheme;

  renderAll();
  renderCart();
}

document.addEventListener("DOMContentLoaded", init);
