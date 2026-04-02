import { Design, Batch, Customer, FabricPurchase, KarigarLedger, GRN, FGStock, Machine, Payment, ARAging, ProductionDept, SustainabilityData, BundleTracking, ClientOrder, PredictiveDelay, DeadstockAlert, KarigarAttendance, VendorRating, SampleTracking, MachineMaintenance, JobVariety, QCChecklist, PackingVariety, TNAEvent, MerchApproval, CostingComparison, InventoryLocation, BuyerFeedback, WhatsAppMessage, SocialMediaPost, MaterialForecast, StageChecklist, JobSheet } from './types';

export const INITIAL_DATA = {
  kpis: {
    total_designs: 12,
    total_qty: 4500,
    total_dispatched: 1200,
    fabric_value: 850000,
    karigar_pending: 125000,
    total_payments: 450000,
    active_batches: 8,
    grn_value: 320000,
    ar_outstanding: 150000
  },
  production: [
    { key: "dyeing", dept: "#Dyei", full: "Dyeing", issued: 1200, received: 1050, pending: 150 },
    { key: "print", dept: "#Prnt", full: "Print", issued: 800, received: 750, pending: 50 },
    { key: "embr", dept: "#Embr", full: "Embroidery", issued: 500, received: 420, pending: 80 },
    { key: "cutt", dept: "#Cutt", full: "Cutting", issued: 2000, received: 1850, pending: 150 },
    { key: "handwork", dept: "#Hand", full: "Handwork", issued: 300, received: 250, pending: 50 },
    { key: "stitching", dept: "#Stitc", full: "Stitching", issued: 1500, received: 1300, pending: 200 },
    { key: "qc", dept: "#QC", full: "QC", issued: 1200, received: 1100, pending: 100 },
    { key: "pressing", dept: "#Press", full: "Pressing", issued: 1000, received: 950, pending: 50 }
  ] as ProductionDept[],
  designs: [
    { id: 'D-101', name: 'Summer Floral Kurti', buyer: 'Retail Chain A', qty: 500, dyeing: 'Done', print: 'Done', embr: 'In Progress', cutt: 'Done', hand: 'Pending', stitch: 'Pending', qc: 'Pending', press: 'Pending', status: 'In Production', category: 'Kurti', cost: 450 },
    { id: 'D-102', name: 'Evening Silk Gown', buyer: 'Boutique B', qty: 200, dyeing: 'Done', print: 'N/A', embr: 'Done', cutt: 'Done', hand: 'Done', stitch: 'In Progress', qc: 'Pending', press: 'Pending', status: 'In Production', category: 'Gown', cost: 1200 },
    { id: 'D-103', name: 'Casual Cotton Top', buyer: 'Fashion Hub', qty: 800, dyeing: 'Done', print: 'Done', embr: 'Done', cutt: 'Done', hand: 'In Progress', stitch: 'N/A', qc: 'Pending', press: 'Pending', status: 'In Production', category: 'Top', cost: 350 }
  ] as Design[],
  fabric_purchase: [
    { date: '2026-03-25', challan: 'CH-101', party: 'Textile Hub', item: 'Cotton Silk', color: 'Midnight Blue', meter: 500, rate: 250, amount: 125000, status: 'Received' },
    { date: '2026-03-26', challan: 'CH-102', party: 'Premium Fabrics', item: 'Linen Blend', color: 'Sand Beige', meter: 300, rate: 450, amount: 135000, status: 'In Transit' },
    { date: '2026-03-27', challan: 'CH-103', party: 'Global Weaves', item: 'Polyester Satin', color: 'Emerald Green', meter: 800, rate: 180, amount: 144000, status: 'Received' }
  ] as FabricPurchase[],
  karigar_ledger: [
    { date: '2026-03-27', name: 'Aslam Bhai', dept: 'Stitching', work: 'Single Needle Stitching', debit: 0, credit: 15000, balance: 15000 },
    { date: '2026-03-28', name: 'Zubair Karigar', dept: 'Embroidery', work: 'Heavy Zardosi', debit: 5000, credit: 0, balance: -5000 },
    { date: '2026-03-29', name: 'Rahim Tailor', dept: 'Cutting', work: 'Pattern Cutting', debit: 2000, credit: 8000, balance: 6000 },
    { date: '2026-03-30', name: 'Salim Press', dept: 'Pressing', work: 'Steam Press', debit: 0, credit: 4500, balance: 4500 },
    { date: '2026-03-31', name: 'Irfan Handwork', dept: 'Handwork', work: 'Bead Work', debit: 3000, credit: 12000, balance: 9000 }
  ] as KarigarLedger[],
  customers: [
    { id: 'C-001', name: 'Retail Chain A', type: 'Wholesale', mobile: '9876543210', gstin: '27AAAAA0000A1Z5', city: 'Mumbai', pending_amt: 45000, balance: 45000, lifetime_value: 1200000 },
    { id: 'C-002', name: 'Boutique B', type: 'Retail', mobile: '9876543211', gstin: '07BBBBB0000B1Z5', city: 'Delhi', pending_amt: 12000, balance: 12000, lifetime_value: 450000 },
    { id: 'C-003', name: 'Fashion Hub', type: 'Wholesale', mobile: '9876543212', gstin: '29CCCCC0000C1Z5', city: 'Bangalore', pending_amt: 85000, balance: 85000, lifetime_value: 2500000 },
    { id: 'C-004', name: 'Style Studio', type: 'Retail', mobile: '9876543213', gstin: '33DDDDD0000D1Z5', city: 'Chennai', pending_amt: 0, balance: 0, lifetime_value: 150000 },
    { id: 'C-005', name: 'Trend Setters', type: 'Wholesale', mobile: '9876543214', gstin: '19EEEEE0000E1Z5', city: 'Kolkata', pending_amt: 25000, balance: 25000, lifetime_value: 800000 }
  ] as Customer[],
  batches: [
    { lot_id: 'LOT-201', style: 'D-101 Summer Kurti', customer: 'Retail Chain A', color: 'Midnight Blue', qty: 250, stage: 'Stitching', status: 'In Progress', delivery: '2026-04-10', priority: 'High' },
    { lot_id: 'LOT-202', style: 'D-102 Evening Gown', customer: 'Boutique B', color: 'Sand Beige', qty: 150, stage: 'Embroidery', status: 'Pending', delivery: '2026-04-15', priority: 'Urgent' },
    { lot_id: 'LOT-203', style: 'D-103 Casual Top', customer: 'Fashion Hub', color: 'Emerald Green', qty: 400, stage: 'Cutting', status: 'In Progress', delivery: '2026-04-05', priority: 'Medium' },
    { lot_id: 'LOT-204', style: 'D-104 Saree', customer: 'Style Studio', color: 'Ruby Red', qty: 100, stage: 'Handwork', status: 'Active', delivery: '2026-04-20', priority: 'Low' },
    { lot_id: 'LOT-205', style: 'D-105 Jacket', customer: 'Trend Setters', color: 'Off White', qty: 200, stage: 'QC', status: 'In Progress', delivery: '2026-04-08', priority: 'High' }
  ] as Batch[],
  grn: [
    { grn_no: 'GRN-001', date: '2026-03-25', supplier: 'Textile Hub', item: 'Cotton Silk', challan: 'CH-101', qty: 500, unit: 'Meters', rate: 250, amount: 125000, status: 'Approved' },
    { grn_no: 'GRN-002', date: '2026-03-27', supplier: 'Global Weaves', item: 'Polyester Satin', challan: 'CH-103', qty: 800, unit: 'Meters', rate: 180, amount: 144000, status: 'Approved' },
    { grn_no: 'GRN-003', date: '2026-03-29', supplier: 'Cotton Co.', item: 'Organic Cotton', challan: 'CH-105', qty: 1000, unit: 'Meters', rate: 150, amount: 150000, status: 'Pending' }
  ] as GRN[],
  fg_stock: [
    { fg_id: 'FG-001', design: 'D-101', color: 'Midnight Blue', sizes: 'M, L, XL', produced: 500, dispatched: 380, balance: 120, status: 'Available' },
    { fg_id: 'FG-002', design: 'D-103', color: 'Emerald Green', sizes: 'S, M, L', produced: 800, dispatched: 450, balance: 350, status: 'Reserved' },
    { fg_id: 'FG-003', design: 'D-105', color: 'Off White', sizes: 'M, L', produced: 300, dispatched: 120, balance: 180, status: 'Available' }
  ] as FGStock[],
  machines: [
    { id: 'M-01', type: 'Stitching', operator: 'Aslam Bhai', output: 150, capacity: 200, efficiency: 92, status: 'Running' },
    { id: 'M-02', type: 'Cutting', operator: 'Irfan', output: 300, capacity: 400, efficiency: 85, status: 'Running' },
    { id: 'M-03', type: 'Pressing', operator: 'Zubair', output: 450, capacity: 500, efficiency: 95, status: 'Running' }
  ] as Machine[],
  payments: [
    { id: 'PAY-001', date: '2026-03-28', party: 'Textile Hub', invoice_no: 'INV-101', amount: 50000, mode: 'NEFT', utr: 'UTR123456', status: 'Completed' },
    { id: 'PAY-002', date: '2026-03-30', party: 'Global Weaves', invoice_no: 'INV-102', amount: 30000, mode: 'UPI', utr: 'UTR789012', status: 'Completed' }
  ] as Payment[],
  ar_aging: [
    { party: 'Retail Chain A', invoice_no: 'INV-501', date: '2026-03-01', total: 100000, paid: 55000, outstanding: 45000, age: 30 },
    { party: 'Fashion Hub', invoice_no: 'INV-502', date: '2026-03-15', total: 150000, paid: 65000, outstanding: 85000, age: 15 }
  ] as ARAging[],
  sustainability: [
    { id: 'S-001', date: '2026-03-01', fabric_waste_kg: 45, water_usage_liters: 1200, organic_fabric_percent: 15, carbon_footprint_score: 72 },
    { id: 'S-002', date: '2026-04-01', fabric_waste_kg: 38, water_usage_liters: 1100, organic_fabric_percent: 20, carbon_footprint_score: 68 }
  ] as SustainabilityData[],
  bundle_tracking: [
    { id: 'B-1001', lot_id: 'LOT-201', design_id: 'D-101', current_stage: 'Stitching', last_scan_time: '2026-04-01T10:00:00Z', operator: 'Aslam', location: 'Floor 1' },
    { id: 'B-1002', lot_id: 'LOT-201', design_id: 'D-101', current_stage: 'Stitching', last_scan_time: '2026-04-01T11:30:00Z', operator: 'Aslam', location: 'Floor 1' }
  ] as BundleTracking[],
  client_orders: [
    { id: 'ORD-5001', client_id: 'C-001', client_name: 'Retail Chain A', design_id: 'D-101', qty: 500, status: 'In Production', estimated_delivery: '2026-04-15' },
    { id: 'ORD-5002', client_id: 'C-003', client_name: 'Fashion Hub', design_id: 'D-103', qty: 300, status: 'Pending', estimated_delivery: '2026-04-25' }
  ] as ClientOrder[],
  predictive_delays: [
    { lot_id: 'LOT-201', design_id: 'D-101', predicted_delay_days: 2, confidence_score: 0.85, reason: 'Fabric shortage in market', impact_level: 'Medium' }
  ] as PredictiveDelay[],
  deadstock_alerts: [
    { fabric_id: 'FAB-99', fabric_name: 'Velvet Red', last_used_date: '2025-12-15', days_idle: 110, stock_value: 45000, suggestion: 'Use for upcoming winter samples' }
  ] as DeadstockAlert[],
  karigar_attendance: [
    { id: 'K-01', name: 'Aslam Bhai', dept: 'Stitching', date: '2026-04-01', status: 'Present', check_in: '09:00', check_out: '18:00', overtime_hrs: 1 },
    { id: 'K-02', name: 'Irfan', dept: 'Handwork', date: '2026-04-01', status: 'Present', check_in: '09:30', check_out: '18:30', overtime_hrs: 0 }
  ] as KarigarAttendance[],
  vendor_ratings: [
    { vendor_id: 'V-01', name: 'Textile Hub', quality_score: 4.5, delivery_score: 4.2, price_score: 4.0, overall_rating: 4.2, last_audit: '2026-03-01' }
  ] as VendorRating[],
  sample_tracking: [
    { id: 'SMP-01', design_id: 'D-101', sample_type: 'Proto', status: 'Approved', sent_date: '2026-03-10', feedback: 'Good fit' }
  ] as SampleTracking[],
  machine_maintenance: [
    { machine_id: 'M-01', last_service: '2026-02-15', next_service: '2026-05-15', health_score: 95, issues_reported: 0, status: 'Healthy' }
  ] as MachineMaintenance[],
  job_varieties: [
    { id: 'JV-01', category: 'Stitching', name: 'Standard Kurti', details: 'Base rate 50 per pc' }
  ] as JobVariety[],
  job_sheets: [
    { id: 'JS-01', lot_no: 'LOT-201', design_no: 'D-101', qty: 250, current_stage: 'Stitching', status: 'In Progress', karigar_name: 'Aslam Bhai' }
  ] as JobSheet[],
  qc_checklists: [
    { design_id: 'D-101', checks: ['Stitching strength', 'Color matching', 'Size accuracy'] }
  ] as QCChecklist[],
  packing_varieties: [
    { id: 'PV-01', name: 'Box Packing', description: 'Standard 12pcs per box' }
  ] as PackingVariety[],
  tna_events: [
    { id: 'TNA-01', lot_id: 'LOT-201', activity: 'Fabric Sourcing', planned_date: '2026-03-20', actual_date: '2026-03-22', status: 'Completed', responsible: 'Merchandiser A' }
  ] as TNAEvent[],
  merch_approvals: [
    { id: 'APP-01', design_id: 'D-101', item: 'Lab Dip', status: 'Approved', sent_date: '2026-03-15' }
  ] as MerchApproval[],
  costing_comparisons: [
    { design_id: 'D-101', estimated_cost: 450, actual_cost: 465, variance: 15, breakdown: { fabric: 250, trims: 50, labor: 100, overhead: 65 } }
  ] as CostingComparison[],
  inventory_locations: [
    { id: 'LOC-01', name: 'Main Warehouse', address: 'Plot 45, MIDC', stock_value: 1500000, capacity_used: 75 }
  ] as InventoryLocation[],
  buyer_feedback: [
    { id: 'FB-01', design_id: 'D-101', buyer_name: 'Retail Chain A', revision_no: 1, feedback_text: 'Increase sleeve length by 1 inch', date: '2026-03-12', status: 'Addressed' }
  ] as BuyerFeedback[],
  whatsapp_messages: [
    { id: 'WA-01', recipient: 'Retail Chain A', phone: '9876543210', message: 'Your order LOT-201 is now in stitching.', status: 'Sent', timestamp: '2026-04-01T10:00:00Z', type: 'Order Update' }
  ] as WhatsAppMessage[],
  social_posts: [
    { id: 'SP-01', platform: 'Instagram', content: 'New Summer Collection arriving soon!', scheduled_date: '2026-04-05', status: 'Scheduled', engagement: { likes: 0, comments: 0, shares: 0 } }
  ] as SocialMediaPost[],
  material_forecasts: [
    { fabric_item: 'Cotton Silk', current_stock: 500, required_qty: 1200, shortfall: 700, suggested_purchase: 800, lead_time_days: 7, priority: 'High' }
  ] as MaterialForecast[],
  stage_checklists: [
    { stage: 'Stitching', parameters: ['Needle Check', 'Thread Match', 'Seam Strength'] },
    { stage: 'Embroidery', parameters: ['Design Alignment', 'Thread Quality', 'Backing Removal'] },
    { stage: 'Cutting', parameters: ['Pattern Match', 'Grain Line', 'Notch Check'] },
    { stage: 'QC', parameters: ['Measurement Check', 'Stain Check', 'Loose Thread'] }
  ] as StageChecklist[]
};
