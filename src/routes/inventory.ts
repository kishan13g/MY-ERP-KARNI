import express from 'express';
import db from '../db.ts';
import { authenticate } from './auth.ts';

const router = express.Router();

// Get stock
router.get('/stock', authenticate, (req, res) => {
  try {
    const stock = db.prepare('SELECT * FROM inventory').all();
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock' });
  }
});

// Update stock (Simple adjustment)
router.post('/stock/adjust', authenticate, (req, res) => {
  const { item_code, qty_change, type } = req.body; // type: 'add' or 'sub'
  try {
    const item: any = db.prepare('SELECT * FROM inventory WHERE item_code = ?').get(item_code);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const newQty = type === 'add' ? item.qty + qty_change : item.qty - qty_change;
    
    db.prepare('UPDATE inventory SET qty = ?, updated_at = CURRENT_TIMESTAMP WHERE item_code = ?')
      .run(newQty, item_code);
      
    res.json({ success: true, newQty });
  } catch (error) {
    res.status(500).json({ error: 'Failed to adjust stock' });
  }
});

// Create item
router.post('/items', authenticate, (req, res) => {
  const { item_code, item_name, category, uom, min_stock } = req.body;
  try {
    const info = db.prepare(`
      INSERT INTO inventory (item_code, item_name, category, uom, min_stock)
      VALUES (?, ?, ?, ?, ?)
    `).run(item_code, item_name, category, uom, min_stock);
    
    res.status(201).json({ id: info.lastInsertRowid, item_code });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

export default router;
