const fallbackProducts = [
  {
    name: "ของน่ากดจาก Shopee",
    category: "ของน่ากด",
    price: null,
    note: "ลิงก์นี้เป็นสินค้าที่คุณส่งมา กดดูรายละเอียดจริงบน Shopee ได้เลย",
    image: "./assets/shopee-find.svg",
    link: "https://s.shopee.co.th/5VTF6JcgvG"
  },
  {
    name: "สมุดจดพล็อตปกแข็ง",
    category: "ของนักเขียน",
    price: 89,
    note: "ไว้เก็บไอเดียที่โผล่มาตอนอาบน้ำ เดินเล่น หรือกำลังจะหลับ",
    image: "./assets/notebook.svg",
    link: "https://shopee.co.th/your-affiliate-link-notebook"
  },
  {
    name: "ปากกาเจลไว้แก้พล็อต",
    category: "ของนักเขียน",
    price: 69,
    note: "ขีดเส้นใต้ฉากสำคัญ เขียนชื่อเล่นตัวละคร และจดประโยคที่ไม่อยากลืม",
    image: "./assets/pens.svg",
    link: "https://shopee.co.th/your-affiliate-link-pens"
  },
  {
    name: "แก้วเก็บอุณหภูมิประจำโต๊ะ",
    category: "ของใช้",
    price: 199,
    note: "กาแฟ ชา หรือโกโก้ยังอุ่นอยู่ ระหว่างรอพระเอกพูดความจริง",
    image: "./assets/tumbler.svg",
    link: "https://shopee.co.th/your-affiliate-link-tumbler"
  },
  {
    name: "หมอนรองหลังอ่านยาวๆ",
    category: "ของใช้",
    price: 249,
    note: "เหมาะกับคืนที่ตั้งใจอ่านแค่ตอนเดียว แต่รู้ตัวอีกทีเช้าแล้ว",
    image: "./assets/cushion.svg",
    link: "https://shopee.co.th/your-affiliate-link-cushion"
  },
  {
    name: "ชั้นวางหนังสือข้างโต๊ะ",
    category: "มุมอ่าน",
    price: 179,
    note: "วางหนังสือ สมุด พัสดุ และของเล็กๆ ที่ไม่รู้จะเก็บไว้ตรงไหน",
    image: "./assets/bookshelf.svg",
    link: "https://shopee.co.th/your-affiliate-link-bookshelf"
  },
  {
    name: "สติกเกอร์แต่งสมุด",
    category: "ของใจฟู",
    price: 35,
    note: "ของเล็กๆ ที่ทำให้สมุดธรรมดาดูน่าหยิบขึ้นมาจดอีกนิด",
    image: "./assets/stickers.svg",
    link: "https://shopee.co.th/your-affiliate-link-stickers"
  },
  {
    name: "กระเป๋าผ้าใส่หนังสือ",
    category: "ของใช้",
    price: 129,
    note: "พกหนังสือ สมุด หรือของชิ้นเล็กๆ ออกไปอ่านนอกบ้าน",
    image: "./assets/tote.svg",
    link: "https://shopee.co.th/your-affiliate-link-tote"
  }
];

const products = window.SOFT_FINDS_PRODUCTS?.length ? window.SOFT_FINDS_PRODUCTS : fallbackProducts;
const categories = ["ทั้งหมด", ...new Set(products.map((product) => product.category))];
let activeCategory = "ทั้งหมด";
let visibleCount = 18;

const grid = document.querySelector("#productGrid");
const tabs = document.querySelector("#categoryTabs");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const toast = document.querySelector("#toast");
const loadMoreButton = document.querySelector("#loadMoreButton");
const pinHeights = [190, 220, 260, 310, 240, 280, 210, 340];

function makeFeedItems(items, count) {
  const feed = [];
  for (let index = 0; index < count; index += 1) {
    const product = items[index % items.length];
    feed.push({
      ...product,
      feedId: `${product.name}-${index}`,
      height: pinHeights[(index + product.name.length) % pinHeights.length]
    });
  }

  return feed.sort((a, b) => {
    const seedA = (a.feedId.length * 17 + a.height * 3) % 97;
    const seedB = (b.feedId.length * 17 + b.height * 3) % 97;
    return seedA - seedB;
  });
}

function formatPrice(price) {
  if (!price) return "ดูราคาใน Shopee";
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(price);
}

function renderTabs() {
  tabs.innerHTML = categories
    .map(
      (category) => `
        <button class="segment" type="button" role="tab" aria-selected="${category === activeCategory}" data-category="${category}">
          ${category}
        </button>
      `
    )
    .join("");
}

function getFilteredProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesCategory = activeCategory === "ทั้งหมด" || product.category === activeCategory;
    const matchesQuery = [product.name, product.category, product.note]
      .join(" ")
      .toLowerCase()
      .includes(query);
    return matchesCategory && matchesQuery;
  });

  return filtered.sort((a, b) => {
    const priceA = a.price ?? Number.MAX_SAFE_INTEGER;
    const priceB = b.price ?? Number.MAX_SAFE_INTEGER;
    if (sortSelect.value === "low") return priceA - priceB;
    if (sortSelect.value === "high") return priceB - priceA;
    return products.indexOf(a) - products.indexOf(b);
  });
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();
  const feedProducts = filteredProducts.length ? makeFeedItems(filteredProducts, visibleCount) : [];
  resultCount.textContent = filteredProducts.length ? `${filteredProducts.length} แบบในฟีด` : "0 รายการ";
  emptyState.hidden = feedProducts.length > 0;
  loadMoreButton.hidden = feedProducts.length === 0;

  grid.innerHTML = feedProducts
    .map(
      (product) => `
        <article class="product-card" style="--pin-height: ${product.height}px">
          <div class="product-media">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
          </div>
          <div class="product-body">
            <span class="product-category">${product.category}</span>
            <h3>${product.name}</h3>
            <p>${product.note}</p>
            <div class="product-meta">
              <span class="price">${formatPrice(product.price)}</span>
              <span>Shopee</span>
            </div>
          </div>
          <a class="shop-link" href="${product.link}" target="_blank" rel="sponsored noopener noreferrer">
            ไปที่ Shopee
          </a>
        </article>
      `
    )
    .join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

tabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  visibleCount = 18;
  renderTabs();
  renderProducts();
});

searchInput.addEventListener("input", () => {
  visibleCount = 18;
  renderProducts();
});

sortSelect.addEventListener("change", () => {
  visibleCount = 18;
  renderProducts();
});

loadMoreButton.addEventListener("click", () => {
  visibleCount += 12;
  renderProducts();
});

window.addEventListener("scroll", () => {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 700;
  if (nearBottom && visibleCount < 90 && !grid.hidden) {
    visibleCount += 6;
    renderProducts();
  }
});

document.querySelector("#copyPostButton").addEventListener("click", async () => {
  const postText = `อ่านจบแล้วแวะเลื่อนดูของน่ารักๆ ได้นะคะ

ไม่ใช่โดเนทน้า เป็นฟีดรวมของจาก Shopee ถ้ามีอันไหนถูกใจแล้วซื้อผ่านลิงก์นี้ เราอาจได้ค่าคอมเล็กๆ โดยคุณจ่ายราคาเดิม

ขอบคุณที่ช่วยต่อไฟให้ตอนถัดไปค่ะ`;

  try {
    await navigator.clipboard.writeText(postText);
    showToast("คัดลอกข้อความโพสต์แล้ว");
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = postText;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    showToast("คัดลอกข้อความโพสต์แล้ว");
  }
});

renderTabs();
renderProducts();
