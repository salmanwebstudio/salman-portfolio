# Saffron & Sage — Restaurant Frontend Demo

Responsive HTML/CSS/Vanilla JavaScript restaurant website. All demo data is saved in browser localStorage through `js/data.js` only.

## Pages
- `index.html`: home, featured menu, reservations and customer reviews
- `menu.html`: category filters, search and add to cart
- `cart.html`: quantity controls, checkout and local order confirmation
- `about.html`: story, chef introduction and gallery
- `contact.html`: contact form, contact details and map placeholder
- `admin.html`: local owner panel for menu, orders, reservations, messages and reviews

## Run
1. Extract the ZIP and open the folder in VS Code.
2. Install/use the Live Server extension.
3. Right-click `index.html` → **Open with Live Server**.
4. Add dishes to cart and place a test order. Open `admin.html` to inspect the saved data.

## Change sample details
- Restaurant name, phone, address and hours: edit shared header/footer strings in `js/app.js`, and details in `contact.html`.
- Menu items and sample reviews: edit `sampleMenu` and initial reviews in `js/data.js`.
- Theme colours/fonts/radii: edit the `:root` variables at the very top of `css/styles.css`.
- Admin password: change `ADMIN_PASSWORD` in `js/data.js`. Default demo password: **Saffron@123**.
- Delivery fee: change `deliveryFee` in `initialDB()` inside `js/data.js`.
- Replace remote Unsplash image URLs with your own files under `images/` and update their paths.

## Reset local demo data
Open browser DevTools → Application → Local Storage → your local website origin → delete `saffronSageDB_v1`, then reload. The sample menu and reviews will be created again. Admin login session is in `sessionStorage` key `ssAdminLoggedIn`.

## JSON data structure
```json
{
  "menu": [{"id":"dish-1","name":"Dish","category":"Mains","price":1000,"description":"...","image":"...","featured":true}],
  "cart": [{"id":"dish-1","name":"Dish","price":1000,"image":"...","quantity":1}],
  "orders": [{"id":"order-id","customer":{"name":"...","phone":"...","address":"..."},"items":[],"subtotal":1000,"deliveryFee":150,"total":1150,"payment":"Cash on delivery","status":"New","createdAt":"ISO_DATE"}],
  "reservations": [{"id":"reservation-id","name":"...","phone":"...","date":"YYYY-MM-DD","time":"7:00 PM","guests":2,"status":"Pending","createdAt":"ISO_DATE"}],
  "reviews": [{"id":"review-id","name":"...","rating":5,"message":"...","createdAt":"ISO_DATE"}],
  "messages": [{"id":"message-id","name":"...","email":"...","phone":"...","message":"...","status":"Unread","createdAt":"ISO_DATE"}],
  "settings": {"currency":"PKR","deliveryFee":150}
}
```

## Production warning
This is frontend-only. localStorage is private to each browser/device, so the owner cannot see customer orders from other devices. The admin password is visible in client-side JavaScript and is not real security. No payment is processed and no order is transmitted to a restaurant. Before launch, add a backend/database, server-side authentication and validation, HTTPS and a payment provider.
