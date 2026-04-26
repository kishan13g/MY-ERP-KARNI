export interface KPI {
  label: string;
  value: string | number;
  sub: string;
  icon: string;
  color: string;
}

export interface ProductionDept {
  key: string;
  dept: string;
  full: string;
  issued: number;
  received: number;
  pending: number;
}

export interface Design {
  id: string;
  name: string;
  buyer: string;
  party?: string;
  qty: number;
  dyeing: string;
  print: string;
  embr: string;
  cutt: string;
  hand: string;
  stitch: string;
  qc: string;
  press: string;
  status: string;
  category?: string;
  season?: string;
  fab?: string;
  color?: string;
  frate?: number;
  cost?: number;
  sell?: number;
  margin?: number;
}

export interface Batch {
  lot_id: string;
  style: string;
  customer: string;
  color: string;
  qty: number;
  stage: string;
  status: string;
  delivery: string;
  priority: string;
  delivery_days?: number;
  done?: number;
  reject?: number;
  wages?: number;
  progress?: number;
}

export interface Customer {
  id: string;
  name: string;
  type: string;
  mobile: string;
  contact?: string;
  gstin: string;
  city: string;
  state?: string;
  credit_limit?: number;
  pay_terms?: string;
  lifetime_value?: number;
  pending_amt?: number;
  balance?: number;
  total_orders?: number;
}

export interface FabricPurchase {
  date: string;
  challan: string;
  party: string;
  item: string;
  color: string;
  meter: number;
  rate: number;
  amount: number;
  status: string;
  market_running?: boolean;
  last_used_date?: string;
}

export interface KarigarLedger {
  id?: string;
  name: string;
  dept: string;
  work: string;
  date: string;
  debit: number;
  credit: number;
  balance: number;
  mobile?: string;
  rate?: number;
}

export interface GRN {
  grn_no: string;
  date: string;
  supplier: string;
  item: string;
  challan: string;
  qty: number;
  unit: string;
  rate: number;
  amount: number;
  status: string;
}

export interface FGStock {
  fg_id: string;
  design: string;
  color: string;
  sizes: string;
  produced: number;
  dispatched: number;
  balance: number;
  status: string;
}

export interface Machine {
  id: string;
  type: string;
  operator: string;
  output: number;
  capacity: number;
  efficiency: number;
  status: string;
}

export interface Payment {
  id: string;
  date: string;
  party: string;
  invoice_no: string;
  amount: number;
  mode: string;
  utr: string;
  status: string;
}

export interface ARAging {
  party: string;
  invoice_no: string;
  date: string;
  total: number;
  paid: number;
  outstanding: number;
  age: number;
}

export interface SustainabilityData {
  id: string;
  date: string;
  fabric_waste_kg: number;
  water_usage_liters: number;
  organic_fabric_percent: number;
  carbon_footprint_score: number;
}

export interface BundleTracking {
  id: string;
  lot_id: string;
  design_id: string;
  current_stage: string;
  last_scan_time: string;
  operator: string;
  location: string;
}

export interface ClientOrder {
  id: string;
  client_id: string;
  client_name: string;
  design_id: string;
  qty: number;
  rate?: number;
  amount?: number;
  status: 'Pending' | 'In Production' | 'QC' | 'Dispatched';
  estimated_delivery: string;
  tracking_id?: string;
}

export interface PredictiveDelay {
  lot_id: string;
  design_id: string;
  predicted_delay_days: number;
  confidence_score: number;
  reason: string;
  impact_level: 'Low' | 'Medium' | 'High';
}

export interface DeadstockAlert {
  fabric_id: string;
  fabric_name: string;
  last_used_date: string;
  days_idle: number;
  stock_value: number;
  suggestion: string;
}

export interface KarigarAttendance {
  id: string;
  name: string;
  dept: string;
  date: string;
  status: 'Present' | 'Absent' | 'Half Day';
  check_in?: string;
  check_out?: string;
  overtime_hrs: number;
}

export interface VendorRating {
  vendor_id: string;
  name: string;
  quality_score: number;
  delivery_score: number;
  price_score: number;
  overall_rating: number;
  last_audit: string;
}

export interface SampleTracking {
  id: string;
  design_id: string;
  sample_type: 'Proto' | 'Fit' | 'Size Set' | 'PP';
  status: 'Pending' | 'Sent' | 'Approved' | 'Rejected';
  sent_date: string;
  feedback?: string;
}

export interface MachineMaintenance {
  machine_id: string;
  last_service: string;
  next_service: string;
  health_score: number;
  issues_reported: number;
  status: 'Healthy' | 'Warning' | 'Critical';
}

export interface JobSheet {
  id: string;
  lot_no: string;
  design_no: string;
  qty: number;
  current_stage: 'Fabric Lot' | 'Dyeing' | 'Print' | 'Embroidery' | 'Handwork' | 'Cutting' | 'Stitching' | 'QC & Pressing';
  status: 'Pending' | 'In Progress' | 'Completed';
  karigar_name?: string;
  issued_date?: string;
  received_date?: string;
  remarks?: string;
}

export interface JobVariety {
  id: string;
  category: 'Dyeing' | 'Print' | 'Embroidery' | 'Handwork' | 'Cutting' | 'Stitching' | 'Pressing';
  name: string;
  details: string;
}

export interface QCChecklist {
  design_id: string;
  checks: string[];
}

export interface PackingVariety {
  id: string;
  name: string;
  description: string;
}

export interface TNAEvent {
  id: string;
  lot_id: string;
  activity: string;
  planned_date: string;
  actual_date?: string;
  status: 'Pending' | 'Delayed' | 'Completed';
  responsible: string;
}

export interface MerchApproval {
  id: string;
  design_id: string;
  item: 'Lab Dip' | 'Strike-off' | 'Trims' | 'Fabric';
  status: 'Pending' | 'Sent' | 'Approved' | 'Rejected';
  sent_date: string;
  remarks?: string;
}

export interface CostingComparison {
  design_id: string;
  estimated_cost: number;
  actual_cost: number;
  variance: number;
  breakdown: {
    fabric: number;
    trims: number;
    labor: number;
    overhead: number;
  };
}

export interface InventoryLocation {
  id: string;
  name: string;
  address: string;
  stock_value: number;
  capacity_used: number;
}

export interface BuyerFeedback {
  id: string;
  design_id: string;
  buyer_name: string;
  revision_no: number;
  feedback_text: string;
  date: string;
  status: 'Open' | 'Addressed';
}

export interface WhatsAppMessage {
  id: string;
  recipient: string;
  phone: string;
  message: string;
  status: 'Sent' | 'Delivered' | 'Read' | 'Failed';
  timestamp: string;
  type: 'Order Update' | 'Payment Reminder' | 'Marketing' | 'Dispatch';
}

export interface SocialMediaPost {
  id: string;
  platform: 'Instagram' | 'Facebook' | 'LinkedIn' | 'Twitter' | 'YouTube' | 'Telegram' | 'Amazon' | 'Flipkart' | 'Myntra' | 'Other Shopping Site';
  content: string;
  image_url?: string;
  scheduled_date: string;
  status: 'Scheduled' | 'Published' | 'Draft';
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
}

export interface MaterialForecast {
  fabric_item: string;
  current_stock: number;
  required_qty: number;
  shortfall: number;
  suggested_purchase: number;
  lead_time_days: number;
  priority: 'Low' | 'Medium' | 'High';
}

export interface StageChecklist {
  stage: string;
  parameters: string[];
}

export interface WageRate {
  id: string;
  design_id: string;
  stage: string;
  base_rate: number;
  size_modifiers: { [size: string]: number };
  pattern_modifiers: { [pattern: string]: number };
  color_modifiers: { [color: string]: number };
}

export interface KarigarWageEntry {
  id: string;
  karigar_id: string;
  karigar_name: string;
  date: string;
  lot_id: string;
  design_id: string;
  stage: string;
  size: string;
  pattern: string;
  color: string;
  qty: number;
  base_rate: number;
  modifiers_total: number;
  final_rate: number;
  total_wage: number;
}

export interface DefectLog {
  id: string;
  date: string;
  lot_id: string;
  design_id: string;
  defect_type: string;
  qty: number;
  karigar_name: string;
  status: 'Pending' | 'Repaired' | 'Rejected';
}

export interface HRMLeave {
  id: string;
  employee_id: string;
  employee_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface CRMLead {
  id: string;
  customer_name: string;
  mobile: string;
  source: string;
  interest: string;
  status: 'New' | 'Contacted' | 'Quoted' | 'Closed';
  date: string;
}

export interface CRMComplaint {
  id: string;
  customer_name: string;
  order_id: string;
  issue: string;
  date: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

export interface ProductionKPI {
  on_time_delivery_rate: number;
  avg_cycle_time_days: number;
  defect_rate_percent: number;
}

export interface SalarySlip {
  id: string;
  karigar_id: string;
  karigar_name: string;
  period_start: string;
  period_end: string;
  entries: KarigarWageEntry[];
  total_earnings: number;
  deductions: number;
  net_payable: number;
  status: 'Draft' | 'Paid';
}

export interface GeneratedDesign {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: string;
  tags: string[];
  notes?: string;
}

export interface CheckIn {
  id: string;
  orderId: string;
  designId: string;
  designName: string;
  party: string;
  receivedQty: number;
  receivedFrom: string;
  receiveDate: string;
  status: string;
  checker?: string;
  remarks?: string;
}

export interface CheckRegister {
  id: string;
  ciId: string;
  designName: string;
  checker: string;
  totalChecked: number;
  pass: number;
  fail: number;
  alt: number;
  reject: number;
  date: string;
  defects?: { [key: string]: number };
  status: string;
  remarks?: string;
}

export interface Alteration {
  id: string;
  crId: string;
  designName: string;
  qty: number;
  defectType: string;
  altPerson: string;
  sentDate: string;
  receivedDate?: string;
  status: string;
  remarks?: string;
}

export interface PressOrder {
  id: string;
  ciId: string;
  designName: string;
  party: string;
  totalQty: number;
  pressType: string;
  tableNo: string;
  presserId: string;
  presserName: string;
  startDate: string;
  doneDate?: string;
  rate: number;
  status: string;
  remarks?: string;
}

export interface PackOrder {
  id: string;
  poId: string;
  designName: string;
  party: string;
  totalQty: number;
  packType: string;
  cartons: number;
  pcsPerCarton: number;
  tagsAttached: boolean;
  barcode?: string;
  packerId: string;
  packerName: string;
  packDate: string;
  status: string;
  remarks?: string;
  rate?: number;
}

export interface Carton {
  id: string;
  pkId: string;
  designName: string;
  cartonNo: number;
  color: string;
  size: string;
  pcs: number;
  weight: number;
  date: string;
  status: string;
}

export interface CutChallan {
  id: string;
  orderId: string;
  designName: string;
  cutterId: string;
  cutterName: string;
  cutType: string;
  tableNo: string;
  layers: number;
  fabricMeters: number;
  issueDate: string;
  dueDate: string;
  status: string;
  remarks?: string;
  sizes: { [size: string]: number };
  totalPcs: number;
  wasteMeters?: number;
  rate: number;
}

export interface ThreeDCalc {
  id: string;
  designId: string;
  designName: string;
  fabricLength: number;
  width: number;
  layers: number;
  pcsPerLayer: number;
  totalPieces: number;
  wastagePercent: number;
  estFabricReq: number;
  date: string;
  status: string;
}

export interface FabricConsumptionAI {
  id: string;
  designId: string;
  designName: string;
  fabricType: string;
  qty: number;
  stdConsumption: number;
  aiEstimated: number;
  actualUsed: number;
  wastagePercent: number;
  variance: number;
  aiAccuracy: number;
  date: string;
}

export interface PatternPlanningAI {
  id: string;
  planId: string;
  designId: string;
  designName: string;
  fabricWidth: number;
  sizes: string;
  efficiency: number;
  wastagePercent: number;
  layers: number;
  aiSuggestion: string;
  date: string;
  status: string;
}

export interface TaskTracking {
  id: string;
  taskId: string;
  title: string;
  project: string;
  status: string;
  assignees: string[];
  estimatedHours: number;
  trackedHours: number;
  todayHours: number;
  notes?: string;
  activity: { text: string; time: string }[];
}
