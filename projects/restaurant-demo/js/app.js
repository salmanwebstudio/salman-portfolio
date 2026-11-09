/* UI layer. No page code accesses localStorage directly. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s),
    $$ = (s, r = document) => [...r.querySelectorAll(s)],
    db = window.RestaurantData,
    page = document.body.dataset.page;
  const money = (n) => `Rs. ${Number(n || 0).toLocaleString("en-PK")}`;
  const esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const bg = (url) =>
    `background-image:url('${String(url || "").replace(/[)'"\\]/g, "")}')`;

const currentPath = window.location.pathname;
const isInsidePages = currentPath.includes("/pages/");

const rootPath = isInsidePages ? "../" : "./";

const nav = [
  ["Home", `${rootPath}index.html`, "home"],
  ["Menu", `${rootPath}pages/menu.html`, "menu"],
  ["Our story", `${rootPath}pages/about.html`, "about"],
  ["Contact", `${rootPath}pages/contact.html`, "contact"],
];

function shared() {
  $("#site-header").innerHTML =
    `<header class="site-header"><div class="topbar"><div class="topbar-inner"><span>G.T. Road, Gujrat · +92 300 1234567</span><span>Open daily · 12:00 PM – 10:00 PM</span></div></div><div class="navbar"><a class="brand" href="${rootPath}index.html">Saffron & Sage<small>FRESH · LOCAL · HEARTFELT</small></a><nav id="main-nav" class="nav-links" aria-label="Main navigation">${nav.map(([t, u, k]) => `<a href="${u}" ${page === k ? 'aria-current="page"' : ""}>${t}</a>`).join("")}</nav><div class="nav-actions"><a class="cart-link" href="${rootPath}pages/cart.html">Cart <span id="header-cart-count" class="cart-count">0</span></a><button class="menu-toggle" id="menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="main-nav">☰</button></div></div></header>`;

  $("#site-footer").innerHTML =
    `<footer class="site-footer"><div class="footer-grid"><div><div class="footer-brand">Saffron & Sage</div><p>Honest ingredients, generous plates and good moments shared around the table.</p></div><div><h3>Explore</h3><ul><li><a href="${rootPath}pages/menu.html">Our menu</a></li><li><a href="${rootPath}pages/about.html">Our story</a></li><li><a href="${rootPath}pages/contact.html">Contact</a></li><li><a href="${rootPath}admin.html">Owner panel</a></li></ul></div><div><h3>Find us</h3><p>G.T. Road, Gujrat<br>Punjab, Pakistan</p><p>+92 300 1234567</p></div><div><h3>Opening hours</h3><p>Monday – Sunday<br>12:00 PM – 10:00 PM</p><p>Freshly prepared, every day.</p></div></div><div class="footer-bottom">© ${new Date().getFullYear()} Saffron & Sage. Demo restaurant website.</div></footer>`;

    $("#menu-toggle").addEventListener("click", () => {
      const n = $("#main-nav"),
        open = n.classList.toggle("open");
      $("#menu-toggle").setAttribute("aria-expanded", String(open));
      $("#menu-toggle").setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation",
      );
    });
    cartCount();
  }
  function cartCount() {
    const e = $("#header-cart-count");
    if (e) e.textContent = db.getCart().reduce((s, x) => s + x.quantity, 0);
  }
  function card(d) {
    return `<article class="dish-card">
    <div class="dish-image" role="img" aria-label="${esc(d.name)}" style="${bg(d.image)}">
    <span class="dish-image-label">CHEF'S PICK</span>
    </div>
    <div class="dish-content">
    <span class="dish-tag">${esc(d.category)}</span>
    <div class="dish-meta">
    <h3>${esc(d.name)}</h3>
    <span class="dish-price">${money(d.price)}</span>
    </div>
    <p>${esc(d.description)}</p>
    <button class="btn btn-primary add-to-cart" data-id="${esc(d.id)}" type="button">Add to basket +</button>
    </div>
    </article>`;
  }

  function bindAdd(root = document) {
    $$(".add-to-cart", root).forEach((b) =>
      b.addEventListener("click", () => {
        db.addToCart(b.dataset.id);
        cartCount();
        const old = b.textContent;
        b.textContent = "Added ✓";
        setTimeout(() => (b.textContent = old), 900);
      }),
    );
  }
  function msg(form, text, type = "success") {
    const e = $(".form-message", form);
    if (e) {
      e.textContent = text;
      e.className = `form-message ${type}`;
    }
  }
  const phoneOK = (p) => /^[+]?[-\d\s()]{9,18}$/.test(p.trim());
  function renderReviews(target, limit = 20) {
    if (!target) return;
    const rows = db.getReviews().slice(0, limit);
    target.innerHTML = rows.length
      ? rows
          .map(
            (r) =>
              `<article class="review-card"><div class="stars" aria-label="${Number(r.rating)} out of 5 stars">${"★".repeat(Math.max(1, Math.min(5, Number(r.rating) || 5)))}</div><p>“${esc(r.message)}”</p><strong>${esc(r.name)}</strong></article>`,
          )
          .join("")
      : `<p>No reviews yet.</p>`;
  }
  function reservation() {
    const f = $("#reservation-form");
    if (!f) return;
    const date = f.elements.date;
    date.min = new Date().toISOString().slice(0, 10);
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = new FormData(f),
        name = String(v.get("name")).trim(),
        phone = String(v.get("phone")).trim(),
        day = String(v.get("date"));
      if (name.length < 2)
        return msg(
          f,
          "Please enter your full name / براہِ کرم پورا نام لکھیں۔",
          "error",
        );
      if (!phoneOK(phone))
        return msg(
          f,
          "Enter a valid phone number / درست فون نمبر درج کریں۔",
          "error",
        );
      if (!day || day < date.min)
        return msg(
          f,
          "Choose a valid future date / درست آنے والی تاریخ منتخب کریں۔",
          "error",
        );
      db.saveReservation({
        name,
        phone,
        date: day,
        time: v.get("time"),
        guests: Number(v.get("guests")),
      });
      f.reset();
      msg(
        f,
        "Reservation request saved! We will contact you to confirm. / آپ کی درخواست محفوظ ہوگئی۔",
      );
    });
  }
  function reviewForm() {
    const f = $("#review-form");
    if (!f) return;
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = new FormData(f),
        name = String(v.get("name")).trim(),
        message = String(v.get("message")).trim();
      if (name.length < 2 || message.length < 8)
        return msg(
          f,
          "Please enter your name and a review of at least 8 characters.",
          "error",
        );
      db.saveReview({ name, rating: Number(v.get("rating")), message });
      f.reset();
      renderReviews($("#home-reviews"), 3);
      msg(f, "Thank you! Your review has been saved.");
    });
  }
  function home() {
    const featured = db
      .getMenu()
      .filter((x) => x.featured)
      .slice(0, 3);
    $("#featured-dishes").innerHTML = featured.map(card).join("");
    bindAdd();
    renderReviews($("#home-reviews"), 3);
    reservation();
    reviewForm();
  }
  function menu() {
    const items = db.getMenu(),
      cats = ["All", ...new Set(items.map((x) => x.category))];
    let active = "All";
    const filters = $("#category-filters"),
      grid = $("#menu-dishes"),
      search = $("#menu-search"),
      empty = $("#menu-empty");
    function draw() {
      const q = search.value.trim().toLowerCase(),
        list = items.filter(
          (d) =>
            (active === "All" || d.category === active) &&
            `${d.name} ${d.description} ${d.category}`
              .toLowerCase()
              .includes(q),
        );
      grid.innerHTML = list.map(card).join("");
      empty.hidden = !!list.length;
      bindAdd(grid);
    }
    filters.innerHTML = cats
      .map(
        (c) =>
          `<button class="filter-btn ${c === "All" ? "active" : ""}" data-category="${esc(c)}" type="button">${esc(c)}</button>`,
      )
      .join("");
    filters.addEventListener("click", (e) => {
      const b = e.target.closest("[data-category]");
      if (!b) return;
      active = b.dataset.category;
      $$("button", filters).forEach((x) =>
        x.classList.toggle("active", x === b),
      );
      draw();
    });
    search.addEventListener("input", draw);
    draw();
  }
  function cart() {
    const host = $("#cart-items"),
      summary = $("#cart-summary"),
      form = $("#checkout-form");
    if (!host) return;
    function draw() {
      const items = db.getCart();
      if (!items.length) {
        host.innerHTML = `<div class="cart-empty"><h2>Your basket is empty</h2><p>Add something delicious from our menu.</p><a class="btn btn-primary" href="menu.html">Browse menu</a></div>`;
        summary.innerHTML = "";
        form.hidden = true;
        return;
      }
      form.hidden = false;
      host.innerHTML = items
        .map(
          (x) =>
            `<article class="cart-item"><div class="cart-thumb" style="${bg(x.image)}" role="img" aria-label="${esc(x.name)}"></div><div><h3>${esc(x.name)}</h3><p>${money(x.price)} each</p><div class="qty-control"><button type="button" data-qty="-1" data-id="${esc(x.id)}" aria-label="Decrease quantity">−</button><strong>${x.quantity}</strong><button type="button" data-qty="1" data-id="${esc(x.id)}" aria-label="Increase quantity">+</button></div><button class="remove-btn" type="button" data-remove="${esc(x.id)}">Remove</button></div><div class="cart-line-price">${money(x.price * x.quantity)}</div></article>`,
        )
        .join("");
      const subtotal = items.reduce((s, x) => s + x.price * x.quantity, 0),
        fee = db.getAll().settings.deliveryFee || 0;
      summary.innerHTML = `<div class="summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="summary-row"><span>Delivery</span><strong>${money(fee)}</strong></div><div class="summary-row summary-total"><span>Total</span><strong>${money(subtotal + fee)}</strong></div>`;
      cartCount();
    }
    host.addEventListener("click", (e) => {
      const q = e.target.closest("[data-qty]"),
        r = e.target.closest("[data-remove]");
      if (q) {
        const x = db.getCart().find((i) => i.id === q.dataset.id);
        if (x) db.setCartQuantity(x.id, x.quantity + Number(q.dataset.qty));
      }
      if (r) db.removeFromCart(r.dataset.remove);
      draw();
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const items = db.getCart(),
        v = new FormData(form),
        name = String(v.get("name")).trim(),
        phone = String(v.get("phone")).trim(),
        address = String(v.get("address")).trim();
      if (!items.length) return msg(form, "Your basket is empty.", "error");
      if (name.length < 2)
        return msg(form, "Enter your name / نام درج کریں۔", "error");
      if (!phoneOK(phone))
        return msg(
          form,
          "Enter a valid phone / درست فون نمبر درج کریں۔",
          "error",
        );
      if (address.length < 8)
        return msg(
          form,
          "Please enter a complete address / مکمل پتہ درج کریں۔",
          "error",
        );
      const subtotal = items.reduce((s, x) => s + x.price * x.quantity, 0),
        fee = db.getAll().settings.deliveryFee || 0,
        order = db.saveOrder({
          customer: { name, phone, address },
          items,
          subtotal,
          deliveryFee: fee,
          total: subtotal + fee,
          payment: v.get("payment"),
        });
      db.clearCart();
      form.reset();
      draw();
      host.innerHTML = `<div class="cart-empty"><h2>Thank you, ${esc(name)}!</h2><p>Your order <strong>${esc(order.id)}</strong> has been saved. Total: <strong>${money(order.total)}</strong>.</p><p>This frontend demo does not notify a real restaurant server.</p><a class="btn btn-primary" href="menu.html">Order something else</a></div>`;
    });
    draw();
  }
  function contact() {
    const f = $("#contact-form");
    if (!f) return;
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = new FormData(f),
        name = String(v.get("name")).trim(),
        email = String(v.get("email")).trim(),
        message = String(v.get("message")).trim();
      if (name.length < 2)
        return msg(f, "Please enter your name / نام درج کریں۔", "error");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return msg(f, "Enter a valid email / درست ای میل درج کریں۔", "error");
      if (message.length < 10)
        return msg(
          f,
          "Message must be at least 10 characters / پیغام کم از کم 10 حروف کا ہو۔",
          "error",
        );
      db.saveMessage({ name, email, phone: v.get("phone"), message });
      f.reset();
      msg(
        f,
        "Message saved successfully. Thank you! / آپ کا پیغام محفوظ ہوگیا۔",
      );
    });
  }
  function admin() {
    const login = $("#admin-login"),
      dash = $("#admin-dashboard");
    if (!login) return;
    const lf = $("#admin-login-form");
    lf.addEventListener("submit", (e) => {
      e.preventDefault();
      if (lf.elements.password.value !== db.getAdminPassword())
        return msg(lf, "Incorrect password / پاس ورڈ درست نہیں۔", "error");
      sessionStorage.setItem("ssAdminLoggedIn", "yes");
      login.hidden = true;
      dash.hidden = false;
      draw();
    });
    $("#admin-logout").addEventListener("click", () => {
      sessionStorage.removeItem("ssAdminLoggedIn");
      dash.hidden = true;
      login.hidden = false;
      lf.reset();
    });
    if (sessionStorage.getItem("ssAdminLoggedIn") === "yes") {
      login.hidden = true;
      dash.hidden = false;
      draw();
    }
    $$("[data-tab]").forEach((b) =>
      b.addEventListener("click", () => {
        $$("[data-tab]").forEach((x) => x.classList.toggle("active", x === b));
        $$(".admin-panel").forEach(
          (x) => (x.hidden = x.id !== `admin-${b.dataset.tab}`),
        );
      }),
    );
    const pf = $("#product-form");
    function record(title, lines, actions = "") {
      return `<article class="admin-record"><h4>${title}</h4>${lines.map((x) => `<p>${x}</p>`).join("")}${actions ? `<div class="admin-record-actions">${actions}</div>` : ""}</article>`;
    }
    function draw() {
      $("#admin-product-list").innerHTML =
        db
          .getMenu()
          .map((d) =>
            record(
              esc(d.name),
              [`${esc(d.category)} · ${money(d.price)}`, esc(d.description)],
              `<button data-edit="${esc(d.id)}">Edit</button><button class="danger" data-delete="${esc(d.id)}">Delete</button>`,
            ),
          )
          .join("") || "<p>No menu items.</p>";
      $("#admin-order-list").innerHTML =
        db
          .getOrders()
          .map((o) =>
            record(
              `${esc(o.customer.name)} · ${money(o.total)}`,
              [
                `${esc(o.id)} · ${new Date(o.createdAt).toLocaleString()}`,
                `${esc(o.customer.phone)} · ${esc(o.customer.address)}`,
                `Payment: ${esc(o.payment)} · Status: ${esc(o.status)}`,
                `Items: ${o.items.map((i) => `${esc(i.name)} × ${i.quantity}`).join(", ")}`,
              ],
              `<button data-order-status="${esc(o.id)}" data-status="Preparing">Preparing</button><button data-order-status="${esc(o.id)}" data-status="Completed">Completed</button>`,
            ),
          )
          .join("") || "<p>No orders yet.</p>";
      $("#admin-reservation-list").innerHTML =
        db
          .getReservations()
          .map((r) =>
            record(
              esc(r.name),
              [
                `${esc(r.date)} · ${esc(r.time)} · ${r.guests} guests`,
                `Phone: ${esc(r.phone)} · Status: ${esc(r.status)}`,
              ],
              `<button data-res-status="${esc(r.id)}" data-status="Confirmed">Confirm</button><button data-res-status="${esc(r.id)}" data-status="Cancelled">Cancel</button>`,
            ),
          )
          .join("") || "<p>No reservations yet.</p>";
      $("#admin-message-list").innerHTML =
        db
          .getMessages()
          .map((m) =>
            record(
              esc(m.name),
              [
                `${esc(m.email)} · ${esc(m.phone || "No phone")}`,
                esc(m.message),
                `Status: ${esc(m.status)}`,
              ],
              `<button data-message-status="${esc(m.id)}" data-status="Read">Mark read</button>`,
            ),
          )
          .join("") || "<p>No messages yet.</p>";
      $("#admin-review-list").innerHTML =
        db
          .getReviews()
          .map((r) =>
            record(
              `${esc(r.name)} · ${"★".repeat(r.rating)}`,
              [esc(r.message)],
              `<button class="danger" data-review-delete="${esc(r.id)}">Delete</button>`,
            ),
          )
          .join("") || "<p>No reviews yet.</p>";
    }
    dash.addEventListener("click", (e) => {
      const t = e.target;
      if (t.dataset.edit) {
        const d = db.getMenu().find((x) => x.id === t.dataset.edit);
        Object.entries(d).forEach(([k, v]) => {
          if (pf.elements[k]) {
            if (pf.elements[k].type === "checkbox")
              pf.elements[k].checked = !!v;
            else pf.elements[k].value = v;
          }
        });
        $("#product-form-title").textContent = "Edit menu item";
        pf.scrollIntoView({ behavior: "smooth" });
      }
      if (t.dataset.delete && confirm("Delete this dish?"))
        db.deleteMenuItem(t.dataset.delete);
      if (t.dataset.orderStatus)
        db.updateOrderStatus(t.dataset.orderStatus, t.dataset.status);
      if (t.dataset.resStatus)
        db.updateReservationStatus(t.dataset.resStatus, t.dataset.status);
      if (t.dataset.messageStatus)
        db.updateMessageStatus(t.dataset.messageStatus, t.dataset.status);
      if (t.dataset.reviewDelete && confirm("Delete this review?"))
        db.deleteReview(t.dataset.reviewDelete);
      if (
        t.dataset.edit ||
        t.dataset.delete ||
        t.dataset.orderStatus ||
        t.dataset.resStatus ||
        t.dataset.messageStatus ||
        t.dataset.reviewDelete
      )
        draw();
    });
    pf.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = new FormData(pf),
        id = String(v.get("id") || "");
      db.saveMenuItem({
        id: id || undefined,
        name: String(v.get("name")).trim(),
        category: v.get("category"),
        price: Number(v.get("price")),
        image:
          String(v.get("image")).trim() ||
          "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
        description: String(v.get("description")).trim(),
        featured: pf.elements.featured.checked,
      });
      pf.reset();
      $("#product-form-title").textContent = "Add menu item";
      msg(pf, "Menu item saved / ڈش محفوظ ہوگئی۔");
      draw();
    });
    $("#product-cancel").addEventListener("click", () => {
      pf.reset();
      $("#product-form-title").textContent = "Add menu item";
    });
  }
  shared();
  if (page === "home") home();
  if (page === "menu") menu();
  if (page === "cart") cart();
  if (page === "contact") contact();
  if (page === "admin") admin();
})();
