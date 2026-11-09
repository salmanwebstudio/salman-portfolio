/* DATA LAYER: every localStorage read/write is centralized here.
   Replace this module's methods with API calls when adding a backend. */
(() => {
  "use strict";
  // CHANGE THIS SAMPLE PASSWORD before sharing. Client-side password is not secure.
  const ADMIN_PASSWORD = "Saffron@123";
  const STORAGE_KEY = "saffronSageDB_v1";
  // SAMPLE MENU AND BRAND CONTENT: replace names, prices, descriptions and image URLs.
  const sampleMenu = [
    {
      id: "dish-1",
      name: "Crispy Garden Bites",
      category: "Starters",
      price: 650,
      description:
        "Golden seasonal vegetables, herb yoghurt and lemon dressing.",
      image:
        "https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=900&q=80",
      featured: true,
    },
    {
      id: "dish-2",
      name: "Creamy Tuscan Pasta",
      category: "Mains",
      price: 1250,
      description:
        "Silky cream sauce, garlic, herbs and parmesan tossed with pasta.",
      image:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
      featured: true,
    },
    {
      id: "dish-3",
      name: "Smoky Grilled Chicken",
      category: "Mains",
      price: 1450,
      description:
        "Char-grilled chicken, fragrant rice and our house-made sauce.",
      image:
        "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=80",
      featured: true,
    },
    {
      id: "dish-4",
      name: "Sage House Salad",
      category: "Starters",
      price: 550,
      description:
        "Crisp greens, cucumber, toasted seeds and citrus vinaigrette.",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
      featured: false,
    },
    {
      id: "dish-5",
      name: "Classic Chocolate Tart",
      category: "Desserts",
      price: 520,
      description: "Rich chocolate filling in a delicate buttery pastry shell.",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
      featured: true,
    },
    {
      id: "dish-6",
      name: "Rose Lemonade",
      category: "Drinks",
      price: 280,
      description: "Fresh lemon, a hint of rose and plenty of ice.",
      image:
        "https://images.unsplash.com/photo-1513558161293-cdaf765edfd47?auto=format&fit=crop&w=900&q=80",
      featured: false,
    },
    {
      id: "dish-7",
      name: "Loaded Herb Fries",
      category: "Starters",
      price: 480,
      description:
        "Crispy fries finished with herbs, seasoning and creamy dip.",
      image:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80",
      featured: false,
    },
    {
      id: "dish-8",
      name: "Caramel Cheesecake",
      category: "Desserts",
      price: 590,
      description: "Creamy baked cheesecake with a smooth caramel finish.",
      image:
        "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80",
      featured: false,
    },
    {
      id: "dish-9",
      name: "Mint Cooler",
      category: "Drinks",
      price: 250,
      description: "A refreshing blend of mint, lime and chilled soda.",
      image:
        "https://images.unsplash.com/photo-1513558161293-cdaf765edfd47?auto=format&fit=crop&w=900&q=80",
      featured: false,
    },
  ];
  const initialDB = () => ({
    menu: sampleMenu,
    cart: [],
    orders: [],
    reservations: [],
    reviews: [
      {
        id: "review-1",
        name: "Ayesha",
        rating: 5,
        message: "Lovely flavours and such a welcoming atmosphere.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "review-2",
        name: "Hamza",
        rating: 5,
        message: "The pasta was delicious. Definitely coming back!",
        createdAt: new Date().toISOString(),
      },
    ],
    messages: [],
    settings: { currency: "PKR", deliveryFee: 150 },
  });
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const makeId = (prefix) =>
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  function readDB() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const db = initialDB();
        writeDB(db);
        return db;
      }
      return { ...initialDB(), ...JSON.parse(raw) };
    } catch (e) {
      console.error("Storage read failed", e);
      return initialDB();
    }
  }
  function writeDB(db) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      return true;
    } catch (e) {
      console.error("Storage write failed", e);
      return false;
    }
  }
  function updateDB(fn) {
    const db = readDB();
    fn(db);
    writeDB(db);
    return db;
  }
  window.RestaurantData = {
    getAdminPassword: () => ADMIN_PASSWORD,
    getAll: () => clone(readDB()),
    getMenu: () => clone(readDB().menu),
    saveMenuItem(item) {
      updateDB((db) => {
        const i = db.menu.findIndex((x) => x.id === item.id);
        if (i >= 0) db.menu[i] = { ...db.menu[i], ...item };
        else db.menu.unshift({ ...item, id: item.id || makeId("dish") });
      });
    },
    deleteMenuItem(id) {
      updateDB((db) => {
        db.menu = db.menu.filter((x) => x.id !== id);
        db.cart = db.cart.filter((x) => x.id !== id);
      });
    },
    getCart: () => clone(readDB().cart),
    addToCart(id) {
      updateDB((db) => {
        const d = db.menu.find((x) => x.id === id);
        if (!d) return;
        const line = db.cart.find((x) => x.id === id);
        if (line) line.quantity++;
        else
          db.cart.push({
            id: d.id,
            name: d.name,
            price: Number(d.price),
            image: d.image,
            quantity: 1,
          });
      });
    },
    setCartQuantity(id, n) {
      updateDB((db) => {
        const x = db.cart.find((i) => i.id === id);
        if (x) {
          if (n <= 0) db.cart = db.cart.filter((i) => i.id !== id);
          else x.quantity = Math.min(99, n);
        }
      });
    },
    removeFromCart(id) {
      updateDB((db) => {
        db.cart = db.cart.filter((x) => x.id !== id);
      });
    },
    clearCart() {
      updateDB((db) => {
        db.cart = [];
      });
    },
    saveOrder(order) {
      const x = {
        ...order,
        id: makeId("order"),
        status: "New",
        createdAt: new Date().toISOString(),
      };
      updateDB((db) => db.orders.unshift(x));
      return x;
    },
    getOrders: () => clone(readDB().orders),
    updateOrderStatus(id, status) {
      updateDB((db) => {
        const x = db.orders.find((o) => o.id === id);
        if (x) x.status = status;
      });
    },
    saveReservation(r) {
      const x = {
        ...r,
        id: makeId("reservation"),
        status: "Pending",
        createdAt: new Date().toISOString(),
      };
      updateDB((db) => db.reservations.unshift(x));
      return x;
    },
    getReservations: () => clone(readDB().reservations),
    updateReservationStatus(id, status) {
      updateDB((db) => {
        const x = db.reservations.find((r) => r.id === id);
        if (x) x.status = status;
      });
    },
    saveReview(r) {
      const x = {
        ...r,
        id: makeId("review"),
        createdAt: new Date().toISOString(),
      };
      updateDB((db) => db.reviews.unshift(x));
      return x;
    },
    getReviews: () => clone(readDB().reviews),
    deleteReview(id) {
      updateDB((db) => {
        db.reviews = db.reviews.filter((x) => x.id !== id);
      });
    },
    saveMessage(m) {
      const x = {
        ...m,
        id: makeId("message"),
        status: "Unread",
        createdAt: new Date().toISOString(),
      };
      updateDB((db) => db.messages.unshift(x));
      return x;
    },
    getMessages: () => clone(readDB().messages),
    updateMessageStatus(id, status) {
      updateDB((db) => {
        const x = db.messages.find((m) => m.id === id);
        if (x) x.status = status;
      });
    },
    resetAll() {
      localStorage.removeItem(STORAGE_KEY);
      return this.getAll();
    },
  };
})();
