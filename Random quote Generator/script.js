const quotes = [
  {text:"The future depends on what you do today.",author:"Mahatma Gandhi",category:"Motivation"},
  {text:"Believe you can and you're halfway there.",author:"Theodore Roosevelt",category:"Motivation"},
  {text:"Dream big and dare to fail.",author:"Norman Vaughan",category:"Motivation"},
  {text:"Success is not final, failure is not fatal.",author:"Winston Churchill",category:"Success"},
  {text:"Opportunities don't happen. You create them.",author:"Chris Grosser",category:"Success"},
  {text:"Life is what happens when you're busy making other plans.",author:"John Lennon",category:"Life"},
  {text:"Turn your wounds into wisdom.",author:"Oprah Winfrey",category:"Life"},
  {text:"Learning never exhausts the mind.",author:"Leonardo da Vinci",category:"Study"},
  {text:"Education is the most powerful weapon you can use to change the world.",author:"Nelson Mandela",category:"Study"}
];

const $ = id => document.getElementById(id);

const quote = $("quote");
const author = $("author");
const badge = $("categoryBadge");
const newBtn = $("newQuoteBtn");
const favBtn = $("favoriteBtn");
const copyBtn = $("copyBtn");
const shareBtn = $("shareBtn");
const themeBtn = $("themeBtn");
const favCount = $("favoriteCount");
const favBox = $("favoritesContainer");
const clearBtn = $("clearFavorites");
const toast = $("toast");
const categories = document.querySelectorAll(".category");

let category = "All";
let current;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


/* SHOW QUOTE */

function showQuote() {
  let list = category === "All"
    ? quotes
    : quotes.filter(q => q.category === category);

  let next;
  do {
    next = list[Math.floor(Math.random() * list.length)];
  } while (list.length > 1 && next === current);

  current = next;

  quote.textContent = `"${current.text}"`;
  author.textContent = `— ${current.author}`;
  badge.textContent = current.category;

  updateHeart();
}


/* CATEGORY */

categories.forEach(btn => {
  btn.onclick = () => {
    categories.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    category = btn.dataset.category;
    showQuote();
  };
});

newBtn.onclick = showQuote;


/* FAVORITE */

favBtn.onclick = () => {
  const exists = favorites.some(q => q.text === current.text);

  favorites = exists
    ? favorites.filter(q => q.text !== current.text)
    : [...favorites, current];

  save();
  renderFavorites();
  updateHeart();

  toastMsg(exists ? "Removed from favorites" : "Added to favorites ❤️");
};

function updateHeart() {
  const liked = favorites.some(q => q.text === current.text);
  favBtn.innerHTML = liked
    ? '<i class="fa-solid fa-heart"></i>'
    : '<i class="fa-regular fa-heart"></i>';
}

function save() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}


/* FAVORITES LIST */

function renderFavorites() {
  favCount.textContent = favorites.length;

  favBox.innerHTML = favorites.length
    ? favorites.map((q,i) => `
      <div class="favorite-card">
        <button onclick="removeFav(${i})">
          <i class="fa-solid fa-trash"></i>
        </button>
        <p>"${q.text}"</p>
        <span>— ${q.author}</span>
      </div>
    `).join("")
    : `<p class="empty-message">No favourite quotes yet.</p>`;
}

function removeFav(i) {
  favorites.splice(i,1);
  save();
  renderFavorites();
  updateHeart();
  toastMsg("Favorite removed");
}

clearBtn.onclick = () => {
  if (!favorites.length) return toastMsg("No favorites to clear");

  if (confirm("Clear all favorites?")) {
    favorites = [];
    save();
    renderFavorites();
    updateHeart();
    toastMsg("Favorites cleared");
  }
};


/* COPY */

copyBtn.onclick = () => {
  const text = `"${current.text}" — ${current.author}`;

  const area = document.createElement("textarea");
  area.value = text;
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();

  toastMsg("Quote copied 📋");
};


/* SHARE */

shareBtn.onclick = async () => {
  const text = `"${current.text}" — ${current.author}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "QuoteVerse",
        text
      });
    } catch {}
  } else {
    copyBtn.click();
  }
};


/* DARK MODE */

themeBtn.onclick = () => {
  document.body.classList.toggle("dark");

  const dark = document.body.classList.contains("dark");

  themeBtn.innerHTML = dark
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';

  localStorage.setItem("theme", dark);
};

if (localStorage.getItem("theme") === "true") {
  document.body.classList.add("dark");
  themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}


/* TOAST */

function toastMsg(msg) {
  toast.textContent = msg;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 2000);
}


/* START */

renderFavorites();
showQuote();