import { Design, Batch, Customer, FabricPurchase, KarigarLedger, GRN, FGStock, Machine, Payment, ARAging, ProductionDept, SustainabilityData, BundleTracking, ClientOrder, PredictiveDelay, DeadstockAlert, KarigarAttendance, VendorRating, SampleTracking, MachineMaintenance, JobVariety, QCChecklist, PackingVariety, TNAEvent, MerchApproval, CostingComparison, InventoryLocation, BuyerFeedback, WhatsAppMessage, SocialMediaPost, MaterialForecast, StageChecklist, JobSheet, WageRate, KarigarWageEntry, SalarySlip, CheckIn, CheckRegister, Alteration, PressOrder, PackOrder, Carton, CutChallan, ThreeDCalc, FabricConsumptionAI, PatternPlanningAI, TaskTracking, DefectLog, HRMLeave, CRMLead, CRMComplaint, ProductionKPI } from './types';

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
  check_in: [
    { id: 'CI-001', orderId: 'CO-001', designId: 'KI-D001', designName: 'Vamika Kurti Sky Blue', party: 'Vitara Fashion', receivedQty: 300, receivedFrom: 'Stitching', receiveDate: '2026-04-10', status: 'Checking', checker: 'Priya Ben', remarks: '' },
    { id: 'CI-002', orderId: 'CO-002', designId: 'KI-D002', designName: 'Lehenga Wine Set', party: 'VB Exports', receivedQty: 150, receivedFrom: 'Embroidery', receiveDate: '2026-04-11', status: 'Pending', checker: '', remarks: '' },
    { id: 'CI-003', orderId: 'CO-003', designId: 'KI-D003', designName: 'Chiffon Dupatta Peach', party: 'Vastra NX', receivedQty: 400, receivedFrom: 'Cutting', receiveDate: '2026-04-09', status: 'Pressing', checker: 'Meena Ben', remarks: '' },
    { id: 'CI-004', orderId: 'CO-004', designId: 'KI-D004', designName: 'Designer Gown Red', party: 'Fashion Hub', receivedQty: 200, receivedFrom: 'Stitching', receiveDate: '2026-04-12', status: 'Completed', checker: 'Priya Ben', remarks: 'All ok' },
    { id: 'CI-005', orderId: 'CO-005', designId: 'KI-D005', designName: 'Cotton Kurti Yellow', party: 'Retail Chain A', receivedQty: 500, receivedFrom: 'Cutting', receiveDate: '2026-04-13', status: 'Checking', checker: 'Meena Ben', remarks: '' },
  ] as CheckIn[],
  check_register: [
    { id: 'CR-001', ciId: 'CI-001', designName: 'Vamika Kurti Sky Blue', checker: 'Priya Ben', totalChecked: 300, pass: 285, fail: 15, alt: 12, reject: 3, date: '2026-04-12', defects: { stitch: 5, thread: 4, stain: 3, print: 2, other: 1 }, status: 'Done', remarks: '12 sent for alteration' },
    { id: 'CR-002', ciId: 'CI-004', designName: 'Designer Gown Red', checker: 'Priya Ben', totalChecked: 200, pass: 198, fail: 2, alt: 1, reject: 1, date: '2026-04-13', defects: { stitch: 1, thread: 1 }, status: 'Done', remarks: '' },
    { id: 'CR-003', ciId: 'CI-003', designName: 'Chiffon Dupatta Peach', checker: 'Meena Ben', totalChecked: 400, pass: 395, fail: 5, alt: 3, reject: 2, date: '2026-04-10', defects: { stitch: 2, thread: 1, stain: 2 }, status: 'Done', remarks: '' },
  ] as CheckRegister[],
  alteration: [
    { id: 'ALT-001', crId: 'CR-001', designName: 'Vamika Kurti Sky Blue', qty: 12, defectType: 'stitch', altPerson: 'Nasir Bhai', sentDate: '2026-04-12', receivedDate: '2026-04-13', status: 'Received', remarks: 'Re-stitching done' },
    { id: 'ALT-002', crId: 'CR-002', designName: 'Designer Gown Red', qty: 1, defectType: 'stain', altPerson: 'Salim Press', sentDate: '2026-04-13', receivedDate: '2026-04-14', status: 'Received', remarks: 'Stain removed' },
  ] as Alteration[],
  press_orders: [
    { id: 'PO-001', ciId: 'CI-001', designName: 'Vamika Kurti Sky Blue', party: 'Vitara Fashion', totalQty: 285, pressType: 'Steam Press', tableNo: 'PT-01', presserId: 'KAR-001', presserName: 'Aslam Bhai', startDate: '2026-04-13', doneDate: '2026-04-14', rate: 3, status: 'Done', remarks: '' },
    { id: 'PO-002', ciId: 'CI-004', designName: 'Designer Gown Red', party: 'Fashion Hub', totalQty: 198, pressType: 'Hand Press', tableNo: 'PT-03', presserId: 'KAR-004', presserName: 'Salim Press', startDate: '2026-04-14', doneDate: '2026-04-15', rate: 4, status: 'Done', remarks: '' },
    { id: 'PO-003', ciId: 'CI-003', designName: 'Chiffon Dupatta Peach', party: 'Vastra NX', totalQty: 395, pressType: 'Hand Press', tableNo: 'PT-02', presserId: 'KAR-002', presserName: 'Zubair Karigar', startDate: '2026-04-11', doneDate: '2026-04-12', rate: 2, status: 'Done', remarks: 'Light press only' },
  ] as PressOrder[],
  pack_orders: [
    { id: 'PK-001', poId: 'PO-001', designName: 'Vamika Kurti Sky Blue', party: 'Vitara Fashion', totalQty: 285, packType: 'Poly Bag', cartons: 6, pcsPerCarton: 50, tagsAttached: true, barcode: 'KI-D001-001', packerId: 'KAR-003', packerName: 'Rahim Tailor', packDate: '2026-04-14', status: 'Done', remarks: '' },
    { id: 'PK-002', poId: 'PO-002', designName: 'Designer Gown Red', party: 'Fashion Hub', totalQty: 198, packType: 'Box', cartons: 10, pcsPerCarton: 20, tagsAttached: true, barcode: 'KI-D004-001', packerId: 'KAR-005', packerName: 'Irfan Handwork', packDate: '2026-04-15', status: 'Done', remarks: '' },
    { id: 'PK-003', poId: 'PO-003', designName: 'Chiffon Dupatta Peach', party: 'Vastra NX', totalQty: 395, packType: 'Poly Bag', cartons: 8, pcsPerCarton: 50, tagsAttached: true, barcode: 'KI-D003-001', packerId: 'KAR-004', packerName: 'Salim Press', packDate: '2026-04-12', status: 'Done', remarks: '' },
  ] as PackOrder[],
  cartons: [
    { id: 'CTN-001', pkId: 'PK-001', designName: 'Vamika Kurti Sky Blue', cartonNo: 1, color: 'Sky Blue', size: 'Mixed', pcs: 50, weight: 3.2, date: '2026-04-14', status: 'Sealed' },
    { id: 'CTN-002', pkId: 'PK-001', designName: 'Vamika Kurti Sky Blue', cartonNo: 2, color: 'Sky Blue', size: 'Mixed', pcs: 50, weight: 3.1, date: '2026-04-14', status: 'Sealed' },
    { id: 'CTN-003', pkId: 'PK-002', designName: 'Designer Gown Red', cartonNo: 1, color: 'Red', size: 'L', pcs: 20, weight: 5.5, date: '2026-04-15', status: 'Loaded' },
  ] as Carton[],
  cut_challans: [
    { id: 'CC-001', orderId: 'CO-001', designName: 'Vamika Kurti Sky Blue', cutterId: 'KAR-003', cutterName: 'Rahim Tailor', cutType: 'Straight Knife', tableNo: 'T-01', layers: 4, fabricMeters: 125, issueDate: '2026-04-05', dueDate: '2026-04-12', status: 'Completed', sizes: { S: 50, M: 80, L: 80, XL: 50, XXL: 40 }, totalPcs: 300, wasteMeters: 3.5, rate: 2.5 },
    { id: 'CC-002', orderId: 'CO-005', designName: 'Cotton Kurti Yellow', cutterId: 'KAR-003', cutterName: 'Rahim Tailor', cutType: 'Band Saw', tableNo: 'T-02', layers: 6, fabricMeters: 200, issueDate: '2026-04-10', dueDate: '2026-04-16', status: 'In Progress', sizes: { M: 100, L: 200, XL: 200 }, totalPcs: 500, wasteMeters: 5.0, rate: 2.0 },
  ] as CutChallan[],
  three_d_calcs: [
    { id: '3DC-001', designId: 'D-101', designName: 'Anarkali Set', fabricLength: 5.4, width: 44, layers: 10, pcsPerLayer: 24, totalPieces: 240, wastagePercent: 5.5, estFabricReq: 57, date: '2026-04-01', status: 'Done' },
  ] as ThreeDCalc[],
  fabric_consumption_ai: [
    { id: 'FAI-001', designId: 'D-101', designName: 'Anarkali Set', fabricType: 'Georgette', qty: 500, stdConsumption: 2.5, aiEstimated: 1250, actualUsed: 1265, wastagePercent: 1.2, variance: 15, aiAccuracy: 98.8, date: '2026-04-01' },
  ] as FabricConsumptionAI[],
  pattern_planning_ai: [
    { id: 'PPAI-001', planId: 'PAT-001', designId: 'D-101', designName: 'Anarkali Set', fabricWidth: 44, sizes: 'S/M/L', efficiency: 94.5, wastagePercent: 5.5, layers: 12, aiSuggestion: 'Optimize layout', date: '2026-04-01', status: 'Done' },
  ] as PatternPlanningAI[],
  task_tracking: [
    { id: 'TT-001', taskId: 'TASK-2847', title: 'Implement Authentication Flow', project: 'Mobile App Redesign', status: 'In Progress', assignees: ['John Doe', 'Maria Kim'], estimatedHours: 12, trackedHours: 8.7, todayHours: 2.6, activity: [{ text: 'Started timer', time: '32 minutes ago' }] },
  ] as TaskTracking[],
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
    { id: 'D-103', name: 'Casual Cotton Top', buyer: 'Fashion Hub', qty: 800, dyeing: 'Done', print: 'Done', embr: 'Done', cutt: 'Done', hand: 'In Progress', stitch: 'N/A', qc: 'Pending', press: 'Pending', status: 'In Production', category: 'Top', cost: 350 },
    { id: 'D-104', name: 'Embroidered Saree', buyer: 'Style Studio', qty: 150, dyeing: 'Done', print: 'N/A', embr: 'In Progress', cutt: 'Done', hand: 'Pending', stitch: 'Pending', qc: 'Pending', press: 'Pending', status: 'Sampling', category: 'Saree', cost: 2500 },
    { id: 'D-105', name: 'Designer Jacket', buyer: 'Trend Setters', qty: 300, dyeing: 'Done', print: 'Done', embr: 'Done', cutt: 'Done', hand: 'Done', stitch: 'Done', qc: 'In Progress', press: 'Pending', status: 'In Production', category: 'Jacket', cost: 1800 }
  ] as Design[],
  fabric_purchase: [
    { date: '2026-03-25', challan: 'CH-101', party: 'Textile Hub', item: 'Cotton Silk', color: 'Midnight Blue', meter: 500, rate: 250, amount: 125000, status: 'Received' },
    { date: '2026-03-26', challan: 'CH-102', party: 'Premium Fabrics', item: 'Linen Blend', color: 'Sand Beige', meter: 300, rate: 450, amount: 135000, status: 'In Transit' },
    { date: '2026-03-27', challan: 'CH-103', party: 'Global Weaves', item: 'Polyester Satin', color: 'Emerald Green', meter: 800, rate: 180, amount: 144000, status: 'Received' },
    { date: '2026-03-28', challan: 'CH-104', party: 'Silk Route', item: 'Pure Silk', color: 'Ruby Red', meter: 200, rate: 1200, amount: 240000, status: 'Received' },
    { date: '2026-03-29', challan: 'CH-105', party: 'Cotton Co.', item: 'Organic Cotton', color: 'Off White', meter: 1000, rate: 150, amount: 150000, status: 'Ordered' }
  ] as FabricPurchase[],
  karigar_ledger: [
    { id: 'K-01', date: '2026-03-27', name: 'Aslam Bhai', dept: 'Stitching', work: 'Single Needle Stitching', debit: 0, credit: 15000, balance: 15000, mobile: '9876543210', rate: 50 },
    { id: 'K-02', date: '2026-03-28', name: 'Zubair Karigar', dept: 'Embroidery', work: 'Heavy Zardosi', debit: 5000, credit: 0, balance: -5000, mobile: '9876543211', rate: 120 },
    { id: 'K-03', date: '2026-03-29', name: 'Rahim Tailor', dept: 'Cutting', work: 'Pattern Cutting', debit: 2000, credit: 8000, balance: 6000, mobile: '9876543212', rate: 30 },
    { id: 'K-04', date: '2026-03-30', name: 'Salim Press', dept: 'Pressing', work: 'Steam Press', debit: 0, credit: 4500, balance: 4500, mobile: '9876543213', rate: 15 },
    { id: 'K-05', date: '2026-03-31', name: 'Irfan Handwork', dept: 'Handwork', work: 'Bead Work', debit: 3000, credit: 12000, balance: 9000, mobile: '9876543214', rate: 80 },
    { id: 'K-06', date: '2026-04-01', name: 'Mustafa Dyeing', dept: 'Dyeing', work: 'Vat Dyeing', debit: 0, credit: 25000, balance: 25000, mobile: '9876543215', rate: 40 }
  ] as KarigarLedger[],
  customers: [
    { id: 'C-001', name: 'Retail Chain A', type: 'Wholesale', mobile: '9876543210', contact: 'John Doe', gstin: '27AAAAA0000A1Z5', city: 'Mumbai', pending_amt: 45000, balance: 45000, lifetime_value: 1200000, total_orders: 15 },
    { id: 'C-002', name: 'Boutique B', type: 'Retail', mobile: '9876543211', contact: 'Jane Smith', gstin: '07BBBBB0000B1Z5', city: 'Delhi', pending_amt: 12000, balance: 12000, lifetime_value: 450000, total_orders: 8 },
    { id: 'C-003', name: 'Fashion Hub', type: 'Wholesale', mobile: '9876543212', contact: 'Mike Ross', gstin: '29CCCCC0000C1Z5', city: 'Bangalore', pending_amt: 85000, balance: 85000, lifetime_value: 2500000, total_orders: 24 },
    { id: 'C-004', name: 'Style Studio', type: 'Retail', mobile: '9876543213', contact: 'Sarah Connor', gstin: '33DDDDD0000D1Z5', city: 'Chennai', pending_amt: 0, balance: 0, lifetime_value: 150000, total_orders: 5 },
    { id: 'C-005', name: 'Trend Setters', type: 'Wholesale', mobile: '9876543214', contact: 'David Miller', gstin: '19EEEEE0000E1Z5', city: 'Kolkata', pending_amt: 25000, balance: 25000, lifetime_value: 800000, total_orders: 12 },
    { id: 'C-006', name: 'Urban Vogue', type: 'Wholesale', mobile: '9876543216', contact: 'Alice Wong', gstin: '27FFFFFF0000F1Z5', city: 'Mumbai', pending_amt: 60000, balance: 60000, lifetime_value: 1100000, total_orders: 10 }
  ] as Customer[],
  batches: [
    { lot_id: 'LOT-201', style: 'D-101 Summer Kurti', customer: 'Retail Chain A', color: 'Midnight Blue', qty: 250, stage: 'Stitching', status: 'In Progress', delivery: '2026-04-10', priority: 'High' },
    { lot_id: 'LOT-202', style: 'D-102 Evening Gown', customer: 'Boutique B', color: 'Sand Beige', qty: 150, stage: 'Embroidery', status: 'Pending', delivery: '2026-04-15', priority: 'Urgent' },
    { lot_id: 'LOT-203', style: 'D-103 Casual Top', customer: 'Fashion Hub', color: 'Emerald Green', qty: 400, stage: 'Cutting', status: 'In Progress', delivery: '2026-04-05', priority: 'Medium' },
    { lot_id: 'LOT-204', style: 'D-104 Saree', customer: 'Style Studio', color: 'Ruby Red', qty: 100, stage: 'Handwork', status: 'Active', delivery: '2026-04-20', priority: 'Low' },
    { lot_id: 'LOT-205', style: 'D-105 Jacket', customer: 'Trend Setters', color: 'Off White', qty: 200, stage: 'QC', status: 'In Progress', delivery: '2026-04-08', priority: 'High' },
    { lot_id: 'LOT-206', style: 'D-101 Summer Kurti', customer: 'Retail Chain A', color: 'Sky Blue', qty: 300, stage: 'Dyeing', status: 'Pending', delivery: '2026-04-12', priority: 'Medium' },
    { lot_id: 'LOT-207', style: 'D-103 Casual Top', customer: 'Fashion Hub', color: 'Olive Green', qty: 500, stage: 'Print', status: 'Pending', delivery: '2026-04-16', priority: 'Medium' },
    { lot_id: 'LOT-208', style: 'D-106 Palazzo', customer: 'Urban Vogue', color: 'Charcoal', qty: 350, stage: 'Cutting', status: 'In Progress', delivery: '2026-04-18', priority: 'High' }
  ] as Batch[],
  grn: [
    { grn_no: 'GRN-001', date: '2026-03-25', supplier: 'Textile Hub', item: 'Cotton Silk', challan: 'CH-101', qty: 500, unit: 'Meters', rate: 250, amount: 125000, status: 'Approved' },
    { grn_no: 'GRN-002', date: '2026-03-27', supplier: 'Global Weaves', item: 'Polyester Satin', challan: 'CH-103', qty: 800, unit: 'Meters', rate: 180, amount: 144000, status: 'Approved' },
    { grn_no: 'GRN-003', date: '2026-03-29', supplier: 'Cotton Co.', item: 'Organic Cotton', challan: 'CH-105', qty: 1000, unit: 'Meters', rate: 150, amount: 150000, status: 'Pending' },
    { grn_no: 'GRN-004', date: '2026-03-31', supplier: 'Silk Route', item: 'Pure Silk', challan: 'CH-104', qty: 200, unit: 'Meters', rate: 1200, amount: 240000, status: 'Approved' }
  ] as GRN[],
  fg_stock: [
    { fg_id: 'FG-001', design: 'D-101', color: 'Midnight Blue', sizes: 'M, L, XL', produced: 500, dispatched: 380, balance: 120, status: 'Available' },
    { fg_id: 'FG-002', design: 'D-103', color: 'Emerald Green', sizes: 'S, M, L', produced: 800, dispatched: 450, balance: 350, status: 'Reserved' },
    { fg_id: 'FG-003', design: 'D-105', color: 'Off White', sizes: 'M, L', produced: 300, dispatched: 120, balance: 180, status: 'Available' },
    { fg_id: 'FG-004', design: 'D-102', color: 'Sand Beige', sizes: 'S, M, L, XL', produced: 200, dispatched: 180, balance: 20, status: 'Available' }
  ] as FGStock[],
  machines: [
    { id: 'M-01', type: 'Stitching', operator: 'Aslam Bhai', output: 150, capacity: 200, efficiency: 92, status: 'Running' },
    { id: 'M-02', type: 'Cutting', operator: 'Irfan', output: 300, capacity: 400, efficiency: 85, status: 'Running' },
    { id: 'M-03', type: 'Pressing', operator: 'Zubair', output: 450, capacity: 500, efficiency: 95, status: 'Running' },
    { id: 'M-04', type: 'Embroidery', operator: 'Zubair', output: 80, capacity: 100, efficiency: 80, status: 'Maintenance' }
  ] as Machine[],
  payments: [
    { id: 'PAY-001', date: '2026-03-28', party: 'Textile Hub', invoice_no: 'INV-101', amount: 50000, mode: 'NEFT', utr: 'UTR123456', status: 'Completed' },
    { id: 'PAY-002', date: '2026-03-30', party: 'Global Weaves', invoice_no: 'INV-102', amount: 30000, mode: 'UPI', utr: 'UTR789012', status: 'Completed' },
    { id: 'PAY-003', date: '2026-04-01', party: 'Cotton Co.', invoice_no: 'INV-103', amount: 75000, mode: 'Cheque', utr: 'CHQ456789', status: 'Pending' }
  ] as Payment[],
  ar_aging: [
    { party: 'Retail Chain A', invoice_no: 'INV-501', date: '2026-03-01', total: 100000, paid: 55000, outstanding: 45000, age: 30 },
    { party: 'Fashion Hub', invoice_no: 'INV-502', date: '2026-03-15', total: 150000, paid: 65000, outstanding: 85000, age: 15 },
    { party: 'Boutique B', invoice_no: 'INV-503', date: '2026-03-20', total: 50000, paid: 38000, outstanding: 12000, age: 10 }
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
    { id: 'K-02', name: 'Irfan', dept: 'Handwork', date: '2026-04-01', status: 'Present', check_in: '09:30', check_out: '18:30', overtime_hrs: 0 },
    { id: 'K-03', name: 'Rahim Tailor', dept: 'Cutting', date: '2026-04-01', status: 'Absent', overtime_hrs: 0 },
    { id: 'K-04', name: 'Salim Press', dept: 'Pressing', date: '2026-04-01', status: 'Present', check_in: '10:00', check_out: '19:00', overtime_hrs: 1 }
  ] as KarigarAttendance[],
  vendor_ratings: [
    { vendor_id: 'V-01', name: 'Textile Hub', quality_score: 4.5, delivery_score: 4.2, price_score: 4.0, overall_rating: 4.2, last_audit: '2026-03-01' },
    { vendor_id: 'V-02', name: 'Premium Fabrics', quality_score: 4.8, delivery_score: 4.5, price_score: 3.5, overall_rating: 4.3, last_audit: '2026-03-15' },
    { vendor_id: 'V-03', name: 'Global Weaves', quality_score: 3.9, delivery_score: 3.8, price_score: 4.5, overall_rating: 4.0, last_audit: '2026-03-20' }
  ] as VendorRating[],
  sample_tracking: [
    { id: 'SMP-01', design_id: 'D-101', sample_type: 'Proto', status: 'Approved', sent_date: '2026-03-10', feedback: 'Good fit' },
    { id: 'SMP-02', design_id: 'D-102', sample_type: 'Fit', status: 'Pending', sent_date: '2026-03-25', feedback: 'Awaiting buyer comments' },
    { id: 'SMP-03', design_id: 'D-104', sample_type: 'PP', status: 'Sent', sent_date: '2026-04-01' }
  ] as SampleTracking[],
  machine_maintenance: [
    { machine_id: 'M-01', last_service: '2026-02-15', next_service: '2026-05-15', health_score: 95, issues_reported: 0, status: 'Healthy' },
    { machine_id: 'M-04', last_service: '2026-01-10', next_service: '2026-04-10', health_score: 65, issues_reported: 2, status: 'Warning' }
  ] as MachineMaintenance[],
  job_varieties: [
    { id: 'JV-01', category: 'Stitching', name: 'Standard Kurti', details: 'Base rate 50 per pc' },
    { id: 'JV-02', category: 'Embroidery', name: 'Heavy Zardosi', details: 'Rate 120 per 1000 stitches' },
    { id: 'JV-03', category: 'Cutting', name: 'Pattern Cutting', details: 'Rate 30 per pc' }
  ] as JobVariety[],
  job_sheets: [
    { id: 'JS-01', lot_no: 'LOT-201', design_no: 'D-101', qty: 250, current_stage: 'Stitching', status: 'In Progress', karigar_name: 'Aslam Bhai' },
    { id: 'JS-02', lot_no: 'LOT-203', design_no: 'D-103', qty: 400, current_stage: 'Cutting', status: 'Completed', karigar_name: 'Rahim Tailor' }
  ] as JobSheet[],
  qc_checklists: [
    { design_id: 'D-101', checks: ['Stitching strength', 'Color matching', 'Size accuracy', 'Button security'] },
    { design_id: 'D-102', checks: ['Fabric drape', 'Zip functionality', 'Lining finish'] }
  ] as QCChecklist[],
  packing_varieties: [
    { id: 'PV-01', name: 'Box Packing', description: 'Standard 12pcs per box' },
    { id: 'PV-02', name: 'Hanger Packing', description: 'Single pc with hanger and polybag' }
  ] as PackingVariety[],
  tna_events: [
    { id: 'TNA-01', lot_id: 'LOT-201', activity: 'Fabric Sourcing', planned_date: '2026-03-20', actual_date: '2026-03-22', status: 'Completed', responsible: 'Merchandiser A' },
    { id: 'TNA-02', lot_id: 'LOT-201', activity: 'Dyeing', planned_date: '2026-03-25', actual_date: '2026-03-26', status: 'Completed', responsible: 'Production Mgr' },
    { id: 'TNA-03', lot_id: 'LOT-201', activity: 'Stitching', planned_date: '2026-04-01', status: 'Pending', responsible: 'Floor Supervisor' }
  ] as TNAEvent[],
  merch_approvals: [
    { id: 'APP-01', design_id: 'D-101', item: 'Lab Dip', status: 'Approved', sent_date: '2026-03-15' },
    { id: 'APP-02', design_id: 'D-102', item: 'Strike-off', status: 'Pending', sent_date: '2026-03-28' },
    { id: 'APP-03', design_id: 'D-104', item: 'Trims', status: 'Approved', sent_date: '2026-03-20' }
  ] as MerchApproval[],
  inventory_locations: [
    { id: 'LOC-01', name: 'Main Warehouse', address: 'Plot 45, MIDC', stock_value: 1500000, capacity_used: 75 },
    { id: 'LOC-02', name: 'Floor 1 Storage', address: 'Internal', stock_value: 450000, capacity_used: 40 }
  ] as InventoryLocation[],
  dyeing_tanks: [
    { tank_id: 'TANK-01', capacity: '500L', current_batch: 'BTC-45', temperature: '65°C', ph_level: '7.2', status: 'Dyeing' },
    { tank_id: 'TANK-02', capacity: '500L', current_batch: 'None', temperature: '25°C', ph_level: '7.0', status: 'Empty' },
    { tank_id: 'TANK-03', capacity: '1000L', current_batch: 'BTC-46', temperature: '80°C', ph_level: '6.8', status: 'Cleaning' },
  ],
  dyeing_orders: [
    { order_id: 'DO-1001', fabric: 'Cotton Silk', shade: 'Royal Blue', qty: '200m', dye_date: '2026-04-10', status: 'Planned' },
    { order_id: 'DO-1002', fabric: 'Chiffon', shade: 'Sunset Orange', qty: '500m', dye_date: '2026-04-12', status: 'In Progress' },
  ],
  chemical_stock: [
    { chemical_name: 'Reactive Blue 21', brand: 'BASF', current_stock: 45, min_level: 10, unit: 'KG', last_restock: '2026-03-20' },
    { chemical_name: 'Acetic Acid', brand: 'Tata', current_stock: 120, min_level: 50, unit: 'L', last_restock: '2026-04-01' },
  ],
  colour_qc: [
    { sample_id: 'QC-SH-01', shade_name: 'Midnight Black', recipe: 'REC-55', delta_e: '0.45', match_status: 'Passed', tester: 'Suresh' },
    { sample_id: 'QC-SH-02', shade_name: 'Rose Pink', recipe: 'REC-58', delta_e: '1.20', match_status: 'Rejected', tester: 'Suresh' },
  ],
  dyeing_job_card: [
    { card_id: 'DJC-2401', batch_id: 'BTC-45', tank_no: 'Tank-01', fabric: 'Silk', shade: 'Red', start_time: '08:00 AM', status: 'Running' },
  ],
  loom_status: [
    { loom_id: 'LM-01', type: 'Air Jet', design: 'Jacquard D1', rpm: 650, efficiency: '92%', current_pick: '4500', status: 'Running' },
    { loom_id: 'LM-02', type: 'Rapier', design: 'Plain Weave', rpm: 450, efficiency: '88%', current_pick: '12000', status: 'Running' },
    { loom_id: 'LM-03', type: 'Air Jet', design: 'None', rpm: 0, efficiency: '0%', current_pick: '0', status: 'Breakdown' },
  ],
  weaving_orders: [
    { order_id: 'WO-501', design: 'D-501 Silk', warp: 'Silk 20/22', weft: 'Silk 20/22', required_qty: '1000m', woven_qty: '450m', status: 'In Progress' },
  ],
  yarn_stock: [
    { yarn_type: 'Silk', count: '20/22', color: 'Bleached', current_qty: 450, unit: 'KG', location: 'Beam Room A' },
    { yarn_type: 'Cotton', count: '40s', color: 'Natural', current_qty: 1200, unit: 'KG', location: 'Yarn Store' },
  ],
  sewing_line: [
    { line_id: 'LINE-A', supervisor: 'Arjun', current_design: 'D-101', target_hr: 50, actual_hr: 48, efficiency: '96%', status: 'Running' },
    { line_id: 'LINE-B', supervisor: 'Vikram', current_design: 'D-102', target_hr: 45, actual_hr: 40, efficiency: '89%', status: 'Running' },
  ],
  operator_perf: [
    { operator_id: 'OP-01', name: 'Ravi Kumar', operation: 'Side Seam', total_output: 450, accepted: 448, rejected: 2, efficiency: '99%' },
    { operator_id: 'OP-02', name: 'Sunita Devi', operation: 'Neck Joint', total_output: 380, accepted: 370, rejected: 10, efficiency: '97%' },
  ],
  op_breakdown: [
    { style_id: 'D-101', operation_name: 'Collar Attachment', machine_type: 'SNLS', sam: 0.45, grade: 'A', attachments: 'Folder' },
    { style_id: 'D-101', operation_name: 'Bottom Hem', machine_type: 'Flat-lock', sam: 0.35, grade: 'B', attachments: 'Hemer' },
  ],
  sam_efficiency: [
    { batch_id: 'BTC-45', product: 'Shirt', sam_value: 14.5, output: 500, man_hours: 120, efficiency_percent: '85%', gsd_score: 92 },
  ],
  alteration_rework: [
    { date: '2026-04-01', line: 'Line-A', defect_type: 'Stitch Skip', qty: 15, corrected: 14, scrap: 1, supervisor: 'Arjun' },
  ],
  cutting_table: [
    { table_id: 'TBL-01', current_layer: 'Lay-10', fabric: 'Crepe Silk', style: 'D-201', ply_count: 50, status: 'Cutting' },
    { table_id: 'TBL-02', current_layer: 'None', fabric: 'None', style: 'None', ply_count: 0, status: 'Free' },
  ],
  lay_planning: [
    { lay_id: 'LAY-45', marker_id: 'MK-101', ratio: '2S:2M:4L', lay_length: '4.5m', total_plys: 50, efficiency_percent: '84.5%', savings: '2.1%' },
  ],
  bundle_mgmt: [
    { bundle_id: 'BND-901', lot_no: 'LOT-201', size: 'XL', qty: 24, current_stage: 'Sewing', last_station: 'Stitching-A1', tag_status: 'RFID Scanned' },
  ],
  cutting_qc: [
    { audit_id: 'AUD-CUT-01', lay_id: 'LAY-45', checker: 'Manoj', nicks_shade: 'None', panel_match: 'OK', score: 'P', status: 'Approved' },
  ],
  cutter_report: [
    { cutter_name: 'Jagdish', shift: 'Morning', total_layers: 4, total_panels: 1200, avg_efficiency: '94%', waste_percent: '1.2%' },
  ],
  handwork_card: [
    { card_id: 'HWC-101', karigar: 'Afzal', work_type: 'Zardosi', design: 'D-505', rate_pc: 250, target: 5, status: 'In Process' },
  ],
  embroidery_card: [
    { prog_id: 'EMB-01', machine: 'Tajima-12', design: 'Flower Motif-01', stitch_count: '45,000', no_of_heads: 24, runtime: '4.5h', status: 'Running' },
  ],
  fabric_return: [
    { return_id: 'RET-01', original_challan: 'CH-4501', party: 'Shree Fabrics', item: 'Cotton', qty_returned: '15m', reason: 'Shade Variation', status: 'Accepted' },
  ],
  fabric_waste: [
    { date: '2026-04-01', dept: 'Cutting', waste_type: 'Panel Bits', weight: 4.5, unit: 'KG', disposal_status: 'Sent to Scrap' },
  ],
  gst_tax: [
    { invoice_no: 'INV-202601', date: '2026-04-01', taxable_amt: 45000, cgst: 1125, sgst: 1125, igst: 0, total_tax: 2250, filing_status: 'Ready' },
  ],
  payment_receipt: [
    { receipt_id: 'RCP-101', date: '2026-04-02', customer: 'Vogue Retail', mode: 'G-Pay', amount: 25000, reference: 'UTR-9011', status: 'Confirmed' },
  ],
  debit_credit_note: [
    { note_id: 'CN-01', type: 'Credit Note', party: 'Fab India', reason: 'Discount', amount: 1500, against_inv: 'INV-450', date: '2026-04-05' },
  ],
  jobber_ledger: [
    { jobber_name: 'Kamal Job Works', service: 'Embroidery', total_work: '450 pcs', rate: 45, total_bill: 20250, paid: 15000, balance: 5250 },
  ],
  dispatch_register: [
    { dispatch_id: 'DSP-01', challan_id: 'CH-101', consignee: 'Mumbai Hub', vehicle_no: 'MH-01-AB-1234', qty: 450, driver: 'Raju', status: 'In Transit' },
  ],
  packing_list: [
    { pack_id: 'PK-401', order_id: 'ORD-901', total_cartons: 15, net_weight: '120kg', gross_weight: '145kg', ready_date: '2026-04-08' },
  ],
  shipping_docs: [
    { doc_id: 'DOC-901', type: 'Insurance', consignee: 'Global Exports', date: '2026-04-01', expiry: '2027-04-01', file_link: 'view.pdf', status: 'Valid' },
  ],
  costing_comparisons: [
    { design_id: 'D-101', estimated_cost: 450, actual_cost: 465, variance: 15, breakdown: { fabric: 250, trims: 50, labor: 100, overhead: 65 } },
    { design_id: 'D-103', estimated_cost: 350, actual_cost: 340, variance: -10, breakdown: { fabric: 200, trims: 30, labor: 80, overhead: 30 } }
  ] as CostingComparison[],
  social_posts: [
    { id: 'POST-01', platform: 'Instagram', content: 'Checkout our new Summer Floral Collection! #Fashion #Summer2026', scheduled_date: '2026-04-15 10:00', status: 'Scheduled', engagement: { likes: 0, comments: 0, shares: 0 } },
    { id: 'POST-02', platform: 'Facebook', content: 'New Arrivals are here! Shop now at Karni ERP.', scheduled_date: '2026-04-10 09:00', status: 'Published', engagement: { likes: 120, comments: 15, shares: 8, views: 1500 } },
  ] as SocialMediaPost[],
  whatsapp_messages: [
    { id: 'MSG-01', recipient: 'Rahul Jain', phone: '+919876543210', type: 'Order Update', message: 'Your order #ORD-5001 is now in production.', status: 'Delivered', timestamp: '2026-04-10 11:30' },
  ] as WhatsAppMessage[],
  material_forecasts: [
    { fabric_item: 'Cotton Silk', current_stock: 450, required_qty: 1200, shortfall: 750, suggested_purchase: 800, lead_time_days: 7, priority: 'High' },
    { fabric_item: 'Pure Silk', current_stock: 200, required_qty: 150, shortfall: 0, suggested_purchase: 0, lead_time_days: 10, priority: 'Low' },
  ] as MaterialForecast[],
  account_master: [
    { id: 'ACC-01', name: 'Cash in Hand', type: 'Asset', opening: 50000, current: 45000 },
    { id: 'ACC-02', name: 'HDFC Bank', type: 'Asset', opening: 1200000, current: 1540000 },
  ] as any[],
  hrm_employees: [
    { id: 'EMP-01', name: 'Alok Sharma', dept: 'Accounts', desig: 'Manager', status: 'Active' },
  ] as any[],
  karigar_master: [
    { id: 'K-01', name: 'Aslam Bhai', dept: 'Stitching' },
    { id: 'K-02', name: 'Zubair Karigar', dept: 'Embroidery' },
  ] as any[],
  wage_rates: [
    { id: 'WR-01', design_id: 'D-101', stage: 'Stitching', base_rate: 50, size_modifiers: { XL: 5, XXL: 10 }, pattern_modifiers: { Heavy: 15 }, color_modifiers: {} },
  ] as WageRate[],
  salary_slips: [
    { id: 'SLIP-01', karigar_id: 'K-01', karigar_name: 'Aslam Bhai', period_start: '2026-04-01', period_end: '2026-04-15', entries: [], total_earnings: 12000, deductions: 500, net_payable: 11500, status: 'Paid' },
  ] as SalarySlip[],
  karigar_wage_entries: [
    { id: 'W-01', karigar_id: 'K-01', karigar_name: 'Aslam Bhai', date: '2026-04-10', lot_id: 'LOT-201', design_id: 'D-101', stage: 'Stitching', size: 'XL', pattern: 'Heavy', color: 'Blue', qty: 100, base_rate: 50, modifiers_total: 20, final_rate: 70, total_wage: 7000 },
  ] as KarigarWageEntry[],
  buyer_feedback: [
    { id: 'FB-01', design_id: 'D-101', buyer_name: 'Retail Chain A', revision_no: 1, feedback_text: 'Sleeves need to be 1 inch longer.', date: '2026-04-05', status: 'Addressed' },
  ] as BuyerFeedback[],
  production_kpis: {
    on_time_delivery_rate: 94.5,
    avg_cycle_time_days: 12.4,
    defect_rate_percent: 2.8,
  } as ProductionKPI,
  challan: [
    { id: 'CH-401', date: '2026-04-01', party: 'Shree Fabrics', item: 'Cotton', qty: 500, status: 'Received' },
  ] as any[],
  stage_checklists: [
    { stage: 'Cutting', parameters: ['Alignment Check', 'Blade Sharpness', 'Layer Height', 'Nicks/Notches'] },
    { stage: 'Stitching', parameters: ['Stitch Density', 'Thread Match', 'Seam Strength', 'Finish Quality'] },
    { stage: 'Embroidery', parameters: ['Stitch Uniformity', 'Thread Tension', 'Pattern Alignment', 'Trimming'] },
    { stage: 'Dyeing', parameters: ['Shade Match', 'Color Fastness', 'PH Level', 'Fabric Feel'] },
    { stage: 'QC', parameters: ['Final Measurements', 'Stain Check', 'Label/Tag Match', 'Packing Integrity'] },
  ] as StageChecklist[],
};
