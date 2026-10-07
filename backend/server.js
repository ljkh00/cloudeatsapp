const express = require('express');
const cors    = require('cors');
const db      = require('./db');

const app  = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require('./auth');

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(express.static('public'));        // Serve HTML/CSS from /public

// ── HEALTH CHECK ───────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'cloudeats-backend' });
});

// ════════════════════════════════════════════════════
// 🟢 USER SERVICE ZONE  →  services/user-service/
//    Deps: express · mysql2 · bcrypt · jsonwebtoken
//    DB:   MySQL  (users table)
// ════════════════════════════════════════════════════
// app.post('/api/auth/register', ...)
// app.post('/api/auth/login', ...)
// app.get('/api/users/:id', ...)

// ════════════════════════════════════════════════════
// 🔵 MENU SERVICE ZONE  →  services/menu-service/
//    Deps: express · mysql2
//    DB:   MySQL  (menu_items table)
// ════════════════════════════════════════════════════
// app.get('/api/menu', ...)
// app.get('/api/menu/:id', ...)
// app.get('/api/menu/category/:cat', ...)

// ── GET ALL MENU ITEMS ──────────────────────────────
app.get('/api/menu', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM menu_items ORDER BY category, name');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Menu fetch error:', err.message);
    res.status(500).json({ success: false, error: 'Could not load menu' });
  }
});

// ── GET MENU BY CATEGORY ───────────────────────────
app.get('/api/menu/category/:category', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM menu_items WHERE category = ? ORDER BY name',
      [req.params.category]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ════════════════════════════════════════════════════
// 🟣 ORDER SERVICE ZONE  →  services/order-service/
//    Deps: express · mongodb · redis · jsonwebtoken
//    DB:   MongoDB (orders) + Redis (cart)
// ════════════════════════════════════════════════════
// app.get('/api/cart/:userId', ...)
// app.post('/api/cart/:userId/items', ...)
// app.post('/api/orders', ...)
// app.get('/api/orders/user/:userId', ...)

app.listen(PORT, () => console.log(`CloudEats backend running on port ${PORT}`));