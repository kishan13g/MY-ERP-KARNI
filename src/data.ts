import { Design, Batch, Customer, FabricPurchase, KarigarLedger, GRN, FGStock, Machine, Payment, ARAging, ProductionDept, SustainabilityData, BundleTracking, ClientOrder, PredictiveDelay, DeadstockAlert, KarigarAttendance, VendorRating, SampleTracking, MachineMaintenance, JobVariety, QCChecklist, PackingVariety, TNAEvent, MerchApproval, CostingComparison, InventoryLocation, BuyerFeedback, WhatsAppMessage, SocialMediaPost, MaterialForecast, StageChecklist, JobSheet } from './types';

export const INITIAL_DATA = {
  kpis: {
    total_designs: 0,
    total_qty: 0,
    total_dispatched: 0,
    fabric_value: 0,
    karigar_pending: 0,
    total_payments: 0,
    active_batches: 0,
    grn_value: 0,
    ar_outstanding: 0
  },
  production: [
    { key: "dyeing", dept: "#Dyei", full: "Dyeing", issued: 0, received: 0, pending: 0 },
    { key: "print", dept: "#Prnt", full: "Print", issued: 0, received: 0, pending: 0 },
    { key: "embr", dept: "#Embr", full: "Embroidery", issued: 0, received: 0, pending: 0 },
    { key: "cutt", dept: "#Cutt", full: "Cutting", issued: 0, received: 0, pending: 0 },
    { key: "handwork", dept: "#Hand", full: "Handwork", issued: 0, received: 0, pending: 0 },
    { key: "stitching", dept: "#Stitc", full: "Stitching", issued: 0, received: 0, pending: 0 },
    { key: "qc", dept: "#QC", full: "QC", issued: 0, received: 0, pending: 0 },
    { key: "pressing", dept: "#Press", full: "Pressing", issued: 0, received: 0, pending: 0 }
  ] as ProductionDept[],
  designs: [] as Design[],
  fabric_purchase: [
    { date: '2026-03-25', challan: 'CH-101', party: 'Textile Hub', item: 'Cotton Silk', color: 'Midnight Blue', meter: 500, rate: 250, amount: 125000, status: 'Received' },
    { date: '2026-03-26', challan: 'CH-102', party: 'Premium Fabrics', item: 'Linen Blend', color: 'Sand Beige', meter: 300, rate: 450, amount: 135000, status: 'In Transit' }
  ] as FabricPurchase[],
  karigar_ledger: [
    { date: '2026-03-27', name: 'Aslam Bhai', dept: 'Stitching', work: 'Single Needle Stitching', debit: 0, credit: 15000, balance: 15000 },
    { date: '2026-03-28', name: 'Zubair Karigar', dept: 'Embroidery', work: 'Heavy Zardosi', debit: 5000, credit: 0, balance: -5000 }
  ] as KarigarLedger[],
  customers: [] as Customer[],
  batches: [
    { lot_id: 'LOT-201', style: 'D-101 Summer Kurti', customer: 'Retail Chain A', color: 'Midnight Blue', qty: 250, stage: 'Stitching', status: 'In Progress', delivery: '2026-04-10', priority: 'High' },
    { lot_id: 'LOT-202', style: 'D-102 Evening Gown', customer: 'Boutique B', color: 'Sand Beige', qty: 150, stage: 'Embroidery', status: 'Pending', delivery: '2026-04-15', priority: 'Urgent' }
  ] as Batch[],
  grn: [] as GRN[],
  fg_stock: [] as FGStock[],
  machines: [] as Machine[],
  payments: [] as Payment[],
  ar_aging: [] as ARAging[],
  sustainability: [] as SustainabilityData[],
  bundle_tracking: [] as BundleTracking[],
  client_orders: [] as ClientOrder[],
  predictive_delays: [] as PredictiveDelay[],
  deadstock_alerts: [] as DeadstockAlert[],
  karigar_attendance: [] as KarigarAttendance[],
  vendor_ratings: [] as VendorRating[],
  sample_tracking: [] as SampleTracking[],
  machine_maintenance: [] as MachineMaintenance[],
  job_varieties: [] as JobVariety[],
  job_sheets: [] as JobSheet[],
  qc_checklists: [] as QCChecklist[],
  packing_varieties: [] as PackingVariety[],
  tna_events: [] as TNAEvent[],
  merch_approvals: [] as MerchApproval[],
  costing_comparisons: [] as CostingComparison[],
  inventory_locations: [] as InventoryLocation[],
  buyer_feedback: [] as BuyerFeedback[],
  whatsapp_messages: [] as WhatsAppMessage[],
  social_posts: [] as SocialMediaPost[],
  material_forecasts: [] as MaterialForecast[],
  stage_checklists: [] as StageChecklist[]
};
