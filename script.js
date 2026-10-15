const products = [
 {id:1,name:"لوله پلی‌اتیلن آبیاری",category:"لوله و اتصالات",price:185000,unit:"هر متر",emoji:"🌀",tag:"پرفروش",bg:"#e8f1e6"},
 {id:2,name:"نوار آبیاری قطره‌ای",category:"آبیاری قطره‌ای",price:720000,unit:"رول",emoji:"💧",tag:"پیشنهاد ویژه",bg:"#e4f1f4"},
 {id:3,name:"اتصال زانویی پلی‌اتیلن",category:"لوله و اتصالات",price:95000,unit:"عدد",emoji:"🔩",tag:"",bg:"#f4eee3"},
 {id:4,name:"آبپاش تنظیم‌شونده",category:"آبیاری قطره‌ای",price:245000,unit:"عدد",emoji:"🚿",tag:"",bg:"#e7edf7"},
 {id:5,name:"فیلتر دیسکی آبیاری",category:"ابزار و تجهیزات",price:1250000,unit:"عدد",emoji:"⚙️",tag:"کیفیت بالا",bg:"#f0e9f5"},
 {id:6,name:"شیر کنترل جریان",category:"لوله و اتصالات",price:315000,unit:"عدد",emoji:"🔧",tag:"",bg:"#e9f1e9"},
 {id:7,name:"قطره‌چکان تنظیمی",category:"آبیاری قطره‌ای",price:45000,unit:"عدد",emoji:"💦",tag:"",bg:"#e2f3f1"},
 {id:8,name:"تایمر آبیاری دیجیتال",category:"ابزار و تجهیزات",price:1890000,unit:"عدد",emoji:"⏱️",tag:"هوشمند",bg:"#f5eee2"}
];
const fa = n => new Intl.NumberFormat('fa-IR').format(n);
const toman = n => `${fa(n)} تومان`;
let selectedCategory = "همه";
let cart = JSON.parse(localStorage.getItem("tipagri-cart-demo") || "{}");
const grid = document.getElementById("productGrid");
const toast = document.getElementById("toast");

function renderProducts(){
 const query = document.getElementById("searchInput").value.trim().toLowerCase();
 const shown = products.filter(p => (selectedCategory==="همه" || p.category===selectedCategory) && p.name.toLowerCase().includes(query));
 if(!shown.length){grid.innerHTML='<div class="empty-state">محصولی با این مشخصات پیدا نشد. عبارت دیگری را امتحان کن.</div>';return;}
 grid.innerHTML = shown.map(p=>`<article class="product-card">
  <div class="product-art" style="--product-bg:${p.bg}">${p.tag?`<span class="product-tag">${p.tag}</span>`:""}<span class="product-emoji">${p.emoji}</span></div>
  <div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3>
   <div class="product-bottom"><div class="price">${toman(p.price)}<small> / ${p.unit}</small></div><button class="add-btn" data-add="${p.id}" aria-label="افزودن ${p.name} به سبد خرید">+</button></div>
  </div></article>`).join("");
}
function saveCart(){localStorage.setItem("tipagri-cart-demo",JSON.stringify(cart));renderCart();}
function addToCart(id){cart[id]=(cart[id]||0)+1;saveCart();showToast("محصول به سبد خرید اضافه شد.");}
function changeQty(id,delta){cart[id]=(cart[id]||0)+delta;if(cart[id]<=0)delete cart[id];saveCart();}
function renderCart(){
 const count=Object.values(cart).reduce((a,b)=>a+b,0);
 document.getElementById("cartCount").textContent=fa(count);
 const items=products.filter(p=>cart[p.id]);
 const container=document.getElementById("cartItems");
 if(!items.length) container.innerHTML='<div class="cart-empty">🛒<br>سبد خریدت هنوز خالی است.</div>';
 else container.innerHTML=items.map(p=>`<div class="cart-line"><div class="mini-art" style="background:${p.bg}">${p.emoji}</div><div class="cart-line-info"><b>${p.name}</b><small>${toman(p.price)}</small></div><div class="quantity"><button data-qty="${p.id}" data-delta="-1" aria-label="کم کردن">−</button><span>${fa(cart[p.id])}</span><button data-qty="${p.id}" data-delta="1" aria-label="زیاد کردن">+</button></div></div>`).join("");
 const total=items.reduce((sum,p)=>sum+p.price*cart[p.id],0);
 document.getElementById("cartTotal").textContent=toman(total);
}
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2500);}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","false");}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","true");}
document.getElementById("filters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;selectedCategory=b.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
document.getElementById("searchInput").addEventListener("input",renderProducts);
grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(Number(b.dataset.add));});
document.getElementById("cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-qty]");if(b)changeQty(Number(b.dataset.qty),Number(b.dataset.delta));});
document.getElementById("cartOpen").addEventListener("click",openCart);
document.getElementById("cartClose").addEventListener("click",closeCart);
document.getElementById("overlay").addEventListener("click",closeCart);
document.getElementById("checkoutBtn").addEventListener("click",()=>{if(!Object.keys(cart).length){showToast("ابتدا محصولی به سبد خرید اضافه کن.");return;}showToast("این نسخه نمایشی است؛ پرداخت واقعی فعال نیست.");});
document.getElementById("newsletterForm").addEventListener("submit",e=>{e.preventDefault();showToast("ثبت آزمایشی انجام شد؛ ایمیلی ارسال نشده است.");e.target.reset();});
document.getElementById("searchToggle").addEventListener("click",()=>{document.getElementById("searchInput").focus();document.getElementById("products").scrollIntoView({behavior:"smooth"});});
renderProducts();renderCart();
