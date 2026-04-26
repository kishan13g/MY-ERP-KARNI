import express from 'express';
import db from '../db.ts';
import { authenticate } from './auth.ts';

const router = express.Router();

// --- DESIGNS ---

// Get all designs
router.get('/designs', authenticate, (req, res) => {
  try {
    const designs = db.prepare('SELECT * FROM designs ORDER BY created_at DESC').all();
    res.json(designs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch designs' });
  }
});

// Create design
router.post('/designs', authenticate, (req, res) => {
  const { design_no, prompt, image_url, tags } = req.body;
  try {
    const info = db.prepare(`
      INSERT INTO designs (design_no, prompt, image_url, tags)
      VALUES (?, ?, ?, ?)
    `).run(design_no, prompt, image_url, tags);
    
    res.status(201).json({ id: info.lastInsertRowid, design_no });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create design' });
  }
});

// --- LOTS ---

// Get all lots
router.get('/lots', authenticate, (req, res) => {
  try {
    const lots = db.prepare(`
      SELECT l.*, d.design_no 
      FROM lots l 
      LEFT JOIN designs d ON l.design_id = d.id 
      ORDER BY l.created_at DESC
    `).all();
    res.json(lots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lots' });
  }
});

// Create lot
router.post('/lots', authenticate, (req, res) => {
  const { lot_no, design_id, qty, priority } = req.body;
  try {
    const info = db.prepare(`
      INSERT INTO lots (lot_no, design_id, qty, priority)
      VALUES (?, ?, ?, ?)
    `).run(lot_no, design_id, qty, priority);
    
    res.status(201).json({ id: info.lastInsertRowid, lot_no });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lot' });
  }
});

// Update lot stage
router.put('/lots/:id/stage', authenticate, (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;
  try {
    db.prepare('UPDATE lots SET current_stage = ? WHERE id = ?').run(stage, id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stage' });
  }
});

export default router;
