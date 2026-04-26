import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Factory, 
  Palette, 
  Scissors, 
  Inbox, 
  Package, 
  Settings as SettingsIcon, 
  CheckCircle2, 
  Truck, 
  HardHat, 
  Wallet, 
  CreditCard, 
  CalendarDays, 
  Calendar,
  BarChart3, 
  PieChart, 
  FileDown, 
  FileUp,
  Cpu, 
  Receipt, 
  Banknote,
  ChevronRight,
  Menu,
  X,
  Search,
  Edit2,
  Bell,
  RefreshCw,
  Trash2,
  Printer,
  Plus,
  Filter,
  Scan,
  Sparkles,
  Send,
  Wand2,
  Ruler,
  Image as ImageIcon,
  Upload,
  Camera,
  Layers,
  Maximize2,
  Download,
  QrCode,
  Leaf,
  Globe,
  Grid,
  TrendingUp,
  AlertTriangle,
  Calculator,
  ShoppingCart,
  Shield,
  Star,
  FlaskConical,
  Wrench,
  MapPin,
  MessageSquare,
  IndianRupee,
  FileText,
  Zap,
  Flame,
  Radio,
  Brain,
  Smartphone,
  Clock,
  Save,
  Library,
  Book,
  Facebook,
  Youtube,
  Twitter,
  Instagram,
  Linkedin,
  ShoppingBag,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { INITIAL_DATA } from './data';
import { cn, formatCurrency, formatDate } from './lib/utils';
import { Design, Batch, Customer, FabricPurchase, KarigarLedger, GRN, FGStock, Machine, Payment, ARAging, ProductionDept, TNAEvent, MerchApproval, BuyerFeedback, WhatsAppMessage, SocialMediaPost, MaterialForecast, StageChecklist, ClientOrder, WageRate, KarigarWageEntry, SalarySlip, GeneratedDesign } from './types';
import { JobCardPrint, JobCardData } from './JobCardPDF';
import { KarigarJobCard, KarigarJobCardData } from './KarigarJobCard';
import { OrderBookPDF, OrderBookData } from './OrderBookPDF';
import { DesignCardPDF, DesignCardData } from './DesignCardPDF';
import { CustomerLedgerPDF, LedgerData } from './CustomerLedgerPDF';
import { VendorLedgerPDF } from './VendorLedgerPDF';
import { EmployeeCardPDF, EmployeeCardData } from './EmployeeCardPDF';
import { PaymentVoucherPDF, PaymentVoucherData } from './PaymentVoucherPDF';
import { SalarySlipPDF } from './SalarySlipPDF';
import { DemoHome } from './components/DemoHome';

type Section = 
  | 'dashboard' | 'orders' | 'designs' | 'pattern_planning' | 'production_plan'
  | 'fabric_consumption' | 'vendor_master' | 'customer_master' | 'crm_leads' | 'crm_complaints'
  | 'hrm_employees' | 'hrm_leaves' | 'karigar_master' | 'account_master' | 'sample_management'
  | 'returns_rejection' | 'user_role_mgmt' | 'stock_transfer' | 'creative_studio' | 'cutting_layer_calc'
  | 'fabric' | 'batches' | 'grn' | 'fabric_issue'
  | 'fgstock' | 'machines' | 'karigar' | 'payments' | 'invoice' | 'invoice_master' | 'sales_invoice'
  | 'settings' | 'importexport' | 'customers' | 'finance' | 'merchandising'
  | 'vendor_mgmt' | 'material_forecasting' | 'tracking' | 'predictive' | 'whatsapp'
  | 'design_master_card' | 'lot_control_tower' | 'dyeing_job' | 'printing_job' 
  | 'embroidery_job' | 'cutting_job' | 'handwork_job' | 'stitching_job' 
  | 'qc_sheet' | 'pressing_job' | 'karigar_advance' | 'design_pattern_board' | 'all_sheets'
  | 'social_media' | 'quality_checklists' | 'reports' | 'client_portal' | 'hr_attendance'
  | 'sample_tracking' | 'maintenance' | 'designtracker' | 'sustainability' | 'market_running'
  | 'smart_inventory' | 'challan' | 'labels' | 'locations' | 'feedback' | 'kpi' | 'jobs' | 'qcpack' | 'costing' | 'tna' | 'analytics' | 'ai_studio' | 'job_card_entry'
  | 'account_ledger' | 'dispatch' | 'eway_bill' | 'photo_master' | 'issue_material' | 'fabric_stock'
  | 'araging' | 'accounts' | 'dyeing_tanks' | 'dyeing_orders' | 'chemical_stock' | 'colour_qc'
  | 'loom_status' | 'weaving_orders' | 'yarn_stock' | 'sewing_line' | 'operator_perf' | 'op_breakdown'
  | 'sam_efficiency' | 'alteration_rework' | 'inline_qc' | 'final_qc' | 'defect_register'
  | 'cutting_table' | 'lay_planning' | 'bundle_mgmt' | 'cutting_qc' | 'cutter_report'
  | 'fabric_return' | 'fabric_waste' | 'handwork_card' | 'embroidery_card' | 'gst_tax'
  | 'debit_credit_note' | 'jobber_ledger' | 'shipping_docs' | 'packing_list' | 'dispatch_register'
  | 'return_rejection' | 'work_order' | 'sample_approval' | 'bi_reports' | 'doc_scanner'
  | 'check_in' | 'check_register' | 'defect_log' | 'alteration' | 'press_order' | 'press_log' 
  | 'press_table' | 'pack_order' | 'carton' | 'tag_label' | 'delivery_challan' | 'cut_challan' 
  | 'size_register' | '3d_cutting_calc' | 'fabric_consumption_ai' | 'pattern_planning_ai' | 'task_tracking' | 'demo_center';

const COLORS = ['#F59E0B', '#3B82F6', '#EC4899', '#10B981', '#8B5CF6', '#F97316', '#06B6D4', '#EF4444'];

const PIPELINE_TRENDS = [
  { date: '24 Mar', issued: 1200, received: 1050, pending: 150 },
  { date: '25 Mar', issued: 1350, received: 1180, pending: 170 },
  { date: '26 Mar', issued: 1100, received: 1020, pending: 80 },
  { date: '27 Mar', issued: 1500, received: 1300, pending: 200 },
  { date: '28 Mar', issued: 1420, received: 1350, pending: 70 },
  { date: '29 Mar', issued: 1600, received: 1480, pending: 120 },
  { date: '30 Mar', issued: 1750, received: 1610, pending: 140 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-lg">
        <p className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">
          {payload[0].payload.full || label}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                <span className="text-[10px] font-medium text-slate-500">{entry.name}:</span>
              </div>
              <span className="text-xs font-bold text-slate-800">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const DetailModal = ({ detail, onClose, onSave }: { detail: { type: string, id: string, data?: any }, onClose: () => void, onSave?: (updatedData: any) => void }) => {
  if (!detail) return null;
  const [formData, setFormData] = useState<any>(detail.data || {});
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (onSave) onSave(formData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">{detail.type} Registry</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{detail.id}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[10px] font-black text-blue-600 uppercase">Live View</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
             {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition-all flex items-center gap-2"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Data
              </button>
            ) : (
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar bg-white">
          {formData ? (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                {Object.entries(formData).map(([key, value]) => {
                  if (typeof value === 'object' && value !== null) return null;
                  const isId = key.toLowerCase() === 'id' || key.toLowerCase().includes('_id');
                  
                  return (
                    <div key={key} className="space-y-1.5 group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block group-hover:text-blue-500 transition-colors">
                        {key.replace(/_/g, ' ')}
                      </label>
                      
                      {isEditing && !isId ? (
                        <input 
                          type="text"
                          value={String(value)}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                      ) : (
                        <div className={cn(
                          "text-sm font-bold p-1 rounded-lg transition-all",
                          isId ? "text-blue-600 font-mono" : "text-slate-800"
                        )}>
                          {typeof value === 'number' && (key.includes('amt') || key.includes('value') || key.includes('amount') || key.includes('rate') || key.includes('cost') || key.includes('credit') || key.includes('debit') || key.includes('balance')) 
                            ? formatCurrency(value) 
                            : String(value)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {detail.type === 'Job Sheet' && detail.data && (
                <div className="mt-6 space-y-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
                    <div className="flex justify-between items-start mb-6 border-b border-slate-200 pb-4">
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Master Job Card</h4>
                        <p className="text-[10px] text-slate-500 font-bold">Production & Quality Tracking Document</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Job No</div>
                        <div className="text-sm font-black text-blue-600">{detail.data.id}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="space-y-1">
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Lot Number</div>
                        <div className="text-xs font-bold text-slate-800">{detail.data.lot_no}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Design / Style</div>
                        <div className="text-xs font-bold text-slate-800">{detail.data.design_no}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Total Quantity</div>
                        <div className="text-xs font-bold text-slate-800">{detail.data.qty} Pcs</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stage Progress</span>
                        <div className="h-px flex-1 bg-slate-200" />
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { stage: 'Fabric Lot', status: detail.data.current_stage === 'Fabric Lot' ? 'Active' : 'Completed' },
                          { stage: 'Dyeing', status: detail.data.current_stage === 'Dyeing' ? 'Active' : 'Pending' },
                          { stage: 'Print', status: detail.data.current_stage === 'Print' ? 'Active' : 'Pending' },
                          { stage: 'Embroidery', status: detail.data.current_stage === 'Embroidery' ? 'Active' : 'Pending' },
                          { stage: 'Cutting', status: detail.data.current_stage === 'Cutting' ? 'Active' : 'Pending' },
                          { stage: 'Stitching', status: detail.data.current_stage === 'Stitching' ? 'Active' : 'Pending' },
                          { stage: 'QC & Pressing', status: detail.data.current_stage === 'QC & Pressing' ? 'Active' : 'Pending' },
                        ].map((s, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                s.status === 'Completed' ? "bg-emerald-500" : s.status === 'Active' ? "bg-blue-500 animate-pulse" : "bg-slate-200"
                              )} />
                              <span className="text-[10px] font-bold text-slate-700">{s.stage}</span>
                            </div>
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-tighter",
                              s.status === 'Completed' ? "text-emerald-600" : s.status === 'Active' ? "text-blue-600" : "text-slate-300"
                            )}>{s.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {detail.type === 'Lot' && detail.data.stage && (
                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Stage Checklist: {detail.data.stage}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(INITIAL_DATA.stage_checklists.find(c => c.stage === detail.data.stage)?.parameters || []).map((param, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2 rounded border border-slate-100">
                        <div className="w-4 h-4 rounded border border-slate-300 flex-shrink-0" />
                        {param}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              No additional data available for this ID.
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3">
            <button 
              onClick={() => window.open(window.location.href, '_blank')}
              className="flex-1 bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-900 transition-all"
            >
              <FileDown className="w-4 h-4" /> Open in New Window
            </button>
            <button 
              onClick={() => window.print()}
              className="flex-1 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
            >
              <Printer className="w-4 h-4" /> Print Details
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  
  const [selectedDetail, setSelectedDetail] = useState<{ type: string, id: string, data?: any } | null>(null);
  const [showJobCard, setShowJobCard] = useState<Partial<JobCardData> | null>(null);
  const [showKarigarCard, setShowKarigarCard] = useState<Partial<KarigarJobCardData> | null>(null);
  const [showOrderBook, setShowOrderBook] = useState<Partial<OrderBookData> | null>(null);
  const [showDesignCard, setShowDesignCard] = useState<Partial<DesignCardData> | null>(null);
  const [showCustomerLedger, setShowCustomerLedger] = useState<Partial<LedgerData> | null>(null);
  const [showVendorLedger, setShowVendorLedger] = useState<Partial<LedgerData> | null>(null);
  const [showEmployeeCard, setShowEmployeeCard] = useState<Partial<EmployeeCardData> | null>(null);
  const [showPaymentVoucher, setShowPaymentVoucher] = useState<Partial<PaymentVoucherData> | null>(null);
  const [data, setData] = useState(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [fabricSubtab, setFabricSubtab] = useState<'purchase' | 'stock' | 'issue' | 'market'>('purchase');
  const [qcSubtab, setQcSubtab] = useState<'qc' | 'packing'>('qc');
  const [jobSubtab, setJobSubtab] = useState<'master' | 'fabric_lot' | 'dyeing' | 'print' | 'embr' | 'hand' | 'cutt' | 'stitch' | 'press'>('master');
  const [grnFilterSupplier, setGrnFilterSupplier] = useState('');
  const [grnFilterStatus, setGrnFilterStatus] = useState('');
  const [fgFilterStatus, setFgFilterStatus] = useState('');
  const [paymentFilterStatus, setPaymentFilterStatus] = useState('');
  const [arFilterParty, setArFilterParty] = useState('');
  const [machineFilterStatus, setMachineFilterStatus] = useState('');
  const [jobFilterDesign, setJobFilterDesign] = useState('');
  const [jobFilterKarigar, setJobFilterKarigar] = useState('');
  const [jobFilterStatus, setJobFilterStatus] = useState('');
  const [aiChatMessages, setAiChatMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Hello! I am your KARNI ERP AI Assistant. How can I help you today? You can ask me about production status, financial summaries, or batch details.' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isGlobalEditMode, setIsGlobalEditMode] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [designAnalysis, setDesignAnalysis] = useState<{ [key: string]: string }>({});
  const [isAnalyzingDesign, setIsAnalyzingDesign] = useState<string | null>(null);
  const [batchForecasts, setBatchForecasts] = useState<{ [key: string]: string }>({});
  const [isForecastingBatch, setIsForecastingBatch] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{ title: string; content: string; loading: boolean } | null>(null);

  const handleAIInsight = async (module: string, context?: any) => {
    setAiAnalysis({ title: `${module} AI Analysis`, content: '', loading: true });
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      const prompt = `Analyze the following ERP data for the module "${module}" and provide business insights, suggestions for optimization, and potential risks. 
      Data: ${JSON.stringify(context || (data as any)[module.toLowerCase().replace(/\s+/g, '_')] || data.kpis)}
      Language: Professional Hindi mixed with English keywords (Hinglish) as common in Indian garment business.
      Format: Clean Markdown with bullet points. Limit to 3-4 powerful points.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setAiAnalysis({ 
        title: `${module} AI Analysis`, 
        content: response.text || 'Unable to generate analysis at this time.', 
        loading: false 
      });
    } catch (error) {
      console.error('AI Error:', error);
      setAiAnalysis({ 
        title: 'AI Analysis Error', 
        content: 'Failed to connect to AI service. Please check your configuration.', 
        loading: false 
      });
    }
  };

  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [savedDesigns, setSavedDesigns] = useState<GeneratedDesign[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<GeneratedDesign | null>(null);
  const [galleryDesigns, setGalleryDesigns] = useState<GeneratedDesign[]>([]);

  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('karni_token');
    const storedUser = localStorage.getItem('karni_user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setIsAuthReady(true);
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('karni_token', result.token);
        localStorage.setItem('karni_user', JSON.stringify(result.user));
        setUser(result.user);
        setIsAuthenticated(true);
        setIsDemoMode(false);
      } else {
        setLoginError(result.error || 'Login failed');
      }
    } catch (err) {
      setLoginError('Could not connect to server. Ensure backend is running.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDemoLogin = () => {
    setIsAuthenticated(true);
    setIsDemoMode(true);
    setUser({ username: 'Demo User', role: 'Viewer' });
    setActiveSection('demo_center');
  };

  const handleLogout = () => {
    localStorage.removeItem('karni_token');
    localStorage.removeItem('karni_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const [showScanner, setShowScanner] = useState(false);
  const [scannerTarget, setScannerTarget] = useState<string | null>(null);
  const [scannerResult, setScannerResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleStartScan = (target: string) => {
    setScannerTarget(target);
    setShowScanner(true);
    setIsScanning(true);
    setScannerResult(null);
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      const mockResults: { [key: string]: string } = {
        'Bundle': `BNDL-${Math.floor(1000 + Math.random() * 9000)}`,
        'Fabric Roll': `ROLL-${Math.floor(5000 + Math.random() * 4000)}`,
        'Karigar ID': `KID-${Math.floor(100 + Math.random() * 900)}`,
        'Invoice': `INV-${Math.floor(10000 + Math.random() * 90000)}`,
        'Design': `DSGN-${Math.floor(100 + Math.random() * 900)}`,
        'Lot': `LOT-${Math.floor(200 + Math.random() * 800)}`
      };
      setScannerResult(mockResults[target] || `SCAN-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 2000);
  };

  const ScannerModal = () => {
    if (!showScanner) return null;
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/20">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">AI Scanner</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Scanning {scannerTarget}...</p>
              </div>
            </div>
            <button 
              onClick={() => setShowScanner(false)}
              className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 flex flex-col items-center justify-center text-center gap-6">
            <div className="relative w-64 h-64 bg-slate-900 rounded-2xl overflow-hidden border-4 border-slate-800 shadow-2xl">
              {/* Camera View Simulation */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
              
              {isScanning ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div 
                    animate={{ 
                      y: [0, 200, 0],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute top-0 left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
                  />
                  <div className="w-48 h-48 border-2 border-dashed border-blue-400/50 rounded-xl flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-blue-500/30 animate-pulse" />
                  </div>
                  <p className="mt-4 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">Align {scannerTarget} in Frame</p>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-900/20">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-500/40 mb-4"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Scan Successful!</p>
                  <div className="mt-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                    <p className="text-white font-mono text-sm">{scannerResult}</p>
                  </div>
                </div>
              )}

              {/* Corner Accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-800">
                {isScanning ? `Processing ${scannerTarget}...` : `Found ${scannerTarget}`}
              </h4>
              <p className="text-xs text-slate-500 max-w-[250px]">
                {isScanning 
                  ? "Our AI is analyzing the visual data to identify the unique identifier." 
                  : `The ${scannerTarget} has been identified. You can now view details or proceed with the action.`}
              </p>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
            <button 
              onClick={() => setShowScanner(false)}
              className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            {!isScanning && (
              <button 
                onClick={() => {
                  setShowScanner(false);
                  if (scannerResult) {
                    setSelectedDetail({ type: scannerTarget || 'Scan', id: scannerResult, data: {} });
                  }
                }}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                View Details
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  const calculatedKpis = useMemo(() => {
    const total_designs = data.designs.length;
    const total_qty = data.batches.reduce((sum, b) => sum + (b.qty || 0), 0);
    const total_dispatched = data.fg_stock.reduce((sum, s) => sum + (s.dispatched || 0), 0);
    const fabric_value = data.fabric_purchase.reduce((sum, f) => sum + (f.amount || 0), 0);
    const karigar_pending = data.karigar_ledger.reduce((sum, k) => sum + (k.balance || 0), 0);
    const total_payments = data.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const active_batches = data.batches.filter(b => b.status === 'In Progress' || b.status === 'Active').length;
    const grn_value = data.grn.reduce((sum, g) => sum + (g.amount || 0), 0);
    const ar_outstanding = data.customers.reduce((sum, c) => sum + (c.balance || 0), 0);
    const machine_efficiency = data.machines.length > 0 
      ? Math.round(data.machines.reduce((sum, m) => sum + (m.efficiency || 0), 0) / data.machines.length)
      : 88;

    // Production KPIs
    const on_time_delivery_rate = data.production_kpis?.on_time_delivery_rate || 94.5;
    const avg_cycle_time_days = data.production_kpis?.avg_cycle_time_days || 12.4;
    const defect_rate_percent = data.production_kpis?.defect_rate_percent || 2.8;

    return {
      total_designs,
      total_qty,
      total_dispatched,
      fabric_value,
      karigar_pending,
      total_payments,
      active_batches,
      grn_value,
      ar_outstanding,
      machine_efficiency,
      on_time_delivery_rate,
      avg_cycle_time_days,
      defect_rate_percent
    };
  }, [data]);

  const jobSheetsStats = useMemo(() => {
    const total = data.job_sheets.length;
    const completed = data.job_sheets.filter(s => s.status === 'Completed').length;
    const in_progress = data.job_sheets.filter(s => s.status === 'In Progress').length;
    const pending = total - completed - in_progress;
    
    const by_stage = data.job_sheets.reduce((acc, s) => {
      acc[s.current_stage] = (acc[s.current_stage] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return { total, completed, in_progress, pending, by_stage };
  }, [data.job_sheets]);

  const stageVarietiesSummary = useMemo(() => {
    return data.job_varieties.reduce((acc, v) => {
      acc[v.category] = (acc[v.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }, [data.job_varieties]);

  const productionData = useMemo(() => {
    const depts = [
      { key: "dyeing", full: "Dyeing", dept: "#Dyei" },
      { key: "print", full: "Print", dept: "#Prnt" },
      { key: "embr", full: "Embroidery", dept: "#Embr" },
      { key: "cutt", full: "Cutting", dept: "#Cutt" },
      { key: "handwork", full: "Handwork", dept: "#Hand" },
      { key: "stitching", full: "Stitching", dept: "#Stitc" },
      { key: "qc", full: "QC", dept: "#QC" },
      { key: "pressing", dept: "#Press", full: "Pressing" }
    ];

    return depts.map(d => {
      const issued = data.batches.filter(b => b.stage === d.full).reduce((sum, b) => sum + (b.qty || 0), 0);
      const received = data.fg_stock.filter(s => s.design === d.full).reduce((sum, s) => sum + (s.produced || 0), 0); 
      const pending = issued - received > 0 ? issued - received : 0;
      
      // If no batches, use demo values from INITIAL_DATA to keep it looking good
      if (issued === 0) {
        const demo = INITIAL_DATA.production.find(p => p.key === d.key);
        return demo || { ...d, issued: 0, received: 0, pending: 0 };
      }

      return {
        ...d,
        issued,
        received,
        pending
      };
    });
  }, [data]);

  const handleCleanData = () => {
    if (window.confirm("Are you sure you want to clean all data and reset to demo state?")) {
      setData(INITIAL_DATA);
      alert("Data cleaned and reset to demo state.");
    }
  };

  const handleGenerateImage = async () => {
    if (!aiPrompt.trim() || isGeneratingImage) return;
    setIsGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ parts: [{ text: `A professional fashion design concept for: ${aiPrompt}. High-end garment visualization, textile patterns, professional studio lighting, detailed fabric texture.` }] }],
        config: {
          imageConfig: {
            aspectRatio: "3:4",
          },
        },
      });

      let imageUrl = '';
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
      
      if (imageUrl) {
        const newDesign: GeneratedDesign = {
          id: `DESIGN-${Date.now()}`,
          prompt: aiPrompt,
          imageUrl,
          timestamp: new Date().toISOString(),
          tags: aiPrompt.split(',').map(t => t.trim()).filter(t => t),
        };
        setSavedDesigns(prev => [newDesign, ...prev]);
        setSelectedDesign(newDesign);
      }
    } catch (error) {
      console.error("Image Generation Error:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSaveDesign = (design: GeneratedDesign) => {
    if (galleryDesigns.some(d => d.id === design.id)) return;
    setGalleryDesigns(prev => [design, ...prev]);
  };

  const handleExportDesign = (design: GeneratedDesign) => {
    const link = document.createElement('a');
    link.href = design.imageUrl;
    link.download = `design-${design.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBatchForecast = async (lotId: string, stage: string, qty: number) => {
    setIsForecastingBatch(lotId);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: 'user',
            parts: [{ text: `Predict a realistic completion date for a batch of ${qty} pieces currently at the "${stage}" stage. 
            Context: Textile manufacturing. Just give a short 3-4 word prediction like "Estimated: 5 days" or "On track: 3 days".` }]
          }
        ]
      });

      const result = await model;
      setBatchForecasts(prev => ({ ...prev, [lotId]: result.text || "Unknown" }));
    } catch (error) {
      console.error("Batch Forecast Error:", error);
    } finally {
      setIsForecastingBatch(null);
    }
  };

  const handleDesignAnalysis = async (designId: string, designName: string) => {
    setIsAnalyzingDesign(designId);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: 'user',
            parts: [{ text: `Provide a quick 2-sentence production tip and a 1-sentence marketing hook for this textile design: "${designName}". 
            Context: This is for an ERP system. Keep it professional.` }]
          }
        ]
      });

      const result = await model;
      setDesignAnalysis(prev => ({ ...prev, [designId]: result.text || "No analysis available." }));
    } catch (error) {
      console.error("Design Analysis Error:", error);
    } finally {
      setIsAnalyzingDesign(null);
    }
  };

  const handleGenerateSummary = async () => {
    const k = calculatedKpis;
    setIsGeneratingSummary(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: 'user',
            parts: [{ text: `Generate a professional executive summary for KARNI ERP based on this data:
            - Total Designs: ${k.total_designs}
            - Total Quantity: ${k.total_qty}
            - Fabric Value: ${formatCurrency(k.fabric_value)}
            - AR Outstanding: ${formatCurrency(k.ar_outstanding)}
            - Karigar Due: ${formatCurrency(k.karigar_pending)}
            - Active Batches: ${data.batches.length}
            
            Include a 'Production Outlook' and 'Financial Health' section. Keep it under 200 words.` }]
          }
        ]
      });

      const result = await model;
      setAiSummary(result.text || "Failed to generate summary.");
    } catch (error) {
      console.error("AI Summary Error:", error);
      setAiSummary("Error generating AI summary. Please try again.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleSendAiMessage = async () => {
    if (!aiInput.trim() || isAiLoading) return;

    const k = calculatedKpis;
    const userMessage = aiInput;
    setAiInput('');
    setAiChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsAiLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: 'user',
            parts: [{ text: `You are an AI assistant for KARNI ERP, a textile manufacturing management system. 
            Current ERP Data Summary:
            - Total Designs: ${k.total_designs}
            - Total Quantity: ${k.total_qty}
            - Fabric Value: ${formatCurrency(k.fabric_value)}
            - AR Outstanding: ${formatCurrency(k.ar_outstanding)}
            - Karigar Due: ${formatCurrency(k.karigar_pending)}
            - Active Batches: ${data.batches.length}
            
            User Question: ${userMessage}` }]
          }
        ],
        config: {
          systemInstruction: "You are a professional ERP assistant. Keep answers concise and data-driven based on the provided summary. If the user asks for something not in the summary, explain that you have limited access to real-time deep data but can provide general guidance based on the dashboard."
        }
      });

      const result = await model;
      const responseText = result.text || "I'm sorry, I couldn't generate a response.";
      
      setAiChatMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setAiChatMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please check your connection or try again later." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const navItems = [
    { id: 'all_sheets', label: 'All Sheets Index', icon: Grid, category: 'Main Operations' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Main Operations' },
    { id: 'orders', label: 'Order Book', icon: ClipboardList, category: 'Main Operations' },
    { id: 'designs', label: 'Design Register', icon: Palette, category: 'Main Operations' },
    { id: 'pattern_planning', label: 'Pattern Planning', icon: Ruler, category: 'Main Operations' },
    { id: 'production_plan', label: 'Production Plan', icon: Factory, category: 'Main Operations' },
    { id: 'jobs', label: 'Job Sheets & Stage Varieties', icon: FileText, category: 'Main Operations' },
    { id: 'job_card_entry', label: 'Job Card Entry Form', icon: ClipboardList, category: 'Main Operations' },
    { id: 'tna', label: 'T&A (Time & Action)', icon: CalendarDays, category: 'Main Operations' },
    { id: 'merchandising', label: 'Merchandising', icon: ShoppingCart, category: 'Main Operations' },
    { id: 'costing', label: 'Product Costing', icon: Calculator, category: 'Main Operations' },
    { id: 'tracking', label: 'Live RFID/QR Tracking', icon: Radio, category: 'Main Operations' },
    
    { id: 'fabric_consumption', label: 'Fabric Consumption', icon: Scissors, category: 'Master Data' },
    { id: 'photo_master', label: 'Photo Master', icon: Camera, category: 'Master Data' },
    { id: 'vendor_master', label: 'Vendor Master', icon: Star, category: 'Master Data' },
    { id: 'vendor_mgmt', label: 'Vendor Performance', icon: TrendingUp, category: 'Master Data' },
    { id: 'customer_master', label: 'Customer Master', icon: Users, category: 'Master Data' },
    { id: 'customers', label: 'Customers List', icon: Users, category: 'Master Data' },
    { id: 'crm_leads', label: 'CRM Leads', icon: TrendingUp, category: 'Master Data' },
    { id: 'crm_complaints', label: 'CRM Complaints', icon: AlertTriangle, category: 'Master Data' },
    { id: 'design_master_card', label: 'Design Master Cards', icon: Palette, category: 'Master Data' },
    { id: 'design_pattern_board', label: 'Pattern Board', icon: Grid, category: 'Master Data' },
    { id: 'locations', label: 'Locations Master', icon: MapPin, category: 'Master Data' },
    { id: 'feedback', label: 'Buyer Feedback', icon: MessageSquare, category: 'Master Data' },
    
    { id: 'hrm_employees', label: 'HRM Employees', icon: Users, category: 'HRM & Karigar' },
    { id: 'hrm_leaves', label: 'HRM Leaves', icon: Calendar, category: 'HRM & Karigar' },
    { id: 'hr_attendance', label: 'Karigar Attendance', icon: Clock, category: 'HRM & Karigar' },
    { id: 'karigar_master', label: 'Karigar Master', icon: HardHat, category: 'HRM & Karigar' },
    { id: 'karigar_advance', label: 'Karigar Advance', icon: Wallet, category: 'HRM & Karigar' },
    { id: 'karigar_wages', label: 'Karigar Wages & Slips', icon: IndianRupee, category: 'HRM & Karigar' },
    { id: 'account_master', label: 'Account Master', icon: Banknote, category: 'HRM & Karigar' },
    { id: 'sample_management', label: 'Sample Management', icon: FlaskConical, category: 'HRM & Karigar' },
    { id: 'sample_tracking', label: 'Sample Tracking', icon: Search, category: 'HRM & Karigar' },
    
    { id: 'returns_rejection', label: 'Returns & Rejection', icon: RefreshCw, category: 'Advanced Tools' },
    { id: 'user_role_mgmt', label: 'User & Role Management', icon: Shield, category: 'Advanced Tools' },
    { id: 'stock_transfer', label: 'Stock Transfer', icon: Truck, category: 'Advanced Tools' },
    { id: 'creative_studio', label: 'AI Design Pattern', icon: Sparkles, category: 'Advanced Tools' },
    { id: 'cutting_layer_calc', label: 'Cutting Layer Calc', icon: Calculator, category: 'Advanced Tools' },
    { id: '3d_cutting_calc', label: '3D Cutting Calc', icon: Box, category: 'Advanced Tools' },
    { id: 'fabric_consumption_ai', label: 'Fabric Consumption AI', icon: Brain, category: 'Advanced Tools' },
    { id: 'pattern_planning_ai', label: 'Pattern Planning AI', icon: Ruler, category: 'Advanced Tools' },
    { id: 'task_tracking', label: 'Task Tracking', icon: Clock, category: 'Advanced Tools' },
    { id: 'quality_checklists', label: 'Quality Checklists', icon: CheckCircle2, category: 'Advanced Tools' },
    { id: 'maintenance', label: 'Machine Maintenance', icon: Wrench, category: 'Advanced Tools' },
    { id: 'designtracker', label: 'Design Tracker', icon: Radio, category: 'Advanced Tools' },
    { id: 'sustainability', label: 'Sustainability Index', icon: Leaf, category: 'Advanced Tools' },
    { id: 'ai_studio', label: 'AI Design Studio', icon: Sparkles, category: 'Advanced Tools' },
    
    { id: 'fabric', label: 'Fabric Purchase', icon: ShoppingBag, category: 'Inventory & Production' },
    { id: 'fabric_stock', label: 'Fabric Stock', icon: Layers, category: 'Inventory & Production' },
    { id: 'batches', label: 'Production Batches', icon: Package, category: 'Inventory & Production' },
    { id: 'lot_control_tower', label: 'Lot Control Tower', icon: LayoutDashboard, category: 'Inventory & Production' },
    { id: 'grn', label: 'GRN', icon: Inbox, category: 'Inventory & Production' },
    { id: 'fabric_issue', label: 'Fabric Issue', icon: Truck, category: 'Inventory & Production' },
    { id: 'issue_material', label: 'Issue Material', icon: Truck, category: 'Inventory & Production' },
    { id: 'market_running', label: 'Market Running', icon: Flame, category: 'Inventory & Production' },
    { id: 'smart_inventory', label: 'Smart Inventory', icon: Cpu, category: 'Inventory & Production' },
    
    { id: 'check_in', label: 'Received for Checking', icon: Inbox, category: 'Checking & Packing' },
    { id: 'check_register', label: 'Checking Register', icon: CheckCircle2, category: 'Checking & Packing' },
    { id: 'defect_log', label: 'Defect Log', icon: AlertTriangle, category: 'Checking & Packing' },
    { id: 'alteration', label: 'Alteration Tracking', icon: Wrench, category: 'Checking & Packing' },
    { id: 'press_order', label: 'Press Orders', icon: Flame, category: 'Checking & Packing' },
    { id: 'press_log', label: 'Pressing Log', icon: ClipboardList, category: 'Checking & Packing' },
    { id: 'press_table', label: 'Table Status', icon: Grid, category: 'Checking & Packing' },
    { id: 'pack_order', label: 'Packing Orders', icon: Package, category: 'Checking & Packing' },
    { id: 'carton', label: 'Carton Register', icon: Package, category: 'Checking & Packing' },
    { id: 'tag_label', label: 'Tag & Label', icon: QrCode, category: 'Checking & Packing' },
    { id: 'qcpack', label: 'QC & Packing', icon: CheckCircle2, category: 'Checking & Packing' },

    { id: 'cut_challan', label: 'Cut Challans', icon: FileText, category: 'Cutting & Dispatch' },
    { id: 'size_register', label: 'Size Register', icon: Ruler, category: 'Cutting & Dispatch' },
    { id: 'challan', label: 'Delivery Challan', icon: FileText, category: 'Cutting & Dispatch' },
    { id: 'dispatch', label: 'Dispatch', icon: Truck, category: 'Cutting & Dispatch' },
    { id: 'delivery_challan', label: 'Delivery Challans', icon: FileText, category: 'Cutting & Dispatch' },
    { id: 'eway_bill', label: 'E-Way Bill', icon: FileText, category: 'Cutting & Dispatch' },
    { id: 'labels', label: 'QR/RFID Labels', icon: QrCode, category: 'Cutting & Dispatch' },
    
    { id: 'fgstock', label: 'Finished Goods Stock', icon: Package, category: 'Finance & Accounts' },
    { id: 'machines', label: 'Machine Ledger', icon: Zap, category: 'Finance & Accounts' },
    { id: 'karigar', label: 'Karigar Entries', icon: BarChart3, category: 'Finance & Accounts' },
    { id: 'payments', label: 'Payments Received', icon: CreditCard, category: 'Finance & Accounts' },
    { id: 'araging', label: 'AR Aging Report', icon: Clock, category: 'Finance & Accounts' },
    { id: 'invoice', label: 'GST Invoices', icon: Receipt, category: 'Finance & Accounts' },
    { id: 'sales_invoice', label: 'Sales Invoice', icon: Receipt, category: 'Finance & Accounts' },
    { id: 'invoice_master', label: 'Invoice Master', icon: Library, category: 'Finance & Accounts' },
    { id: 'account_ledger', label: 'Account Ledger', icon: Book, category: 'Finance & Accounts' },
    { id: 'finance', label: 'Finance Overview', icon: IndianRupee, category: 'Finance & Accounts' },
    { id: 'kpi', label: 'KPI Dashboard', icon: BarChart3, category: 'Finance & Accounts' },
    
    { id: 'analytics', label: 'Advanced Analytics', icon: PieChart, category: 'System' },
    { id: 'predictive', label: 'Predictive AI', icon: Brain, category: 'System' },
    { id: 'whatsapp', label: 'WhatsApp Sync', icon: MessageSquare, category: 'System' },
    { id: 'social_media', label: 'Social Media', icon: Globe, category: 'System' },
    { id: 'material_forecasting', label: 'Material Forecast', icon: TrendingUp, category: 'System' },
    { id: 'reports', label: 'System Reports', icon: FileDown, category: 'System' },
    { id: 'client_portal', label: 'B2B Client Portal', icon: Smartphone, category: 'System' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, category: 'System' },
    { id: 'importexport', label: 'Import/Export', icon: FileDown, category: 'System' },
  ];

  const categories = Array.from(new Set(navItems.map(item => item.category)));

  const [showNewEntryModal, setShowNewEntryModal] = useState<{ type: string; title: string } | null>(null);
  const [genericFormData, setGenericFormData] = useState<any>({});

  const handleGenericSave = (type: string, data?: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    const entry = { ...(data || genericFormData), id };

    switch (type) {
      case 'Job Sheet':
        setData(prev => ({ ...prev, jobs: [entry, ...prev.jobs] }));
        break;
      case 'Order':
        // For orders, we might need to map fields if they don't match exactly
        // But for now let's assume they match or we fix them in the modal
        setData(prev => ({ ...prev, batches: [{ ...entry, lot_id: entry.orderId || id, stage: 'Order' }, ...prev.batches] }));
        break;
      case 'Design':
        setData(prev => ({ ...prev, designs: [entry, ...prev.designs] }));
        break;
      case 'Batch':
        setData(prev => ({ ...prev, batches: [entry, ...prev.batches] }));
        break;
      case 'Customer':
        setData(prev => ({ ...prev, customers: [entry, ...prev.customers] }));
        break;
      case 'Vendor':
        setData(prev => ({ ...prev, vendors: [entry, ...prev.vendors] }));
        break;
      case 'Employee':
        setData(prev => ({ ...prev, hrm_employees: [entry, ...prev.hrm_employees] }));
        break;
      case 'Fabric Purchase':
        setData(prev => ({ ...prev, fabric_purchase: [entry, ...prev.fabric_purchase] }));
        break;
      case 'GRN':
        setData(prev => ({ ...prev, grn: [entry, ...prev.grn] }));
        break;
      case 'FG Stock':
        setData(prev => ({ ...prev, fg_stock: [entry, ...prev.fg_stock] }));
        break;
      case 'Payment':
        setData(prev => ({ ...prev, payments: [entry, ...prev.payments] }));
        break;
      case 'Karigar':
        setData(prev => ({ ...prev, karigar_master: [entry, ...prev.karigar_master] }));
        break;
      case 'Account':
        setData(prev => ({ ...prev, account_master: [entry, ...prev.account_master] }));
        break;
      default:
        console.log('Save logic not implemented for:', type);
    }

    setShowNewEntryModal(null);
    setGenericFormData({});
    alert(`${type} saved successfully!`);
  };

  const updateGenericField = (field: string, value: any) => {
    setGenericFormData((prev: any) => ({ ...prev, [field]: value }));
  };
  const [selectedDesignId, setSelectedDesignId] = useState<string>('');
  const [selectedSlip, setSelectedSlip] = useState<SalarySlip | null>(null);
  const [activeDTTab, setActiveDTTab] = useState<string>('summary');
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState<boolean>(false);
  const [isExportingToGoogle, setIsExportingToGoogle] = useState<string | null>(null);
  const [showGoogleImportModal, setShowGoogleImportModal] = useState<boolean>(false);
  const [importingType, setImportingType] = useState<string>('Batch Management');
  const [spreadsheetId, setSpreadsheetId] = useState<string>(() => localStorage.getItem('ki_spreadsheet_id') || '');
  useEffect(() => {
    if (spreadsheetId) localStorage.setItem('ki_spreadsheet_id', spreadsheetId);
  }, [spreadsheetId]);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isBulkExporting, setIsBulkExporting] = useState<boolean>(false);
  const [debugRedirectUri, setDebugRedirectUri] = useState<string>('');

  const [jobCardType, setJobCardType] = useState<string>('dyeing');
  const [activePlatform, setActivePlatform] = useState('all');
  const [wageTab, setWageTab] = useState<'rates' | 'entries' | 'slips'>('entries');
  const [selectedKarigar, setSelectedKarigar] = useState<string>('all');
  const [jobCardCounters, setJobCardCounters] = useState<Record<string, number>>({ DYE: 1, PRT: 1, EMB: 1, CUT: 1, HND: 1, STT: 1, PRS: 1 });
  const [jobCardEntries, setJobCardEntries] = useState<any[]>([]);
  const [jobCardFormData, setJobCardFormData] = useState<any>({
    date: new Date().toISOString().split('T')[0],
    challanNo: '',
    designId: '',
    lotNo: '',
    designName: '',
    fabricName: '',
    colour: '',
    status: 'Pending',
    karigar: '',
    qty: 0,
    rate: 0,
    total: 0,
    type: '',
    issueDate: '',
    outDate: '',
    qc: '',
    shade: '',
    remark: '',
    colors: 0,
    material: '',
    size: '',
    wastage: 0,
    pattern: '',
    style: '',
    chest: 0,
    length: 0,
    shoulder: 0,
    sleeve: 0,
    qtyPressed: 0,
    qtyPacked: 0,
    packing: '',
    tag: '',
    advance: 0,
    tds: 0,
    net: 0,
    mode: '',
    payDate: '',
    balance: 0,
    payStatus: 'Pending'
  });

  const DT = {
    get: (dn: string, key: string) => { try { return JSON.parse(localStorage.getItem('ki_dt_'+dn+'_'+key)||'[]') } catch(e){ return [] } },
    set: (dn: string, key: string, val: any) => localStorage.setItem('ki_dt_'+dn+'_'+key, JSON.stringify(val)),
    push: (dn: string, key: string, obj: any) => { const arr=DT.get(dn,key); obj.id=obj.id||Math.random().toString(36).substr(2, 9); arr.push(obj); DT.set(dn,key,arr); return obj; },
    del: (dn: string, key: string, id: string) => { const arr=DT.get(dn,key).filter((r: any)=>r.id!==id); DT.set(dn,key,arr); },
  };

  useEffect(() => {
    const checkGoogleAuth = async () => {
      try {
        const res = await fetch('/api/auth/google/status');
        const data = await res.json();
        setIsGoogleAuthenticated(data.isAuthenticated);
      } catch (e) {
        console.error("Failed to check Google auth status", e);
      }
    };
    checkGoogleAuth();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        setIsGoogleAuthenticated(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const jobPrefixes: Record<string, string> = {
      dyeing: 'DYE', printing: 'PRT', embroidery: 'EMB',
      cutting: 'CUT', handwork: 'HND', stitching: 'STT', pressing: 'PRS'
    };
    const prefix = jobPrefixes[jobCardType];
    if (prefix) {
      const num = String(jobCardCounters[prefix]).padStart(3, '0');
      const challan = `${prefix}-${num}`;
      setJobCardFormData(prev => ({ ...prev, challanNo: challan }));
    }
  }, [jobCardType, jobCardCounters]);

  const updateJobCardField = (field: string, value: any) => {
    setJobCardFormData((prev: any) => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'designId') {
        const designs: Record<string, any> = {
          'KI-D001': { name: 'Floral Kurti A', fabric: 'Georgette', colour: 'Red' },
          'KI-D002': { name: 'Straight Salwar B', fabric: 'Cotton', colour: 'Blue' },
          'KI-D003': { name: 'New Design', fabric: '', colour: '' },
        };
        if (designs[value]) {
          newData.designName = designs[value].name;
          newData.fabricName = designs[value].fabric;
          newData.colour = designs[value].colour;
          if (value === 'KI-D001') newData.lotNo = 'LOT-001';
          if (value === 'KI-D002') newData.lotNo = 'LOT-002';
        }
      }

      const qty = parseFloat(field === 'qty' ? value : (field === 'qtyPressed' ? value : newData.qty)) || 0;
      const rate = parseFloat(field === 'rate' ? value : newData.rate) || 0;
      const total = qty * rate;
      newData.total = total;

      const advance = parseFloat(field === 'advance' ? value : newData.advance) || 0;
      const tds = parseFloat(field === 'tds' ? value : newData.tds) || 0;
      const net = total - tds;
      const balance = net - advance;
      
      newData.net = net;
      newData.balance = balance;

      if (advance >= net && net > 0) newData.payStatus = 'Paid';
      else if (advance > 0) newData.payStatus = 'Partial';
      else newData.payStatus = 'Pending';

      return newData;
    });
  };

  const saveJobCardEntry = () => {
    if (!jobCardFormData.date || !jobCardFormData.challanNo || !jobCardFormData.designId) {
      alert('Please fill Date, Challan No and Design ID');
      return;
    }

    const entry = { 
      ...jobCardFormData, 
      id: Math.random().toString(36).substr(2, 9),
      jobType: jobCardType 
    };
    setJobCardEntries((prev: any[]) => [entry, ...prev]);

    const jobPrefixes: Record<string, string> = {
      dyeing: 'DYE', printing: 'PRT', embroidery: 'EMB',
      cutting: 'CUT', handwork: 'HND', stitching: 'STT', pressing: 'PRS'
    };
    const prefix = jobPrefixes[jobCardType];
    setJobCardCounters((prev: any) => ({ ...prev, [prefix]: prev[prefix] + 1 }));
    
    alert('Job Card Saved: ' + jobCardFormData.challanNo);
  };

  const clearJobCardForm = () => {
    setJobCardFormData({
      date: new Date().toISOString().split('T')[0],
      challanNo: 'CH-' + Math.floor(Math.random() * 10000),
      designId: '',
      lotNo: '',
      designName: '',
      fabricName: '',
      colour: '',
      status: 'Pending',
      karigar: '',
      qty: 0,
      rate: 0,
      total: 0,
      type: '',
      issueDate: '',
      outDate: '',
      qc: '',
      shade: '',
      remark: '',
      colors: 0,
      material: '',
      size: '',
      wastage: 0,
      pattern: '',
      style: '',
      chest: 0,
      length: 0,
      shoulder: 0,
      sleeve: 0,
      qtyPressed: 0,
      qtyPacked: 0,
      packing: '',
      tag: '',
      advance: 0,
      tds: 0,
      net: 0,
      mode: '',
      payDate: '',
      balance: 0,
      payStatus: 'Pending',
      stitches: 0,
      machineNo: '',
      sizeS: 0,
      sizeM: 0,
      sizeL: 0,
      sizeXL: 0,
      avgConsumption: 0,
      workType: '',
      operation: '',
      ironingType: 'Steam',
      expectedOutDate: '',
      qcPass: 'Pending',
      remarks: '',
      dyeType: 'Reactive',
      printType: 'Digital',
      noOfColours: 0
    });
  };

  const handleGoogleAuth = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const { url, redirectUri } = await res.json();
      setDebugRedirectUri(redirectUri);
      window.open(url, 'google_auth_popup', 'width=600,height=700');
    } catch (e) {
      console.error("Failed to get Google auth URL", e);
    }
  };

  const handleGoogleImport = async () => {
    let finalId = spreadsheetId;
    // Extract ID if a full URL is provided
    if (spreadsheetId.includes('docs.google.com/spreadsheets/d/')) {
      const match = spreadsheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        finalId = match[1];
      }
    }

    if (!finalId) {
      alert("Please enter a Spreadsheet ID or URL");
      return;
    }
    setIsImporting(true);
    try {
      const res = await fetch('/api/google/sheets/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetId: finalId }),
      });
      const result = await res.json();
      if (result.success && result.values) {
        const [headers, ...rows] = result.values;
        
        const getCol = (name: string) => {
          const idx = headers.findIndex((h: string) => h.toLowerCase().trim() === name.toLowerCase().trim());
          return idx;
        };

        // Simple mapping logic based on type
        if (importingType === 'Batch Management') {
          const newBatches = rows.map((row: any[]) => ({
            id: Math.random().toString(36).substr(2, 9),
            lot_id: row[getCol('Lot ID')] || row[0] || '',
            style: row[getCol('Style')] || row[1] || '',
            customer: row[getCol('Customer')] || row[2] || '',
            color: row[getCol('Color')] || row[3] || '',
            qty: parseInt(row[getCol('Qty')] || row[4]) || 0,
            stage: row[getCol('Stage')] || row[5] || 'Cutting',
            status: row[getCol('Status')] || row[6] || 'Active',
            delivery: row[getCol('Delivery')] || row[7] || new Date().toISOString().split('T')[0],
            priority: row[getCol('Priority')] || row[8] || 'Medium',
          }));
          setData(prev => ({ ...prev, batches: [...newBatches, ...prev.batches] }));
        } else if (importingType === 'Fabric Purchase Register') {
          const newFabric = rows.map((row: any[]) => ({
            id: Math.random().toString(36).substr(2, 9),
            date: row[getCol('Date')] || row[0] || new Date().toISOString().split('T')[0],
            challan: row[getCol('Challan')] || row[1] || '',
            party: row[getCol('Party')] || row[2] || '',
            item: row[getCol('Item')] || row[3] || '',
            color: row[getCol('Color')] || row[4] || '',
            meter: parseFloat(row[getCol('Meter')] || row[5]) || 0,
            rate: parseFloat(row[getCol('Rate')] || row[6]) || 0,
            amount: parseFloat(row[getCol('Amount')] || row[7]) || 0,
            status: row[getCol('Status')] || row[8] || 'Pending',
          }));
          setData(prev => ({ ...prev, fabric_purchase: [...newFabric, ...prev.fabric_purchase] }));
        } else if (importingType === 'Karigar Ledger') {
          const newKarigar = rows.map((row: any[]) => ({
            id: Math.random().toString(36).substr(2, 9),
            date: row[getCol('Date')] || row[0] || new Date().toISOString().split('T')[0],
            name: row[getCol('Karigar Name')] || row[1] || '',
            work: row[getCol('Work Description')] || row[2] || '',
            debit: parseFloat(row[getCol('Debit')] || row[3]) || 0,
            credit: parseFloat(row[getCol('Credit')] || row[4]) || 0,
            balance: parseFloat(row[getCol('Balance')] || row[5]) || 0,
            dept: row[getCol('Dept')] || row[6] || 'Stitching',
          }));
          setData(prev => ({ ...prev, karigar_ledger: [...newKarigar, ...prev.karigar_ledger] }));
        }
        
        alert(`Successfully imported ${rows.length} records!`);
        setShowGoogleImportModal(false);
      } else {
        alert("Failed to import: " + (result.error || "Unknown error"));
      }
    } catch (e) {
      console.error("Import error", e);
      alert("Import failed. Check console for details.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleBulkImport = async () => {
    let finalId = spreadsheetId;
    if (spreadsheetId.includes('docs.google.com/spreadsheets/d/')) {
      const match = spreadsheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        finalId = match[1];
      }
    }

    if (!finalId) {
      alert("Please enter a Spreadsheet ID or URL");
      return;
    }

    setIsImporting(true);
    try {
      const res = await fetch('/api/google/sheets/import-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetId: finalId }),
      });
      const result = await res.json();
      
      if (result.success && result.allData) {
        const allData = result.allData;
        const newData: any = { ...data };

        const processSheet = (sheetName: string, dataKey: string, mapper: (row: any[], getCol: (n: string) => number) => any) => {
          if (allData[sheetName] && allData[sheetName].length > 1) {
            const [headers, ...rows] = allData[sheetName];
            const getCol = (name: string) => {
              const idx = headers.findIndex((h: string) => h && h.toLowerCase().trim() === name.toLowerCase().trim());
              return idx;
            };
            // Skip header rows (some sheets have extra headers)
            const actualRows = sheetName === 'Design Register' ? rows.slice(2) : rows.slice(1);
            newData[dataKey] = actualRows.map((row: any[]) => mapper(row, getCol)).filter(Boolean);
          }
        };

        // Define mappers for each module
        processSheet('Batches', 'batches', (row, getCol) => ({
          id: Math.random().toString(36).substr(2, 9),
          lot_id: row[getCol('Lot ID')] || '',
          style: row[getCol('Style')] || '',
          customer: row[getCol('Customer')] || '',
          color: row[getCol('Color')] || '',
          qty: parseInt(row[getCol('Qty')]) || 0,
          stage: row[getCol('Stage')] || 'Cutting',
          status: row[getCol('Status')] || 'Active',
          delivery: row[getCol('Delivery')] || new Date().toISOString().split('T')[0],
          priority: row[getCol('Priority')] || 'Medium',
        }));

        processSheet('Fabric_Purchase', 'fabric_purchase', (row, getCol) => ({
          id: Math.random().toString(36).substr(2, 9),
          date: row[getCol('Date')] || new Date().toISOString().split('T')[0],
          challan: row[getCol('Challan')] || '',
          party: row[getCol('Party')] || '',
          item: row[getCol('Item')] || '',
          color: row[getCol('Color')] || '',
          meter: parseFloat(row[getCol('Meter')]) || 0,
          rate: parseFloat(row[getCol('Rate')]) || 0,
          amount: parseFloat(row[getCol('Amount')]) || 0,
          status: row[getCol('Status')] || 'Pending',
        }));

        processSheet('Karigar_Ledger', 'karigar_ledger', (row, getCol) => ({
          id: Math.random().toString(36).substr(2, 9),
          date: row[getCol('Date')] || new Date().toISOString().split('T')[0],
          name: row[getCol('Karigar Name')] || '',
          work: row[getCol('Work Description')] || '',
          debit: parseFloat(row[getCol('Debit')]) || 0,
          credit: parseFloat(row[getCol('Credit')]) || 0,
          balance: parseFloat(row[getCol('Balance')]) || 0,
          dept: row[getCol('Dept')] || 'Stitching',
        }));

        // Add more mappers as needed for other sheets...
        // For now, let's just do the main ones and generic ones for others
        const genericSheets = [
          ['Design Register', 'design_register'],
          ['Design_Master', 'design_master'],
          ['Fabric_Issue', 'fabric_issue'],
          ['Fabric_Stock', 'fabric_stock'],
          ['Dyeing_Job', 'dyeing_job'],
          ['Print_Job', 'print_job'],
          ['Embroidery_Job', 'embroidery_job'],
          ['Cutting_Job', 'cutting_job'],
          ['Handwork_Job', 'handwork_job'],
          ['Stitching_Job', 'stitching_job'],
          ['Quality_Check', 'quality_check'],
          ['Pressing', 'pressing'],
          ['Challan', 'challan'],
          ['Packing', 'packing'],
          ['Customers', 'customers'],
          ['GRN', 'grn'],
          ['Issue_Material', 'issue_material'],
          ['FG_Stock', 'fg_stock'],
          ['Machines', 'machines'],
          ['Karigar_Entries', 'karigar_entries'],
          ['Payments', 'payments'],
          ['GST_Invoices', 'gst_invoices']
        ];

        genericSheets.forEach(([sheetName, dataKey]) => {
          if (!newData[dataKey] || newData[dataKey].length === 0) {
            processSheet(sheetName, dataKey, (row, getCol) => {
              const obj: any = { id: Math.random().toString(36).substr(2, 9) };
              // Generic mapping: try to map common fields
              if (getCol('Date') !== -1) obj.date = row[getCol('Date')];
              if (getCol('Name') !== -1) obj.name = row[getCol('Name')];
              if (getCol('Status') !== -1) obj.status = row[getCol('Status')];
              // Fallback to first few columns if no headers match
              if (Object.keys(obj).length === 1) {
                row.forEach((val, i) => { obj[`col_${i}`] = val; });
              }
              return obj;
            });
          }
        });

        setData(newData);
        alert("Successfully imported all sheets!");
        setShowGoogleImportModal(false);
      } else {
        alert("Failed to import: " + (result.error || "Unknown error"));
      }
    } catch (e) {
      console.error("Bulk import error", e);
      alert("Bulk import failed. Check console for details.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleBulkExport = async () => {
    if (!isGoogleAuthenticated) {
      handleGoogleAuth();
      return;
    }

    setIsBulkExporting(true);
    try {
      let finalId = spreadsheetId;
      if (spreadsheetId.includes('docs.google.com/spreadsheets/d/')) {
        const match = spreadsheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match && match[1]) {
          finalId = match[1];
        }
      }

      const datasets = [
        {
          sheetName: 'Design Register',
          headers: ['Design ID', 'Design Name', 'Category', 'Status', 'Cost'],
          rows: data.designs.map(d => [d.id, d.name, d.category, d.status, d.cost])
        },
        {
          sheetName: 'Design_Master',
          headers: ['Design ID', 'Design Name', 'Category', 'Status', 'Cost'],
          rows: data.designs.map(d => [d.id, d.name, d.category, d.status, d.cost])
        },
        {
          sheetName: 'Customer_Orders',
          headers: ['Order ID', 'Customer', 'Style', 'Qty', 'Delivery Date', 'Status'],
          rows: data.client_orders.map(o => [o.id, o.client_name, o.design_id, o.qty, o.estimated_delivery, o.status])
        },
        {
          sheetName: 'Fabric_Purchase',
          headers: ['Date', 'Challan', 'Party', 'Item', 'Color', 'Meter', 'Rate', 'Amount', 'Status'],
          rows: data.fabric_purchase.map(f => [f.date, f.challan, f.party, f.item, f.color, f.meter, f.rate, f.amount, f.status])
        },
        {
          sheetName: 'Fabric_Issue',
          headers: ['Date', 'Lot ID', 'Item', 'Color', 'Meter', 'Status'],
          rows: data.fabric_purchase.map(f => [f.date, 'LOT-XXX', f.item, f.color, f.meter, 'Issued'])
        },
        {
          sheetName: 'Fabric_Stock',
          headers: ['Item', 'Color', 'Total Meter', 'Available'],
          rows: data.fabric_purchase.map(f => [f.item, f.color, f.meter, f.meter])
        },
        {
          sheetName: 'Check_In',
          headers: ['ID', 'Order ID', 'Design', 'Party', 'Qty', 'From', 'Date', 'Status'],
          rows: data.check_in.map(c => [c.id, c.orderId, c.designName, c.party, c.receivedQty, c.receivedFrom, c.receiveDate, c.status])
        },
        {
          sheetName: 'Check_Register',
          headers: ['CR No', 'Design', 'Checker', 'Total', 'Pass', 'Fail', 'Alt', 'Reject', 'Date', 'Status'],
          rows: data.check_register.map(c => [c.id, c.designName, c.checker, c.totalChecked, c.pass, c.fail, c.alt, c.reject, c.date, c.status])
        },
        {
          sheetName: 'Alteration',
          headers: ['Alt ID', 'CR Ref', 'Design', 'Qty', 'Defect', 'Karigar', 'Sent Date', 'Status'],
          rows: data.alteration.map(a => [a.id, a.crId, a.designName, a.qty, a.defectType, a.altPerson, a.sentDate, a.status])
        },
        {
          sheetName: 'Press_Orders',
          headers: ['PO No', 'Design', 'Party', 'Qty', 'Type', 'Table', 'Presser', 'Status'],
          rows: data.press_orders.map(p => [p.id, p.designName, p.party, p.totalQty, p.pressType, p.tableNo, p.presserName, p.status])
        },
        {
          sheetName: 'Pack_Orders',
          headers: ['PK No', 'Design', 'Party', 'Qty', 'Type', 'Cartons', 'Packer', 'Status'],
          rows: data.pack_orders.map(p => [p.id, p.designName, p.party, p.totalQty, p.packType, p.cartons, p.packerName, p.status])
        },
        {
          sheetName: 'Cartons',
          headers: ['Carton No', 'Design', 'Color', 'Size', 'Pcs', 'Weight', 'Date', 'Status'],
          rows: data.cartons.map(c => [c.cartonNo, c.designName, c.color, c.size, c.pcs, c.weight, c.date, c.status])
        },
        {
          sheetName: 'Cut_Challans',
          headers: ['CC No', 'Design', 'Cutter', 'Layers', 'Meters', 'Total Pcs', 'Date', 'Status'],
          rows: data.cut_challans.map(c => [c.id, c.designName, c.cutterName, c.layers, c.fabricMeters, c.totalPcs, c.issueDate, c.status])
        },
        {
          sheetName: '3D_Cutting',
          headers: ['Design', 'Width', 'Layers', 'Pcs/Layer', 'Total Pcs', 'Wastage', 'Status'],
          rows: data.three_d_calcs.map(c => [c.designName, c.width, c.layers, c.pcsPerLayer, c.totalPieces, c.wastagePercent, c.status])
        },
        {
          sheetName: 'Fabric_Consumption',
          headers: ['Design', 'Fabric', 'Qty', 'Std Cons', 'AI Est', 'Actual', 'Variance', 'Accuracy'],
          rows: data.fabric_consumption_ai.map(f => [f.designName, f.fabricType, f.qty, f.stdConsumption, f.aiEstimated, f.actualUsed, f.variance, f.aiAccuracy])
        },
        {
          sheetName: 'Pattern_Planning',
          headers: ['Plan ID', 'Design', 'Width', 'Efficiency', 'Wastage', 'Layers', 'AI Suggestion', 'Status'],
          rows: data.pattern_planning_ai.map(p => [p.planId, p.designName, p.fabricWidth, p.efficiency, p.wastagePercent, p.layers, p.aiSuggestion, p.status])
        },
        {
          sheetName: 'Task_Tracking',
          headers: ['Task ID', 'Title', 'Project', 'Status', 'Estimated', 'Tracked'],
          rows: data.task_tracking.map(t => [t.taskId, t.title, t.project, t.status, t.estimatedHours, t.trackedHours])
        },
        {
          sheetName: 'Dyeing_Job',
          headers: ['Date', 'Lot ID', 'Karigar', 'Issue Qty', 'Receive Qty', 'Status'],
          rows: productionData.filter(p => p.key === 'dyeing').map(p => ['2026-04-01', 'LOT-201', 'Aslam Bhai', p.issued, p.received, 'In Progress'])
        },
        {
          sheetName: 'Print_Job',
          headers: ['Date', 'Lot ID', 'Karigar', 'Issue Qty', 'Receive Qty', 'Status'],
          rows: productionData.filter(p => p.key === 'print').map(p => ['2026-04-01', 'LOT-201', 'Zubair', p.issued, p.received, 'In Progress'])
        },
        {
          sheetName: 'Embroidery_Job',
          headers: ['Date', 'Lot ID', 'Karigar', 'Issue Qty', 'Receive Qty', 'Status'],
          rows: productionData.filter(p => p.key === 'embr').map(p => ['2026-04-01', 'LOT-201', 'Zubair', p.issued, p.received, 'In Progress'])
        },
        {
          sheetName: 'Cutting_Job',
          headers: ['Date', 'Lot ID', 'Karigar', 'Issue Qty', 'Receive Qty', 'Status'],
          rows: productionData.filter(p => p.key === 'cutt').map(p => ['2026-04-01', 'LOT-201', 'Aslam Bhai', p.issued, p.received, 'In Progress'])
        },
        {
          sheetName: 'Handwork_Job',
          headers: ['Date', 'Lot ID', 'Karigar', 'Issue Qty', 'Receive Qty', 'Status'],
          rows: productionData.filter(p => p.key === 'handwork').map(p => ['2026-04-01', 'LOT-201', 'Zubair', p.issued, p.received, 'In Progress'])
        },
        {
          sheetName: 'Stitching_Job',
          headers: ['Date', 'Lot ID', 'Karigar', 'Issue Qty (Pcs)', 'Receive Qty (Pcs)', 'Status'],
          rows: productionData.filter(p => p.key === 'stitching').map(p => ['2026-04-01', 'LOT-201', 'Aslam Bhai', p.issued, p.received, 'In Progress'])
        },
        {
          sheetName: 'Quality_Check',
          headers: ['Date', 'Lot ID', 'Karigar', 'Issue Qty', 'Receive Qty', 'Status'],
          rows: productionData.filter(p => p.key === 'qc').map(p => ['2026-04-01', 'LOT-201', 'Aslam Bhai', p.issued, p.received, 'In Progress'])
        },
        {
          sheetName: 'Pressing',
          headers: ['Date', 'Lot ID', 'Karigar', 'Issue Qty', 'Receive Qty', 'Status'],
          rows: productionData.filter(p => p.key === 'pressing').map(p => ['2026-04-01', 'LOT-201', 'Aslam Bhai', p.issued, p.received, 'In Progress'])
        },
        {
          sheetName: 'Karigar_Ledger',
          headers: ['Date', 'Karigar Name', 'Work Description', 'Debit', 'Credit', 'Balance', 'Dept'],
          rows: data.karigar_ledger.map(r => [r.date, r.name, r.work, r.debit, r.credit, r.balance, r.dept])
        },
        {
          sheetName: 'Challan',
          headers: ['Date', 'Challan No', 'Customer', 'Qty', 'Status'],
          rows: [['2026-04-01', 'CH-501', 'Retail Chain A', 250, 'Dispatched']]
        },
        {
          sheetName: 'Packing',
          headers: ['Date', 'Lot ID', 'Qty', 'Status'],
          rows: [['2026-04-01', 'LOT-201', 250, 'Packed']]
        },
        {
          sheetName: 'Customers',
          headers: ['ID', 'Name', 'Type', 'Mobile', 'City', 'Balance'],
          rows: data.customers.map(c => [c.id, c.name, c.type, c.mobile, c.city, c.balance])
        },
        {
          sheetName: 'Batches',
          headers: ['Lot ID', 'Style', 'Customer', 'Color', 'Qty', 'Stage', 'Status', 'Delivery', 'Priority'],
          rows: data.batches.map(b => [b.lot_id, b.style, b.customer, b.color, b.qty, b.stage, b.status, b.delivery, b.priority])
        },
        {
          sheetName: 'GRN',
          headers: ['Date', 'GRN No', 'Supplier', 'Item', 'Qty', 'Status'],
          rows: data.grn.map(g => [g.date, g.grn_no, g.supplier, g.item, g.qty, g.status])
        },
        {
          sheetName: 'Issue_Material',
          headers: ['Date', 'Lot ID', 'Item', 'Qty'],
          rows: [['2026-04-01', 'LOT-201', 'Cotton Silk', 500]]
        },
        {
          sheetName: 'FG_Stock',
          headers: ['Design', 'Color', 'Sizes', 'Produced', 'Dispatched', 'Balance', 'Status'],
          rows: data.fg_stock.map(s => [s.design, s.color, s.sizes, s.produced, s.dispatched, s.balance, s.status])
        },
        {
          sheetName: 'Machines',
          headers: ['Machine ID', 'Type', 'Status', 'Efficiency'],
          rows: data.machines.map(m => [m.id, m.type, m.status, m.efficiency])
        },
        {
          sheetName: 'Karigar_Entries',
          headers: ['Date', 'Karigar', 'Lot ID', 'Qty', 'Rate', 'Amount'],
          rows: [['2026-04-01', 'Aslam Bhai', 'LOT-201', 250, 50, 12500]]
        },
        {
          sheetName: 'Payments',
          headers: ['Date', 'Party', 'Amount', 'Method', 'Status'],
          rows: data.payments.map(p => [p.date, p.party, p.amount, p.mode, p.status])
        },
        {
          sheetName: 'GST_Invoices',
          headers: ['Date', 'Invoice No', 'Customer', 'Amount', 'Tax', 'Total'],
          rows: [['2026-04-01', 'INV-001', 'Retail Chain A', 100000, 18000, 118000]]
        },
        {
          sheetName: 'Social_Media',
          headers: ['Platform', 'Content', 'Date', 'Status', 'Likes', 'Comments'],
          rows: data.social_posts.map(p => [p.platform, p.content, p.scheduled_date, p.status, p.engagement.likes, p.engagement.comments])
        },
        {
          sheetName: 'WhatsApp_Messages',
          headers: ['Timestamp', 'Recipient', 'Type', 'Message', 'Status'],
          rows: data.whatsapp_messages.map(m => [m.timestamp, m.recipient, m.type, m.message, m.status])
        },
        {
          sheetName: 'Material_Forecast',
          headers: ['Item', 'Stock', 'Required', 'Shortfall', 'Suggested', 'Lead Time'],
          rows: data.material_forecasts.map(f => [f.fabric_item, f.current_stock, f.required_qty, f.shortfall, f.suggested_purchase, f.lead_time_days])
        },
        {
          sheetName: 'Scan_History',
          headers: ['Scan ID', 'Date', 'Doc Type', 'Confidence', 'Status'],
          rows: [
            ['SCN-8821', '14 Apr 2024', 'Purchase Invoice', '98%', 'Processed'],
            ['SCN-8820', '13 Apr 2024', 'Job Card', '95%', 'Processed'],
            ['SCN-8819', '13 Apr 2024', 'Fabric Label', '99%', 'Processed']
          ]
        }
      ];

      const res = await fetch('/api/google/sheets/export-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName: 'KARNI IMPEX', datasets, spreadsheetId: finalId }),
      });
      const result = await res.json();
      if (result.success) {
        window.open(result.url, '_blank');
      } else {
        const errorMsg = result.error?.includes('API has not been used') 
          ? "Google Sheets API is disabled. Please enable it in your Google Cloud Console."
          : result.error;
        alert("Bulk export failed: " + errorMsg);
      }
    } catch (e) {
      console.error("Bulk export error", e);
      alert("Export failed. Please try again.");
    } finally {
      setIsBulkExporting(false);
    }
  };

  const exportToGoogleSheets = async (title: string, headers: string[], rows: any[][]) => {
    if (!isGoogleAuthenticated) {
      handleGoogleAuth();
      return;
    }

    setIsExportingToGoogle(title);
    try {
      const res = await fetch('/api/google/sheets/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, headers, rows, spreadsheetId }),
      });
      const result = await res.json();
      if (result.success) {
        setSpreadsheetId(result.spreadsheetId);
        window.open(result.url, '_blank');
      } else {
        alert("Failed to export to Google Sheets: " + result.error);
      }
    } catch (e) {
      console.error("Google Sheets export error", e);
      alert("Export failed. Please try again.");
    } finally {
      setIsExportingToGoogle(null);
    }
  };

  useEffect(() => {
    if (isGlobalEditMode) {
      const tds = document.querySelectorAll('td:not(:last-child)');
      tds.forEach(td => {
        if (td.children.length === 0 || (td.children.length === 1 && td.children[0].tagName === 'SPAN')) {
          (td as HTMLElement).contentEditable = 'true';
        }
      });
    } else {
      const tds = document.querySelectorAll('td[contenteditable="true"]');
      tds.forEach(td => (td as HTMLElement).contentEditable = 'false');
    }
  }, [isGlobalEditMode, activeSection]);

  const handleExport = (title: string, mode: 'csv' | 'google' = 'csv') => {
    let csvContent = "";
    let fileName = `${title.toLowerCase().replace(/\s+/g, '_')}_export.csv`;
    let headers: string[] = [];
    let rows: any[][] = [];

    const generateCSV = (h: string[], r: any[][]) => {
      headers = h;
      rows = r;
      const csvRows = [
        h.join(','),
        ...r.map(row => row.map(cell => {
          const s = String(cell ?? '');
          if (s.includes(',') || s.includes('"') || s.includes('\n')) {
            return `"${s.replace(/"/g, '""')}"`;
          }
          return s;
        }).join(','))
      ];
      return csvRows.join('\n');
    };

    const tRaw = title.toLowerCase();
    const t = tRaw.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

    if (t.includes('batch') || t.includes('job sheet') || t.includes('lot status') || t.includes('production plan') || t.includes('cutting layer') || t.includes('tracking report')) {
      const h = ['Lot ID', 'Style', 'Customer', 'Color', 'Qty', 'Stage', 'Status', 'Delivery', 'Priority'];
      csvContent = generateCSV(h, data.batches.map(b => [b.lot_id, b.style, b.customer, b.color, b.qty, b.stage, b.status, b.delivery, b.priority]));
    } else if (t.includes('variety') || t.includes('stage varieties')) {
      const h = ['ID', 'Category', 'Name', 'Details'];
      csvContent = generateCSV(h, data.job_varieties.map(v => [v.id, v.category, v.name, v.details]));
    } else if (t.includes('order book') || t.includes('client order') || t.includes('client portal')) {
      const h = ['Order ID', 'Customer', 'Style', 'Qty', 'Delivery Date', 'Status'];
      csvContent = generateCSV(h, data.client_orders.map(o => [o.id, o.client_name, o.design_id, o.qty, o.estimated_delivery, o.status]));
    } else if (t.includes('fabric lotting') || t.includes('fabric purchase') || t.includes('fabric stock') || t.includes('fabric consumption') || t.includes('challan register') || t.includes('issue material') || t.includes('fabric issue')) {
      const h = ['Date', 'Challan', 'Party', 'Item', 'Color', 'Meter', 'Rate', 'Amount', 'Status'];
      csvContent = generateCSV(h, data.fabric_purchase.map(f => [f.date, f.challan, f.party, f.item, f.color, f.meter, f.rate, f.amount, f.status]));
    } else if (t.includes('karigar ledger') || t.includes('karigar list') || t.includes('karigar master') || t.includes('karigar advances') || t.includes('karigar entries')) {
      const h = ['Date', 'Karigar Name', 'Work Description', 'Debit', 'Credit', 'Balance', 'Dept'];
      csvContent = generateCSV(h, data.karigar_ledger.map(r => [r.date, r.name, r.work, r.debit, r.credit, r.balance, r.dept]));
    } else if (t.includes('karigar wages') || t.includes('salary slips')) {
      const h = ['ID', 'Karigar', 'Date', 'Lot', 'Design', 'Stage', 'Qty', 'Rate', 'Total Wage'];
      csvContent = generateCSV(h, data.karigar_wage_entries.map(e => [e.id, e.karigar_name, e.date, e.lot_id, e.design_id, e.stage, e.qty, e.final_rate, e.total_wage]));
    } else if (t.includes('design tracker') || t.includes('design register') || t.includes('pattern planning') || t.includes('design master card') || t.includes('pattern board') || t.includes('photo master')) {
      const h = ['Design ID', 'Design Name', 'Category', 'Status', 'Cost', 'Fabric', 'Image URL'];
      csvContent = generateCSV(h, data.designs.map(d => [d.id, d.name, d.category, d.status, d.cost, d.fabric, d.image || '']));
    } else if (t.includes('customer master') || t.includes('customers') || t.includes('crm leads') || t.includes('crm complaints') || t.includes('client portal')) {
      const h = ['ID', 'Name', 'Type', 'Mobile', 'City', 'Balance'];
      csvContent = generateCSV(h, data.customers.map(c => [c.id, c.name, c.type, c.mobile, c.city, c.balance]));
    } else if (t.includes('fg stock') || t.includes('finished goods') || t.includes('dispatch register') || t.includes('inventory') || t.includes('labels') || t.includes('returns') || t.includes('packing register') || t.includes('packing list') || t.includes('bundling sheet') || t.includes('bundle mgmt')) {
      const h = ['Design', 'Color', 'Sizes', 'Produced', 'Dispatched', 'Balance', 'Status'];
      csvContent = generateCSV(h, data.fg_stock.map(s => [s.design, s.color, s.sizes, s.produced, s.dispatched, s.balance, s.status]));
    } else if (t.includes('machines') || t.includes('machine list') || t.includes('machine efficiency') || t.includes('maintenance') || t.includes('loom status') || t.includes('sewing line') || t.includes('dyeing tank') || t.includes('cutting table')) {
      const h = ['Machine ID', 'Type', 'Operator', 'Efficiency', 'Status'];
      csvContent = generateCSV(h, data.machines.map(m => [m.id, m.type, m.operator, m.efficiency, m.status]));
    } else if (t.includes('payments') || t.includes('payment register') || t.includes('account ledger') || t.includes('accounts ledger') || t.includes('finance overview') || t.includes('payment receipt') || t.includes('voucher') || t.includes('expense') || t.includes('kharcha') || t.includes('debit credit note')) {
      const h = ['Date', 'Party', 'Amount', 'Method', 'Status'];
      csvContent = generateCSV(h, data.payments.map(p => [p.date, p.party, p.amount, p.mode, p.status]));
    } else if (t.includes('grn') || t.includes('chemical stock') || t.includes('yarn stock') || t.includes('fabric return') || t.includes('fabric waste')) {
      const h = ['Date', 'GRN No', 'Supplier', 'Item', 'Qty', 'Status'];
      csvContent = generateCSV(h, data.grn.map(g => [g.date, g.grn_no, g.supplier, g.item, g.qty, g.status]));
    } else if (t.includes('ar aging') || t.includes('invoice master') || t.includes('sales invoices') || t.includes('invoice register') || t.includes('eway bill') || t.includes('gst tax')) {
      const h = ['Party', 'Invoice No', 'Date', 'Total', 'Paid', 'Outstanding', 'Age'];
      csvContent = generateCSV(h, data.ar_aging.map(a => [a.party, a.invoice_no, a.date, a.total, a.paid, a.outstanding, a.age]));
    } else if (t.includes('sustainability') || t.includes('carbon')) {
      const h = ['Date', 'Waste (kg)', 'Water (L)', 'Organic %', 'Carbon Score'];
      csvContent = generateCSV(h, data.sustainability.map(s => [s.date, s.fabric_waste_kg, s.water_usage_liters, s.organic_fabric_percent, s.carbon_footprint_score]));
    } else if (t.includes('attendance') || t.includes('hrm leaves') || t.includes('hr attendance') || t.includes('operator perf') || t.includes('cutter report')) {
      const h = ['Date', 'Name', 'Dept', 'Status', 'In', 'Out', 'OT'];
      csvContent = generateCSV(h, data.karigar_attendance.map(a => [a.date, a.name, a.dept, a.status, a.check_in, a.check_out, a.overtime_hrs]));
    } else if (t.includes('vendor performance') || t.includes('vendor master') || t.includes('vendor mgmt') || t.includes('supplier')) {
      const h = ['Name', 'Quality', 'Delivery', 'Price', 'Overall', 'Last Audit'];
      csvContent = generateCSV(h, data.vendor_ratings.map(v => [v.name, v.quality_score, v.delivery_score, v.price_score, v.overall_rating, v.last_audit]));
    } else if (t.includes('tna') || t.includes('time & action')) {
      const h = ['Activity', 'Planned', 'Actual', 'Status', 'Responsible'];
      csvContent = generateCSV(h, data.tna_events.map(e => [e.activity, e.planned_date, e.actual_date, e.status, e.responsible]));
    } else if (t.includes('merchandising') || t.includes('approvals')) {
      const h = ['Design ID', 'Item', 'Status', 'Sent Date'];
      csvContent = generateCSV(h, data.merch_approvals.map(m => [m.design_id, m.item, m.status, m.sent_date]));
    } else if (t.includes('whatsapp')) {
      const h = ['Date', 'Recipient', 'Message', 'Status', 'Type'];
      csvContent = generateCSV(h, data.whatsapp_messages.map(m => [m.timestamp, m.recipient, m.message, m.status, m.type]));
    } else if (t.includes('hrm employees') || t.includes('user management') || t.includes('user role')) {
      const h = ['ID', 'Name', 'Dept', 'Designation', 'Status'];
      csvContent = generateCSV(h, data.hrm_employees.map(e => [e.id, e.name, e.dept, e.desig, e.status]));
    } else if (t.includes('sample management') || t.includes('sample tracking') || t.includes('sample approval')) {
      const h = ['ID', 'Design', 'Type', 'Status', 'Sent Date'];
      csvContent = generateCSV(h, data.sample_tracking.map(s => [s.id, s.design_id, s.sample_type, s.status, s.sent_date]));
    } else if (t.includes('stock transfer') || t.includes('locations data') || t.includes('smart inventory')) {
      const h = ['ID', 'Name', 'Address', 'Stock Value', 'Capacity Used'];
      csvContent = generateCSV(h, data.inventory_locations.map(l => [l.id, l.name, l.address, l.stock_value, l.capacity_used]));
    } else if (t.includes('production summary') || t.includes('analytics') || t.includes('bi reports') || t.includes('sam efficiency')) {
      const h = ['Dept', 'Issued', 'Received', 'Pending'];
      csvContent = generateCSV(h, data.production.map(p => [p.full, p.issued, p.received, p.pending]));
    } else if (t.includes('market trends') || t.includes('material forecast') || t.includes('market running') || t.includes('market fabrics')) {
      const h = ['Item', 'Stock', 'Required', 'Shortfall', 'Suggested', 'Lead Time'];
      csvContent = generateCSV(h, data.material_forecasts.map(f => [f.fabric_item, f.current_stock, f.required_qty, f.shortfall, f.suggested_purchase, f.lead_time_days]));
    } else if (t.includes('qc report') || t.includes('quality checklists') || t.includes('colour qc') || t.includes('cutting qc')) {
      const h = ['Design', 'Checks'];
      csvContent = generateCSV(h, data.qc_checklists.map(q => [q.design_id, q.checks.join(' | ')]));
    } else if (t.includes('account master')) {
      const h = ['ID', 'Name', 'Type', 'Opening', 'Current'];
      csvContent = generateCSV(h, data.account_master.map(a => [a.id, a.name, a.type, a.opening, a.current]));
    } else if (t.includes('check in')) {
      const h = ['ID', 'Order ID', 'Design', 'Party', 'Qty', 'From', 'Date', 'Status'];
      csvContent = generateCSV(h, data.check_in.map(c => [c.id, c.orderId, c.designName, c.party, c.receivedQty, c.receivedFrom, c.receiveDate, c.status]));
    } else if (t.includes('check register')) {
      const h = ['CR No', 'Design', 'Checker', 'Total', 'Pass', 'Fail', 'Alt', 'Reject', 'Date', 'Status'];
      csvContent = generateCSV(h, data.check_register.map(c => [c.id, c.designName, c.checker, c.totalChecked, c.pass, c.fail, c.alt, c.reject, c.date, c.status]));
    } else if (t.includes('alteration')) {
      const h = ['Alt ID', 'CR Ref', 'Design', 'Qty', 'Defect', 'Karigar', 'Sent Date', 'Status'];
      csvContent = generateCSV(h, data.alteration.map(a => [a.id, a.crId, a.designName, a.qty, a.defectType, a.altPerson, a.sentDate, a.status]));
    } else if (t.includes('press order') || t.includes('presser') || t.includes('pressing')) {
      const h = ['PO No', 'Design', 'Party', 'Qty', 'Type', 'Table', 'Presser', 'Status'];
      csvContent = generateCSV(h, data.press_orders.map(p => [p.id, p.designName, p.party, p.totalQty, p.pressType, p.tableNo, p.presserName, p.status]));
    } else if (t.includes('pack order') || t.includes('packer') || t.includes('packing')) {
      const h = ['PK No', 'Design', 'Party', 'Qty', 'Type', 'Cartons', 'Packer', 'Status'];
      csvContent = generateCSV(h, data.pack_orders.map(p => [p.id, p.designName, p.party, p.totalQty, p.packType, p.cartons, p.packerName, p.status]));
    } else if (t.includes('carton')) {
      const h = ['Carton No', 'Design', 'Color', 'Size', 'Pcs', 'Weight', 'Date', 'Status'];
      csvContent = generateCSV(h, data.cartons.map(c => [c.cartonNo, c.designName, c.color, c.size, c.pcs, c.weight, c.date, c.status]));
    } else if (t.includes('quality check') || t.includes('qc check')) {
      const h = ['ID', 'Design', 'Checker', 'Total', 'Pass', 'Fail', 'Alt', 'Reject', 'Date', 'Status'];
      csvContent = generateCSV(h, data.check_register.map(c => [c.id, c.designName, c.checker, c.totalChecked, c.pass, c.fail, c.alt, c.reject, c.date, c.status]));
    } else if (t.includes('dyeing job') || t.includes('print job') || t.includes('embroidery job') || t.includes('cutting job') || t.includes('handwork job') || t.includes('stitching job')) {
      const h = ['Lot ID', 'Style', 'Customer', 'Color', 'Qty', 'Stage', 'Status'];
      csvContent = generateCSV(h, data.batches.map(b => [b.lot_id, b.style, b.customer, b.color, b.qty, b.stage, b.status]));
    } else if (t.includes('cut challan')) {
      const h = ['CC No', 'Design', 'Cutter', 'Layers', 'Meters', 'Total Pcs', 'Date', 'Status'];
      csvContent = generateCSV(h, data.cut_challans.map(c => [c.id, c.designName, c.cutterName, c.layers, c.fabricMeters, c.totalPcs, c.issueDate, c.status]));
    } else if (t.includes('3d cutting')) {
      const h = ['Design', 'Width', 'Layers', 'Pcs/Layer', 'Total Pcs', 'Wastage', 'Status'];
      csvContent = generateCSV(h, data.three_d_calcs.map(c => [c.designName, c.width, c.layers, c.pcsPerLayer, c.totalPieces, c.wastagePercent, c.status]));
    } else if (t.includes('fabric consumption')) {
      const h = ['Design', 'Fabric', 'Qty', 'Std Cons', 'AI Est', 'Actual', 'Variance', 'Accuracy'];
      csvContent = generateCSV(h, data.fabric_consumption_ai.map(f => [f.designName, f.fabricType, f.qty, f.stdConsumption, f.aiEstimated, f.actualUsed, f.variance, f.aiAccuracy]));
    } else if (t.includes('pattern planning')) {
      const h = ['Plan ID', 'Design', 'Width', 'Efficiency', 'Wastage', 'Layers', 'AI Suggestion', 'Status'];
      csvContent = generateCSV(h, data.pattern_planning_ai.map(p => [p.planId, p.designName, p.fabricWidth, p.efficiency, p.wastagePercent, p.layers, p.aiSuggestion, p.status]));
    } else if (t.includes('task tracking')) {
      const h = ['Task ID', 'Title', 'Project', 'Status', 'Estimated', 'Tracked'];
      csvContent = generateCSV(h, data.task_tracking.map(t => [t.taskId, t.title, t.project, t.status, t.estimatedHours, t.trackedHours]));
    } else if (t.includes('costing data') || t.includes('product costing') || t.includes('auto costing') || t.includes('op breakdown')) {
      const h = ['Design', 'Est. Cost', 'Act. Cost', 'Variance'];
      csvContent = generateCSV(h, data.costing_comparisons.map(c => [c.design_id, c.estimated_cost, c.actual_cost, c.variance]));
    } else if (t.includes('buyer feedback') || t.includes('feedback')) {
      const h = ['ID', 'Design', 'Buyer', 'Rev', 'Feedback', 'Status'];
      csvContent = generateCSV(h, data.buyer_feedback.map(f => [f.id, f.design_id, f.buyer_name, f.revision_no, f.feedback_text, f.status]));
    } else if (t.includes('ai predictive') || t.includes('predictive ai') || t.includes('doc scanner')) {
      const h = ['Lot', 'Design', 'Delay', 'Confidence', 'Reason'];
      csvContent = generateCSV(h, data.predictive_delays.map(d => [d.lot_id, d.design_id, d.predicted_delay_days, d.confidence_score, d.reason]));
    } else if (t.includes('ai design studio') || t.includes('creative studio') || t.includes('ai design pattern')) {
      const h = ['ID', 'Prompt', 'Timestamp', 'Tags'];
      csvContent = generateCSV(h, savedDesigns.map(d => [d.id, d.prompt, d.timestamp, d.tags.join(' | ')]));
    } else if (t.includes('job card entry')) {
      const h = ['Lot No', 'Design', 'Qty', 'Stage', 'Karigar', 'Status'];
      csvContent = generateCSV(h, jobCardEntries.map(e => [e.lotNo, e.designNo, e.qty, e.stage, e.karigar, e.status]));
    } else if (t.includes('social media')) {
      const h = ['Platform', 'Content', 'Date', 'Status', 'Likes', 'Comments'];
      csvContent = generateCSV(h, data.social_posts.map(p => [p.platform, p.content, p.scheduled_date, p.status, p.engagement.likes, p.engagement.comments]));
    } else if (t.includes('kpi dashboard') || t.includes('system reports') || t.includes('reports')) {
      const h = ['Metric', 'Value'];
      const k = calculatedKpis;
      csvContent = generateCSV(h, [
        ['Total Designs', k.total_designs],
        ['Total Quantity', k.total_qty],
        ['Total Dispatched', k.total_dispatched],
        ['Fabric Value', k.fabric_value],
        ['Karigar Pending', k.karigar_pending],
        ['Total Payments', k.total_payments],
        ['Active Batches', k.active_batches],
        ['GRN Value', k.grn_value],
        ['AR Outstanding', k.ar_outstanding],
        ['Machine Efficiency', k.machine_efficiency]
      ]);
    } else if (t.includes('work order') || t.includes('dyeing job card') || t.includes('handwork card') || t.includes('embroidery card') || t.includes('alteration')) {
      const h = ['Order ID', 'Date', 'Design', 'Qty', 'Dept', 'Priority', 'Status'];
      csvContent = generateCSV(h, data.batches.map(b => [b.lot_id, b.delivery, b.style, b.qty, b.stage, b.priority, b.status]));
    } else if (t.includes('jobber ledger')) {
      const h = ['Date', 'Karigar Name', 'Work Description', 'Debit', 'Credit', 'Balance', 'Dept'];
      csvContent = generateCSV(h, data.karigar_ledger.map(r => [r.date, r.name, r.work, r.debit, r.credit, r.balance, r.dept]));
    } else if (t.includes('dyeing order') || t.includes('weaving order')) {
      const h = ['Order ID', 'Customer', 'Style', 'Qty', 'Delivery Date', 'Status'];
      csvContent = generateCSV(h, data.client_orders.map(o => [o.id, o.client_name, o.design_id, o.qty, o.estimated_delivery, o.status]));
    } else if (t.includes('lay planning')) {
      const h = ['Design ID', 'Design Name', 'Category', 'Status', 'Cost', 'Fabric', 'Image URL'];
      csvContent = generateCSV(h, data.designs.map(d => [d.id, d.name, d.category, d.status, d.cost, d.fabric, d.image || '']));
    } else {
      csvContent = `Exporting ${title} data...\nGenerated at: ${new Date().toLocaleString()}\n\nNote: This is a prototype export for ${title}.`;
      fileName = `${title.toLowerCase().replace(/\s+/g, '_')}_export.txt`;
    }

    if (mode === 'google') {
      if (headers.length > 0) {
        exportToGoogleSheets(title, headers, rows);
      } else {
        alert("Google Sheets export is not supported for this data type yet.");
      }
      return;
    }

    const blob = new Blob([csvContent], { type: fileName.endsWith('.csv') ? 'text/csv' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const [showGenericPDF, setShowGenericPDF] = useState<{ type: string, data: any } | null>(null);

  // 📦 Dynamic Card Entry Form Component
  const CardEntryForm = ({ moduleType, onClose, onSave }: { moduleType: string, onClose: () => void, onSave: (type: string, data: any) => void }) => {
    const [form, setForm] = useState<Record<string, any>>({});

    const configs: Record<string, { title: string, fields: any[] }> = {
      'Account Ledger': {
        title: "Account Ledger",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "party", label: "Party Name", type: "text", required: true },
          { name: "type", label: "Type", type: "select", options: ["Sale", "Receipt", "Purchase", "Payment", "Journal"] },
          { name: "invoice_no", label: "Invoice No", type: "text" },
          { name: "description", label: "Description", type: "text" },
          { name: "debit", label: "Debit (₹)", type: "number" },
          { name: "credit", label: "Credit (₹)", type: "number" },
          { name: "payment_mode", label: "Payment Mode", type: "select", options: ["Cash", "NEFT", "UPI", "Cheque"] },
          { name: "remark", label: "Remark", type: "text" },
        ]
      },
      'Account Master': {
        title: "Account Master",
        fields: [
          { name: "code", label: "Account Code", type: "text", required: true },
          { name: "name", label: "Account Name", type: "text", required: true },
          { name: "type", label: "Type", type: "select", options: ["Debtor", "Creditor", "Bank", "Cash", "Expense", "Income"] },
          { name: "group", label: "Group", type: "text" },
          { name: "opening_balance", label: "Opening Balance (₹)", type: "number" },
          { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
          { name: "remarks", label: "Remarks", type: "text" },
        ]
      },
      'AI Design Studio': {
        title: "AI Design Pattern Studio",
        fields: [
          { name: "studio_id", label: "Studio ID", type: "text", required: true },
          { name: "design_name", label: "Design Name", type: "text", required: true },
          { name: "prompt", label: "AI Prompt", type: "text" },
          { name: "style", label: "Style", type: "text" },
          { name: "color", label: "Color", type: "text" },
          { name: "fabric", label: "Fabric", type: "text" },
          { name: "status", label: "Status", type: "select", options: ["Approved", "Review", "Rejected"] },
        ]
      },
      'Auto Costing': {
        title: "Auto Costing",
        fields: [
          { name: "costing_id", label: "Costing ID", type: "text", required: true },
          { name: "design_id", label: "Design ID", type: "text", required: true },
          { name: "design_name", label: "Design Name", type: "text" },
          { name: "fabric_cost", label: "Fabric Cost", type: "number" },
          { name: "dyeing", label: "Dyeing", type: "number" },
          { name: "printing", label: "Printing", type: "number" },
          { name: "embroidery", label: "Embroidery", type: "number" },
          { name: "stitching", label: "Stitching", type: "number" },
          { name: "cutting", label: "Cutting", type: "number" },
          { name: "overhead", label: "Overhead", type: "number" },
          { name: "margin", label: "Margin %", type: "number" },
          { name: "status", label: "Status", type: "select", options: ["Final", "Draft"] },
        ]
      },
      'Challan': {
        title: "Challan",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "challan_no", label: "Challan No", type: "text", required: true },
          { name: "customer", label: "Customer", type: "text" },
          { name: "design_id", label: "Design ID", type: "text" },
          { name: "qty", label: "Quantity", type: "number" },
          { name: "rate", label: "Rate (₹)", type: "number" },
          { name: "gst_percent", label: "GST %", type: "number" },
          { name: "transport", label: "Transport", type: "text" },
          { name: "status", label: "Status", type: "select", options: ["Dispatched", "Delivered", "Pending"] },
        ]
      },
      'Customer Master': {
        title: "Customer Master",
        fields: [
          { name: "code", label: "Customer Code", type: "text", required: true },
          { name: "name", label: "Customer Name", type: "text", required: true },
          { name: "mobile", label: "Mobile", type: "text" },
          { name: "gstin", label: "GSTIN", type: "text" },
          { name: "city", label: "City", type: "text" },
          { name: "state", label: "State", type: "text" },
          { name: "credit_limit", label: "Credit Limit (₹)", type: "number" },
          { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
        ]
      },
      '3D Cutting Calc': {
        title: "3D Cutting Layer Calculator",
        fields: [
          { name: "calc_id", label: "Calc ID", type: "text", required: true },
          { name: "design_id", label: "Design ID", type: "text", required: true },
          { name: "fabric_length", label: "Fabric Length (Mtr)", type: "number" },
          { name: "width", label: "Width (Inch)", type: "number" },
          { name: "layers", label: "Layers", type: "number" },
          { name: "pcs_per_layer", label: "Pieces/Layer", type: "number" },
          { name: "wastage", label: "Wastage %", type: "number" },
        ]
      },
      'Cutting Job': {
        title: "Cutting Job",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "lot_id", label: "Lot ID", type: "text", required: true },
          { name: "karigar", label: "Karigar", type: "text" },
          { name: "issue_qty", label: "Issue Qty (Mtr)", type: "number" },
          { name: "receive_qty", label: "Receive Qty (Mtr)", type: "number" },
          { name: "rate", label: "Rate (₹)", type: "number" },
          { name: "status", label: "Status", type: "select", options: ["Done", "Progress", "Pending"] },
        ]
      },
      'Dispatch': {
        title: "Dispatch",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "dispatch_no", label: "Dispatch No", type: "text", required: true },
          { name: "challan_no", label: "Challan No", type: "text" },
          { name: "party", label: "Party Name", type: "text" },
          { name: "qty", label: "Qty (Pcs)", type: "number" },
          { name: "transport", label: "Transport Name", type: "text" },
          { name: "lr_no", label: "LR No", type: "text" },
          { name: "status", label: "Status", type: "select", options: ["In Transit", "Delivered", "Pending"] },
        ]
      },
      'Dyeing Job': {
        title: "Dyeing Job",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "lot_id", label: "Lot ID", type: "text", required: true },
          { name: "karigar", label: "Karigar", type: "text" },
          { name: "issue_qty", label: "Issue Qty (Mtr)", type: "number" },
          { name: "receive_qty", label: "Receive Qty (Mtr)", type: "number" },
          { name: "rate", label: "Rate (₹)", type: "number" },
          { name: "status", label: "Status", type: "select", options: ["Done", "In Progress", "Pending"] },
        ]
      },
      'Embroidery Job': {
        title: "Embroidery Job",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "lot_id", label: "Lot ID", type: "text", required: true },
          { name: "karigar", label: "Karigar", type: "text" },
          { name: "work_type", label: "Work Type", type: "text" },
          { name: "issue_qty", label: "Issue Qty", type: "number" },
          { name: "receive_qty", label: "Receive Qty", type: "number" },
          { name: "rate", label: "Rate (₹)", type: "number" },
          { name: "status", label: "Status", type: "select", options: ["Done", "In Progress", "Pending"] },
        ]
      },
      'E-Way Bill': {
        title: "E-Way Bill",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "ewb_no", label: "E-Way Bill No", type: "text", required: true },
          { name: "invoice_no", label: "Invoice No", type: "text" },
          { name: "party", label: "Party Name", type: "text" },
          { name: "transporter", label: "Transporter", type: "text" },
          { name: "vehicle_no", label: "Vehicle No", type: "text" },
          { name: "status", label: "Status", type: "select", options: ["Valid", "Expiring", "Cancelled"] },
        ]
      },
      'Fabric Consumption AI': {
        title: "Fabric Consumption AI",
        fields: [
          { name: "design_id", label: "Design ID", type: "text", required: true },
          { name: "fabric_type", label: "Fabric Type", type: "text" },
          { name: "qty", label: "Qty (Pcs)", type: "number" },
          { name: "std_consumption", label: "Std Consumption", type: "number" },
          { name: "ai_estimated", label: "AI Estimated", type: "number" },
          { name: "actual_used", label: "Actual Used", type: "number" },
        ]
      },
      'Fabric Issue': {
        title: "Fabric Issue",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "lot_id", label: "Lot ID", type: "text", required: true },
          { name: "item", label: "Item", type: "text" },
          { name: "meter", label: "Meter", type: "number" },
          { name: "dept", label: "Job Dept", type: "text" },
          { name: "party", label: "Job Work Party", type: "text" },
          { name: "status", label: "Status", type: "select", options: ["Issued", "Pending"] },
        ]
      },
      'Fabric Purchase': {
        title: "Fabric Purchase Register",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "challan", label: "Challan No", type: "text" },
          { name: "party", label: "Party/Supplier", type: "text" },
          { name: "item", label: "Fabric Item", type: "text" },
          { name: "color", label: "Color/Shade", type: "text" },
          { name: "meter", label: "Meters", type: "number" },
          { name: "rate", label: "Rate/Mtr", type: "number" },
          { name: "status", label: "Status", type: "select", options: ["Pending", "In Transit", "Received"] },
        ]
      },
      'Fabric Stock': {
        title: "Fabric Stock",
        fields: [
          { name: "design_id", label: "Design ID", type: "text" },
          { name: "item", label: "Item", type: "text", required: true },
          { name: "color", label: "Color", type: "text" },
          { name: "width", label: "Panna (Width)", type: "text" },
          { name: "purchased", label: "Purchased Qty", type: "number" },
          { name: "issued", label: "Issued Qty", type: "number" },
          { name: "supplier", label: "Supplier", type: "text" },
        ]
      },
      'Finished Goods Stock': {
        title: "Finished Goods Stock",
        fields: [
          { name: "design_id", label: "Design ID", type: "text", required: true },
          { name: "style", label: "Style", type: "text" },
          { name: "color", label: "Color", type: "text" },
          { name: "size", label: "Size", type: "text" },
          { name: "qty", label: "Qty", type: "number" },
          { name: "location", label: "Location", type: "text" },
          { name: "status", label: "Status", type: "select", options: ["Available", "Reserved", "Sold"] },
        ]
      },
      'GRN': {
        title: "GRN — Goods Receipt Note",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "grn_no", label: "GRN No", type: "text", required: true },
          { name: "supplier", label: "Supplier", type: "text" },
          { name: "item", label: "Item", type: "text" },
          { name: "qty", label: "Qty", type: "number" },
          { name: "rate", label: "Rate (₹)", type: "number" },
          { name: "status", label: "Status", type: "select", options: ["Completed", "Pending"] },
        ]
      },
      'Handwork Job': {
        title: "Handwork Job",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "lot_id", label: "Lot ID", type: "text", required: true },
          { name: "karigar", label: "Karigar", type: "text" },
          { name: "issue_qty", label: "Issue Qty", type: "number" },
          { name: "receive_qty", label: "Receive Qty", type: "number" },
          { name: "rate", label: "Rate (₹)", type: "number" },
          { name: "status", label: "Status", type: "select", options: ["Done", "Progress", "Pending"] },
        ]
      },
      'HRM Attendance': {
        title: "HRM Attendance",
        fields: [
          { name: "month", label: "Month", type: "text", required: true },
          { name: "emp_id", label: "Emp ID", type: "text", required: true },
          { name: "emp_name", label: "Emp Name", type: "text" },
          { name: "dept", label: "Department", type: "text" },
          { name: "working_days", label: "Working Days", type: "number" },
          { name: "present", label: "Present", type: "number" },
          { name: "ot_hours", label: "OT Hours", type: "number" },
          { name: "status", label: "Status", type: "select", options: ["Present", "Absent", "On Leave"] },
        ]
      },
      'HRM Employees': {
        title: "HRM Employees",
        fields: [
          { name: "emp_id", label: "Emp ID", type: "text", required: true },
          { name: "name", label: "Emp Name", type: "text", required: true },
          { name: "dept", label: "Department", type: "text" },
          { name: "designation", label: "Designation", type: "text" },
          { name: "mobile", label: "Mobile", type: "text" },
          { name: "salary", label: "Salary (₹)", type: "number" },
          { name: "join_date", label: "Join Date", type: "date" },
          { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
        ]
      },
      'HRM Leaves': {
        title: "HRM Leaves",
        fields: [
          { name: "leave_id", label: "Leave ID", type: "text", required: true },
          { name: "emp_id", label: "Emp ID", type: "text", required: true },
          { name: "type", label: "Leave Type", type: "select", options: ["Casual", "Sick", "Paid", "Unpaid"] },
          { name: "from", label: "From Date", type: "date" },
          { name: "to", label: "To Date", type: "date" },
          { name: "reason", label: "Reason", type: "text" },
          { name: "status", label: "Status", type: "select", options: ["Approved", "Pending", "Rejected"] },
        ]
      },
      'Invoice Master': {
        title: "Invoice Master",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "invoice_no", label: "Invoice No", type: "text", required: true },
          { name: "type", label: "Type", type: "select", options: ["Sale", "Purchase"] },
          { name: "party", label: "Party Name", type: "text" },
          { name: "taxable", label: "Taxable Amount (₹)", type: "number" },
          { name: "gst_percent", label: "GST %", type: "number" },
          { name: "total", label: "Total (₹)", type: "number" },
          { name: "status", label: "Status", type: "select", options: ["Paid", "Part Paid", "Unpaid"] },
        ]
      },
      'Issue Material': {
        title: "Issue Material",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "lot_id", label: "Lot ID", type: "text", required: true },
          { name: "item", label: "Item", type: "text" },
          { name: "qty", label: "Qty", type: "number" },
          { name: "issued_by", label: "Issued By", type: "text" },
          { name: "dept", label: "Department", type: "text" },
          { name: "status", label: "Status", type: "select", options: ["Issued", "Pending"] },
        ]
      },
      'Marker Planning': {
        title: "Marker Planning",
        fields: [
          { name: "marker_id", label: "Marker ID", type: "text", required: true },
          { name: "design_id", label: "Design ID", type: "text", required: true },
          { name: "width", label: "Fabric Width", type: "text" },
          { name: "pcs", label: "Total Pieces", type: "number" },
          { name: "length", label: "Marker Length", type: "number" },
          { name: "efficiency", label: "Efficiency %", type: "number" },
          { name: "layers", label: "Layers", type: "number" },
        ]
      },
      'Order Book': {
        title: "Order Book",
        fields: [
          { name: "order_id", label: "Order ID", type: "text", required: true },
          { name: "date", label: "Date", type: "date", required: true },
          { name: "design_id", label: "Design ID", type: "text" },
          { name: "party", label: "Party Name", type: "text" },
          { name: "qty", label: "Quantity", type: "number" },
          { name: "rate", label: "Rate (₹)", type: "number" },
          { name: "delivery", label: "Delivery Date", type: "date" },
          { name: "status", label: "Status", type: "select", options: ["In Progress", "Ready", "Pending"] },
        ]
      },
      'Pattern Planning AI': {
        title: "Pattern Planning AI",
        fields: [
          { name: "plan_id", label: "Plan ID", type: "text", required: true },
          { name: "design_id", label: "Design ID", type: "text", required: true },
          { name: "width", label: "Fabric Width", type: "text" },
          { name: "efficiency", label: "Efficiency %", type: "number" },
          { name: "wastage", label: "Wastage %", type: "number" },
          { name: "layers", label: "Layers", type: "number" },
          { name: "suggestion", label: "AI Suggestion", type: "text" },
        ]
      },
      'Payments Received': {
        title: "Payments Received",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "party", label: "Party", type: "text", required: true },
          { name: "invoice_ref", label: "Invoice Ref", type: "text" },
          { name: "amount", label: "Amount (₹)", type: "number" },
          { name: "mode", label: "Payment Mode", type: "select", options: ["NEFT", "Cheque", "UPI", "Cash"] },
          { name: "ref_no", label: "UTR/Ref No", type: "text" },
          { name: "bank", label: "Bank", type: "text" },
          { name: "status", label: "Status", type: "select", options: ["Cleared", "Clearing", "Pending"] },
        ]
      },
      'Pressing Job': {
        title: "Pressing Job",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "lot_id", label: "Lot ID", type: "text", required: true },
          { name: "karigar", label: "Karigar", type: "text" },
          { name: "issue_qty", label: "Issue Qty", type: "number" },
          { name: "receive_qty", label: "Receive Qty", type: "number" },
          { name: "rate", label: "Rate (₹)", type: "number" },
          { name: "status", label: "Status", type: "select", options: ["Done", "Progress", "Pending"] },
        ]
      },
      'Print Job': {
        title: "Print Job",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "lot_id", label: "Lot ID", type: "text", required: true },
          { name: "karigar", label: "Karigar", type: "text" },
          { name: "issue_qty", label: "Issue Qty (Mtr)", type: "number" },
          { name: "receive_qty", label: "Receive Qty (Mtr)", type: "number" },
          { name: "rate", label: "Rate (₹)", type: "number" },
          { name: "status", label: "Status", type: "select", options: ["Done", "Progress", "Pending"] },
        ]
      },
      'Production Batches': {
        title: "Production Batches",
        fields: [
          { name: "lot_id", label: "Lot ID", type: "text", required: true },
          { name: "style", label: "Style/Design", type: "text" },
          { name: "customer", label: "Customer", type: "text" },
          { name: "qty", label: "Qty", type: "number" },
          { name: "stage", label: "Current Stage", type: "select", options: ["Cutting", "Stitching", "QC", "Pressing", "Packing"] },
          { name: "delivery", label: "Delivery Date", type: "date" },
          { name: "priority", label: "Priority", type: "select", options: ["High", "Medium", "Low"] },
          { name: "status", label: "Status", type: "select", options: ["In Progress", "Done", "Pending"] },
        ]
      },
      'Production Plan': {
        title: "Production Plan",
        fields: [
          { name: "plan_id", label: "Plan ID", type: "text", required: true },
          { name: "design_id", label: "Design ID", type: "text", required: true },
          { name: "order_id", label: "Order ID", type: "text" },
          { name: "qty", label: "Total Qty", type: "number" },
          { name: "start", label: "Start Date", type: "date" },
          { name: "delivery", label: "Delivery Date", type: "date" },
          { name: "priority", label: "Priority", type: "select", options: ["High", "Medium", "Low"] },
          { name: "stage", label: "Stage", type: "text" },
        ]
      },
      'Quality Check': {
        title: "Quality Check",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "lot_id", label: "Lot ID", type: "text", required: true },
          { name: "karigar", label: "Karigar", type: "text" },
          { name: "total", label: "Total Qty", type: "number" },
          { name: "pass", label: "Pass Qty", type: "number" },
          { name: "fail", label: "Fail Qty", type: "number" },
          { name: "defect", label: "Defect Type", type: "text" },
          { name: "checker", label: "Checker", type: "text" },
          { name: "status", label: "Status", type: "select", options: ["Passed", "Failed", "Rework"] },
        ]
      },
      'Returns Rejection': {
        title: "Returns & Rejection Management",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "return_id", label: "Return ID", type: "text", required: true },
          { name: "invoice_ref", label: "Invoice Ref", type: "text" },
          { name: "party", label: "Party Name", type: "text" },
          { name: "qty", label: "Qty Returned", type: "number" },
          { name: "defect", label: "Defect Type", type: "text" },
          { name: "action", label: "Action Taken", type: "text" },
          { name: "status", label: "Status", type: "select", options: ["Resolved", "Processing", "Pending"] },
        ]
      },
      'Sales Invoice': {
        title: "Sales Invoice",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "invoice_no", label: "Invoice No", type: "text", required: true },
          { name: "customer", label: "Customer Name", type: "text" },
          { name: "design_id", label: "Design ID", type: "text" },
          { name: "qty", label: "Qty (Pcs)", type: "number" },
          { name: "rate", label: "Rate (₹)", type: "number" },
          { name: "taxable", label: "Taxable Amt (₹)", type: "number" },
          { name: "gst_percent", label: "GST %", type: "number" },
          { name: "total", label: "Total Amt (₹)", type: "number" },
          { name: "status", label: "Status", type: "select", options: ["Paid", "Part Paid", "Unpaid"] },
        ]
      },
      'Vendor Master': {
        title: "Vendor Master",
        fields: [
          { name: "code", label: "Vendor Code", type: "text", required: true },
          { name: "name", label: "Vendor Name", type: "text", required: true },
          { name: "type", label: "Type", type: "select", options: ["Fabric Supplier", "Process Vendor", "Trims Supplier"] },
          { name: "gstin", label: "GSTIN", type: "text" },
          { name: "mobile", label: "Mobile", type: "text" },
          { name: "city", label: "City", type: "text" },
          { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
        ]
      },
      'Karigar Ledger': {
        title: "Karigar Ledger Entry",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "name", label: "Karigar Name", type: "text", required: true },
          { name: "dept", label: "Department", type: "select", options: ["Stitching", "Embroidery", "Handwork", "Cutting", "Dyeing", "Pressing"] },
          { name: "work", label: "Work Description", type: "text" },
          { name: "debit", label: "Debit (₹)", type: "number" },
          { name: "credit", label: "Credit (₹)", type: "number" },
          { name: "balance", label: "Balance (₹)", type: "number" },
        ]
      },
      'Customer': {
        title: "Customer Master",
        fields: [
          { name: "name", label: "Customer Name", type: "text", required: true },
          { name: "type", label: "Type", type: "select", options: ["Retailer", "Wholesaler", "Distributor", "Boutique"] },
          { name: "mobile", label: "Mobile", type: "text", placeholder: "10-digit number" },
          { name: "city", label: "City", type: "text" },
          { name: "gstin", label: "GSTIN", type: "text" },
        ]
      },
      'Batch': {
        title: "Production Batch / Lot",
        fields: [
          { name: "lot_id", label: "Lot ID", type: "text", required: true, placeholder: "e.g. LOT-206" },
          { name: "style", label: "Style/Design", type: "text" },
          { name: "customer", label: "Customer", type: "text" },
          { name: "color", label: "Color", type: "text" },
          { name: "qty", label: "Quantity", type: "number" },
          { name: "stage", label: "Current Stage", type: "select", options: ["Fabric Lot", "Dyeing", "Print", "Embroidery", "Cutting", "Stitching", "QC & Pressing"] },
          { name: "delivery", label: "Delivery Date", type: "date" },
          { name: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High", "Urgent"] },
        ]
      },
      'Karigar': {
        title: "Karigar Ledger Entry",
        fields: [
          { name: "name", label: "Karigar Name", type: "text", required: true },
          { name: "dept", label: "Department", type: "select", options: ["Stitching", "Embroidery", "Handwork", "Cutting", "Dyeing", "Pressing"] },
          { name: "work", label: "Work Description", type: "text" },
          { name: "debit", label: "Debit (₹)", type: "number" },
          { name: "credit", label: "Credit (₹)", type: "number" },
          { name: "balance", label: "Balance (₹)", type: "number" },
        ]
      },
      'Payment': {
        title: "Payment Received",
        fields: [
          { name: "date", label: "Date", type: "date", required: true },
          { name: "party", label: "Party/Customer", type: "text" },
          { name: "invoice_no", label: "Invoice/Ref No", type: "text" },
          { name: "amount", label: "Amount (₹)", type: "number" },
          { name: "mode", label: "Payment Mode", type: "select", options: ["Cash", "NEFT", "UPI", "Cheque"] },
          { name: "utr", label: "UTR/Transaction ID", type: "text" },
          { name: "status", label: "Status", type: "select", options: ["Pending", "Completed", "Failed"] },
        ]
      }
    };

    const config = configs[moduleType] || { title: moduleType, fields: [] };

    const handleChange = (name: string, value: string | number) => {
      setForm(prev => {
        const updated = { ...prev, [name]: value };
        if (moduleType === 'Karigar' || moduleType === 'Karigar Ledger') {
          updated.balance = (Number(updated.credit) || 0) - (Number(updated.debit) || 0);
        }
        return updated;
      });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(moduleType, { ...form, id: Math.random().toString(36).substr(2, 9) });
    };

    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> {config.title} Entry
            </h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowGenericPDF({ type: moduleType, data: form })}
                className="px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" /> Preview PDF
              </button>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {config.fields.map((field: any) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {field.label} {field.required && <span className="text-rose-500">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={form[field.name] || ''}
                      onChange={e => handleChange(field.name, e.target.value)}
                      required={field.required}
                    >
                      <option value="">Select {field.label}</option>
                      { (field.options || []).map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder={`Enter ${field.label}`}
                      value={form[field.name] ?? ''}
                      onChange={e => handleChange(field.name, field.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Record
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  // 📄 Generic PDF Preview Component
  const GenericPDF = ({ type, data, onClose }: { type: string, data: any, onClose: () => void }) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
      const content = printRef.current;
      if (!content) return;
      
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>${type} - ${new Date().toLocaleDateString()}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Noto+Sans:wght@300;400;500;600&display=swap');
              body { font-family: 'Noto Sans', sans-serif; padding: 40px; color: #2a1a1a; background: #fff; }
              .header { border-bottom: 3px solid #8B1A1A; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
              .header h1 { font-family: 'Rajdhani', sans-serif; color: #8B1A1A; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px; }
              .header .company { text-align: right; }
              .header .company h2 { font-family: 'Rajdhani', sans-serif; margin: 0; color: #c9a84c; font-size: 20px; }
              .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
              .field { border-bottom: 1px solid #e0d8d0; padding: 10px 0; }
              .label { font-size: 10px; font-weight: 700; color: #7a6a6a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
              .value { font-size: 14px; font-weight: 500; color: #2a1a1a; }
              .footer { margin-top: 60px; border-top: 1px solid #e0d8d0; padding-top: 20px; display: flex; justify-content: space-between; font-size: 12px; color: #7a6a6a; }
              @media print {
                body { padding: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${content.innerHTML}
            <script>window.onload = () => { window.print(); window.close(); }</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    };

    return (
      <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[200] flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
          <div className="p-4 bg-slate-100 border-b flex justify-between items-center">
            <h3 className="font-bold text-slate-700">PDF Preview: {type}</h3>
            <div className="flex gap-2">
              <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700">
                <Printer className="w-4 h-4" /> Print PDF
              </button>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><X className="w-5 h-5" /></button>
            </div>
          </div>
          
          <div className="flex-1 p-12 bg-slate-50 overflow-y-auto">
            <div ref={printRef} className="bg-white shadow-lg p-12 min-h-[1000px] mx-auto max-w-[800px]">
              <div className="header">
                <div>
                  <h1>${type}</h1>
                  <p style="font-size: 12px; color: #7a6a6a; margin-top: 5px;">Document Generated on ${new Date().toLocaleDateString()}</p>
                </div>
                <div className="company">
                  <h2>KARNI IMPEX</h2>
                  <p style="font-size: 10px; color: #7a6a6a;">Ahmedabad, Gujarat, India</p>
                </div>
              </div>

              <div className="grid">
                ${Object.entries(data).map(([key, value]) => `
                  <div class="field">
                    <div class="label">${key.replace(/_/g, ' ')}</div>
                    <div class="value">${value || '—'}</div>
                  </div>
                `).join('')}
              </div>

              <div style="margin-top: 40px; padding: 20px; background: #fdfcfa; border: 1px dashed #c9a84c; border-radius: 8px;">
                <p style="font-size: 12px; color: #7a6a6a; margin: 0;"><strong>Note:</strong> This is a computer-generated document from Karni Impex ERP v10. No signature is required.</p>
              </div>

              <div class="footer">
                <div>Generated by: System Admin</div>
                <div>Page 1 of 1</div>
                <div>Ref: ${Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNewEntryModal = () => {
    if (!showNewEntryModal) return null;

    // Use Dynamic Card Entry Form for specific types
    const dynamicTypes = [
      'Account Ledger', 'Account Master', 'AI Design Studio', 'Auto Costing', 'Challan', 
      'Customer Master', '3D Cutting Calc', 'Cutting Job', 'Dispatch', 'Dyeing Job', 
      'Embroidery Job', 'E-Way Bill', 'Fabric Consumption AI', 'Fabric Issue', 
      'Fabric Purchase', 'Fabric Stock', 'Finished Goods Stock', 'GRN', 'Handwork Job', 
      'HRM Attendance', 'HRM Employees', 'HRM Leaves', 'Invoice Master', 'Issue Material', 
      'Live KPI', 'Marker Planning', 'Order Book', 'Pattern Planning AI', 'Payments Received', 
      'Photo Master', 'Pressing Job', 'Print Job', 'Production Batches', 'Production Plan', 
      'Quality Check', 'Returns Rejection', 'Sales Invoice', 'Vendor Master', 'Karigar Ledger',
      'Customer', 'Batch', 'Karigar', 'Payment'
    ];

    if (dynamicTypes.includes(showNewEntryModal.type)) {
      return (
        <CardEntryForm 
          moduleType={showNewEntryModal.type} 
          onClose={() => setShowNewEntryModal(null)} 
          onSave={(type, data) => {
            handleGenericSave(type, data);
            setShowNewEntryModal(null);
          }} 
        />
      );
    }

    if (showNewEntryModal.type === 'Order') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Order ID</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="e.g. ORD-101" 
                    value={genericFormData.orderId || ''}
                    onChange={(e) => updateGenericField('orderId', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Customer</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="Select Customer" 
                    value={genericFormData.customer || ''}
                    onChange={(e) => updateGenericField('customer', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Design / Style</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="Select Design" 
                    value={genericFormData.style || ''}
                    onChange={(e) => updateGenericField('style', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Quantity</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="0" 
                    value={genericFormData.qty || ''}
                    onChange={(e) => updateGenericField('qty', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Rate</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="0.00" 
                    value={genericFormData.rate || ''}
                    onChange={(e) => updateGenericField('rate', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Delivery Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    value={genericFormData.delivery || ''}
                    onChange={(e) => updateGenericField('delivery', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowOrderBook({
                    order_no: genericFormData.orderId || 'NEW',
                    date: new Date().toLocaleDateString('en-IN'),
                    customer_name: genericFormData.customer || '',
                    delivery_date: genericFormData.delivery || '',
                    items: [{ sr: 1, design_no: genericFormData.style || '', description: 'New Order', qty: genericFormData.qty || 0, rate: genericFormData.rate || 0, amount: (genericFormData.qty || 0) * (genericFormData.rate || 0) }]
                  });
                }}
                className="px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" /> Preview PDF
              </button>
              <div className="flex-1" />
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => handleGenericSave('Order')} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Create Order</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Design') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Design ID</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                    placeholder="e.g. D-501" 
                    value={genericFormData.id || ''}
                    onChange={(e) => updateGenericField('id', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Design Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                    placeholder="e.g. Floral Kurti" 
                    value={genericFormData.name || ''}
                    onChange={(e) => updateGenericField('name', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={genericFormData.category || 'Kurti'}
                    onChange={(e) => updateGenericField('category', e.target.value)}
                  >
                    <option>Kurti</option>
                    <option>Suit</option>
                    <option>Saree</option>
                    <option>Western</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Estimated Cost</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                    placeholder="0.00" 
                    value={genericFormData.cost || ''}
                    onChange={(e) => updateGenericField('cost', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Fabric Details</label>
                <textarea 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm h-20" 
                  placeholder="Enter fabric and trim details..."
                  value={genericFormData.fabric || ''}
                  onChange={(e) => updateGenericField('fabric', e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => {
                  // Trigger a generic print or specific design card
                  alert('Design Master Card Preview coming soon!');
                }}
                className="px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" /> Preview Card
              </button>
              <div className="flex-1" />
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => handleGenericSave('Design')} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Save Design</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Batch') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Lot ID</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
                    placeholder="e.g. LOT-205" 
                    value={genericFormData.lot_id || ''}
                    onChange={(e) => updateGenericField('lot_id', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Style</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
                    placeholder="Select Style" 
                    value={genericFormData.style || ''}
                    onChange={(e) => updateGenericField('style', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Quantity</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
                    placeholder="0" 
                    value={genericFormData.qty || ''}
                    onChange={(e) => updateGenericField('qty', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Color</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
                    placeholder="e.g. Royal Blue" 
                    value={genericFormData.color || ''}
                    onChange={(e) => updateGenericField('color', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Delivery Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
                    value={genericFormData.delivery || ''}
                    onChange={(e) => updateGenericField('delivery', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Priority</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    value={genericFormData.priority || 'Medium'}
                    onChange={(e) => updateGenericField('priority', e.target.value)}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowJobCard({
                    job_card_no: `JC-${genericFormData.lot_id || 'NEW'}`,
                    date: new Date().toLocaleDateString('en-IN'),
                    lot_no: genericFormData.lot_id || '',
                    design_style_no: genericFormData.style || '',
                    colour_shade: genericFormData.color || '',
                    total_meter: genericFormData.qty?.toString() || '',
                  });
                }}
                className="px-4 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-lg flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" /> Print Job Card
              </button>
              <div className="flex-1" />
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => handleGenericSave('Batch')} className="px-6 py-2 bg-orange-600 text-white text-sm font-bold rounded-lg hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all">Create Batch</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Customer') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Customer Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                  placeholder="e.g. Reliance Trends" 
                  value={genericFormData.name || ''}
                  onChange={(e) => updateGenericField('name', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Type</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    value={genericFormData.type || 'Retailer'}
                    onChange={(e) => updateGenericField('type', e.target.value)}
                  >
                    <option>Retailer</option>
                    <option>Wholesaler</option>
                    <option>Distributor</option>
                    <option>Boutique</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Mobile</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                    placeholder="10-digit number" 
                    value={genericFormData.mobile || ''}
                    onChange={(e) => updateGenericField('mobile', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">City</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                    placeholder="e.g. Mumbai" 
                    value={genericFormData.city || ''}
                    onChange={(e) => updateGenericField('city', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">GST Number</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                    placeholder="GSTIN" 
                    value={genericFormData.gstin || ''}
                    onChange={(e) => updateGenericField('gstin', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => {
                  alert('Customer Ledger Preview coming soon!');
                }}
                className="px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" /> Print Ledger
              </button>
              <div className="flex-1" />
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => handleGenericSave('Customer')} className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all">Save Customer</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Karigar') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Karigar Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" 
                  placeholder="e.g. Aslam Bhai" 
                  value={genericFormData.name || ''}
                  onChange={(e) => updateGenericField('name', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Department</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                    value={genericFormData.dept || 'Stitching'}
                    onChange={(e) => updateGenericField('dept', e.target.value)}
                  >
                    <option>Stitching</option>
                    <option>Embroidery</option>
                    <option>Handwork</option>
                    <option>Cutting</option>
                    <option>Dyeing</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Mobile</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" 
                    placeholder="10-digit number" 
                    value={genericFormData.mobile || ''}
                    onChange={(e) => updateGenericField('mobile', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Rate per Pc/Meter</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" 
                    placeholder="0.00" 
                    value={genericFormData.rate || ''}
                    onChange={(e) => updateGenericField('rate', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Opening Balance</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" 
                    placeholder="0.00" 
                    value={genericFormData.balance || ''}
                    onChange={(e) => updateGenericField('balance', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowKarigarCard({
                    karigar_name: genericFormData.name || '',
                    karigar_id: 'K-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
                    department: genericFormData.dept || '',
                    mobile: genericFormData.mobile || '',
                    date: new Date().toLocaleDateString('en-IN'),
                    items: []
                  });
                }}
                className="px-4 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 rounded-lg flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" /> Print Job Card
              </button>
              <div className="flex-1" />
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => handleGenericSave('Karigar')} className="px-6 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 shadow-lg shadow-amber-200 transition-all">Save Karigar</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Vendor') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Vendor Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                  placeholder="e.g. Vardhman Textiles" 
                  value={genericFormData.name || ''}
                  onChange={(e) => updateGenericField('name', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={genericFormData.category || 'Fabric Supplier'}
                    onChange={(e) => updateGenericField('category', e.target.value)}
                  >
                    <option>Fabric Supplier</option>
                    <option>Trims & Accessories</option>
                    <option>Dyeing House</option>
                    <option>Printing Unit</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Contact Person</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="Name" 
                    value={genericFormData.contact || ''}
                    onChange={(e) => updateGenericField('contact', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Mobile</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="10-digit number" 
                    value={genericFormData.mobile || ''}
                    onChange={(e) => updateGenericField('mobile', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">GSTIN</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="GST Number" 
                    value={genericFormData.gstin || ''}
                    onChange={(e) => updateGenericField('gstin', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => {
                  alert('Vendor Ledger Preview coming soon!');
                }}
                className="px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" /> Print Ledger
              </button>
              <div className="flex-1" />
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => handleGenericSave('Vendor')} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Save Vendor</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Employee') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                    placeholder="e.g. Rajesh Kumar" 
                    value={genericFormData.name || ''}
                    onChange={(e) => updateGenericField('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Employee ID</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                    placeholder="e.g. EMP-001" 
                    value={genericFormData.id || ''}
                    onChange={(e) => updateGenericField('id', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Department</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={genericFormData.dept || 'Production'}
                    onChange={(e) => updateGenericField('dept', e.target.value)}
                  >
                    <option>Production</option>
                    <option>Quality</option>
                    <option>Accounts</option>
                    <option>Sales</option>
                    <option>HR</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Designation</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                    placeholder="e.g. Supervisor" 
                    value={genericFormData.designation || ''}
                    onChange={(e) => updateGenericField('designation', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Mobile</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                    placeholder="10-digit number" 
                    value={genericFormData.mobile || ''}
                    onChange={(e) => updateGenericField('mobile', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Joining Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                    value={genericFormData.joining_date || ''}
                    onChange={(e) => updateGenericField('joining_date', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowEmployeeCard({
                    full_name: genericFormData.name || '',
                    employee_id: genericFormData.id || '',
                    department: genericFormData.dept || '',
                    designation: genericFormData.designation || '',
                    mobile: genericFormData.mobile || '',
                    joining_date: genericFormData.joining_date || '',
                  });
                }}
                className="px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" /> Preview ID Card
              </button>
              <div className="flex-1" />
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => handleGenericSave('Employee')} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Save Employee</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Account') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Account Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                  placeholder="e.g. HDFC Bank Main" 
                  value={genericFormData.name || ''}
                  onChange={(e) => updateGenericField('name', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Account Type</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={genericFormData.type || 'Bank'}
                    onChange={(e) => updateGenericField('type', e.target.value)}
                  >
                    <option>Bank</option>
                    <option>Cash</option>
                    <option>Supplier Ledger</option>
                    <option>Customer Ledger</option>
                    <option>Expense</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Opening Balance</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="0.00" 
                    value={genericFormData.balance || ''}
                    onChange={(e) => updateGenericField('balance', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowCustomerLedger({
                    party_name: genericFormData.name || '',
                    opening_balance: genericFormData.balance || 0,
                    entries: []
                  });
                }}
                className="px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" /> Preview Ledger
              </button>
              <div className="flex-1" />
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => handleGenericSave('Account')} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Save Account</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Fabric Purchase') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    value={genericFormData.date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateGenericField('date', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Challan No.</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="e.g. CH-101" 
                    value={genericFormData.challan || ''}
                    onChange={(e) => updateGenericField('challan', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Party / Supplier</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                  placeholder="Supplier Name" 
                  value={genericFormData.party || ''}
                  onChange={(e) => updateGenericField('party', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Item Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="e.g. Cotton Silk" 
                    value={genericFormData.item || ''}
                    onChange={(e) => updateGenericField('item', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Color</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="e.g. Midnight Blue" 
                    value={genericFormData.color || ''}
                    onChange={(e) => updateGenericField('color', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Meters</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="0" 
                    value={genericFormData.meters || ''}
                    onChange={(e) => updateGenericField('meters', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Rate</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="0" 
                    value={genericFormData.rate || ''}
                    onChange={(e) => updateGenericField('rate', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Status</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={genericFormData.status || 'Received'}
                    onChange={(e) => updateGenericField('status', e.target.value)}
                  >
                    <option>Received</option>
                    <option>In Transit</option>
                    <option>Pending</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => handleGenericSave('Fabric Purchase')} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Save Purchase</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'GRN') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">GRN No.</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                    placeholder="e.g. GRN-001" 
                    value={genericFormData.grn_no || ''}
                    onChange={(e) => updateGenericField('grn_no', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                    value={genericFormData.date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateGenericField('date', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Supplier</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                    placeholder="Supplier Name" 
                    value={genericFormData.supplier || ''}
                    onChange={(e) => updateGenericField('supplier', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Challan No.</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                    placeholder="e.g. CH-101" 
                    value={genericFormData.challan || ''}
                    onChange={(e) => updateGenericField('challan', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Item Description</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                  placeholder="e.g. Cotton Silk" 
                  value={genericFormData.description || ''}
                  onChange={(e) => updateGenericField('description', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Quantity</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                    placeholder="0" 
                    value={genericFormData.qty || ''}
                    onChange={(e) => updateGenericField('qty', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Rate</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                    placeholder="0" 
                    value={genericFormData.rate || ''}
                    onChange={(e) => updateGenericField('rate', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Status</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    value={genericFormData.status || 'Approved'}
                    onChange={(e) => updateGenericField('status', e.target.value)}
                  >
                    <option>Approved</option>
                    <option>Pending</option>
                    <option>Rejected</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => handleGenericSave('GRN')} className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all">Save GRN</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'FG Stock') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Design ID</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="e.g. D-101" 
                    value={genericFormData.design_id || ''}
                    onChange={(e) => updateGenericField('design_id', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Lot ID</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="e.g. LOT-001" 
                    value={genericFormData.lot_id || ''}
                    onChange={(e) => updateGenericField('lot_id', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Color</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="e.g. Red" 
                    value={genericFormData.color || ''}
                    onChange={(e) => updateGenericField('color', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Sizes</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="e.g. S, M, L, XL" 
                    value={genericFormData.sizes || ''}
                    onChange={(e) => updateGenericField('sizes', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Received Qty</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="0" 
                    value={genericFormData.qty || ''}
                    onChange={(e) => updateGenericField('qty', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Warehouse</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={genericFormData.warehouse || 'Main Warehouse'}
                    onChange={(e) => updateGenericField('warehouse', e.target.value)}
                  >
                    <option>Main Warehouse</option>
                    <option>Store A</option>
                    <option>Store B</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Status</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={genericFormData.status || 'In Stock'}
                    onChange={(e) => updateGenericField('status', e.target.value)}
                  >
                    <option>In Stock</option>
                    <option>Reserved</option>
                    <option>Dispatched</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => handleGenericSave('FG Stock')} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Add to Stock</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Payment') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                    value={genericFormData.date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateGenericField('date', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Payment Mode</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    value={genericFormData.mode || 'Bank Transfer'}
                    onChange={(e) => updateGenericField('mode', e.target.value)}
                  >
                    <option>Bank Transfer</option>
                    <option>Cash</option>
                    <option>Cheque</option>
                    <option>UPI</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Party Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                  placeholder="Customer or Supplier Name" 
                  value={genericFormData.party || ''}
                  onChange={(e) => updateGenericField('party', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Amount</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                    placeholder="0.00" 
                    value={genericFormData.amount || ''}
                    onChange={(e) => updateGenericField('amount', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Reference No.</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                    placeholder="e.g. TXN-12345" 
                    value={genericFormData.ref_no || ''}
                    onChange={(e) => updateGenericField('ref_no', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Remarks</label>
                <textarea 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm h-20" 
                  placeholder="Additional notes..."
                  value={genericFormData.remarks || ''}
                  onChange={(e) => updateGenericField('remarks', e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowPaymentVoucher({
                    party_name: genericFormData.party || '',
                    amount: genericFormData.amount || 0,
                    payment_mode: genericFormData.mode || 'Bank Transfer',
                    reference_no: genericFormData.ref_no || '',
                    remarks: genericFormData.remarks || '',
                    date: genericFormData.date || new Date().toLocaleDateString('en-IN')
                  });
                }}
                className="px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" /> Preview Voucher
              </button>
              <div className="flex-1" />
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => handleGenericSave('Payment')} className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all">Record Payment</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Sample') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Design ID</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                    placeholder="e.g. D-101" 
                    value={genericFormData.design_id || ''}
                    onChange={(e) => updateGenericField('design_id', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Sample Type</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={genericFormData.type || 'Proto Sample'}
                    onChange={(e) => updateGenericField('type', e.target.value)}
                  >
                    <option>Proto Sample</option>
                    <option>Fit Sample</option>
                    <option>PP Sample</option>
                    <option>Production Sample</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Sent To</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                  placeholder="Buyer Name / Office" 
                  value={genericFormData.sent_to || ''}
                  onChange={(e) => updateGenericField('sent_to', e.target.value)}
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => handleGenericSave('Sample')} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Submit Sample</button>
            </div>
          </motion.div>
        </div>
      );
    }    if (showNewEntryModal.type === 'Attendance') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    value={genericFormData.date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateGenericField('date', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Shift</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={genericFormData.shift || 'Day Shift'}
                    onChange={(e) => updateGenericField('shift', e.target.value)}
                  >
                    <option>Day Shift</option>
                    <option>Night Shift</option>
                    <option>Overtime</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Karigar Name / ID</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                  placeholder="Search Karigar..." 
                  value={genericFormData.name || ''}
                  onChange={(e) => updateGenericField('name', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Status</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={genericFormData.status || 'Present'}
                    onChange={(e) => updateGenericField('status', e.target.value)}
                  >
                    <option>Present</option>
                    <option>Absent</option>
                    <option>Half Day</option>
                    <option>Leave</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Hours Worked</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="0" 
                    value={genericFormData.hours || ''}
                    onChange={(e) => updateGenericField('hours', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => handleGenericSave('Attendance')} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Mark Attendance</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Vendor Rating') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Vendor Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" 
                  placeholder="Select Vendor" 
                  value={genericFormData.vendor || ''}
                  onChange={(e) => updateGenericField('vendor', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Quality Score (0-100)</label>
                    <input 
                      type="range" 
                      className="w-full accent-amber-500" 
                      min="0" 
                      max="100" 
                      value={genericFormData.quality || 80}
                      onChange={(e) => updateGenericField('quality', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Delivery Score (0-100)</label>
                    <input 
                      type="range" 
                      className="w-full accent-amber-500" 
                      min="0" 
                      max="100" 
                      value={genericFormData.delivery || 85}
                      onChange={(e) => updateGenericField('delivery', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Price Score (0-100)</label>
                    <input 
                      type="range" 
                      className="w-full accent-amber-500" 
                      min="0" 
                      max="100" 
                      value={genericFormData.price || 75}
                      onChange={(e) => updateGenericField('price', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Service Score (0-100)</label>
                    <input 
                      type="range" 
                      className="w-full accent-amber-500" 
                      min="0" 
                      max="100" 
                      value={genericFormData.service || 90}
                      onChange={(e) => updateGenericField('service', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Review / Feedback</label>
                <textarea 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm h-20" 
                  placeholder="Vendor performance notes..."
                  value={genericFormData.feedback || ''}
                  onChange={(e) => updateGenericField('feedback', e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => handleGenericSave('Vendor Rating')} className="px-6 py-2 bg-amber-500 text-slate-900 text-sm font-bold rounded-lg hover:bg-amber-600 shadow-lg shadow-amber-200 transition-all">Submit Rating</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Return') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Batch / Lot ID</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="e.g. LOT-201" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Quantity</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Reason for Return</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm h-20" placeholder="Describe the defect or reason..."></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-rose-600 text-white text-sm font-bold rounded-lg hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all">Log Return</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'User') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Full Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 outline-none text-sm" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">User ID / Username</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 outline-none text-sm" placeholder="johndoe" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Email Address</label>
                <input type="email" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 outline-none text-sm" placeholder="john@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Role</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 outline-none text-sm">
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Supervisor</option>
                    <option>Operator</option>
                    <option>Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Department</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 outline-none text-sm">
                    <option>Production</option>
                    <option>Inventory</option>
                    <option>Accounts</option>
                    <option>Merchandising</option>
                    <option>HR</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all">Create User</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Location') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Location Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 outline-none text-sm" placeholder="e.g. Warehouse A" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Location ID</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 outline-none text-sm" placeholder="e.g. LOC-001" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Address / Description</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 outline-none text-sm h-20" placeholder="Full address or location details..."></textarea>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Type</label>
                <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 outline-none text-sm">
                  <option>Warehouse</option>
                  <option>Production Floor</option>
                  <option>Showroom</option>
                  <option>Office</option>
                </select>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all">Save Location</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Stock') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Item Name</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. Cotton Fabric" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Quantity</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Unit</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                    <option>Meters</option>
                    <option>Pieces</option>
                    <option>Kgs</option>
                    <option>Rolls</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Add Stock</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Machine') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Machine Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 outline-none text-sm" placeholder="e.g. Juki Stitching M1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Machine ID</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 outline-none text-sm" placeholder="e.g. MAC-001" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Department</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 outline-none text-sm">
                    <option>Stitching</option>
                    <option>Cutting</option>
                    <option>Embroidery</option>
                    <option>Finishing</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Status</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 outline-none text-sm">
                    <option>Operational</option>
                    <option>Under Maintenance</option>
                    <option>Breakdown</option>
                    <option>Idle</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all">Save Machine</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Entry') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-sm text-slate-500 mb-4">Please fill in the details for this new entry.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Reference ID</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 outline-none text-sm" placeholder="e.g. REF-001" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Description</label>
                  <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 outline-none text-sm h-24" placeholder="Enter details..."></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Date</label>
                    <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Status</label>
                    <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-500 outline-none text-sm">
                      <option>Pending</option>
                      <option>Active</option>
                      <option>Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all">Save Entry</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Job Sheet') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Job ID</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="e.g. JS-001" 
                    value={genericFormData.id || ''}
                    onChange={(e) => updateGenericField('id', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    value={genericFormData.date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateGenericField('date', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Karigar</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="Search Karigar..." 
                    value={genericFormData.karigar || ''}
                    onChange={(e) => updateGenericField('karigar', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Lot ID</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="e.g. LOT-001" 
                    value={genericFormData.lot_id || ''}
                    onChange={(e) => updateGenericField('lot_id', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Quantity</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="0" 
                    value={genericFormData.qty || ''}
                    onChange={(e) => updateGenericField('qty', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Rate / Pc</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    placeholder="0" 
                    value={genericFormData.rate || ''}
                    onChange={(e) => updateGenericField('rate', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Total Amount</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 outline-none text-sm font-bold" 
                    disabled 
                    placeholder="0" 
                    value={(genericFormData.qty || 0) * (genericFormData.rate || 0)}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Work Description</label>
                <textarea 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm h-20" 
                  placeholder="Details of work assigned..."
                  value={genericFormData.description || ''}
                  onChange={(e) => updateGenericField('description', e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowKarigarCard({
                    job_card_no: genericFormData.id || 'NEW',
                    date: genericFormData.date || new Date().toISOString().split('T')[0],
                    karigar_name: genericFormData.karigar || '',
                    lot_no: genericFormData.lot_id || '',
                    production: [{
                      sr: 1,
                      process: genericFormData.description || 'General Work',
                      qty: genericFormData.qty || 0,
                      rate: genericFormData.rate || 0,
                      remark: ''
                    }]
                  });
                }}
                className="px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" /> Print Job Sheet
              </button>
              <div className="flex-1" />
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => handleGenericSave('Job Sheet')} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Create Job Sheet</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Job Variety') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Variety Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. Straight Cut" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                    <option>Stitching</option>
                    <option>Cutting</option>
                    <option>Embroidery</option>
                    <option>Finishing</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Base Rate</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Estimated Time (Min)</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Complexity Level</label>
                <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                  <option>Simple</option>
                  <option>Medium</option>
                  <option>Complex</option>
                  <option>Highly Intricate</option>
                </select>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Save Variety</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Pattern') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Design ID</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. D-101" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Pattern Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. Front Panel" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Version</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="v1.0" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Master Karigar</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Search Master..." />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Save Pattern</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Production Plan') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Plan ID</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="PLAN-001" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Target Qty</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Start Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">End Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Create Plan</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'BOM') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Design ID</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder="e.g. D-101" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Item Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder="e.g. Cotton Thread" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Required Qty</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Unit</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm">
                    <option>Meters</option>
                    <option>Pieces</option>
                    <option>Rolls</option>
                    <option>Kgs</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Wastage %</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder="5" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-orange-600 text-white text-sm font-bold rounded-lg hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all">Save BOM</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Lead') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Lead Name / Company</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="e.g. Fashion Hub" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Contact Number</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="10-digit mobile" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Source</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                    <option>Website</option>
                    <option>Referral</option>
                    <option>Trade Show</option>
                    <option>Social Media</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Interest Level</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                    <option>Hot</option>
                    <option>Warm</option>
                    <option>Cold</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Status</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Negotiating</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all">Save Lead</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Ticket') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Subject</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="Brief issue description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Priority</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Department</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm">
                    <option>IT Support</option>
                    <option>Maintenance</option>
                    <option>Production</option>
                    <option>HR</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Issue Description</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm h-24" placeholder="Provide full details..."></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-rose-600 text-white text-sm font-bold rounded-lg hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all">Submit Ticket</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Leave') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Leave Type</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                    <option>Sick Leave</option>
                    <option>Casual Leave</option>
                    <option>Earned Leave</option>
                    <option>Maternity/Paternity</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Total Days</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Start Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">End Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Reason</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm h-20" placeholder="Enter reason for leave..."></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Apply Leave</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Stock Transfer') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">From Location</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                    <option>Main Warehouse</option>
                    <option>Store A</option>
                    <option>Store B</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">To Location</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                    <option>Store A</option>
                    <option>Store B</option>
                    <option>Main Warehouse</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Item / Batch ID</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="Search Item..." />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Quantity</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="0" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Transfer Stock</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Stock Audit') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Audit Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Location</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm">
                    <option>Main Warehouse</option>
                    <option>Store A</option>
                    <option>Store B</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">System Qty</label>
                  <input type="number" className="w-full px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 outline-none text-sm" disabled placeholder="100" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Physical Qty</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Discrepancy Notes</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm h-20" placeholder="Reason for difference..."></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 shadow-lg shadow-amber-200 transition-all">Complete Audit</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Challan') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Challan No.</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. CH-501" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Receiver Type</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                    <option>Karigar</option>
                    <option>Vendor</option>
                    <option>Customer</option>
                    <option>Internal</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Receiver Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Search..." />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Items / Description</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm h-20" placeholder="List items being sent..."></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Generate Challan</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Trend') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Trend Title</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="e.g. Pastel Summer 2026" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                    <option>Color</option>
                    <option>Fabric</option>
                    <option>Silhouette</option>
                    <option>Print/Pattern</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Confidence Level</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Trend Analysis / Notes</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm h-24" placeholder="Enter market research details..."></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Save Trend</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Fabric Issue') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Issue Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Job / Lot ID</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="e.g. LOT-201" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Fabric Item</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="Search Fabric..." />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Quantity (m)</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Issued To (Karigar/Unit)</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="Name" />
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-rose-600 text-white text-sm font-bold rounded-lg hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all">Issue Fabric</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Lotting') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Lot ID</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. LOT-1001" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Design ID</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. D-101" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Total Pcs</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Fabric Lot No.</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. FL-55" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Create Lot</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Karigar Entry') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Karigar Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="Search Karigar..." />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Job Sheet ID</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="e.g. JS-501" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Operation Done</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="e.g. Side Stitch" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Qty Completed</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="0" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Save Entry</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'QC Entry') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Batch / Lot ID</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Search..." />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Total Inspected</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Passed</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-emerald-600 font-bold" placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Rejected</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm text-rose-600 font-bold" placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Alteration</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm text-amber-600 font-bold" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Defect Details</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm h-20" placeholder="e.g. Loose threads on 5 pcs..."></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all">Save QC Report</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Packing Entry') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Batch ID</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Search Batch..." />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Box No.</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. BOX-01" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Packing Type</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                    <option>Standard Carton</option>
                    <option>Polybag Bundle</option>
                    <option>Hanger Pack</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Qty in Box</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="0" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Save Packing</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Invoice') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Invoice No.</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="e.g. INV-2026-001" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Invoice Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Customer / Client</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Search Customer..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Total Amount</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Tax %</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="18" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all">Generate Invoice</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Account Entry') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Entry Type</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                    <option>Debit (Expense)</option>
                    <option>Credit (Income)</option>
                    <option>Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Amount</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="0.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Account</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                    <option>Cash in Hand</option>
                    <option>HDFC Bank</option>
                    <option>SBI Bank</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                    <option>Salary</option>
                    <option>Rent</option>
                    <option>Raw Material</option>
                    <option>Sales Revenue</option>
                    <option>Misc</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Narration / Notes</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm h-20" placeholder="Enter transaction details..."></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Save Entry</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'TNA Activity') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Activity Name</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. Fabric Sourcing" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Planned Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Responsible Person</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Name" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Add Activity</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Merchandising Submission') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Submission Type</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                    <option>Lab Dip</option>
                    <option>Strike Off</option>
                    <option>Size Set</option>
                    <option>PP Sample</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Submission Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Buyer / Client</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="Search Buyer..." />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Submission Notes</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm h-20" placeholder="Enter details..."></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Submit</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Feedback') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Feedback From</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                    <option>Customer</option>
                    <option>Internal Team</option>
                    <option>Vendor</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Rating</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                    <option>5 Stars - Excellent</option>
                    <option>4 Stars - Good</option>
                    <option>3 Stars - Average</option>
                    <option>2 Stars - Poor</option>
                    <option>1 Star - Very Poor</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Feedback Content</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm h-24" placeholder="Enter feedback details..."></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all">Submit Feedback</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'WhatsApp Broadcast') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Target Audience</label>
                <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                  <option>All Customers</option>
                  <option>All Karigars</option>
                  <option>Active Leads</option>
                  <option>Specific Group...</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Message Template</label>
                <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                  <option>New Design Launch</option>
                  <option>Payment Reminder</option>
                  <option>Order Confirmation</option>
                  <option>Custom Message</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Message Content</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm h-32" placeholder="Type your message here... Use {name} for personalization."></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Send Broadcast
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Costing') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Design ID</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="e.g. D-101" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Fabric Cost</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Jobwork Cost</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Trims/Acc.</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="0.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Overheads %</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="10" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Profit Margin %</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="20" />
                </div>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">Calculated Selling Price</span>
                  <span className="text-lg font-black text-amber-900">₹ 0.00</span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 shadow-lg shadow-amber-200 transition-all">Save Costing</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Maintenance') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Machine ID</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="Search Machine..." />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Service Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Maintenance Type</label>
                <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm">
                  <option>Routine Service</option>
                  <option>Breakdown Repair</option>
                  <option>Part Replacement</option>
                  <option>Oil & Cleaning</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Issue / Work Details</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm h-24" placeholder="Describe the work to be done..."></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-rose-600 text-white text-sm font-bold rounded-lg hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all">Schedule Service</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Costing') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Design ID</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="e.g. D-101" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Fabric Cost</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Jobwork Cost</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Trims/Acc.</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="0.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Overheads %</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="10" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Profit Margin %</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="20" />
                </div>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">Calculated Selling Price</span>
                  <span className="text-lg font-black text-amber-900">₹ 0.00</span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 shadow-lg shadow-amber-200 transition-all">Save Costing</button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showNewEntryModal.type === 'Maintenance') {
      return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Machine ID</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="Search Machine..." />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Service Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Maintenance Type</label>
                <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm">
                  <option>Routine Service</option>
                  <option>Breakdown Repair</option>
                  <option>Part Replacement</option>
                  <option>Oil & Cleaning</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Issue / Work Details</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm h-24" placeholder="Describe the work to be done..."></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-rose-600 text-white text-sm font-bold rounded-lg hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all">Schedule Service</button>
            </div>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              {showNewEntryModal.title}
            </h3>
            <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <div className="p-8 space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-700 flex items-start gap-3">
              <Sparkles className="w-5 h-5 mt-0.5 shrink-0" />
              <p>This is a prototype entry form. In the full version, you would see specific fields for <strong>{showNewEntryModal.type}</strong> data entry.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Entry Name / ID</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" placeholder="e.g. NEW-ITEM-001" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Description / Notes</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm h-24" placeholder="Enter details..."></textarea>
              </div>
            </div>
          </div>
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
            <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Save Entry</button>
          </div>
        </motion.div>
      </div>
    );
  };
  const renderKPIs = () => {
    const k = calculatedKpis;
    const kpiCards = [
      { id: 'designs', section: 'designs', label: 'Active Designs', value: k.total_designs, sub: 'In production', icon: Palette, color: 'text-amber-500', bg: 'bg-amber-500/10' },
      { id: 'qty', section: 'batches', label: 'Total Qty', value: k.total_qty.toLocaleString(), sub: 'Pieces', icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
      { id: 'fabric', section: 'fabric', label: 'Fabric Value', value: formatCurrency(k.fabric_value), sub: 'Current stock', icon: Scissors, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
      { id: 'ar', section: 'araging', label: 'AR Outstanding', value: formatCurrency(k.ar_outstanding), sub: 'Receivable', icon: CalendarDays, color: 'text-rose-500', bg: 'bg-rose-500/10' },
      { id: 'karigar', section: 'karigar', label: 'Karigar Due', value: formatCurrency(k.karigar_pending), sub: 'Payable', icon: HardHat, color: 'text-pink-500', bg: 'bg-pink-500/10' },
      { id: 'efficiency', section: 'machines', label: 'Machine Efficiency', value: `${k.machine_efficiency}%`, sub: 'Average', icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    ];

    const filteredCards = kpiCards.filter(card => {
      if (activeSection === 'dashboard') return true;
      
      const productionGroup = ['production', 'designs', 'orders', 'batches', 'tna', 'merchandising', 'tracking', 'predictive', 'sample_tracking', 'creative_studio', 'cad_library', 'jobs', 'qcpack', 'quality_checklists'];
      const inventoryGroup = ['fabric', 'grn', 'fgstock', 'smart_inventory', 'locations', 'labels'];
      const financeGroup = ['araging', 'payments', 'accounts', 'costing', 'client_portal'];
      const karigarGroup = ['karigar', 'hr_attendance', 'maintenance', 'vendor_mgmt'];

      if (card.id === 'designs' || card.id === 'qty') return productionGroup.includes(activeSection);
      if (card.id === 'fabric') return inventoryGroup.includes(activeSection);
      if (card.id === 'ar') return financeGroup.includes(activeSection);
      if (card.id === 'karigar') return karigarGroup.includes(activeSection);
      
      return false;
    });

    if (filteredCards.length === 0 && activeSection !== 'dashboard') return null;

    return (
      <div className="flex justify-between items-center mb-6">
        <div className={cn(
          "grid gap-4 flex-1",
          filteredCards.length === 1 ? "grid-cols-1" : 
          filteredCards.length === 2 ? "grid-cols-2" :
          filteredCards.length === 3 ? "grid-cols-3" :
          filteredCards.length === 4 ? "grid-cols-4" : "grid-cols-1 md:grid-cols-3 lg:grid-cols-5"
        )}>
          {filteredCards.map((card, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveSection((card as any).section)}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={cn("p-2 rounded-lg", card.bg)}>
                  <card.icon className={cn("w-5 h-5", card.color)} />
                </div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{card.label}</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{card.value}</div>
              <div className="text-xs text-slate-500 mt-1">{card.sub}</div>
            </motion.div>
          ))}
        </div>
        {activeSection === 'dashboard' && (
          <button 
            onClick={() => setActiveSection('ai-assistant')}
            className="ml-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-8 rounded-xl font-bold flex flex-col items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-xs uppercase tracking-tighter">AI Insights</span>
          </button>
        )}
      </div>
    );
  };

  const KPI = ({ icon: Icon, label, value, sub, change, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-xl", 
          color === 'blue' ? "bg-blue-50 text-blue-600" :
          color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
          color === 'rose' ? "bg-rose-50 text-rose-600" :
          color === 'amber' ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-600"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full", 
            change.includes('↑') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {change}
          </span>
        )}
      </div>
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-2xl font-black text-slate-800 tracking-tight">{value}</div>
        {sub && <div className="text-[10px] text-slate-400 mt-1 font-medium">{sub}</div>}
      </div>
    </div>
  );
  const renderModuleIndex = () => {
    const groups = [
      {
        title: '🏭 Production & Planning',
        color: 'border-rose-800',
        items: [
          { id: 'designs', name: 'Design Register', cols: 17 },
          { id: 'design_master_card', name: 'Design Master Card', cols: 18 },
          { id: 'lot_control_tower', name: 'LOT Control Tower', cols: 18 },
          { id: 'sample_management', name: 'Sample Management', cols: 13 },
          { id: 'cutting_layer_calc', name: 'Cutting Layout Calculator', cols: 10 },
          { id: 'design_pattern_board', name: 'Design Pattern Board', cols: 11 },
          { id: 'production_plan', name: 'Production Plan', cols: 12 },
          { id: 'work_order', name: 'Production Work Order', cols: 14 },
          { id: 'sample_approval', name: 'Sample Approval Card', cols: 15 },
          { id: 'tna', name: 'Time & Action (T&A)', cols: 12 },
        ]
      },
      {
        title: '🎨 Dyeing & Printing',
        color: 'border-blue-500',
        items: [
          { id: 'dyeing_tanks', name: 'Dyeing Tanks / Vat Status', cols: 10 },
          { id: 'dyeing_orders', name: 'Dyeing Orders', cols: 12 },
          { id: 'chemical_stock', name: 'Chemical / Dye Stock', cols: 11 },
          { id: 'colour_qc', name: 'Colour QC / Matching', cols: 10 },
          { id: 'printing_job', name: 'Printing Job Sheet', cols: 14 },
          { id: 'dyeing_job', name: 'Dyeing Job Sheet', cols: 13 },
          { id: 'dyeing_job_card', name: 'Dyeing Job Card', cols: 15 },
        ]
      },
      {
        title: '🧵 Weaving & Stitching',
        color: 'border-indigo-600',
        items: [
          { id: 'loom_status', name: 'Tapela / Loom Status', cols: 10 },
          { id: 'weaving_orders', name: 'Weaving Orders', cols: 12 },
          { id: 'yarn_stock', name: 'Yarn Stock & Issue', cols: 11 },
          { id: 'stitching_job', name: 'Stitching Job Sheet', cols: 13 },
          { id: 'sewing_line', name: 'Sewing Line Status', cols: 12 },
          { id: 'operator_perf', name: 'Operator / Tailor Performance', cols: 14 },
          { id: 'op_breakdown', name: 'Operation Breakdown (OB)', cols: 12 },
          { id: 'sam_efficiency', name: 'SAM / Efficiency Tracking', cols: 11 },
          { id: 'alteration_rework', name: 'Alteration / Rework', cols: 10 },
        ]
      },
      {
        title: '✂️ Cutting & Handwork',
        color: 'border-orange-600',
        items: [
          { id: 'cutting_job', name: 'Cutting Job Sheet', cols: 13 },
          { id: 'cutting_table', name: 'Cutting Table Status', cols: 10 },
          { id: 'lay_planning', name: 'Lay Planning / Marker', cols: 12 },
          { id: 'bundle_mgmt', name: 'Bundle / Lot Management', cols: 11 },
          { id: 'cutting_qc', name: 'Cutting QC', cols: 10 },
          { id: 'cutter_report', name: 'Cutter Wise Report', cols: 12 },
          { id: 'handwork_job', name: 'Handwork Job Sheet', cols: 12 },
          { id: 'handwork_card', name: 'Handwork / Khatli Card', cols: 14 },
          { id: 'embroidery_job', name: 'Embroidery Job Sheet', cols: 13 },
          { id: 'embroidery_card', name: 'Embroidery Job Card', cols: 15 },
        ]
      },
      {
        title: '📦 Inventory & Materials',
        color: 'border-emerald-500',
        items: [
          { id: 'fabric_stock', name: 'Fabric Stock Register', cols: 13 },
          { id: 'fabric', name: 'Fabric Purchase (IN)', cols: 18 },
          { id: 'fabric_issue', name: 'Fabric Issue (OUT)', cols: 15 },
          { id: 'fabric_return', name: 'Fabric Return Register', cols: 10 },
          { id: 'fabric_waste', name: 'Fabric Waste / Kachra', cols: 11 },
          { id: 'grn', name: 'GRN (Goods Receipt)', cols: 13 },
          { id: 'fgstock', name: 'Finished Goods Stock', cols: 12 },
          { id: 'stock_transfer', name: 'Stock Transfer', cols: 10 },
          { id: 'material_forecasting', name: 'Material Forecasting', cols: 11 },
        ]
      },
      {
        title: '💰 Finance & Accounts',
        color: 'border-rose-600',
        items: [
          { id: 'account_ledger', name: 'Jigar Khata / Ledger', cols: 15 },
          { id: 'account_master', name: 'Account Master', cols: 13 },
          { id: 'invoice', name: 'Sales / Invoice', cols: 19 },
          { id: 'gst_tax', name: 'GST / Tax Management', cols: 12 },
          { id: 'payments', name: 'Record Payment (Received)', cols: 11 },
          { id: 'payment_receipt', name: 'Payment Receipt / Voucher', cols: 14 },
          { id: 'debit_credit_note', name: 'Debit / Credit Note', cols: 13 },
          { id: 'jobber_ledger', name: 'Jobber Ledger Entry', cols: 14 },
          { id: 'eway_bill', name: 'GST e-Way Bill', cols: 15 },
          { id: 'vendor_mgmt', name: 'Vendor Payments', cols: 11 },
          { id: 'costing', name: 'Smart Costing', cols: 12 },
        ]
      },
      {
        title: '🚚 Dispatch & Logistics',
        color: 'border-cyan-600',
        items: [
          { id: 'dispatch', name: 'Dispatch / Delivery', cols: 15 },
          { id: 'dispatch_register', name: 'Dispatch Register', cols: 14 },
          { id: 'packing_list', name: 'Packing List', cols: 13 },
          { id: 'pressing_job', name: 'Pressing & Packing', cols: 10 },
          { id: 'bundling_sheet', name: 'Bundling Sheet', cols: 12 },
          { id: 'shipping_docs', name: 'Shipping Documentation', cols: 14 },
          { id: 'return_rejection', name: 'Return / Rejection', cols: 13 },
        ]
      },
      {
        title: '👷 HR & Admin',
        color: 'border-slate-600',
        items: [
          { id: 'hrm_employees', name: 'HRM Employees', cols: 13 },
          { id: 'hr_attendance', name: 'Worker / Haazri', cols: 12 },
          { id: 'hrm_leaves', name: 'HRM Leaves', cols: 11 },
          { id: 'karigar_master', name: 'Karigar Master', cols: 13 },
          { id: 'karigar_advance', name: 'Karigar Advance', cols: 11 },
          { id: 'machines', name: 'Machine Register', cols: 11 },
          { id: 'maintenance', name: 'Maintenance Register', cols: 12 },
          { id: 'expense', name: 'Factory Kharcha', cols: 11 },
          { id: 'user_role_mgmt', name: 'User & Role Management', cols: 11 },
        ]
      },
      {
        title: '🤖 AI & Reports',
        color: 'border-purple-600',
        items: [
          { id: 'bi_reports', name: 'BI Reports & Analytics', cols: 15 },
          { id: 'reports', name: 'Production Reports', cols: 12 },
          { id: 'ai_studio', name: 'AI Design Studio', cols: 11 },
          { id: 'doc_scanner', name: 'AI Document Scanner', cols: 10 },
          { id: 'analytics', name: 'Advanced Analytics', cols: 14 },
        ]
      }
    ];

    return (
      <div className="space-y-8 mt-12 pt-12 border-t border-slate-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">🏭 KARNI ERP MASTER INDEX</h2>
          <p className="text-sm text-slate-500 mt-1">Quick access to all manufacturing and financial modules</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map((group, gi) => (
            <div key={gi} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b-2 border-slate-100 pb-2">{group.title}</h3>
              <div className="grid grid-cols-1 gap-2">
                {group.items.map((item, ii) => (
                  <button 
                    key={ii}
                    onClick={() => setActiveSection(item.id as Section)}
                    className={cn(
                      "flex flex-col items-start p-3 bg-white border-l-4 rounded-r-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left",
                      group.color
                    )}
                  >
                    <span className="text-xs font-bold text-slate-800">{item.name}</span>
                    <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">{item.cols} Columns · Editable</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Factory className="w-5 h-5 text-orange-500" /> Department-wise Production Status (Today)
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { name: 'Dyeing', icon: Palette, color: 'text-blue-600', val: '2,400 m' },
            { name: 'Printing', icon: Printer, color: 'text-purple-600', val: '1,800 m' },
            { name: 'Embroidery', icon: Scissors, color: 'text-amber-600', val: '420 pcs' },
            { name: 'Handwork', icon: Sparkles, color: 'text-cyan-600', val: '180 pcs' },
            { name: 'Cutting', icon: Scissors, color: 'text-orange-600', val: '650 sets' },
            { name: 'Stitching', icon: Cpu, color: 'text-emerald-600', val: '580 pcs' },
            { name: 'QC', icon: CheckCircle2, color: 'text-rose-600', val: '48 rej' },
            { name: 'Packing', icon: Package, color: 'text-slate-600', val: '520 pcs' },
          ].map((d, i) => (
            <div key={i} className="flex-shrink-0 bg-slate-50 border border-slate-100 rounded-xl p-3 min-w-[120px] flex flex-col items-center justify-center gap-1 hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-default">
              <d.icon className={cn("w-5 h-5", d.color)} />
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.name}</div>
              <div className={cn("text-lg font-bold tracking-tight", d.color)}>{d.val}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Production Status — Issued vs Received</h3>
          <div className="h-[300px] min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="issued" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Issued" />
                <Bar dataKey="received" fill="#10b981" radius={[4, 4, 0, 0]} name="Received" />
                <Bar dataKey="pending" fill="#ef4444" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Alerts & Notifications</h3>
          <div className="space-y-4">
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-3">
              <Bell className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-rose-800">Overdue Batches</div>
                <div className="text-xs text-rose-600">3 batches are past their delivery date.</div>
              </div>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3">
              <Bell className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-amber-800">Low Fabric Stock</div>
                <div className="text-xs text-amber-600">Cotton Voile is below 50m.</div>
              </div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
              <Bell className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-blue-800">New Orders</div>
                <div className="text-xs text-blue-600">2 new orders received today.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">🔄 Production Pipeline Status</h3>
        <div className="flex overflow-x-auto pb-4 gap-0 custom-scrollbar">
          {data.production.map((dept, i) => (
            <div key={i} className={cn(
              "flex-1 min-w-[100px] text-center p-4 border-r border-slate-100 last:border-r-0 bg-slate-50/50",
              (dept.pending || 0) > 0 && "bg-amber-50/30"
            )}>
              <div className="text-2xl font-bold text-slate-800 font-mono">{(dept.issued || 0) - (dept.received || 0)}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{dept.full || 'Unknown'}</div>
              <div className="mt-2 text-[8px] text-slate-400">In Queue</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Active Batches — Live Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.batches.slice(0, 4).map((batch, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <button 
                  onClick={() => setSelectedDetail({ type: 'Lot', id: batch.lot_id, data: batch })}
                  className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-tight"
                >
                  {batch.lot_id}
                </button>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-500 font-medium">{batch.stage}</span>
              </div>
              <div className="text-sm font-bold text-slate-800 truncate mb-1">{batch.style}</div>
              <div className="text-[10px] text-slate-400 mb-3">{batch.customer} · {batch.color}</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${batch.progress || 0}%` }} />
                </div>
                <span className="text-[10px] font-bold text-slate-600">{batch.progress || 0}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" /> Production Performance KPIs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">On-Time Delivery Rate</div>
            <div className="text-3xl font-bold text-emerald-700">{calculatedKpis.on_time_delivery_rate}%</div>
            <div className="text-[10px] text-emerald-500 mt-1">Target: 98%</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Avg. Cycle Time</div>
            <div className="text-3xl font-bold text-blue-700">{calculatedKpis.avg_cycle_time_days} Days</div>
            <div className="text-[10px] text-blue-500 mt-1">Target: 10 Days</div>
          </div>
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
            <div className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">Defect Rate</div>
            <div className="text-3xl font-bold text-rose-700">{calculatedKpis.defect_rate_percent}%</div>
            <div className="text-[10px] text-rose-500 mt-1">Target: &lt; 2%</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[250px]">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Delivery Performance Trend</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { month: 'Jan', rate: 92 },
                { month: 'Feb', rate: 93.5 },
                { month: 'Mar', rate: 91 },
                { month: 'Apr', rate: 94.5 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} domain={[80, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} name="Delivery Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[250px]">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Defect Rate by Category</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Stitch', rate: 1.2 },
                { name: 'Fabric', rate: 0.8 },
                { name: 'Print', rate: 0.5 },
                { name: 'Size', rate: 0.3 },
              ]} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={60} />
                <Tooltip />
                <Bar dataKey="rate" fill="#f43f5e" radius={[0, 4, 4, 0]} name="Defect %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {renderModuleIndex()}
    </div>
  );

  const renderTable = (headers: string[], rows: any[], renderRow: (row: any, i: number) => React.ReactNode) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-200">
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, i) => renderRow(row, i))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGenericModule = (title: string, columns?: string[], tableData?: any[], rowRenderer?: (item: any, index: number) => React.ReactNode) => {
    const defaultRenderer = (item: any, index: number) => (
      <tr key={index} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
        {columns?.map((col, idx) => {
          const key = col.toLowerCase().replace(/\s+/g, '_');
          const value = item[key] || item[col] || '';
          const isId = idx === 0 || col.toLowerCase().includes('id') || col.toLowerCase().includes('no');
          return (
            <td 
              key={idx} 
              className={cn(
                "px-4 py-3 text-xs whitespace-nowrap",
                isId ? "font-bold text-blue-600 cursor-pointer hover:underline" : "text-slate-600"
              )}
              onClick={() => isId ? setSelectedDetail({ type: title, id: String(value), data: item }) : null}
            >
              {typeof value === 'number' && (key.includes('amt') || key.includes('value') || key.includes('amount') || key.includes('rate')) 
                ? formatCurrency(value) 
                : String(value)}
            </td>
          );
        })}
      </tr>
    );

    return (
      <div className="space-y-6">
        {renderModuleHeader(title, 
          { label: 'Add Row', onClick: () => setShowNewEntryModal({ type: 'Entry', title: `Add New ${title}` }) },
          [
            { label: 'Sync Google Sheets', onClick: () => handleExport(title, 'google'), icon: Globe, disabled: isExportingToGoogle === title },
            { label: 'Export CSV', onClick: () => handleExport(title), icon: FileDown }
          ],
          `Search in ${title}...`,
          tableData?.length
        )}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {renderTable(columns || [], tableData || [], rowRenderer || defaultRenderer)}
        </div>
      </div>
    );
  };

  const renderFabricIssue = () => (
    <div className="space-y-6">
      {renderModuleHeader('Fabric Issue Log — Department-wise', 
        { label: 'Issue Fabric', onClick: () => {} },
        [],
        'Search issues...',
        3
      )}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</label>
            <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
              <option>All Departments</option>
              <option>Dyeing</option>
              <option>Printing</option>
              <option>Embroidery</option>
              <option>Cutting</option>
              <option>Stitching</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Design</label>
            <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
              <option>All Designs</option>
              {data.designs.map(d => <option key={d.id}>{d.id} {d.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Range</label>
            <input type="date" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" defaultValue="2026-04-01" />
          </div>
        </div>
      </div>
      {renderTable(
        ['Date', 'Issue ID', 'Fabric', 'Qty (m)', 'Dept', 'Karigar', 'Design', 'Lot ID'],
        [
          { date: '01-Apr-26', id: 'FAB-I-201', fabric: 'Cotton Silk', qty: 250, dept: 'Dyeing', karigar: 'Ravi Dyeing', design: 'D-501', lot: 'LOT-240' },
          { date: '01-Apr-26', id: 'FAB-I-202', fabric: 'Rayon Crepe', qty: 180, dept: 'Embroidery', karigar: 'Fatima Emb.', design: 'D-503', lot: 'LOT-241' },
          { date: '02-Apr-26', id: 'FAB-I-203', fabric: 'Cotton Silk', qty: 320, dept: 'Cutting', karigar: 'Ramesh Cut.', design: 'D-501', lot: 'LOT-242' },
        ],
        (r, i) => (
          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-4 py-3 text-[10px] text-slate-500">{r.date}</td>
            <td className="px-4 py-3 text-xs font-bold text-slate-800">{r.id}</td>
            <td className="px-4 py-3 text-xs text-slate-600">{r.fabric}</td>
            <td className="px-4 py-3 text-xs font-bold text-slate-800">{r.qty}m</td>
            <td className="px-4 py-3">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-bold uppercase tracking-tight">{r.dept}</span>
            </td>
            <td className="px-4 py-3 text-xs text-slate-500">{r.karigar}</td>
            <td className="px-4 py-3 text-xs text-slate-500">{r.design}</td>
            <td className="px-4 py-3 text-xs text-slate-500">{r.lot}</td>
          </tr>
        )
      )}
    </div>
  );
  const renderAIAssistant = () => (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-slate-800">KARNI AI Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {aiChatMessages.map((msg, i) => (
          <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] p-3 rounded-2xl text-sm shadow-sm",
              msg.role === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-800 rounded-tl-none"
            )}>
              {msg.text}
            </div>
          </div>
        ))}
        {isAiLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-400 p-3 rounded-2xl rounded-tl-none text-sm animate-pulse">
              AI is thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Ask about production, finance, or batches..." 
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
          />
          <button 
            onClick={handleSendAiMessage}
            disabled={isAiLoading}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderWhatsAppHub = () => renderGenericModule('WhatsApp Communication Hub');
  const renderSocialMedia = () => renderGenericModule('Social Media Marketing Hub');
  const renderMaterialForecasting = () => renderGenericModule('AI Material Forecasting');
  const renderQualityChecklists = () => renderGenericModule('Quality Checklists by Stage');
  const renderPredictiveAnalytics = () => renderGenericModule('AI Predictive Analytics');
  const renderImportExport = () => renderGenericModule('Import & Export Center');
  const renderSettings = () => renderGenericModule('System Settings');
  const renderCreativeStudio = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">AI Design Studio</h3>
          <p className="text-sm text-slate-500">Generate, visualize, and manage your garment concepts with advanced AI</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Upload className="w-4 h-4" /> Import Moodboard
          </button>
          <button 
            onClick={() => savedDesigns.length > 0 && handleExportDesign(savedDesigns[0])}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
          >
            <Download className="w-4 h-4" /> Export Latest
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Design Prompt</label>
              <textarea 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe your design idea in detail..."
                className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fabric</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none">
                  <option>Silk</option>
                  <option>Cotton</option>
                  <option>Linen</option>
                  <option>Chiffon</option>
                  <option>Velvet</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none">
                  <option>Ethnic</option>
                  <option>Western</option>
                  <option>Fusion</option>
                  <option>Formal</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerateImage}
              disabled={isGeneratingImage || !aiPrompt.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingImage ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )}
              {isGeneratingImage ? 'Generating...' : 'Generate Design'}
            </button>

            <div className="pt-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Style Presets</h4>
              <div className="flex flex-wrap gap-2">
                {['Floral', 'Minimalist', 'Bohemian', 'Royal', 'Modern'].map(preset => (
                  <button 
                    key={preset}
                    onClick={() => setAiPrompt(prev => prev ? `${prev}, ${preset}` : preset)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-200 transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Design History
            </h4>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {savedDesigns.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs italic">
                  No designs generated yet.
                </div>
              ) : (
                savedDesigns.map(design => (
                  <button 
                    key={design.id}
                    onClick={() => setSelectedDesign(design)}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-xl border transition-all text-left group",
                      selectedDesign?.id === design.id ? "bg-blue-50 border-blue-200" : "bg-white border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img src={design.imageUrl} alt="Thumb" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-slate-800 truncate">{design.prompt}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{new Date(design.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Canvas */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[700px]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Visualizer Canvas</h4>
                  <p className="text-[10px] text-slate-400">High-fidelity design preview and inspection</p>
                </div>
              </div>
              {selectedDesign && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleSaveDesign(selectedDesign)}
                    className="p-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg text-slate-600 transition-all"
                    title="Save to Collection"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleExportDesign(selectedDesign)}
                    className="p-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg text-slate-600 transition-all"
                    title="Download Image"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg text-slate-600 transition-all">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 p-8 flex items-center justify-center bg-slate-100/50 relative overflow-hidden">
              {/* Background Grid Pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              
              {isGeneratingImage ? (
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
                    <Sparkles className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">AI is crafting your design...</p>
                    <p className="text-xs text-slate-400">Analyzing patterns and textures</p>
                  </div>
                </div>
              ) : selectedDesign ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <div className="relative z-10 bg-white p-4 rounded-2xl shadow-2xl border border-white/50 backdrop-blur-sm">
                    <img 
                      src={selectedDesign.imageUrl} 
                      alt="Generated Design" 
                      className="max-w-full max-h-[600px] rounded-xl shadow-inner object-contain"
                    />
                    
                    {/* Floating Info Badge */}
                    <div className="absolute -bottom-4 -right-4 bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-800 max-w-[240px]">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">AI Concept</span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-relaxed italic">
                        "{selectedDesign.prompt}"
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {selectedDesign.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-800 rounded text-[9px] text-slate-400">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl" />
                </motion.div>
              ) : (
                <div className="text-center space-y-6 max-w-sm">
                  <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto">
                    <ImageIcon className="w-10 h-10 text-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-sm font-bold text-slate-800">Ready to Visualize</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Enter a prompt on the left to generate a professional garment design concept.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {selectedDesign && (
              <div className="p-6 bg-white border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Technical Details</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Resolution</span>
                      <span className="font-medium text-slate-800">1024 x 1365</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Aspect Ratio</span>
                      <span className="font-medium text-slate-800">3:4</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Model</span>
                      <span className="font-medium text-slate-800">Gemini 2.5 Flash Image</span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Design Notes</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This AI-generated concept explores the intersection of traditional patterns and modern silhouettes. 
                    The visualization highlights potential fabric textures and color palettes for the upcoming season.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Design Gallery Section */}
      <div className="mt-12 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-slate-800">Design Gallery</h4>
            <p className="text-xs text-slate-400">Your curated collection of AI-generated concepts</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {galleryDesigns.length} SAVED DESIGNS
            </span>
          </div>
        </div>

        {galleryDesigns.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {galleryDesigns.map((design) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden cursor-pointer"
                onClick={() => setSelectedDesign(design)}
              >
                <div className="aspect-[3/4] overflow-hidden bg-slate-100">
                  <img 
                    src={design.imageUrl} 
                    alt={design.prompt} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-[10px] text-slate-600 line-clamp-2 font-medium leading-relaxed">
                    {design.prompt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-400">
                      {new Date(design.timestamp).toLocaleDateString()}
                    </span>
                    <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="p-2 bg-white rounded-full text-slate-900 shadow-xl hover:scale-110 transition-transform">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-slate-200" />
            </div>
            <h5 className="text-sm font-bold text-slate-800">No saved designs yet</h5>
            <p className="text-xs text-slate-400 mt-1">Generate concepts and save them to build your gallery.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCADLibrary = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">CAD & Pattern Library</h3>
          <p className="text-sm text-slate-500">Technical specifications and pattern management</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Pattern
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Categories</h4>
            <div className="space-y-2">
              {['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'].map(cat => (
                <button key={cat} className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg text-sm text-slate-600 transition-colors">
                  {cat} <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-full">12</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">File Formats</h4>
            <div className="flex flex-wrap gap-2">
              {['.DXF', '.PLT', '.PDF', '.AI', '.SVG'].map(fmt => (
                <span key={fmt} className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">{fmt}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Pattern Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.designs.slice(0, 6).map((design, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Ruler className="w-12 h-12 text-slate-300 opacity-50" />
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-600 border border-slate-200">
                  v2.1
                </div>
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors" />
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">{design.name}</h4>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">{design.id}</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-slate-500 font-medium">
                  <div className="flex items-center gap-1"><Layers className="w-3 h-3" /> 8 Pieces</div>
                  <div className="flex items-center gap-1"><Ruler className="w-3 h-3" /> 5 Sizes</div>
                </div>
                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <button className="flex-1 bg-slate-50 text-slate-600 py-2 rounded-lg text-[10px] font-bold hover:bg-slate-100 transition-colors">View CAD</button>
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-colors">Download</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photo to Fabric Visualization Mock */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white overflow-hidden relative">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-500/30">
              <Sparkles className="w-3 h-3" /> New Feature
            </div>
            <h3 className="text-3xl font-bold leading-tight">Photo-to-Fabric <br />AI Visualization</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Instantly preview your designs on any fabric texture. Upload a swatch photo and our AI will wrap it onto your 3D CAD patterns with realistic draping and lighting.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all">Try Visualizer</button>
              <button className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all border border-slate-700">Watch Demo</button>
            </div>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-slate-700 rounded-full mx-auto flex items-center justify-center animate-pulse">
                  <ImageIcon className="w-10 h-10 text-slate-500" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Interactive Preview Coming Soon</p>
              </div>
            </div>
            {/* Visual simulation of fabric mapping */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40" />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Active Fabric</div>
                  <div className="text-xs font-bold text-white">Silk Satin - Floral Red</div>
                </div>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4].map(i => <div key={i} className="w-6 h-6 rounded bg-slate-700 border border-slate-600" />)}
              </div>
            </div>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 blur-[120px] -ml-48 -mb-48" />
      </div>
    </div>
  );

  const [dtRefresh, setDtRefresh] = useState(0);
  const refreshDT = () => setDtRefresh(prev => prev + 1);

  const renderJobCardEntry = () => {
    const jobTabs = [
      { id: 'dyeing', label: 'Dyeing', icon: '🔵', color: '#1a6b8a' },
      { id: 'printing', label: 'Printing', icon: '🟢', color: '#117a65' },
      { id: 'embroidery', label: 'Embroidery', icon: '🔴', color: '#7b241c' },
      { id: 'cutting', label: 'Cutting', icon: '🔷', color: '#1a5276' },
      { id: 'handwork', label: 'Handwork', icon: '🟤', color: '#784212' },
      { id: 'stitching', label: 'Stitching', icon: '🟩', color: '#1e8449' },
      { id: 'pressing', label: 'Pressing', icon: '⚫', color: '#2c3e50' },
    ];

    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-20">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-blue-600" />
              Job Card <span className="text-blue-600">Data Entry</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">Create & manage all production job cards</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleStartScan('Job Card')}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
            >
              <Scan className="w-4 h-4 text-blue-600" /> Scan Card
            </button>
            <div className="bg-slate-900 text-white px-4 py-2 rounded-lg font-mono text-sm shadow-lg">
              Challan: <span className="text-amber-400">{jobCardFormData.challanNo}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {jobTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setJobCardType(tab.id)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-2",
                jobCardType === tab.id 
                  ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              )}
            >
              <span className="text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 flex items-center justify-between">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Job Card Header
            </h3>
            <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
              {jobCardType} Job Sheet
            </span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={jobCardFormData.date}
                onChange={(e) => updateJobCardField('date', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Challan No</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={jobCardFormData.challanNo}
                onChange={(e) => updateJobCardField('challanNo', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Design ID</label>
              <select 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={jobCardFormData.designId}
                onChange={(e) => updateJobCardField('designId', e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="KI-D001">KI-D001 – Floral Kurti A</option>
                <option value="KI-D002">KI-D002 – Straight Salwar B</option>
                <option value="KI-D003">KI-D003 – New Design</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LOT No</label>
              <select 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={jobCardFormData.lotNo}
                onChange={(e) => updateJobCardField('lotNo', e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="LOT-001">LOT-001</option>
                <option value="LOT-002">LOT-002</option>
                <option value="LOT-003">LOT-003</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Design Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-slate-50 text-slate-500"
                value={jobCardFormData.designName}
                readOnly
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fabric Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={jobCardFormData.fabricName}
                onChange={(e) => updateJobCardField('fabricName', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Colour</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={jobCardFormData.colour}
                onChange={(e) => updateJobCardField('colour', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</label>
              <select 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={jobCardFormData.status}
                onChange={(e) => updateJobCardField('status', e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Specific Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className={cn(
            "p-4 flex items-center justify-between",
            jobCardType === 'dyeing' ? "bg-blue-600" :
            jobCardType === 'printing' ? "bg-emerald-600" :
            jobCardType === 'embroidery' ? "bg-rose-700" :
            jobCardType === 'cutting' ? "bg-indigo-700" :
            jobCardType === 'handwork' ? "bg-amber-800" :
            jobCardType === 'stitching' ? "bg-green-700" : "bg-slate-700"
          )}>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              {jobTabs.find(t => t.id === jobCardType)?.icon}
              {jobCardType.charAt(0).toUpperCase() + jobCardType.slice(1)} Job Details
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Karigar Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={jobCardFormData.karigar}
                  onChange={(e) => updateJobCardField('karigar', e.target.value)}
                  placeholder="Search Karigar..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {jobCardType === 'pressing' ? 'Qty Pressed' : 'Qty (Meters/Pcs)'}
                </label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={jobCardType === 'pressing' ? jobCardFormData.qtyPressed : jobCardFormData.qty}
                  onChange={(e) => updateJobCardField(jobCardType === 'pressing' ? 'qtyPressed' : 'qty', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={jobCardFormData.rate}
                  onChange={(e) => updateJobCardField('rate', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 rounded-lg border border-amber-200 text-sm bg-amber-50 font-bold text-amber-900"
                  value={formatCurrency(jobCardFormData.total)}
                  readOnly
                />
              </div>

              {/* Conditional Fields based on job type */}
              {jobCardType === 'dyeing' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dye Type</label>
                    <select 
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={jobCardFormData.dyeType || 'Reactive'}
                      onChange={(e) => updateJobCardField('dyeType', e.target.value)}
                    >
                      <option>Reactive</option>
                      <option>Acid</option>
                      <option>Vat</option>
                      <option>Disperse</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shade</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="e.g. Deep Red" 
                      value={jobCardFormData.shade || ''}
                      onChange={(e) => updateJobCardField('shade', e.target.value)}
                    />
                  </div>
                </>
              )}

              {jobCardType === 'printing' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Print Type</label>
                    <select 
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={jobCardFormData.printType || 'Digital'}
                      onChange={(e) => updateJobCardField('printType', e.target.value)}
                    >
                      <option>Digital</option>
                      <option>Screen</option>
                      <option>Block</option>
                      <option>Sublimation</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No. of Colours</label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      value={jobCardFormData.noOfColours || 0}
                      onChange={(e) => updateJobCardField('noOfColours', parseInt(e.target.value))}
                    />
                  </div>
                </>
              )}

              {jobCardType === 'embroidery' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stitches Count</label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      value={jobCardFormData.stitches || 0}
                      onChange={(e) => updateJobCardField('stitches', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Machine No.</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      value={jobCardFormData.machineNo || ''}
                      onChange={(e) => updateJobCardField('machineNo', e.target.value)}
                    />
                  </div>
                </>
              )}

              {jobCardType === 'cutting' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Size S/M</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" placeholder="S" className="w-full px-2 py-1 rounded border border-slate-200 text-xs" value={jobCardFormData.sizeS || 0} onChange={(e) => updateJobCardField('sizeS', parseInt(e.target.value))} />
                      <input type="number" placeholder="M" className="w-full px-2 py-1 rounded border border-slate-200 text-xs" value={jobCardFormData.sizeM || 0} onChange={(e) => updateJobCardField('sizeM', parseInt(e.target.value))} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Size L/XL</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" placeholder="L" className="w-full px-2 py-1 rounded border border-slate-200 text-xs" value={jobCardFormData.sizeL || 0} onChange={(e) => updateJobCardField('sizeL', parseInt(e.target.value))} />
                      <input type="number" placeholder="XL" className="w-full px-2 py-1 rounded border border-slate-200 text-xs" value={jobCardFormData.sizeXL || 0} onChange={(e) => updateJobCardField('sizeXL', parseInt(e.target.value))} />
                    </div>
                  </div>
                </>
              )}

              {jobCardType === 'handwork' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Work Type</label>
                    <select 
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={jobCardFormData.workType || 'Zardosi'}
                      onChange={(e) => updateJobCardField('workType', e.target.value)}
                    >
                      <option>Zardosi</option>
                      <option>Aari</option>
                      <option>Mirror</option>
                      <option>Beads</option>
                    </select>
                  </div>
                </>
              )}

              {jobCardType === 'stitching' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operation</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="e.g. Side Stitch" 
                      value={jobCardFormData.operation || ''}
                      onChange={(e) => updateJobCardField('operation', e.target.value)}
                    />
                  </div>
                </>
              )}

              {jobCardType === 'pressing' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ironing Type</label>
                    <select 
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={jobCardFormData.ironingType || 'Steam'}
                      onChange={(e) => updateJobCardField('ironingType', e.target.value)}
                    >
                      <option>Steam</option>
                      <option>Normal</option>
                    </select>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expected Out Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={jobCardFormData.expectedOutDate || ''}
                  onChange={(e) => updateJobCardField('expectedOutDate', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">QC Pass</label>
                <select 
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={jobCardFormData.qcPass || 'Pending'}
                  onChange={(e) => updateJobCardField('qcPass', e.target.value)}
                >
                  <option>Pending</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Remarks</label>
              <textarea 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-20"
                placeholder="Any special instructions..."
                value={jobCardFormData.remarks || ''}
                onChange={(e) => updateJobCardField('remarks', e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-100 p-4">
            <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              Payment & Advance Details
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gross Amount</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-slate-50 font-bold"
                value={formatCurrency(jobCardFormData.total)}
                readOnly
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Advance Paid</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={jobCardFormData.advance}
                onChange={(e) => updateJobCardField('advance', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TDS</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={jobCardFormData.tds}
                onChange={(e) => updateJobCardField('tds', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Net Payable</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-emerald-50 font-bold text-emerald-900"
                value={formatCurrency(jobCardFormData.net)}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <button 
            onClick={saveJobCardEntry}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Job Card
          </button>
          <button 
            onClick={() => { 
              saveJobCardEntry(); 
              setShowJobCard({
                job_card_no: jobCardFormData.challanNo,
                date: jobCardFormData.date,
                lot_no: jobCardFormData.lotNo,
                design_style_no: jobCardFormData.designId,
                colour_shade: jobCardFormData.colour,
                total_meter: jobCardFormData.qty.toString(),
              });
            }}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Save & Print
          </button>
          <button 
            onClick={clearJobCardForm}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Clear Form
          </button>
        </div>

        {/* Saved Entries Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider">Saved Job Cards (This Session)</h3>
            <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {jobCardEntries.length} entries
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Challan</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Design</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Karigar</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody>
                {jobCardEntries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-400 text-sm italic">
                      No job cards saved yet.
                    </td>
                  </tr>
                ) : (
                  jobCardEntries.map((e: any, i: number) => (
                    <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs text-slate-600">{e.date}</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-800">{e.challanNo}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 capitalize">{e.jobType}</td>
                      <td className="px-4 py-3 text-xs text-blue-600 font-bold">{e.designId}</td>
                      <td className="px-4 py-3 text-xs text-slate-700">{e.karigar}</td>
                      <td className="px-4 py-3 text-xs font-bold text-emerald-600">{formatCurrency(e.total)}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                          e.status === 'Completed' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                        )}>{e.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => setJobCardEntries((prev: any[]) => prev.filter((_, idx) => idx !== i))}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderDesignTracker = () => {
    const designs = data.designs;
    const selectedDesign = designs.find(d => d.id === selectedDesignId);

    const renderDTContent = () => {
      if (!selectedDesignId) return null;
      const dn = selectedDesignId;

      switch (activeDTTab) {
        case 'summary': {
          const fab = DT.get(dn, 'fabric_purchase');
          const iss = DT.get(dn, 'fabric_issue');
          const emb = DT.get(dn, 'embroidery');
          const cut = DT.get(dn, 'cutting');
          const sti = DT.get(dn, 'stitching');
          const qcp = DT.get(dn, 'qc_packing');
          const del = DT.get(dn, 'delivery');

          const stats = [
            { label: 'Fabric Purchased', value: fab.reduce((s: any, r: any) => s + Number(r.qty), 0) + 'm', icon: Scissors, color: 'text-blue-600' },
            { label: 'Fabric Issued', value: iss.reduce((s: any, r: any) => s + Number(r.qty), 0) + 'm', icon: Scissors, color: 'text-amber-600' },
            { label: 'Embroidery Rec.', value: emb.reduce((s: any, r: any) => s + Number(r.rec_qty), 0) + ' Pcs', icon: Palette, color: 'text-pink-600' },
            { label: 'Cutting Done', value: cut.reduce((s: any, r: any) => s + Number(r.qty), 0) + ' Pcs', icon: Scissors, color: 'text-emerald-600' },
            { label: 'Stitching Rec.', value: sti.reduce((s: any, r: any) => s + Number(r.rec_qty), 0) + ' Pcs', icon: Factory, color: 'text-indigo-600' },
            { label: 'QC Passed', value: qcp.reduce((s: any, r: any) => s + Number(r.qty), 0) + ' Pcs', icon: CheckCircle2, color: 'text-emerald-600' },
            { label: 'Delivered', value: del.reduce((s: any, r: any) => s + Number(r.qty), 0) + ' Pcs', icon: Truck, color: 'text-slate-600' },
          ];

          return (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {stats.map((s, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <s.icon className={cn("w-3.5 h-3.5", s.color)} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</span>
                    </div>
                    <div className="text-lg font-bold text-slate-800">{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
                <p className="text-slate-500">Production Summary for <strong>{selectedDesign?.name}</strong></p>
                <div className="mt-6 h-64 flex items-end justify-around gap-2 px-4">
                  {stats.map((s, i) => {
                    const val = parseFloat(s.value);
                    const max = 1000; // Mock max for visualization
                    const height = Math.min(100, (val / max) * 100);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-slate-50 rounded-t-lg relative group h-full">
                          <div 
                            className={cn("absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-500", s.color.replace('text-', 'bg-'))}
                            style={{ height: `${height || 10}%` }}
                          />
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {s.value}
                          </div>
                        </div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter text-center h-8 flex items-center">{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }
        case 'fabric': {
          const purchase = DT.get(dn, 'fabric_purchase');
          const issue = DT.get(dn, 'fabric_issue');
          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Fabric Purchase Register</h4>
                  <button onClick={() => {
                    const qty = prompt("Qty (m):");
                    const rate = prompt("Rate:");
                    const vendor = prompt("Vendor:");
                    if (qty && rate && vendor) {
                      DT.push(dn, 'fabric_purchase', { qty, rate, vendor, date: new Date().toLocaleDateString() });
                      refreshDT();
                    }
                  }} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold">+ Add Purchase</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[10px]">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter">Date</th>
                        <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter">Vendor</th>
                        <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter text-right">Qty (m)</th>
                        <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter text-right">Total</th>
                        <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchase.map((r: any) => (
                        <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="py-2 font-medium text-slate-600">{r.date}</td>
                          <td className="py-2 font-bold text-slate-800">{r.vendor}</td>
                          <td className="py-2 text-right font-bold text-blue-600">{r.qty || 0}</td>
                          <td className="py-2 text-right font-bold text-slate-800">{((Number(r.qty) || 0) * (Number(r.rate) || 0)).toFixed(2)}</td>
                          <td className="py-2 text-center">
                            <button onClick={() => { DT.del(dn, 'fabric_purchase', r.id); refreshDT(); }} className="text-rose-500 hover:text-rose-700">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {purchase.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-slate-400 italic">No purchase records</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Fabric Issue Log</h4>
                  <button onClick={() => {
                    const qty = prompt("Qty (m):");
                    const dept = prompt("Department:");
                    if (qty && dept) {
                      DT.push(dn, 'fabric_issue', { qty, dept, date: new Date().toLocaleDateString() });
                      refreshDT();
                    }
                  }} className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold">+ Issue Fabric</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[10px]">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter">Date</th>
                        <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter">Dept</th>
                        <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter text-right">Qty (m)</th>
                        <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {issue.map((r: any) => (
                        <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="py-2 font-medium text-slate-600">{r.date}</td>
                          <td className="py-2 font-bold text-slate-800">{r.dept}</td>
                          <td className="py-2 text-right font-bold text-amber-600">{r.qty}</td>
                          <td className="py-2 text-center">
                            <button onClick={() => { DT.del(dn, 'fabric_issue', r.id); refreshDT(); }} className="text-rose-500 hover:text-rose-700">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {issue.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-slate-400 italic">No issue records</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        }
        case 'embroidery': {
          const rows = DT.get(dn, 'embroidery');
          return (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Embroidery In/Out Log</h4>
                <button onClick={() => {
                  const iss = prompt("Issued Qty:");
                  const rec = prompt("Received Qty:");
                  const vendor = prompt("Vendor:");
                  if (iss && rec && vendor) {
                    DT.push(dn, 'embroidery', { iss_qty: iss, rec_qty: rec, vendor, date: new Date().toLocaleDateString() });
                    refreshDT();
                  }
                }} className="bg-pink-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold">+ New Entry</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter">Date</th>
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter">Vendor</th>
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter text-right">Issued</th>
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter text-right">Received</th>
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r: any) => (
                      <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-2 font-medium text-slate-600">{r.date}</td>
                        <td className="py-2 font-bold text-slate-800">{r.vendor}</td>
                        <td className="py-2 text-right font-bold text-slate-600">{r.iss_qty}</td>
                        <td className="py-2 text-right font-bold text-pink-600">{r.rec_qty}</td>
                        <td className="py-2 text-center">
                          <button onClick={() => { DT.del(dn, 'embroidery', r.id); refreshDT(); }} className="text-rose-500 hover:text-rose-700">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {rows.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-slate-400 italic">No records</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }
        case 'cutting': {
          const rows = DT.get(dn, 'cutting');
          return (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Cutting Register</h4>
                <button onClick={() => {
                  const qty = prompt("Cut Qty:");
                  const master = prompt("Master Name:");
                  if (qty && master) {
                    DT.push(dn, 'cutting', { qty, master, date: new Date().toLocaleDateString() });
                    refreshDT();
                  }
                }} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold">+ Add Cutting</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter">Date</th>
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter">Master</th>
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter text-right">Qty</th>
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r: any) => (
                      <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-2 font-medium text-slate-600">{r.date}</td>
                        <td className="py-2 font-bold text-slate-800">{r.master}</td>
                        <td className="py-2 text-right font-bold text-emerald-600">{r.qty}</td>
                        <td className="py-2 text-center">
                          <button onClick={() => { DT.del(dn, 'cutting', r.id); refreshDT(); }} className="text-rose-500 hover:text-rose-700">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {rows.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-slate-400 italic">No records</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }
        case 'stitching': {
          const rows = DT.get(dn, 'stitching');
          return (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Stitching In/Out Log</h4>
                <button onClick={() => {
                  const iss = prompt("Issued Qty:");
                  const rec = prompt("Received Qty:");
                  const unit = prompt("Unit/Karigar:");
                  if (iss && rec && unit) {
                    DT.push(dn, 'stitching', { iss_qty: iss, rec_qty: rec, unit, date: new Date().toLocaleDateString() });
                    refreshDT();
                  }
                }} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold">+ New Entry</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter">Date</th>
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter">Unit</th>
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter text-right">Issued</th>
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter text-right">Received</th>
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r: any) => (
                      <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-2 font-medium text-slate-600">{r.date}</td>
                        <td className="py-2 font-bold text-slate-800">{r.unit}</td>
                        <td className="py-2 text-right font-bold text-slate-600">{r.iss_qty}</td>
                        <td className="py-2 text-right font-bold text-indigo-600">{r.rec_qty}</td>
                        <td className="py-2 text-center">
                          <button onClick={() => { DT.del(dn, 'stitching', r.id); refreshDT(); }} className="text-rose-500 hover:text-rose-700">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {rows.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-slate-400 italic">No records</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }
        case 'qc': {
          const rows = DT.get(dn, 'qc_packing');
          return (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-700 uppercase text-xs tracking-widest">QC & Packing Register</h4>
                <button onClick={() => {
                  const qty = prompt("Passed Qty:");
                  const checker = prompt("Checker Name:");
                  if (qty && checker) {
                    DT.push(dn, 'qc_packing', { qty, checker, date: new Date().toLocaleDateString() });
                    refreshDT();
                  }
                }} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold">+ QC Entry</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter">Date</th>
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter">Checker</th>
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter text-right">Qty</th>
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r: any) => (
                      <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-2 font-medium text-slate-600">{r.date}</td>
                        <td className="py-2 font-bold text-slate-800">{r.checker}</td>
                        <td className="py-2 text-right font-bold text-emerald-600">{r.qty}</td>
                        <td className="py-2 text-center">
                          <button onClick={() => { DT.del(dn, 'qc_packing', r.id); refreshDT(); }} className="text-rose-500 hover:text-rose-700">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {rows.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-slate-400 italic">No records</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }
        case 'delivery': {
          const rows = DT.get(dn, 'delivery');
          return (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Delivery / Dispatch Log</h4>
                <button onClick={() => {
                  const qty = prompt("Delivered Qty:");
                  const challan = prompt("Challan No:");
                  if (qty && challan) {
                    DT.push(dn, 'delivery', { qty, challan, date: new Date().toLocaleDateString() });
                    refreshDT();
                  }
                }} className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold">+ New Delivery</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter">Date</th>
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter">Challan</th>
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter text-right">Qty</th>
                      <th className="py-2 text-slate-400 font-bold uppercase tracking-tighter text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r: any) => (
                      <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-2 font-medium text-slate-600">{r.date}</td>
                        <td className="py-2 font-bold text-slate-800">{r.challan}</td>
                        <td className="py-2 text-right font-bold text-slate-800">{r.qty}</td>
                        <td className="py-2 text-center">
                          <button onClick={() => { DT.del(dn, 'delivery', r.id); refreshDT(); }} className="text-rose-500 hover:text-rose-700">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {rows.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-slate-400 italic">No records</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }
        default: return null;
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Design Tracker</h3>
            <p className="text-xs text-slate-500">Track production lifecycle for a specific design</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDesignId}
              onChange={(e) => setSelectedDesignId(e.target.value)}
            >
              <option value="">Select a Design</option>
              {designs.map(d => <option key={d.id} value={d.id}>{d.id} - {d.name}</option>)}
            </select>
            <button 
              onClick={() => handleExport('Design Tracker')}
              className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {!selectedDesignId ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <Palette className="w-8 h-8 text-slate-300" />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800">No Design Selected</h4>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">Please select a design from the dropdown above to view its production tracker.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Design Name</div>
                  <div className="text-sm font-bold text-slate-800">{selectedDesign?.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Buyer</div>
                  <div className="text-sm font-bold text-slate-800">{selectedDesign?.buyer}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Total Qty</div>
                  <div className="text-sm font-bold text-blue-600">{selectedDesign?.qty} Pcs</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Status</div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-emerald-100 text-emerald-600">
                    {selectedDesign?.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {[
                { id: 'summary', label: 'Summary', icon: LayoutDashboard },
                { id: 'fabric', label: 'Fabric', icon: Scissors },
                { id: 'embroidery', label: 'Embroidery', icon: Palette },
                { id: 'cutting', label: 'Cutting', icon: Scissors },
                { id: 'stitching', label: 'Stitching', icon: Factory },
                { id: 'qc', label: 'QC & Packing', icon: CheckCircle2 },
                { id: 'delivery', label: 'Delivery', icon: Truck }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDTTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all",
                    activeDTTab === tab.id 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                      : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {renderDTContent()}
          </div>
        )}
      </div>
    );
  };

  const renderModuleHeader = (
    title: string, 
    primaryAction?: { label: string, onClick: () => void }, 
    secondaryActions?: { label: string, onClick: () => void, icon?: any, disabled?: boolean }[],
    searchPlaceholder?: string,
    rowCount?: number
  ) => (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">Karni Impex — Manufacturing ERP</p>
        </div>
      </div>
      
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3 no-print">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder={searchPlaceholder || `Search in ${title}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {primaryAction && (
            <button 
              onClick={primaryAction.onClick}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              {primaryAction.label}
            </button>
          )}
          
          <button 
            onClick={() => window.print()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>

          {secondaryActions?.map((action, i) => (
            <button 
              key={i} 
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                "flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm",
                action.disabled && "opacity-50 cursor-not-allowed grayscale"
              )}
            >
              {action.icon && <action.icon className="w-3.5 h-3.5" />}
              {action.label}
            </button>
          ))}
          
          {rowCount !== undefined && (
            <div className="hidden md:flex items-center px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-l border-slate-100 ml-2">
              Rows: {rowCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'design_master_card': return (
        <div className="space-y-6">
          {renderModuleHeader('Design Master Cards', 
            { label: 'New Master Card', onClick: () => setShowNewEntryModal({ type: 'Design', title: 'Create Design Master' }) },
            [{ label: 'Print All', onClick: () => window.print(), icon: Printer }],
            'Search design card...',
            data.designs.length
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {data.designs.slice(0, 4).map((d, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-48 h-48 bg-slate-100 flex items-center justify-center text-4xl">
                  {d.image ? <img src={d.image} alt={d.id} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : '👗'}
                </div>
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{d.id}</h4>
                      <p className="text-xs text-slate-500">{d.category} · {d.fabric}</p>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{formatCurrency(d.price || 0)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="text-[8px] text-slate-400 uppercase font-bold">Base Fabric</div>
                      <div className="text-xs font-bold text-slate-700">{d.fabric}</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="text-[8px] text-slate-400 uppercase font-bold">Work Type</div>
                      <div className="text-xs font-bold text-slate-700">Embroidery</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-slate-800 transition-all">View Full Card</button>
                    <button className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"><Printer className="w-4 h-4 text-slate-400" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'dyeing_tanks': return renderGenericModule('Dyeing Tanks / Vat Status', ['Tank ID', 'Capacity', 'Current Batch', 'Status', 'Temp', 'pH Level']);
      case 'dyeing_orders': return renderGenericModule('Dyeing Orders', ['Order ID', 'Date', 'Fabric', 'Color', 'Qty', 'Karigar', 'Status']);
      case 'chemical_stock': return renderGenericModule('Chemical / Dye Stock', ['Item Name', 'Category', 'Stock Qty', 'Unit', 'Min Stock', 'Supplier']);
      case 'colour_qc': return renderGenericModule('Colour QC / Matching', ['Batch ID', 'Design ID', 'Target Color', 'Actual Color', 'Match %', 'Status']);
      case 'dyeing_job_card': return renderGenericModule('Dyeing Job Card', ['Card ID', 'Date', 'Lot ID', 'Process', 'Karigar', 'Machine', 'Status']);
      
      case 'loom_status': return renderGenericModule('Tapela / Loom Status', ['Loom ID', 'Type', 'Current Design', 'Operator', 'Efficiency', 'Status']);
      case 'weaving_orders': return renderGenericModule('Weaving Orders', ['Order ID', 'Date', 'Yarn Type', 'Design', 'Qty', 'Delivery', 'Status']);
      case 'yarn_stock': return renderGenericModule('Yarn Stock & Issue', ['Yarn Type', 'Count', 'Stock (kg)', 'Issued (kg)', 'Balance', 'Supplier']);
      case 'sewing_line': return renderGenericModule('Sewing Line Status', ['Line ID', 'Design', 'Target/Hr', 'Actual/Hr', 'Efficiency', 'Status']);
      case 'operator_perf': return renderGenericModule('Operator / Tailor Performance', ['Operator ID', 'Name', 'Total Pcs', 'Approved', 'Rejected', 'Efficiency']);
      case 'op_breakdown': return renderGenericModule('Operation Breakdown (OB)', ['Design ID', 'Operation', 'Machine Type', 'SAM', 'Rate', 'Total SAM']);
      case 'sam_efficiency': return renderGenericModule('SAM / Efficiency Tracking', ['Date', 'Line', 'Design', 'Total SAM', 'Actual Mins', 'Efficiency %']);
      case 'alteration_rework': return renderGenericModule('Alteration / Rework', ['Date', 'Lot ID', 'Defect', 'Karigar', 'Action', 'Status']);
      
      case 'cutting_table': return renderGenericModule('Cutting Table Status', ['Table ID', 'Current Lot', 'Layers', 'Pcs', 'Cutter', 'Status']);
      case 'lay_planning': return renderGenericModule('Lay Planning / Marker', ['Marker ID', 'Design', 'Fabric Width', 'Efficiency', 'Length', 'Status']);
      case 'bundle_mgmt': return renderGenericModule('Bundle / Lot Management', ['Bundle ID', 'Lot ID', 'Size', 'Qty', 'Current Dept', 'Status']);
      
      case 'fabric_stock': return (
        <div className="space-y-4">
          {renderModuleHeader('Fabric Stock Register', 
            { label: 'Add Stock', onClick: () => setShowNewEntryModal({ type: 'Fabric Purchase', title: 'New Fabric Purchase' }) },
            [{ label: 'Export CSV', onClick: () => handleExport('Fabric Stock'), icon: FileDown }],
            'Search fabric...',
            data.fabric_purchase.length
          )}
          {renderTable(
            ['Item', 'Color', 'Purchased', 'Issued', 'Balance', 'Unit', 'Status'],
            data.fabric_purchase,
            (f, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{f.item}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{f.color}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{f.meter}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{f.meter * 0.4}</td>
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{f.meter * 0.6}</td>
                <td className="px-4 py-3 text-xs text-slate-500">Mtrs</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-emerald-100 text-emerald-600">In Stock</span>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'material_forecasting': return (
        <div className="space-y-6">
          {renderModuleHeader('AI Material Forecasting', 
            { label: 'Run Forecast', onClick: () => {} },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Material Forecast', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Material Forecast' },
              { label: 'Inventory Settings', onClick: () => {}, icon: SettingsIcon }
            ],
            'Search items...',
            10
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Fabric', 'Yarn', 'Dyes', 'Trims', 'Packing'].map((cat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-slate-800">{cat} Forecast</h4>
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Required (Next 30d)</span>
                    <span className="font-bold text-slate-800">1,200 Units</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Current Stock</span>
                    <span className="font-bold text-slate-800">450 Units</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                      <span className="text-rose-600">Shortage Risk</span>
                      <span className="text-rose-600">High</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      
      case 'account_ledger': return (
        <div className="space-y-4">
          {renderModuleHeader('General Account Ledger', 
            { label: 'Add Entry', onClick: () => setShowNewEntryModal({ type: 'Account Entry', title: 'New Ledger Entry' }) },
            [{ label: 'Export CSV', onClick: () => handleExport('Account Ledger'), icon: FileDown }],
            'Search ledger...',
            data.karigar_ledger.length
          )}
          {renderTable(
            ['Date', 'Account / Party', 'Description', 'Debit', 'Credit', 'Balance'],
            data.karigar_ledger,
            (r, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{r.name}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.work}</td>
                <td className="px-4 py-3 text-xs text-rose-600 font-bold">{r.debit > 0 ? formatCurrency(r.debit) : '—'}</td>
                <td className="px-4 py-3 text-xs text-emerald-600 font-bold">{r.credit > 0 ? formatCurrency(r.credit) : '—'}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{formatCurrency(r.balance)}</td>
              </tr>
            )
          )}
        </div>
      );
      case 'eway_bill': return (
        <div className="space-y-4">
          {renderModuleHeader('E-Way Bill Management', 
            { label: 'Generate E-Way Bill', onClick: () => {} },
            [{ label: 'Portal Login', onClick: () => {}, icon: Globe }],
            'Search E-Way Bill...',
            3
          )}
          {renderTable(
            ['Bill No', 'Date', 'Invoice No', 'Party', 'Amount', 'Valid Until', 'Status'],
            [
              { no: '2410982341', date: '08 Apr', inv: 'INV-202601', party: 'Ramesh Traders', amount: 47250, valid: '10 Apr', status: 'Active' },
              { no: '2410982340', date: '07 Apr', inv: 'INV-202600', party: 'Anand Fabrics', amount: 85000, valid: '09 Apr', status: 'Active' },
            ],
            (r, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{r.no}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                <td className="px-4 py-3 text-xs text-blue-600 font-bold">{r.inv}</td>
                <td className="px-4 py-3 text-xs text-slate-800">{r.party}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{formatCurrency(r.amount)}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.valid}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-emerald-100 text-emerald-600">{r.status}</span>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'dispatch_register': return (
        <div className="space-y-6">
          {renderModuleHeader('Dispatch & Shipping Register', 
            { label: 'New Dispatch', onClick: () => setShowNewEntryModal({ type: 'Dispatch', title: 'New Dispatch Entry' }) },
            [
              { label: 'Scan Label', onClick: () => handleStartScan('Bundle'), icon: Scan },
              { label: 'Export CSV', onClick: () => handleExport('Dispatch Register'), icon: FileDown }
            ],
            'Search dispatch...',
            5
          )}
          {renderTable(
            ['Date', 'Order ID', 'Customer', 'Boxes', 'Courier', 'Tracking No', 'Status'],
            [
              { date: '08 Apr', id: '#SO-2401', customer: 'Ramesh Traders', boxes: 3, courier: 'Own Vehicle', tracking: '-', status: 'Delivered' },
              { date: '07 Apr', id: '#SO-2400', customer: 'Anand Fabrics', boxes: 6, courier: 'Blue Dart', tracking: 'BD441892', status: 'In Transit' },
            ],
            (r, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{r.id}</td>
                <td className="px-4 py-3 text-xs text-slate-800 font-medium">{r.customer}</td>
                <td className="px-4 py-3 text-xs text-slate-800">{r.boxes}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.courier}</td>
                <td className="px-4 py-3 text-xs font-mono text-slate-400">{r.tracking}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    r.status === 'Delivered' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                  )}>{r.status}</span>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'bundling_sheet': return renderGenericModule('Bundling Sheet', ['Bundle ID', 'Lot ID', 'Size', 'Qty', 'Karigar', 'Status']);
      
      case 'hr_attendance': return (
        <div className="space-y-6">
          {renderModuleHeader('Worker Attendance & Haazri', 
            { label: 'Mark Attendance', onClick: () => {} },
            [
              { label: 'Scan ID Card', onClick: () => handleStartScan('Karigar ID'), icon: Scan },
              { label: 'Biometric Sync', onClick: () => {}, icon: Smartphone }
            ],
            'Search worker...',
            12
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Present', 'Absent', 'Late', 'On Leave'].map((status, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold text-slate-800">{[85, 5, 8, 2][i]}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">{status} Today</div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'maintenance': return (
        <div className="space-y-4">
          {renderModuleHeader('Machine Maintenance Register', 
            { label: 'Log Issue', onClick: () => {} },
            [{ label: 'Schedule Service', onClick: () => {}, icon: Clock }],
            'Search machine...',
            data.machines.length
          )}
          {renderTable(
            ['Machine ID', 'Type', 'Last Service', 'Next Service', 'Status', 'Action'],
            data.machines,
            (m, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{m.id}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{m.type}</td>
                <td className="px-4 py-3 text-xs text-slate-500">15 Mar</td>
                <td className="px-4 py-3 text-xs text-slate-500">15 Apr</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    m.status === 'Running' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                  )}>{m.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-[10px] font-bold text-blue-600">Service</button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'expense': return renderGenericModule('Factory Kharcha', ['Date', 'Category', 'Description', 'Amount', 'Paid To', 'Status']);
      
      case 'bi_reports': return renderGenericModule('BI Reports & Analytics', ['Report Name', 'Category', 'Last Run', 'Format', 'Action']);
      case 'reports': return (
        <div className="space-y-6">
          {renderModuleHeader('Production & MIS Reports', 
            { label: 'Generate Report', onClick: () => {} },
            [{ label: 'Schedule Email', onClick: () => {}, icon: Clock }],
            'Search reports...',
            15
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Daily Production', 'Inventory Status', 'Karigar Ledger', 'Sales Summary', 'Waste Report'].map((r, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-blue-600 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <button className="text-slate-300 hover:text-slate-600"><FileDown className="w-4 h-4" /></button>
                </div>
                <h4 className="font-bold text-slate-800">{r} Report</h4>
                <p className="text-[10px] text-slate-500 mt-1">Last generated: 2 hours ago</p>
              </div>
            ))}
          </div>
        </div>
      );
      case 'doc_scanner': return (
        <div className="space-y-6">
          {renderModuleHeader('AI Document Scanner', 
            { label: 'Start New Scan', onClick: () => handleStartScan('Invoice') },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Doc Scanner', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Doc Scanner' },
              { label: 'Export History', onClick: () => handleExport('Doc Scanner'), icon: FileDown },
              { label: 'Scanner Settings', onClick: () => {}, icon: SettingsIcon }
            ],
            'Search scan history...',
            12
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              onClick={() => handleStartScan('Invoice')}
              className="p-8 bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-4 group"
            >
              <div className="p-4 bg-blue-50 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Scan Invoice / GRN</h4>
                <p className="text-xs text-slate-500">Auto-extract data from purchase invoices</p>
              </div>
            </div>
            <div 
              onClick={() => handleStartScan('Job Card')}
              className="p-8 bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-4 group"
            >
              <div className="p-4 bg-emerald-50 rounded-full text-emerald-600 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Scan Job Card</h4>
                <p className="text-xs text-slate-500">Update production status from physical cards</p>
              </div>
            </div>
            <div 
              onClick={() => handleStartScan('Fabric Roll')}
              className="p-8 bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-4 group"
            >
              <div className="p-4 bg-amber-50 rounded-full text-amber-600 group-hover:scale-110 transition-transform">
                <QrCode className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Scan Fabric QR</h4>
                <p className="text-xs text-slate-500">Check roll details and consumption history</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Recent Scan History</h4>
              <button className="text-[10px] font-bold text-blue-600 hover:underline">View All</button>
            </div>
            {renderTable(['Scan ID', 'Date', 'Doc Type', 'Confidence', 'Status'], [
              { id: 'SCN-8821', date: '14 Apr 2024', type: 'Purchase Invoice', conf: '98%', status: 'Processed' },
              { id: 'SCN-8820', date: '13 Apr 2024', type: 'Job Card', conf: '95%', status: 'Processed' },
              { id: 'SCN-8819', date: '13 Apr 2024', type: 'Fabric Label', conf: '99%', status: 'Processed' },
            ], (s, i) => (
              <tr key={i}>
                <td className="px-4 py-3 text-xs font-mono font-bold text-slate-800">{s.id}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{s.date}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-700">{s.type}</td>
                <td className="px-4 py-3 text-xs text-emerald-600 font-bold">{s.conf}</td>
                <td className="px-4 py-3 text-xs">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-bold">Processed</span>
                </td>
              </tr>
            ))}
          </div>
        </div>
      );

      case 'check_in': return (
        <div className="space-y-4">
          {renderModuleHeader('Received for Checking', 
            { label: 'Receive Lot', onClick: () => setShowNewEntryModal({ type: 'CheckIn', title: 'Receive Lot for Checking' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Check In', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Check In' },
              { label: 'Export CSV', onClick: () => handleExport('Check In'), icon: FileDown }
            ],
            'Search received lots...',
            data.check_in.length
          )}
          {renderTable(
            ['ID', 'Design', 'Party', 'From', 'Qty', 'Date', 'Status', 'Action'],
            data.check_in,
            (c, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-blue-600 font-bold">{c.id}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{c.designName}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{c.party}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{c.receivedFrom}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{c.receivedQty}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{c.receiveDate}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    c.status === 'Checking' ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                  )}>{c.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-[10px] font-bold text-blue-600 hover:underline">Check</button>
                </td>
              </tr>
            )
          )}
        </div>
      );

      case 'check_register': return (
        <div className="space-y-4">
          {renderModuleHeader('Checking Register', 
            { label: 'New Check Entry', onClick: () => setShowNewEntryModal({ type: 'CheckRegister', title: 'New Checking Entry' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Check Register', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Check Register' },
              { label: 'Export CSV', onClick: () => handleExport('Check Register'), icon: FileDown }
            ],
            'Search check entries...',
            data.check_register.length
          )}
          {renderTable(
            ['CR No', 'Design', 'Checker', 'Total', 'Pass', 'Fail', 'Alt', 'Reject', 'Date', 'Status'],
            data.check_register,
            (c, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-emerald-600 font-bold">{c.id}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{c.designName}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{c.checker}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{c.totalChecked}</td>
                <td className="px-4 py-3 text-xs text-emerald-600 font-bold">{c.pass}</td>
                <td className="px-4 py-3 text-xs text-rose-600 font-bold">{c.fail}</td>
                <td className="px-4 py-3 text-xs text-amber-600 font-bold">{c.alt}</td>
                <td className="px-4 py-3 text-xs text-rose-800 font-bold">{c.reject}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{c.date}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-emerald-100 text-emerald-600">{c.status}</span>
                </td>
              </tr>
            )
          )}
        </div>
      );

      case 'defect_log': return (
        <div className="space-y-6">
          {renderModuleHeader('Defect / Alteration Log', 
            { label: 'Log Defect', onClick: () => {} },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Defect Log', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Defect Log' },
              { label: 'Defect Analysis', onClick: () => {}, icon: BarChart3 }
            ],
            'Search defects...',
            10
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: 'Stitch Missing', count: 45, icon: Scissors },
              { label: 'Loose Thread', count: 120, icon: Scissors },
              { label: 'Stain / Spot', count: 12, icon: AlertTriangle },
              { label: 'Hole / Cut', count: 5, icon: AlertTriangle },
              { label: 'Print Defect', count: 28, icon: Palette },
              { label: 'Size Issue', count: 15, icon: Ruler },
            ].map((d, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                <d.icon className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-slate-800">{d.count}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      );

      case 'alteration': return (
        <div className="space-y-4">
          {renderModuleHeader('Alteration Tracking', 
            { label: 'Send for Alt', onClick: () => setShowNewEntryModal({ type: 'Alteration', title: 'Send Pieces for Alteration' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Alteration', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Alteration' },
              { label: 'Export CSV', onClick: () => handleExport('Alteration'), icon: FileDown }
            ],
            'Search alterations...',
            data.alteration.length
          )}
          {renderTable(
            ['Alt ID', 'CR Ref', 'Design', 'Qty', 'Defect', 'Karigar', 'Sent Date', 'Status'],
            data.alteration,
            (a, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-amber-600 font-bold">{a.id}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{a.crId}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{a.designName}</td>
                <td className="px-4 py-3 text-xs font-bold text-amber-600">{a.qty}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{a.defectType}</td>
                <td className="px-4 py-3 text-xs text-slate-800">{a.altPerson}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{a.sentDate}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    a.status === 'Received' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                  )}>{a.status}</span>
                </td>
              </tr>
            )
          )}
        </div>
      );

      case 'press_order': return (
        <div className="space-y-4">
          {renderModuleHeader('Pressing Orders', 
            { label: 'New Press Order', onClick: () => setShowNewEntryModal({ type: 'PressOrder', title: 'New Pressing Order' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Press Orders', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Press Orders' },
              { label: 'Export CSV', onClick: () => handleExport('Press Orders'), icon: FileDown }
            ],
            'Search press orders...',
            data.press_orders.length
          )}
          {renderTable(
            ['PO No', 'Design', 'Party', 'Qty', 'Type', 'Table', 'Presser', 'Status'],
            data.press_orders,
            (p, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-blue-600 font-bold">{p.id}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{p.designName}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{p.party}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{p.totalQty}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{p.pressType}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{p.tableNo}</td>
                <td className="px-4 py-3 text-xs text-slate-800">{p.presserName}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    p.status === 'Done' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                  )}>{p.status}</span>
                </td>
              </tr>
            )
          )}
        </div>
      );

      case 'press_log': return (
        <div className="space-y-4">
          {renderModuleHeader('Pressing Log', 
            { label: 'Log Entry', onClick: () => {} },
            [{ label: 'Daily Report', onClick: () => {}, icon: FileText }],
            'Search logs...',
            25
          )}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Today's Output</div>
                <div className="text-2xl font-bold text-blue-900">1,245 Pcs</div>
              </div>
              <div className="flex-1 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Efficiency</div>
                <div className="text-2xl font-bold text-emerald-900">94%</div>
              </div>
            </div>
            {renderTable(['Date', 'Presser', 'Design', 'Qty', 'Rate', 'Total'], [
              { date: '14 Apr', name: 'Aslam Bhai', design: 'Vamika Kurti', qty: 285, rate: 3, total: 855 },
              { date: '14 Apr', name: 'Zubair Karigar', design: 'Chiffon Dupatta', qty: 395, rate: 2, total: 790 },
            ], (l, i) => (
              <tr key={i}>
                <td className="px-4 py-3 text-xs text-slate-500">{l.date}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{l.name}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{l.design}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{l.qty}</td>
                <td className="px-4 py-3 text-xs text-slate-500">₹{l.rate}</td>
                <td className="px-4 py-3 text-xs font-bold text-emerald-600">₹{l.total}</td>
              </tr>
            ))}
          </div>
        </div>
      );

      case 'press_table': return (
        <div className="space-y-6">
          {renderModuleHeader('Pressing Table Status', 
            { label: 'Manage Tables', onClick: () => {} },
            [{ label: 'Refresh', onClick: () => {}, icon: Radio }],
            'Search tables...',
            8
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['PT-01', 'PT-02', 'PT-03', 'PT-04', 'PT-05', 'PT-06', 'PT-07', 'PT-08'].map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold">{t}</div>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    i < 2 ? "bg-emerald-100 text-emerald-600" : i < 5 ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"
                  )}>{i < 2 ? 'Active' : i < 5 ? 'Busy' : 'Idle'}</span>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-800">{i < 5 ? 'Aslam Bhai' : '---'}</div>
                  <div className="text-[10px] text-slate-500">{i < 5 ? 'Vamika Kurti Sky Blue' : 'No Active Order'}</div>
                  {i < 5 && (
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-blue-500 h-full" style={{ width: `${Math.random() * 100}%` }}></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      case 'pack_order': return (
        <div className="space-y-4">
          {renderModuleHeader('Packing Orders', 
            { label: 'New Pack Order', onClick: () => setShowNewEntryModal({ type: 'PackOrder', title: 'New Packing Order' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Pack Orders', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Pack Orders' },
              { label: 'Export CSV', onClick: () => handleExport('Pack Orders'), icon: FileDown }
            ],
            'Search pack orders...',
            data.pack_orders.length
          )}
          {renderTable(
            ['PK No', 'Design', 'Party', 'Qty', 'Type', 'Cartons', 'Packer', 'Status'],
            data.pack_orders,
            (p, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-blue-600 font-bold">{p.id}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{p.designName}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{p.party}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{p.totalQty}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{p.packType}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{p.cartons}</td>
                <td className="px-4 py-3 text-xs text-slate-800">{p.packerName}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    p.status === 'Done' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                  )}>{p.status}</span>
                </td>
              </tr>
            )
          )}
        </div>
      );

      case 'carton': return (
        <div className="space-y-4">
          {renderModuleHeader('Carton Register', 
            { label: 'Add Carton', onClick: () => setShowNewEntryModal({ type: 'Carton', title: 'Add New Carton' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Cartons', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Cartons' },
              { label: 'Print Labels', onClick: () => {}, icon: QrCode }
            ],
            'Search cartons...',
            data.cartons.length
          )}
          {renderTable(
            ['Carton No', 'Design', 'Color', 'Size', 'Pcs', 'Weight', 'Date', 'Status'],
            data.cartons,
            (c, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-blue-600 font-bold">{c.cartonNo}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{c.designName}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{c.color}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{c.size}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{c.pcs}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{c.weight} kg</td>
                <td className="px-4 py-3 text-xs text-slate-500">{c.date}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-emerald-100 text-emerald-600">{c.status}</span>
                </td>
              </tr>
            )
          )}
        </div>
      );

      case 'tag_label': return (
        <div className="space-y-6">
          {renderModuleHeader('Tag & Label Management', 
            { label: 'Generate Tags', onClick: () => {} },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Tag Labels', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Tag Labels' },
              { label: 'Label Settings', onClick: () => {}, icon: SettingsIcon }
            ],
            'Search designs...',
            15
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { design: 'Vamika Kurti', tags: 'Price Tag, Wash Care', status: 'Ready' },
              { design: 'Lehenga Set', tags: 'Price Tag, Brand Label', status: 'Pending' },
              { design: 'Chiffon Dupatta', tags: 'Price Tag', status: 'Ready' },
            ].map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-slate-800">{t.design}</h4>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    t.status === 'Ready' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                  )}>{t.status}</span>
                </div>
                <div className="text-xs text-slate-500 mb-4">Required: {t.tags}</div>
                <button className="w-full py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  <QrCode className="w-4 h-4" /> Print Labels
                </button>
              </div>
            ))}
          </div>
        </div>
      );

      case 'cut_challan': return (
        <div className="space-y-4">
          {renderModuleHeader('Cut Challans', 
            { label: 'New Cut Challan', onClick: () => setShowNewEntryModal({ type: 'CutChallan', title: 'New Cutting Challan' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Cut Challans', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Cut Challans' },
              { label: 'Export CSV', onClick: () => handleExport('Cut Challans'), icon: FileDown }
            ],
            'Search cut challans...',
            data.cut_challans.length
          )}
          {renderTable(
            ['CC No', 'Design', 'Cutter', 'Layers', 'Meters', 'Total Pcs', 'Date', 'Status'],
            data.cut_challans,
            (c, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-blue-600 font-bold">{c.id}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{c.designName}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{c.cutterName}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{c.layers}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{c.fabricMeters}m</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{c.totalPcs}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{c.issueDate}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-emerald-100 text-emerald-600">{c.status}</span>
                </td>
              </tr>
            )
          )}
        </div>
      );

      case 'size_register': return (
        <div className="space-y-4">
          {renderModuleHeader('Size Register', 
            { label: 'Add Size Set', onClick: () => {} },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Size Register', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Size Register' },
              { label: 'Size Analysis', onClick: () => {}, icon: BarChart3 }
            ],
            'Search designs...',
            10
          )}
          {renderTable(
            ['Design', 'S', 'M', 'L', 'XL', 'XXL', 'Total', 'Action'],
            [
              { design: 'Vamika Kurti', s: 50, m: 80, l: 80, xl: 50, xxl: 40, total: 300 },
              { design: 'Lehenga Set', s: 20, m: 40, l: 40, xl: 30, xxl: 20, total: 150 },
            ],
            (s, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{s.design}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{s.s}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{s.m}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{s.l}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{s.xl}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{s.xxl}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{s.total}</td>
                <td className="px-4 py-3">
                  <button className="text-[10px] font-bold text-blue-600 hover:underline">Edit</button>
                </td>
              </tr>
            )
          )}
        </div>
      );

      case 'delivery_challan': return (
        <div className="space-y-4">
          {renderModuleHeader('Delivery Challans', 
            { label: 'New DC', onClick: () => setShowNewEntryModal({ type: 'DeliveryChallan', title: 'New Delivery Challan' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Delivery Challans', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Delivery Challans' },
              { label: 'Export CSV', onClick: () => handleExport('Delivery Challans'), icon: FileDown }
            ],
            'Search challans...',
            15
          )}
          {renderTable(
            ['DC No', 'Party', 'Design', 'Qty', 'Cartons', 'Date', 'Status'],
            [
              { id: 'DC-101', party: 'Vitara Fashion', design: 'Vamika Kurti', qty: 285, cartons: 6, date: '2026-04-14', status: 'Dispatched' },
              { id: 'DC-102', party: 'Vastra NX', design: 'Chiffon Dupatta', qty: 395, cartons: 8, date: '2026-04-12', status: 'Delivered' },
            ],
            (d, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-blue-600 font-bold">{d.id}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{d.party}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{d.design}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{d.qty}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{d.cartons}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{d.date}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    d.status === 'Delivered' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                  )}>{d.status}</span>
                </td>
              </tr>
            )
          )}
        </div>
      );

      case '3d_cutting_calc': return (
        <div className="space-y-6">
          {renderModuleHeader('3D Cutting Calculator', 
            { label: 'New Calculation', onClick: () => {} },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('3D Cutting', 'google'), icon: Globe, disabled: isExportingToGoogle === '3D Cutting' },
              { label: 'View 3D Model', onClick: () => {}, icon: Box }
            ],
            'Search designs...',
            data.three_d_calcs.length
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">Input Parameters</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Fabric Width (in)</label>
                    <input type="number" className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs" defaultValue={44} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Layers</label>
                    <input type="number" className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs" defaultValue={10} />
                  </div>
                </div>
                <button className="w-full py-3 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all">Calculate Optimal Layout</button>
              </div>
            </div>
            <div className="bg-slate-900 rounded-xl p-6 flex items-center justify-center text-slate-400 border border-slate-800">
              <div className="text-center">
                <Box className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <div className="text-xs font-bold text-slate-500 uppercase">3D Layout Preview</div>
              </div>
            </div>
          </div>
          {renderTable(
            ['Design', 'Width', 'Layers', 'Pcs/Layer', 'Total Pcs', 'Wastage', 'Status'],
            data.three_d_calcs,
            (c, i) => (
              <tr key={i}>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{c.designName}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{c.width}"</td>
                <td className="px-4 py-3 text-xs text-slate-600">{c.layers}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{c.pcsPerLayer}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{c.totalPieces}</td>
                <td className="px-4 py-3 text-xs text-rose-600 font-bold">{c.wastagePercent}%</td>
                <td className="px-4 py-3 text-xs">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-tight">{c.status}</span>
                </td>
              </tr>
            )
          )}
        </div>
      );

      case 'fabric_consumption_ai': return (
        <div className="space-y-4">
          {renderModuleHeader('Fabric Consumption AI', 
            { label: 'Run AI Analysis', onClick: () => {} },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Fabric Consumption', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Fabric Consumption' },
              { label: 'Export CSV', onClick: () => handleExport('Fabric Consumption'), icon: FileDown }
            ],
            'Search designs...',
            data.fabric_consumption_ai.length
          )}
          {renderTable(
            ['Design', 'Fabric', 'Qty', 'Std Cons', 'AI Est', 'Actual', 'Variance', 'Accuracy'],
            data.fabric_consumption_ai,
            (f, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{f.designName}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{f.fabricType}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{f.qty}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{f.stdConsumption}m</td>
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{f.aiEstimated}m</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{f.actualUsed}m</td>
                <td className="px-4 py-3 text-xs font-bold text-rose-600">{f.variance}m</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${f.aiAccuracy}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600">{f.aiAccuracy}%</span>
                  </div>
                </td>
              </tr>
            )
          )}
        </div>
      );

      case 'pattern_planning_ai': return (
        <div className="space-y-4">
          {renderModuleHeader('Pattern Planning AI', 
            { label: 'Generate Plan', onClick: () => {} },
            [{ label: 'Sync Google Sheets', onClick: () => handleExport('Pattern Planning', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Pattern Planning' }],
            'Search plans...',
            data.pattern_planning_ai.length
          )}
          {renderTable(
            ['Plan ID', 'Design', 'Width', 'Efficiency', 'Wastage', 'Layers', 'AI Suggestion', 'Status'],
            data.pattern_planning_ai,
            (p, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-blue-600 font-bold">{p.planId}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{p.designName}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{p.fabricWidth}"</td>
                <td className="px-4 py-3 text-xs font-bold text-emerald-600">{p.efficiency}%</td>
                <td className="px-4 py-3 text-xs text-rose-600 font-bold">{p.wastagePercent}%</td>
                <td className="px-4 py-3 text-xs text-slate-500">{p.layers}</td>
                <td className="px-4 py-3 text-xs italic text-slate-500">{p.aiSuggestion}</td>
                <td className="px-4 py-3 text-xs">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-tight">{p.status}</span>
                </td>
              </tr>
            )
          )}
        </div>
      );

      case 'task_tracking': return (
        <div className="space-y-6">
          {renderModuleHeader('AI Task Tracking', 
            { label: 'New Task', onClick: () => {} },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Task Tracking', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Task Tracking' },
              { label: 'Time Logs', onClick: () => {}, icon: Clock }
            ],
            'Search tasks...',
            data.task_tracking.length
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.task_tracking.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.taskId}</div>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-tight">{t.status}</span>
                </div>
                <h4 className="font-bold text-slate-800 mb-1">{t.title}</h4>
                <p className="text-xs text-slate-500 mb-4">{t.project}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex -space-x-2">
                    {t.assignees.map((a, idx) => (
                      <div key={idx} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600" title={a}>
                        {a.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800">{t.trackedHours}h / {t.estimatedHours}h</div>
                    <div className="text-[10px] text-slate-400">Tracked</div>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
                  <div className="bg-blue-500 h-full" style={{ width: `${(t.trackedHours / t.estimatedHours) * 100}%` }}></div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" /> Start Timer
                  </button>
                  <button className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
                    <FileText className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      case 'analytics': {
        const deliveryData = [
          { month: 'Jan', rate: 94 },
          { month: 'Feb', rate: 91 },
          { month: 'Mar', rate: 95 },
          { month: 'Apr', rate: 92 },
          { month: 'May', rate: 96 },
          { month: 'Jun', rate: 94 },
        ];

        const defectData = [
          { batch: 'LOT-201', rate: 1.2 },
          { batch: 'LOT-202', rate: 0.8 },
          { batch: 'LOT-203', rate: 2.1 },
          { batch: 'LOT-204', rate: 0.5 },
          { batch: 'LOT-205', rate: 1.5 },
          { batch: 'LOT-206', rate: 0.9 },
        ];

        const cycleTimeData = [
          { stage: 'Cutting', avgDays: 1.5 },
          { stage: 'Stitching', avgDays: 4.2 },
          { stage: 'Finishing', avgDays: 2.1 },
          { stage: 'Packing', avgDays: 1.0 },
        ];

        return (
          <div className="space-y-6">
            {renderModuleHeader('Business Intelligence & Analytics', 
              { label: 'Refresh Data', onClick: () => {} },
              [
                { label: 'Sync Google Sheets', onClick: () => handleExport('Analytics', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Analytics' },
                { label: 'AI Insights', onClick: () => handleAIInsight('Analytics'), icon: Sparkles }
              ],
              'Search metrics...',
              12
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+2.4%</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">94.2%</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">On-Time Delivery Rate</div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">-0.5d</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">8.8 Days</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Avg. Production Cycle</div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-rose-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">-0.2%</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">1.15%</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Avg. Defect Rate</div>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">On-Time Delivery Trend</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={deliveryData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} domain={[80, 100]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                      />
                      <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">Defect Rate per Batch (%)</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={defectData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="batch" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f8fafc' }}
                      />
                      <Bar dataKey="rate" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">Average Cycle Time by Stage (Days)</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cycleTimeData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={80} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="avgDays" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'lot_control_tower': return (
        <div className="space-y-6">
          {renderModuleHeader('Lot Control Tower — Production Monitoring', 
            { label: 'Refresh Data', onClick: () => {} },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Lot Status', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Lot Status' },
              { label: 'Export Status', onClick: () => handleExport('Lot Status'), icon: FileDown }
            ],
            'Search lot...',
            data.batches.length
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.batches.map((b, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-slate-800">{b.lot_id}</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">{b.style}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    b.priority === 'Urgent' ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"
                  )}>{b.priority}</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Current Stage:</span>
                    <span className="font-bold text-blue-600">{b.stage}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                      <span className="text-slate-400">Production Progress</span>
                      <span className="text-slate-600">{Math.floor((b.done / b.qty) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(b.done / b.qty) * 100}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                    <div>
                      <div className="text-[8px] text-slate-400 uppercase font-bold">Target Qty</div>
                      <div className="text-sm font-bold text-slate-800">{b.qty}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-slate-400 uppercase font-bold">Delivery</div>
                      <div className="text-sm font-bold text-slate-800">{b.delivery}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'dyeing_job': 
      case 'printing_job':
      case 'embroidery_job':
      case 'cutting_job':
      case 'handwork_job':
      case 'stitching_job':
      case 'qc_sheet':
      case 'pressing_job': {
        const stageMap: Record<string, string> = {
          'dyeing_job': 'Dyeing',
          'printing_job': 'Print',
          'embroidery_job': 'Embroidery',
          'cutting_job': 'Cutting',
          'handwork_job': 'Handwork',
          'stitching_job': 'Stitching',
          'qc_sheet': 'QC',
          'pressing_job': 'QC & Pressing'
        };
        const stage = stageMap[activeSection];
        return (
          <div className="space-y-4">
            {renderModuleHeader(`${stage} Job Register`, 
              { label: 'Add Job', onClick: () => setShowNewEntryModal({ type: 'Job Sheet', title: `New ${stage} Job` }) },
              [{ label: 'Export CSV', onClick: () => handleExport(`${stage} Jobs`), icon: FileDown }],
              `Search ${stage} jobs...`,
              data.job_sheets.filter(s => s.current_stage === stage).length
            )}
            {renderTable(
              ['ID', 'Lot No', 'Design', 'Qty', 'Karigar', 'Issued', 'Status', 'Actions'],
              data.job_sheets.filter(s => s.current_stage === stage),
              (s, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs font-bold text-slate-800">{s.id}</td>
                  <td className="px-4 py-3 text-xs font-bold text-blue-600">{s.lot_no}</td>
                  <td className="px-4 py-3 text-xs text-slate-800">{s.design_no}</td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-800">{s.qty}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{s.karigar_name || '-'}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{s.issued_date || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                      s.status === 'Completed' ? "bg-emerald-100 text-emerald-600" : s.status === 'In Progress' ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"
                    )}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => setSelectedDetail({ type: 'Job Sheet', id: s.id, data: s })}
                      className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            )}
          </div>
        );
      }
      case 'karigar_advance': return (
        <div className="space-y-4">
          {renderModuleHeader('Karigar Advance & Loan Register', 
            { label: 'Give Advance', onClick: () => setShowNewEntryModal({ type: 'Karigar Entry', title: 'New Advance Payment' }) },
            [{ label: 'Export CSV', onClick: () => handleExport('Karigar Advances'), icon: FileDown }],
            'Search karigar...',
            5
          )}
          {renderTable(
            ['Date', 'Karigar', 'Dept', 'Advance Amount', 'Purpose', 'Repayment Status'],
            [
              { date: '08 Apr', name: 'Ramkishan', dept: 'Weaving', amount: 5000, purpose: 'Festival', status: 'Pending' },
              { date: '07 Apr', name: 'Mohan', dept: 'Cutting', amount: 2000, purpose: 'Medical', status: 'Deducted' },
            ],
            (r, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{r.name}</td>
                <td className="px-4 py-3 text-xs text-blue-500 font-medium">{r.dept}</td>
                <td className="px-4 py-3 text-xs font-bold text-rose-600">{formatCurrency(r.amount)}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.purpose}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    r.status === 'Deducted' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                  )}>{r.status}</span>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'design_pattern_board': return (
        <div className="space-y-6">
          {renderModuleHeader('Design Pattern & Style Board', 
            { label: 'Add Pattern', onClick: () => {} },
            [{ label: 'AI Suggest', onClick: () => {}, icon: Sparkles }],
            'Search pattern...',
            data.designs.length
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {data.designs.map((d, i) => (
              <div key={i} className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500 transition-all cursor-pointer group">
                <div className="aspect-square bg-slate-100 rounded-lg mb-2 flex items-center justify-center text-3xl overflow-hidden">
                  {d.image ? <img src={d.image} alt={d.id} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" /> : '🧵'}
                </div>
                <div className="px-1">
                  <div className="text-[10px] font-bold text-slate-800 truncate">{d.id}</div>
                  <div className="text-[8px] text-slate-400 uppercase font-bold">{d.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'work_order': return renderGenericModule('Production Work Order', ['Order ID', 'Date', 'Design', 'Qty', 'Dept', 'Priority', 'Status']);
      case 'sample_approval': return renderGenericModule('Sample Approval Card', ['Sample ID', 'Design', 'Type', 'Sent Date', 'Approved Date', 'Status']);
      case 'all_sheets': return (
        <div className="space-y-6">
          {renderModuleHeader('ERP Master Index — All Modules', { label: 'Refresh', onClick: () => {} })}
          {renderModuleIndex()}
        </div>
      );
      case 'dashboard': return renderDashboard();
      case 'orders': return (
        <div className="space-y-6">
          {renderModuleHeader('Order Book — Customer Orders', 
            { label: 'Add Order', onClick: () => setShowNewEntryModal({ type: 'Order', title: 'Create New Order' }) },
            [
              { label: 'Print Order Book', onClick: () => setShowOrderBook({}), icon: Printer },
              { label: 'Export CSV', onClick: () => handleExport('Order Book'), icon: FileDown }, 
              { label: 'Sync Google Sheets', onClick: () => handleExport('Order Book', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Order Book' },
            ],
            'Search in orders...',
            data.client_orders.length
          )}
          {renderTable(
            ['Order ID', 'Date', 'Design ID', 'Party Name', 'Qty', 'Rate', 'Amount', 'Status', 'Action'],
            data.client_orders,
            (o: ClientOrder, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{o.id}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{o.estimated_delivery}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{o.design_id}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-800">{o.client_name}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{o.qty}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{formatCurrency(o.rate || 0)}</td>
                <td className="px-4 py-3 text-xs font-bold text-emerald-600">{formatCurrency(o.amount || (o.qty * (o.rate || 0)))}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight", 
                    o.status === 'In Production' ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                  )}>{o.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowOrderBook({
                        entries: data.client_orders.map(order => ({
                          order_id: order.id,
                          date: order.estimated_delivery,
                          design_id: order.design_id,
                          design_name: 'Standard Style',
                          party_name: order.client_name,
                          qty: order.qty,
                          rate: order.rate || 500,
                          amount: order.amount || (order.qty * (order.rate || 500))
                        }))
                      })}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Print Order Book"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Search className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'designs': return (
        <div className="space-y-6">
          {renderModuleHeader('Design Register — Style · Colour · Costing', 
            { label: 'Add Design', onClick: () => setShowNewEntryModal({ type: 'Design', title: 'Create New Design' }) },
            [
              { label: 'Export CSV', onClick: () => handleExport('Design Register'), icon: FileDown },
              { label: 'AI Analysis', onClick: () => {}, icon: Sparkles }
            ],
            'Search in designs...',
            data.designs.length
          )}
          {renderTable(
            ['Design ID', 'Design Name', 'Category', 'Status', 'Created At', 'Action'],
            data.designs,
            (d, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{d.id}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-800">{d.name}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{d.category}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight", 
                    d.status === 'Dispatched' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                  )}>{d.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">2026-03-20</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => handleDesignAnalysis(d.id, d.name)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Sparkles className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Search className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'pattern_planning': return (
        <div className="space-y-6">
          {renderModuleHeader('Pattern Planning — CAD & Grading', 
            { label: 'New Pattern', onClick: () => setShowNewEntryModal({ type: 'Pattern', title: 'Create New Pattern' }) },
            [
              { label: 'CAD Library', onClick: () => {}, icon: Ruler },
              { label: 'Print Pattern', onClick: () => window.print(), icon: Printer }
            ]
          )}
          {renderTable(
            ['Design ID', 'Style Name', 'Pattern Status', 'CAD File', 'Last Updated', 'Action'],
            data.designs,
            (d, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{d.id}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-800">{d.name}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-bold uppercase tracking-tight">Approved</span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{d.id}_pattern.dwg</td>
                <td className="px-4 py-3 text-xs text-slate-500">2026-03-25</td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Download className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'production_plan': return (
        <div className="space-y-6">
          {renderModuleHeader('Production Plan — Batch Scheduling', 
            { label: 'Add Plan', onClick: () => setShowNewEntryModal({ type: 'Production Plan', title: 'Create Production Plan' }) },
            [
              { label: 'Export CSV', onClick: () => handleExport('Production Plan'), icon: FileDown },
              { label: 'Print Plan', onClick: () => window.print(), icon: Printer },
              { label: 'Calendar View', onClick: () => {}, icon: Calendar }
            ],
            'Search plans...',
            data.batches.length
          )}
          {renderTable(
            ['Batch ID', 'Design ID', 'Style Name', 'Start Date', 'End Date', 'Status', 'Action'],
            data.batches,
            (b, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{b.lot_id}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{b.style.split(' ')[0]}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-800">{b.style.split(' ').slice(1).join(' ')}</td>
                <td className="px-4 py-3 text-xs text-slate-500">2026-04-01</td>
                <td className="px-4 py-3 text-xs text-slate-500">{b.delivery}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight", 
                    b.status === 'In Progress' ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                  )}>{b.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><ClipboardList className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'fabric_consumption': return (
        <div className="space-y-6">
          {renderModuleHeader('Fabric Consumption — BOM & Wastage', 
            { label: 'Add BOM', onClick: () => setShowNewEntryModal({ type: 'BOM', title: 'Create Bill of Materials' }) },
            [
              { label: 'Export CSV', onClick: () => handleExport('Fabric Consumption'), icon: FileDown },
              { label: 'Print BOM', onClick: () => window.print(), icon: Printer },
              { label: 'Calculator', onClick: () => {}, icon: Calculator }
            ],
            'Search consumption...',
            data.designs.length
          )}
          {renderTable(
            ['Design ID', 'Fabric Type', 'Consumption/Pc', 'Unit', 'Total Requirement', 'Action'],
            data.designs,
            (d, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{d.id}</td>
                <td className="px-4 py-3 text-xs text-slate-600">Cotton Silk</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">2.5</td>
                <td className="px-4 py-3 text-xs text-slate-500">Meters</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{d.qty * 2.5}m</td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Search className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'vendor_master': return (
        <div className="space-y-6">
          {renderModuleHeader('Vendor Master — Suppliers & Ratings', 
            { label: 'Add Vendor', onClick: () => setShowNewEntryModal({ type: 'Vendor', title: 'Add New Vendor' }) },
            [
              { label: 'Export CSV', onClick: () => handleExport('Vendor Master'), icon: FileDown },
              { label: 'Print List', onClick: () => window.print(), icon: Printer },
              { label: 'Performance', onClick: () => {}, icon: TrendingUp }
            ],
            'Search vendors...',
            data.vendor_ratings.length
          )}
          {renderTable(
            ['Vendor ID', 'Vendor Name', 'Category', 'Contact', 'Rating', 'Status', 'Action'],
            data.vendor_ratings,
            (v, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{v.vendor_id}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-800">{v.name}</td>
                <td className="px-4 py-3 text-xs text-slate-500">Fabric Supplier</td>
                <td className="px-4 py-3 text-xs text-slate-500">9876543210</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <Star className="w-3 h-3 fill-current" /> {v.overall_rating}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-bold uppercase tracking-tight">Active</span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Search className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'customer_master': return (
        <div className="space-y-6">
          {renderModuleHeader('Customer Master — B2B Clients', 
            { label: 'Add Customer', onClick: () => setShowNewEntryModal({ type: 'Customer', title: 'Add New Customer' }) },
            [
              { label: 'Export CSV', onClick: () => handleExport('Customer Master'), icon: FileDown },
              { label: 'Print List', onClick: () => window.print(), icon: Printer },
              { label: 'Sync Google Sheets', onClick: () => handleExport('Customer Master', 'google'), icon: Globe }
            ],
            'Search customers...',
            data.customers.length
          )}
          {renderTable(
            ['Customer ID', 'Customer Name', 'Type', 'Contact', 'City', 'Status', 'Action'],
            data.customers,
            (c, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{c.id}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-800">{c.name}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{c.type}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{c.mobile}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{c.city}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-bold uppercase tracking-tight">Active</span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Search className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'crm_leads': return (
        <div className="space-y-6">
          {renderModuleHeader('CRM Leads — Sales Pipeline', 
            { label: 'Add Lead', onClick: () => setShowNewEntryModal({ type: 'Lead', title: 'Add New Sales Lead' }) },
            [
              { label: 'Export CSV', onClick: () => handleExport('CRM Leads'), icon: FileDown },
              { label: 'Follow-up', onClick: () => {}, icon: Calendar }
            ],
            'Search leads...',
            1
          )}
          {renderTable(
            ['Lead ID', 'Customer Name', 'Source', 'Status', 'Next Follow-up', 'Action'],
            [{ id: 'L-001', name: 'Global Retail', source: 'Website', status: 'Hot', next: '2026-04-05' }],
            (l, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{l.id}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-800">{l.name}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{l.source}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 font-bold uppercase tracking-tight">{l.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{l.next}</td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><MessageSquare className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'crm_complaints': return (
        <div className="space-y-6">
          {renderModuleHeader('CRM Complaints — Support Tickets', 
            { label: 'Add Ticket', onClick: () => setShowNewEntryModal({ type: 'Ticket', title: 'Add Support Ticket' }) },
            [{ label: 'History', onClick: () => {}, icon: RefreshCw }],
            'Search complaints...',
            1
          )}
          {renderTable(
            ['Ticket ID', 'Customer', 'Issue', 'Priority', 'Status', 'Assigned To', 'Action'],
            [{ id: 'T-101', customer: 'Boutique B', issue: 'Sizing discrepancy', priority: 'High', status: 'Open', assigned: 'Support A' }],
            (t, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{t.id}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-800">{t.customer}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{t.issue}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 font-bold uppercase tracking-tight">{t.priority}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 font-bold uppercase tracking-tight">{t.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{t.assigned}</td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Search className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'hrm_employees': return (
        <div className="space-y-6">
          {renderModuleHeader('HRM Employees — Staff Directory', 
            { label: 'Add Employee', onClick: () => setShowNewEntryModal({ type: 'Employee', title: 'Add New Employee' }) },
            [
              { label: 'Export CSV', onClick: () => handleExport('HRM Employees'), icon: FileDown },
              { label: 'Print List', onClick: () => window.print(), icon: Printer },
              { label: 'ID Cards', onClick: () => {}, icon: QrCode }
            ],
            'Search employees...',
            1
          )}
          {renderTable(
            ['Emp ID', 'Name', 'Department', 'Designation', 'Joining Date', 'Status', 'Action'],
            [{ id: 'E-001', name: 'Amit Sharma', dept: 'Production', desig: 'Supervisor', date: '2025-01-15', status: 'Active' }],
            (e, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{e.id}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-800">{e.name}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{e.dept}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{e.desig}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{e.date}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-bold uppercase tracking-tight">{e.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Search className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'hrm_leaves': return (
        <div className="space-y-6">
          {renderModuleHeader('HRM Leaves — Attendance Tracking', 
            { label: 'Apply Leave', onClick: () => setShowNewEntryModal({ type: 'Leave', title: 'Apply for Leave' }) },
            [
              { label: 'Export CSV', onClick: () => handleExport('HRM Leaves'), icon: FileDown },
              { label: 'Holiday List', onClick: () => {}, icon: Calendar }
            ],
            'Search leaves...',
            1
          )}
          {renderTable(
            ['Emp ID', 'Name', 'Leave Type', 'Start Date', 'End Date', 'Status', 'Action'],
            [{ id: 'E-001', name: 'Amit Sharma', type: 'Sick Leave', start: '2026-04-01', end: '2026-04-02', status: 'Approved' }],
            (l, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{l.id}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-800">{l.name}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{l.type}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{l.start}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{l.end}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-bold uppercase tracking-tight">{l.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Search className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'karigar_master': return (
        <div className="space-y-6">
          {renderModuleHeader('Karigar Master — Work Type · Rate · Balance', 
            { label: 'Add Karigar', onClick: () => setShowNewEntryModal({ type: 'Karigar', title: 'Add New Karigar' }) },
            [
              { label: 'Export CSV', onClick: () => handleExport('Karigar Master'), icon: FileDown },
              { label: 'Print Job Card', onClick: () => setShowKarigarCard({}), icon: Printer },
              { label: 'Attendance', onClick: () => {}, icon: CalendarDays }
            ],
            'Search karigars...',
            data.karigar_ledger.length
          )}
          {renderTable(
            ['Karigar ID', 'Name', 'Work Type', 'Rate/Pc', 'Balance', 'Status', 'Action'],
            data.karigar_ledger,
            (r: KarigarLedger, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{r.id}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-800">{r.name}</td>
                <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold uppercase tracking-tight">{r.dept || 'Stitching'}</span></td>
                <td className="px-4 py-3 text-xs text-slate-600">{formatCurrency(r.rate || 50)}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{formatCurrency(r.balance)}</td>
                <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-bold uppercase tracking-tight">Active</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowKarigarCard({
                        karigar_name: r.name,
                        department: r.dept,
                        karigar_code: r.id
                      })}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Print Job Card"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Search className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'account_master': return (
        <div className="space-y-6">
          {renderModuleHeader('Account Master — Ledger & Balances', 
            { label: 'Add Account', onClick: () => setShowNewEntryModal({ type: 'Account', title: 'Add New Account' }) },
            [
              { label: 'Export CSV', onClick: () => handleExport('Account Master'), icon: FileDown },
              { label: 'Reconcile', onClick: () => {}, icon: RefreshCw }
            ],
            'Search accounts...',
            1
          )}
          {renderTable(
            ['Account ID', 'Account Name', 'Type', 'Opening Balance', 'Current Balance', 'Action'],
            [{ id: 'ACC-01', name: 'HDFC Bank', type: 'Bank', opening: 500000, current: 750000 }],
            (a, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{a.id}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-800">{a.name}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{a.type}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{formatCurrency(a.opening)}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{formatCurrency(a.current)}</td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Search className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'sample_management': return (
        <div className="space-y-6">
          {renderModuleHeader('Sample Management — Approvals & Revisions', 
            { label: 'Add Sample', onClick: () => setShowNewEntryModal({ type: 'Sample', title: 'Add New Sample' }) },
            [
              { label: 'Export CSV', onClick: () => handleExport('Sample Management'), icon: FileDown },
              { label: 'Tracking', onClick: () => {}, icon: MapPin }
            ],
            'Search samples...',
            data.sample_tracking.length
          )}
          {renderTable(
            ['Sample ID', 'Design ID', 'Style Name', 'Sample Type', 'Status', 'Approval Date', 'Action'],
            data.sample_tracking,
            (s, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{s.id}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{s.design_id}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-800">Summer Kurti</td>
                <td className="px-4 py-3 text-xs text-slate-500">{s.sample_type}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-bold uppercase tracking-tight">{s.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{s.sent_date}</td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Search className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'returns_rejection': return (
        <div className="space-y-6">
          {renderModuleHeader('Returns & Rejection — Quality Control', 
            { label: 'Add Return', onClick: () => setShowNewEntryModal({ type: 'Return', title: 'Log New Return' }) },
            [
              { label: 'Export CSV', onClick: () => handleExport('Returns & Rejection'), icon: FileDown },
              { label: 'QC Stats', onClick: () => {}, icon: BarChart3 }
            ],
            'Search returns...',
            1
          )}
          {renderTable(
            ['Return ID', 'Batch ID', 'Design ID', 'Reason', 'Qty', 'Status', 'Action'],
            [{ id: 'RET-01', batch: 'LOT-201', design: 'D-101', reason: 'Stitching defect', qty: 5, status: 'Inspected' }],
            (r, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{r.id}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.batch}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.design}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.reason}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{r.qty}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 font-bold uppercase tracking-tight">{r.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Search className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'user_role_mgmt': return (
        <div className="space-y-6">
          {renderModuleHeader('User & Role Management — Permissions', 
            { label: 'Add User', onClick: () => setShowNewEntryModal({ type: 'User', title: 'Add New User' }) },
            [
              { label: 'Export CSV', onClick: () => handleExport('User Management'), icon: FileDown },
              { label: 'Roles', onClick: () => {}, icon: Shield }
            ],
            'Search users...',
            1
          )}
          {renderTable(
            ['User ID', 'Name', 'Role', 'Department', 'Last Login', 'Status', 'Action'],
            [{ id: 'U-01', name: 'Admin User', role: 'Admin', dept: 'IT', login: '2026-04-02', status: 'Active' }],
            (u, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{u.id}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-800">{u.name}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{u.role}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{u.dept}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{u.login}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-bold uppercase tracking-tight">{u.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><SettingsIcon className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'photo_master': return (
        <div className="space-y-6">
          {renderModuleHeader('Photo Master — Product Gallery', 
            { label: 'Upload Photos', onClick: () => {} },
            [{ label: 'Sync Drive', onClick: () => {}, icon: Globe }],
            'Search photos...',
            data.designs.length
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.designs.map((d, i) => (
              <div key={i} className="relative aspect-square bg-slate-900 rounded-xl overflow-hidden group">
                <img 
                  src={d.image || `https://picsum.photos/seed/${d.id}/400/400`} 
                  alt={d.id} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="text-[10px] font-bold text-white">{d.id}</div>
                  <div className="text-[8px] text-slate-300">{d.category}</div>
                </div>
                <button className="absolute top-2 right-2 p-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
      case 'invoice_master': return (
        <div className="space-y-4">
          {renderModuleHeader('Invoice Master — All Billing Records', 
            { label: 'New Invoice', onClick: () => setActiveSection('invoice') },
            [{ label: 'Export CSV', onClick: () => handleExport('Invoice Master'), icon: FileDown }],
            'Search invoices...',
            10
          )}
          {renderTable(
            ['Invoice No', 'Date', 'Party', 'Amount', 'GST', 'Total', 'Status'],
            data.payments.map((p, i) => ({ ...p, inv: `INV-${202600+i}`, gst: p.amount * 0.05, total: p.amount * 1.05 })),
            (r, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{r.inv}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                <td className="px-4 py-3 text-xs text-slate-800 font-medium">{r.party}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{formatCurrency(r.amount)}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{formatCurrency(r.gst)}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{formatCurrency(r.total)}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-emerald-100 text-emerald-600">Finalized</span>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'sales_invoice': return (
        <div className="space-y-4">
          {renderModuleHeader('Sales Invoice Register', 
            { label: 'Create Sales Invoice', onClick: () => setShowNewEntryModal({ type: 'Invoice', title: 'New Sales Invoice' }) },
            [{ label: 'Export CSV', onClick: () => handleExport('Sales Invoices'), icon: FileDown }],
            'Search sales invoices...',
            5
          )}
          {renderTable(
            ['Inv No', 'Date', 'Customer', 'Items', 'Taxable', 'GST', 'Total', 'Status'],
            data.payments.slice(0, 5).map((p, i) => ({ ...p, inv: `SINV-${100+i}`, items: 'Fabric / Saree', taxable: p.amount, gst: p.amount * 0.05, total: p.amount * 1.05 })),
            (r, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{r.inv}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                <td className="px-4 py-3 text-xs text-slate-800 font-medium">{r.party}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.items}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{formatCurrency(r.taxable)}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{formatCurrency(r.gst)}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{formatCurrency(r.total)}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-blue-100 text-blue-600">Sent</span>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'stock_transfer': return (
        <div className="space-y-6">
          {renderModuleHeader('Stock Transfer — Inter-Location', 
            { label: 'Add Transfer', onClick: () => setShowNewEntryModal({ type: 'Stock Transfer', title: 'New Stock Transfer' }) },
            [
              { label: 'Export CSV', onClick: () => handleExport('Stock Transfer'), icon: FileDown },
              { label: 'Locations', onClick: () => {}, icon: MapPin }
            ],
            'Search transfers...',
            1
          )}
          {renderTable(
            ['Transfer ID', 'From Location', 'To Location', 'Item', 'Qty', 'Status', 'Action'],
            [{ id: 'ST-01', from: 'Warehouse A', to: 'Floor 1', item: 'Cotton Silk', qty: 100, status: 'Completed' }],
            (s, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{s.id}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{s.from}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{s.to}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{s.item}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{s.qty}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-bold uppercase tracking-tight">{s.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Search className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'creative_studio': return renderCreativeStudio();
      case 'dyeing_tanks': return renderGenericModule('Dyeing Tanks Status', ['Tank ID', 'Capacity', 'Current Batch', 'Temperature', 'PH Level', 'Status'], (data as any).dyeing_tanks);
      case 'dyeing_orders': return renderGenericModule('Dyeing Program Orders', ['Order ID', 'Fabric', 'Shade', 'Qty', 'Dye Date', 'Status'], (data as any).dyeing_orders);
      case 'chemical_stock': return renderGenericModule('Chemical & Dye Stock', ['Chemical Name', 'Brand', 'Current Stock', 'Min Level', 'Unit', 'Last Restock'], (data as any).chemical_stock);
      case 'colour_qc': return renderGenericModule('Colour Lab / QC', ['Sample ID', 'Shade Name', 'Recipe', 'Delta E', 'Match Status', 'Tester'], (data as any).colour_qc);
      case 'dyeing_job_card': return renderGenericModule('Dyeing Job Cards', ['Card ID', 'Batch ID', 'Tank No', 'Fabric', 'Shade', 'Start Time', 'Status'], (data as any).dyeing_job_card);
      case 'loom_status': return renderGenericModule('Loom Machine Status', ['Loom ID', 'Type', 'Design', 'RPM', 'Efficiency', 'Current Pick', 'Status'], (data as any).loom_status);
      case 'weaving_orders': return renderGenericModule('Weaving Orders Register', ['Order ID', 'Design', 'Warp', 'Weft', 'Required Qty', 'Woven Qty', 'Status'], (data as any).weaving_orders);
      case 'yarn_stock': return renderGenericModule('Yarn / Beam Stock', ['Yarn Type', 'Count', 'Color', 'Current Qty', 'Unit', 'Location'], (data as any).yarn_stock);
      case 'sewing_line': return renderGenericModule('Sewing Line Monitoring', ['Line ID', 'Supervisor', 'Current Design', 'Target/Hr', 'Actual/Hr', 'Efficiency', 'Status'], (data as any).sewing_line);
      case 'operator_perf': return renderGenericModule('Operator Performance', ['Operator ID', 'Name', 'Operation', 'Total Output', 'Accepted', 'Rejected', 'Efficiency'], (data as any).operator_perf);
      case 'op_breakdown': return renderGenericModule('Operations Breakdown (OB)', ['Style ID', 'Operation Name', 'Machine Type', 'SAM', 'Grade', 'Attachments'], (data as any).op_breakdown);
      case 'sam_efficiency': return renderGenericModule('SAM & Efficiency Tracking', ['Batch ID', 'Product', 'SAM Value', 'Output', 'Man Hours', 'Efficiency%', 'GSD Score'], (data as any).sam_efficiency);
      case 'alteration_rework': return renderGenericModule('Alteration & Rework Log', ['Date', 'Line', 'Defect Type', 'Qty', 'Corrected', 'Scrap', 'Supervisor'], (data as any).alteration_rework);
      case 'cutting_table': return renderGenericModule('Cutting Table Status', ['Table ID', 'Current Layer', 'Fabric', 'Style', 'Ply Count', 'Status'], (data as any).cutting_table);
      case 'lay_planning': return renderGenericModule('Lay Planning & Markers', ['Lay ID', 'Marker ID', 'Ratio', 'Lay Length', 'Total Plys', 'Efficiency%', 'Savings'], (data as any).lay_planning);
      case 'bundle_mgmt': return renderGenericModule('Bundle Management', ['Bundle ID', 'Lot NO', 'Size', 'Qty', 'Current Stage', 'Last Station', 'Tag Status'], (data as any).bundle_mgmt);
      case 'cutting_qc': return renderGenericModule('Cutting Quality Audit', ['Audit ID', 'Lay ID', 'Checker', 'Nicks/Shade', 'Panel Match', 'Score', 'Status'], (data as any).cutting_qc);
      case 'cutter_report': return renderGenericModule('Cutter Daily Output', ['Cutter Name', 'Shift', 'Total Layers', 'Total Panels', 'Avg Efficiency', 'Waste%'], (data as any).cutter_report);
      case 'handwork_card': return renderGenericModule('Handwork Job Cards', ['Card ID', 'Karigar', 'Work Type', 'Design', 'Rate/Pc', 'Target', 'Status'], (data as any).handwork_card);
      case 'embroidery_card': return renderGenericModule('Embroidery Program Cards', ['Prog ID', 'Machine', 'Design', 'Stitch Count', 'No of Heads', 'Runtime', 'Status'], (data as any).embroidery_card);
      case 'fabric_return': return renderGenericModule('Fabric Return Register', ['Return ID', 'Original Challan', 'Party', 'Item', 'Qty Returned', 'Reason', 'Status'], (data as any).fabric_return);
      case 'fabric_waste': return renderGenericModule('Fabric Waste Tracking', ['Date', 'Dept', 'Waste Type', 'Weight', 'Unit', 'Disposal Status'], (data as any).fabric_waste);
      case 'gst_tax': return renderGenericModule('GST & Tax Records', ['Invoice No', 'Date', 'Taxable Amt', 'CGST', 'SGST', 'IGST', 'Total Tax', 'Filing Status'], (data as any).gst_tax);
      case 'payment_receipt': return renderGenericModule('Payment Receipts', ['Receipt ID', 'Date', 'Customer', 'Mode', 'Amount', 'Reference', 'Status'], (data as any).payment_receipt);
      case 'debit_credit_note': return renderGenericModule('Debit / Credit Notes', ['Note ID', 'Type', 'Party', 'Reason', 'Amount', 'Against Inv', 'Date'], (data as any).debit_credit_note);
      case 'jobber_ledger': return renderGenericModule('Jobber Service Ledger', ['Jobber Name', 'Service', 'Total Work', 'Rate', 'Total Bill', 'Paid', 'Balance'], (data as any).jobber_ledger);
      case 'dispatch_register': return renderGenericModule('Dispatch Register', ['Dispatch ID', 'Challan ID', 'Consignee', 'Vehicle No', 'Qty', 'Driver', 'Status'], (data as any).dispatch_register);
      case 'packing_list': return renderGenericModule('Packing List Management', ['Pack ID', 'Order ID', 'Total Cartons', 'Net Weight', 'Gross Weight', 'Ready Date'], (data as any).packing_list);
      case 'shipping_docs': return renderGenericModule('Shipping Documents', ['Doc ID', 'Type', 'Consignee', 'Date', 'Expiry', 'File Link', 'Status'], (data as any).shipping_docs);

      case 'cutting_layer_calc': return (
        <div className="space-y-6">
          {renderModuleHeader('Cutting Layer Calculator — Optimization', 
            { label: 'Add Calculation', onClick: () => setShowNewEntryModal({ type: 'Costing', title: 'New Layer Calculation' }) },
            [
              { label: 'Export CSV', onClick: () => handleExport('Cutting Layer Calc'), icon: FileDown },
              { label: 'History', onClick: () => {}, icon: RefreshCw }
            ],
            'Search calculations...',
            1
          )}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Calculator className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800">Layer Optimization Engine</h4>
                <p className="text-sm text-slate-500">Calculate optimal layers for maximum fabric efficiency</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Total Quantity</label>
                <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. 1200" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Max Layers</label>
                <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. 50" />
              </div>
            </div>
            <button className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all shadow-lg shadow-slate-800/20">Calculate Optimal Layers</button>
          </div>
        </div>
      );
      case 'production': return (
        <div className="space-y-6">
          {renderModuleHeader('Department-wise Production — Pipeline Status', 
            { label: 'Add Entry', onClick: () => setShowNewEntryModal({ type: 'Batch', title: 'Add Production Entry' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Production Summary', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Production Summary' },
              { label: 'Export Summary', onClick: () => handleExport('Production Summary', 'csv'), icon: FileDown },
              { label: 'Live Tracking', onClick: () => setActiveSection('tracking'), icon: MapPin }
            ],
            'Search production...',
            productionData.length
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {productionData.map((dept, i) => {
                const pct = Math.round((dept.received / dept.issued) * 100) || 0;
                return (
                  <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-bold text-slate-800">{dept.full}</div>
                      <div className={cn("text-xs font-bold", pct > 90 ? "text-emerald-500" : pct > 70 ? "text-amber-500" : "text-rose-500")}>{pct}%</div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Issued: {dept.issued}</span>
                      <span>Recd: {dept.received}</span>
                      <span className="text-rose-500 font-bold">Pend: {dept.pending}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
      );
      case 'fabric_issue': return renderFabricIssue();
      case 'inventory': return (
        <div className="space-y-6">
          {renderModuleHeader('Inventory — Fabric & Finished Goods', 
            { label: 'Stock Audit', onClick: () => setShowNewEntryModal({ type: 'Stock Audit', title: 'New Stock Audit' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Inventory', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Inventory' },
              { label: 'Scan Roll', onClick: () => handleStartScan('Fabric Roll'), icon: Scan },
              { label: 'Export CSV', onClick: () => handleExport('Inventory'), icon: FileDown },
              { label: 'Smart Alerts', onClick: () => setActiveSection('smart_inventory'), icon: AlertTriangle }
            ],
            'Search inventory...',
            data.fabric_purchase.length + data.fg_stock.length
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-blue-600" /> Fabric Stock
              </h4>
              {renderTable(['Item', 'Color', 'Stock'], data.fabric_purchase.slice(0, 5), (f, i) => (
                <tr key={i}><td className="px-4 py-2 text-xs">{f.item}</td><td className="px-4 py-2 text-xs">{f.color}</td><td className="px-4 py-2 text-xs font-bold">{f.meter}m</td></tr>
              ))}
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" /> Finished Goods
              </h4>
              {renderTable(['Design', 'Color', 'Qty'], data.fg_stock.slice(0, 5), (f, i) => (
                <tr key={i}><td className="px-4 py-2 text-xs">{f.design}</td><td className="px-4 py-2 text-xs">{f.color}</td><td className="px-4 py-2 text-xs font-bold">{f.balance}</td></tr>
              ))}
            </div>
          </div>
        </div>
      );
      case 'challan': return (
        <div className="space-y-6">
          {renderModuleHeader('Challan / Dispatch Register — Logistics', 
            { label: 'Add Challan', onClick: () => setShowNewEntryModal({ type: 'Challan', title: 'Create New Challan' }) },
            [
              { label: 'Export CSV', onClick: () => handleExport('Challan Register'), icon: FileDown },
              { label: 'Tracking', onClick: () => setActiveSection('tracking'), icon: Truck }
            ],
            'Search challans...',
            data.challan.length
          )}
          {renderTable(
            ['Date', 'Challan No', 'Customer', 'Design', 'Qty', 'Total', 'Status', 'Action'],
            data.challan,
            (r: any, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-[10px] text-slate-500">{r.date}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{r.challan_no}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{r.customer}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{r.design}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{r.qty}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{formatCurrency(r.amount)}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight", 
                    r.status === 'Dispatched' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                  )}>{r.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => window.print()}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'market_running': return (
        <div className="space-y-6">
          {renderModuleHeader('Market Running — Hot Designs & Trends', 
            { label: 'Add Trend', onClick: () => setShowNewEntryModal({ type: 'Trend', title: 'Add New Market Trend' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Market Trends', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Market Trends' },
              { label: 'Export CSV', onClick: () => handleExport('Market Trends'), icon: FileDown },
              { label: 'AI Forecast', onClick: () => {}, icon: Sparkles }
            ],
            'Search trends...',
            3
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { rank: '🥇 1', design: 'Anarkali D-501', sales: '1,240 pcs', trend: 'Rising', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
              { rank: '🥈 2', design: 'Palazzo D-503', sales: '890 pcs', trend: 'Hot', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
              { rank: '🥉 3', design: 'Sharara D-505', sales: '580 pcs', trend: 'Rising', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            ].map((item, i) => (
              <div key={i} className={cn("p-6 rounded-2xl border shadow-sm", item.bg, item.border)}>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.rank}</div>
                <div className="text-lg font-bold text-slate-800 mb-1">{item.design}</div>
                <div className={cn("text-2xl font-black tracking-tight", item.color)}>{item.sales}</div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 mt-2">
                  <TrendingUp className="w-3 h-3" /> {item.trend} Trend
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'labels': return (
        <div className="space-y-6">
          {renderModuleHeader('Print Batch Labels (QR/RFID)', 
            { label: 'Print All', onClick: () => window.print() },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Labels', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Labels' },
              { label: 'Export CSV', onClick: () => handleExport('Labels'), icon: FileDown },
              { label: 'Label Settings', onClick: () => {}, icon: SettingsIcon }
            ],
            'Search batches...',
            data.batches.length
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.batches.slice(0, 8).map((b, i) => (
              <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-3">
                <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-200">
                  <QrCode className="w-12 h-12 text-slate-400" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-800">{b.lot_id}</div>
                  <div className="text-[10px] text-slate-500">{b.style}</div>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="w-full py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded-lg hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-3 h-3" /> Print Label
                </button>
              </div>
            ))}
          </div>
        </div>
      );
      case 'client_portal': return (
        <div className="space-y-6">
          {renderModuleHeader('B2B Client Portal — Order Monitoring', 
            { label: 'Invite Client', onClick: () => {} },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Client Portal', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Client Portal' },
              { label: 'Portal Settings', onClick: () => {}, icon: SettingsIcon }
            ],
            'Search client...',
            data.customers.length
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.customers.slice(0, 3).map((c, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {c.name.charAt(0)}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-bold">Active</span>
                </div>
                <h4 className="font-bold text-slate-800">{c.name}</h4>
                <p className="text-xs text-slate-500 mb-4">{c.city}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Recent Order</span>
                    <span className="text-slate-800 font-medium">#SO-2401</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Order Status</span>
                    <span className="text-blue-600 font-bold">In Production</span>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-100 transition-all">View Portal</button>
              </div>
            ))}
          </div>
        </div>
      );
      case 'finance': return (
        <div className="space-y-6">
          {renderModuleHeader('Finance & Accounts — Overview', 
            { label: 'Add Entry', onClick: () => setShowNewEntryModal({ type: 'Payment', title: 'New Financial Entry' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Finance Overview', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Finance Overview' },
              { label: 'Financial Report', onClick: () => window.print(), icon: FileDown },
              { label: 'Payments', onClick: () => setActiveSection('payments'), icon: CreditCard }
            ],
            'Search finance...',
            1
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" /> Recent Payments
              </h4>
              {renderTable(['Date', 'Party', 'Amount'], data.payments.slice(0, 5), (p, i) => (
                <tr key={i}><td className="px-4 py-2 text-xs">{p.date}</td><td className="px-4 py-2 text-xs">{p.party}</td><td className="px-4 py-2 text-xs font-bold text-emerald-600">{formatCurrency(p.amount)}</td></tr>
              ))}
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-600" /> AR Aging
              </h4>
              {renderTable(['Party', 'Amount', 'Age'], data.ar_aging.slice(0, 5), (a, i) => (
                <tr key={i}><td className="px-4 py-2 text-xs">{a.party}</td><td className="px-4 py-2 text-xs font-bold">{formatCurrency(a.amount)}</td><td className="px-4 py-2 text-xs text-rose-600">{a.age} days</td></tr>
              ))}
            </div>
          </div>
        </div>
      );
      case 'tracking': return (
        <div className="space-y-6">
          {renderModuleHeader('Live RFID / QR Bundle Tracking', 
            { label: 'Scan QR Code', onClick: () => handleStartScan('Bundle') },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Tracking Report', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Tracking Report' },
              { label: 'Export Report', onClick: () => handleExport('Tracking Report'), icon: FileDown },
              { label: 'Lot Control', onClick: () => setActiveSection('lot_control_tower'), icon: LayoutDashboard }
            ],
            'Search bundle or lot...',
            data.batches.length
          )}
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2 no-print">
            <div className="bg-white p-4 rounded-xl border-l-4 border-blue-600 shadow-sm min-w-[150px] flex-1">
              <div className="text-2xl font-bold text-slate-800">42</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Total Orders</div>
            </div>
            <div className="bg-white p-4 rounded-xl border-l-4 border-amber-500 shadow-sm min-w-[150px] flex-1">
              <div className="text-2xl font-bold text-amber-600">14</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">In Process</div>
            </div>
            <div className="bg-white p-4 rounded-xl border-l-4 border-sky-600 shadow-sm min-w-[150px] flex-1">
              <div className="text-2xl font-bold text-sky-600">8</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Ready to Dispatch</div>
            </div>
            <div className="bg-white p-4 rounded-xl border-l-4 border-emerald-500 shadow-sm min-w-[150px] flex-1">
              <div className="text-2xl font-bold text-emerald-600">20</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Delivered</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            {renderTable(
              ['Order ID', 'Customer', 'Items', 'Order Date', 'Delivery Date', 'Amount', 'Status', 'Action'],
              data.batches.map((b, i) => ({
                id: `#SO-240${i+1}`,
                customer: `Customer ${i+1}`,
                items: `${b.style} ${b.qty}pcs`,
                orderDate: '01 Apr',
                deliveryDate: b.delivery,
                amount: b.qty * 450,
                status: b.stage === 'QC & Pressing' ? 'Ready' : b.stage === 'Dispatched' ? 'Delivered' : 'In Process'
              })),
              (r, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs font-bold text-blue-600">{r.id}</td>
                  <td className="px-4 py-3 text-xs text-slate-800 font-medium">{r.customer}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.items}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.orderDate}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.deliveryDate}</td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-800">{formatCurrency(r.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                      r.status === 'Delivered' ? "bg-emerald-100 text-emerald-600" : 
                      r.status === 'Ready' ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                    )}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-[10px] font-bold text-blue-600 hover:underline">Track</button>
                  </td>
                </tr>
              )
            )}
          </div>
        </div>
      );
      case 'batches': return (
        <div className="space-y-4">
          {renderModuleHeader('Batch / Lot Management', 
            { label: 'Add Batch', onClick: () => setShowNewEntryModal({ type: 'Batch', title: 'Create New Batch' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Batch Management', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Batch Management' },
              { label: 'Export CSV', onClick: () => handleExport('Batch Management', 'csv'), icon: FileDown }
            ],
            'Search batches...',
            data.batches.length
          )}
          {renderTable(
            ['Lot ID', 'Style', 'Customer', 'Color', 'Qty', 'Stage', 'AI Forecast', 'Priority', 'Action'],
            data.batches,
            (b: Batch, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3">
                  <button 
                    onClick={() => setSelectedDetail({ type: 'Lot', id: b.lot_id, data: b })}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    {b.lot_id}
                  </button>
                </td>
                <td className="px-4 py-3 text-xs font-medium text-slate-800">{b.style}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{b.customer}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{b.color}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{b.qty}</td>
                <td className="px-4 py-3 text-xs font-medium text-amber-600">{b.stage}</td>
                <td className="px-4 py-3">
                  {batchForecasts[b.lot_id] ? (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {batchForecasts[b.lot_id]}
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleBatchForecast(b.lot_id, b.stage, b.qty)}
                      disabled={isForecastingBatch === b.lot_id}
                      className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-all disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3" />
                      {isForecastingBatch === b.lot_id ? '...' : 'Forecast'}
                    </button>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    b.priority === 'Urgent' ? "bg-rose-100 text-rose-600" : b.priority === 'High' ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"
                  )}>{b.priority}</span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button 
                    onClick={() => setSelectedDetail({ type: 'Lot', id: b.lot_id, data: b })}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="View Details"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => {
                      setActiveSection('jobs');
                      setJobSubtab('master');
                    }}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                    title="Go to Job Sheets"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'customers': return (
        <div className="space-y-4">
          {renderModuleHeader('Customer Master', 
            { label: 'Add Customer', onClick: () => setShowNewEntryModal({ type: 'Customer', title: 'Add New Customer' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Customer Master', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Customer Master' },
              { label: 'Export CSV', onClick: () => handleExport('Customer Master', 'csv'), icon: FileDown }
            ],
            'Search customers...',
            data.customers.length
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.customers.map((c, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-sm font-bold text-slate-800">{c.name}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">{c.type}</div>
                  </div>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">{c.city}</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Mobile</span>
                    <span className="text-slate-600 font-medium">{c.mobile}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">GSTIN</span>
                    <span className="text-slate-600 font-mono">{c.gstin}</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[8px] text-slate-400 uppercase tracking-widest">Lifetime Value</div>
                    <div className="text-xs font-bold text-emerald-600">{formatCurrency(c.lifetime_value || 0)}</div>
                  </div>
                  <div>
                    <div className="text-[8px] text-slate-400 uppercase tracking-widest">Outstanding</div>
                    <div className="text-xs font-bold text-rose-600">{formatCurrency(c.pending_amt || 0)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'fabric': return (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { id: 'purchase', label: '📥 Purchase', icon: Inbox },
              { id: 'stock', label: '🧶 Stock', icon: Scissors },
              { id: 'issue', label: '📤 Issue Log', icon: Truck },
              { id: 'market', label: '🔥 Market Running', icon: Sparkles },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFabricSubtab(tab.id as any)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                  fabricSubtab === tab.id 
                    ? "bg-slate-900 text-white border-slate-900" 
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {fabricSubtab === 'purchase' && (
            <div className="space-y-4">
              {renderModuleHeader('Fabric Purchase Register', 
                { label: 'Add GRN', onClick: () => setShowNewEntryModal({ type: 'GRN', title: 'New Fabric GRN Entry' }) },
                [
                  { label: 'Sync Google Sheets', onClick: () => handleExport('Fabric Purchase Register', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Fabric Purchase Register' },
                  { label: 'Export CSV', onClick: () => handleExport('Fabric Purchase Register', 'csv'), icon: FileDown },
                  { label: 'Forecast Report', onClick: () => setActiveSection('material_forecasting'), icon: TrendingUp }
                ],
                'Search purchases...',
                data.fabric_purchase.length
              )}
              {renderTable(
                ['Date', 'Challan', 'Party', 'Item', 'Color', 'Meter', 'Rate', 'Amount', 'Status'],
                data.fabric_purchase,
                (f: FabricPurchase, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500">{f.date}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => setSelectedDetail({ type: 'Fabric Challan', id: f.challan, data: f })}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        {f.challan}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-800">{f.party}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{f.item}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{f.color}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-800">{f.meter}m</td>
                    <td className="px-4 py-3 text-xs text-slate-500">₹{f.rate}</td>
                    <td className="px-4 py-3 text-xs font-bold text-amber-600">{formatCurrency(f.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                        f.status === 'Received' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                      )}>{f.status}</span>
                    </td>
                  </tr>
                )
              )}
            </div>
          )}

          {fabricSubtab === 'stock' && (
            <div className="space-y-4">
              {renderModuleHeader('Fabric Stock Register', 
                { label: 'Stock Audit', onClick: () => setShowNewEntryModal({ type: 'Stock Audit', title: 'Fabric Stock Audit' }) },
                [
                  { label: 'Sync Google Sheets', onClick: () => handleExport('Fabric Stock Register', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Fabric Stock Register' },
                  { label: 'Export CSV', onClick: () => handleExport('Fabric Stock Register'), icon: FileDown },
                  { label: 'Inventory Center', onClick: () => setActiveSection('inventory'), icon: Package }
                ],
                'Search in stock...',
                data.fabric_purchase.length
              )}
              {renderTable(
                ['Lot No', 'Fabric Name', 'Color', 'Panna', 'Received', 'Used', 'Balance', 'Rate', 'Value'],
                data.fabric_purchase.map(f => ({ ...f, used: Math.floor(f.meter * 0.8), balance: Math.floor(f.meter * 0.2), panna: 44 })),
                (s, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-bold text-blue-600">{s.challan}</td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-800">{s.item}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{s.color}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{s.panna}"</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{s.meter}m</td>
                    <td className="px-4 py-3 text-xs text-rose-500">{s.used}m</td>
                    <td className="px-4 py-3 text-xs font-bold text-emerald-600">{s.balance}m</td>
                    <td className="px-4 py-3 text-xs text-slate-500">₹{s.rate}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-800">{formatCurrency(s.balance * s.rate)}</td>
                  </tr>
                )
              )}
            </div>
          )}

          {fabricSubtab === 'issue' && (
            <div className="space-y-4">
              {renderModuleHeader('Fabric Issue Log', 
                { label: 'Add Issue', onClick: () => setShowNewEntryModal({ type: 'Fabric Issue', title: 'New Fabric Issue Entry' }) },
                [
                  { label: 'Sync Google Sheets', onClick: () => handleExport('Fabric Issue Log', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Fabric Issue Log' },
                  { label: 'Export CSV', onClick: () => handleExport('Fabric Issue Log'), icon: FileDown },
                  { label: 'Export Log', onClick: () => handleExport('Fabric Issue Log'), icon: Download }
                ],
                'Search in issue log...',
                3
              )}
              {renderTable(
                ['Date', 'Lot No', 'Design ID', 'Fabric', 'Dept', 'Karigar', 'Qty Issued'],
                data.fabric_purchase.slice(0, 3).map((f, i) => ({ ...f, lot: `LOT-00${i+1}`, dept: 'Cutting', karigar: 'Mohan' })),
                (fi, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500">{fi.date}</td>
                    <td className="px-4 py-3 text-xs font-bold text-blue-600">{fi.lot}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">KI-D00{i+1}</td>
                    <td className="px-4 py-3 text-xs text-slate-800">{fi.item}</td>
                    <td className="px-4 py-3 text-xs text-blue-500 font-medium">{fi.dept}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{fi.karigar}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-800">{fi.meter * 0.5}m</td>
                  </tr>
                )
              )}
            </div>
          )}

          {fabricSubtab === 'market' && (
            <div className="space-y-4">
              {renderModuleHeader('Market Running Fabrics — High Demand Trends', 
                { label: 'Add Trend', onClick: () => setShowNewEntryModal({ type: 'Trend', title: 'Add Market Fabric Trend' }) },
                [
                  { label: 'Sync Google Sheets', onClick: () => handleExport('Market Fabrics', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Market Fabrics' },
                  { label: 'Export CSV', onClick: () => handleExport('Market Fabrics'), icon: FileDown },
                  { label: 'AI Insights', onClick: () => {}, icon: Sparkles }
                ],
                'Search in market fabrics...',
                data.fabric_purchase.filter(f => f.market_running).length
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.fabric_purchase.filter(f => f.market_running).map((f, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{f.item}</div>
                        <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{f.party}</div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight">Running</span>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: f.color.toLowerCase().includes('printed') ? '#f8fafc' : f.color.toLowerCase() }} />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest">Color / Shade</div>
                        <div className="text-xs font-bold text-slate-700">{f.color}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                      <div>
                        <div className="text-[8px] text-slate-400 uppercase tracking-widest">Avg Rate</div>
                        <div className="text-xs font-bold text-slate-800">₹{f.rate}/m</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-slate-400 uppercase tracking-widest">Stock Avail.</div>
                        <div className="text-xs font-bold text-blue-600">{f.meter}m</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {renderTable(
                ['Fabric Name', 'Color', 'Supplier', 'Current Rate', 'Status'],
                data.fabric_purchase.filter(f => f.market_running),
                (f, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-bold text-slate-800">{f.item}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: f.color.toLowerCase().includes('printed') ? '#f8fafc' : f.color.toLowerCase() }} />
                        <span className="text-xs text-slate-600">{f.color}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{f.party}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-800">₹{f.rate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        RUNNING
                      </div>
                    </td>
                  </tr>
                )
              )}
            </div>
          )}
        </div>
      );
      case 'grn': {
        const filteredGrn = data.grn.filter(r => {
          const matchesSupplier = grnFilterSupplier === '' || r.supplier === grnFilterSupplier;
          const matchesStatus = grnFilterStatus === '' || r.status === grnFilterStatus;
          const matchesSearch = searchQuery === '' || 
            r.grn_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.item.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesSupplier && matchesStatus && matchesSearch;
        });

        const suppliers = Array.from(new Set(data.grn.map(r => r.supplier)));
        const statuses = Array.from(new Set(data.grn.map(r => r.status)));

        return (
          <div className="space-y-4">
            {renderModuleHeader('GRN Inward Register', 
              { label: 'Add GRN', onClick: () => setShowNewEntryModal({ type: 'GRN', title: 'Create New GRN' }) },
              [
                { label: 'Sync Google Sheets', onClick: () => handleExport('GRN Register', 'google'), icon: Globe, disabled: isExportingToGoogle === 'GRN Register' },
                { label: 'Scan Invoice', onClick: () => handleStartScan('Invoice'), icon: Scan },
                { label: 'Export CSV', onClick: () => handleExport('GRN Register'), icon: FileDown },
                { label: 'Filter', onClick: () => {}, icon: Filter }
              ],
              'Search in GRNs...',
              filteredGrn.length
            )}
            <div className="flex gap-2 mb-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={grnFilterSupplier}
                  onChange={(e) => setGrnFilterSupplier(e.target.value)}
                >
                  <option value="">All Suppliers</option>
                  {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <select 
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={grnFilterStatus}
                onChange={(e) => setGrnFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {renderTable(
              ['GRN No', 'Date', 'Supplier', 'Item', 'Challan', 'Qty', 'Rate', 'Amount', 'Status'],
              filteredGrn,
              (r: GRN, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => setSelectedDetail({ type: 'GRN', id: r.grn_no, data: r })}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      {r.grn_no}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                  <td className="px-4 py-3 text-xs text-slate-800">{r.supplier}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.item}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.challan}</td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-800">{r.qty} {r.unit}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">₹{r.rate}</td>
                  <td className="px-4 py-3 text-xs font-bold text-amber-600">{formatCurrency(r.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                      r.status === 'Received' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                    )}>{r.status}</span>
                  </td>
                </tr>
              )
            )}
          </div>
        );
      }
      case 'fgstock': {
        const filteredFg = data.fg_stock.filter(r => {
          const matchesStatus = fgFilterStatus === '' || r.status === fgFilterStatus;
          const matchesSearch = searchQuery === '' || 
            r.fg_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.design.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesStatus && matchesSearch;
        });

        const statuses = Array.from(new Set(data.fg_stock.map(r => r.status)));

        return (
          <div className="space-y-4">
            {renderModuleHeader('Finished Goods Stock', 
              { label: 'Add Stock', onClick: () => setShowNewEntryModal({ type: 'FG Stock', title: 'Add Finished Goods Stock' }) },
              [
                { label: 'Export CSV', onClick: () => handleExport('FG Stock'), icon: FileDown },
                { label: 'Inventory Center', onClick: () => setActiveSection('inventory'), icon: Package }
              ],
              'Search in stock...',
              filteredFg.length
            )}
            <div className="flex gap-2 mb-4">
              <select 
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fgFilterStatus}
                onChange={(e) => setFgFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {renderTable(
              ['FG ID', 'Design', 'Color', 'Sizes', 'Produced', 'Dispatched', 'Balance', 'Status'],
              filteredFg,
              (r: FGStock, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => setSelectedDetail({ type: 'FG ID', id: r.fg_id, data: r })}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      {r.fg_id}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">{r.design}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.color}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.sizes}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.produced}</td>
                  <td className="px-4 py-3 text-xs text-rose-500">{r.dispatched}</td>
                  <td className="px-4 py-3 text-xs font-bold text-emerald-600">{r.balance}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                      r.status === 'In Stock' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                    )}>{r.status}</span>
                  </td>
                </tr>
              )
            )}
          </div>
        );
      }
      case 'machines': {
        const filteredMachines = data.machines.filter(r => {
          const matchesStatus = machineFilterStatus === '' || r.status === machineFilterStatus;
          const matchesSearch = searchQuery === '' || 
            r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.operator.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesStatus && matchesSearch;
        });

        const statuses = Array.from(new Set(data.machines.map(r => r.status)));

        return (
          <div className="space-y-4">
            {renderModuleHeader('Machine Efficiency Tracker', 
              { label: 'Add Machine', onClick: () => setShowNewEntryModal({ type: 'Machine', title: 'Register New Machine' }) },
              [
                { label: 'Export CSV', onClick: () => handleExport('Machine Efficiency'), icon: FileDown },
                { label: 'Maintenance Log', onClick: () => {}, icon: SettingsIcon }
              ],
              'Search machines...',
              filteredMachines.length
            )}
            <div className="flex gap-2 mb-4">
              <select 
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={machineFilterStatus}
                onChange={(e) => setMachineFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {renderTable(
              ['ID', 'Type', 'Operator', 'Output', 'Capacity', 'Efficiency', 'Status'],
              filteredMachines,
              (r: Machine, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => setSelectedDetail({ type: 'Machine', id: r.id, data: r })}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      {r.id}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.type}</td>
                  <td className="px-4 py-3 text-xs text-slate-800">{r.operator}</td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-800">{r.output} pcs</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.capacity}/day</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn("h-full", r.efficiency > 90 ? "bg-emerald-500" : r.efficiency > 70 ? "bg-amber-500" : "bg-rose-500")} style={{ width: `${r.efficiency}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{r.efficiency}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                      r.status === 'Active' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                    )}>{r.status}</span>
                  </td>
                </tr>
              )
            )}
          </div>
        );
      }
      case 'karigar': return (
        <div className="space-y-4">
          {renderModuleHeader('Karigar Master', 
            { label: 'Add Karigar', onClick: () => setShowNewEntryModal({ type: 'Karigar', title: 'Add New Karigar' }) },
            [
              { label: 'Scan ID', onClick: () => handleStartScan('Karigar ID'), icon: Scan },
              { label: 'Export CSV', onClick: () => handleExport('Karigar List'), icon: FileDown },
              { label: 'Print Job Card', onClick: () => setShowKarigarCard({}), icon: Printer },
              { label: 'Sync Google Sheets', onClick: () => handleExport('Karigar Ledger', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Karigar Ledger' },
              { label: 'Ledger Entry', onClick: () => {}, icon: Plus }
            ],
            'Search karigars...',
            data.karigar_ledger.length
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.karigar_ledger.slice(0, 4).map((k, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-sm font-bold text-slate-800">{k.name}</div>
                    <button className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold hover:bg-emerald-50 px-2 py-1 rounded transition-colors">
                      <CreditCard className="w-3 h-3" /> Pay
                    </button>
                  </div>
                <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-3">{k.dept}</div>
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                  <div>
                    <div className="text-[8px] text-slate-400 uppercase tracking-widest">Earned</div>
                    <div className="text-xs font-bold text-emerald-600">{formatCurrency(k.credit)}</div>
                  </div>
                  <div>
                    <div className="text-[8px] text-slate-400 uppercase tracking-widest">Balance</div>
                    <div className="text-xs font-bold text-rose-600">{formatCurrency(k.balance)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {renderTable(
            ['Date', 'Karigar', 'Dept', 'Work', 'Credit', 'Debit', 'Balance', 'Action'],
            data.karigar_ledger,
            (r: KarigarLedger, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{r.name}</td>
                <td className="px-4 py-3 text-xs text-blue-500 font-medium">{r.dept}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.work}</td>
                <td className="px-4 py-3 text-xs font-bold text-emerald-600">{r.credit > 0 ? formatCurrency(r.credit) : '—'}</td>
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{r.debit > 0 ? formatCurrency(r.debit) : '—'}</td>
                <td className="px-4 py-3 text-xs font-bold text-rose-600">{formatCurrency(r.balance)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowKarigarCard({
                        karigar_name: r.name,
                        department: r.dept,
                      })}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Print Job Card"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'payments': {
        const filteredPayments = data.payments.filter(r => {
          const matchesStatus = paymentFilterStatus === '' || r.status === paymentFilterStatus;
          const matchesSearch = searchQuery === '' || 
            r.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.invoice_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.utr.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesStatus && matchesSearch;
        });

        const statuses = Array.from(new Set(data.payments.map(r => r.status)));

        return (
          <div className="space-y-4">
            {renderModuleHeader('Payment Register', 
              { label: 'Add Payment', onClick: () => setShowNewEntryModal({ type: 'Payment', title: 'Record New Payment' }) },
              [
                { label: 'Export CSV', onClick: () => handleExport('Payment Register'), icon: FileDown },
                { label: 'Payment Settings', onClick: () => {}, icon: SettingsIcon }
              ],
              'Search payments...',
              filteredPayments.length
            )}
            <div className="flex gap-2 mb-4">
              <select 
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={paymentFilterStatus}
                onChange={(e) => setPaymentFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {renderTable(
              ['ID', 'Date', 'Party', 'Invoice', 'Amount', 'Mode', 'UTR', 'Status'],
              filteredPayments,
              (r: Payment, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => setSelectedDetail({ type: 'Payment', id: r.id, data: r })}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      {r.id}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">{r.party}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.invoice_no}</td>
                  <td className="px-4 py-3 text-xs font-bold text-emerald-600">{formatCurrency(r.amount)}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.mode}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{r.utr}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                      r.status === 'Received' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                    )}>{r.status}</span>
                  </td>
                </tr>
              )
            )}
          </div>
        );
      }
      case 'araging': {
        const filteredAr = data.ar_aging.filter(r => {
          const matchesParty = arFilterParty === '' || r.party === arFilterParty;
          const matchesSearch = searchQuery === '' || 
            r.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.invoice_no.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesParty && matchesSearch;
        });

        const parties = Array.from(new Set(data.ar_aging.map(r => r.party)));

        return (
          <div className="space-y-4">
            {renderModuleHeader('AR Aging Report', 
              { label: 'Export Report', onClick: () => {} },
              [
                { label: 'Export CSV', onClick: () => handleExport('AR Aging Report'), icon: FileDown },
                { label: 'Aging Settings', onClick: () => {}, icon: SettingsIcon }
              ],
              'Search party...',
              filteredAr.length
            )}
            <div className="flex gap-2 mb-4">
              <select 
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={arFilterParty}
                onChange={(e) => setArFilterParty(e.target.value)}
              >
                <option value="">All Parties</option>
                {parties.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            {renderTable(
              ['Party', 'Invoice', 'Date', 'Total', 'Paid', 'Outstanding', 'Age'],
              filteredAr,
              (r: ARAging, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs font-bold text-slate-800">{r.party}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.invoice_no}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{formatCurrency(r.total)}</td>
                  <td className="px-4 py-3 text-xs text-emerald-600">{formatCurrency(r.paid)}</td>
                  <td className="px-4 py-3 text-xs font-bold text-rose-600">{formatCurrency(r.outstanding)}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold",
                      r.age > 60 ? "bg-rose-100 text-rose-600" : r.age > 30 ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                    )}>{r.age} days</span>
                  </td>
                </tr>
              )
            )}
          </div>
        );
      }
      case 'ai_studio': return (
        <div className="space-y-6">
          {renderCreativeStudio()}
        </div>
      );
      case 'job_card_entry': return renderJobCardEntry();
      case 'jobs': {
        const filteredJobSheets = data.job_sheets.filter(s => {
          const stage = s.current_stage.toLowerCase();
          const sub = jobSubtab.toLowerCase();
          let matchesSubtab = false;
          if (sub === 'master') matchesSubtab = true;
          else if (sub === 'embr') matchesSubtab = stage === 'embroidery';
          else if (sub === 'cutt') matchesSubtab = stage === 'cutting';
          else if (sub === 'stitch') matchesSubtab = stage === 'stitching';
          else if (sub === 'press') matchesSubtab = stage === 'qc & pressing' || stage === 'qc' || stage === 'pressing';
          else if (sub === 'hand') matchesSubtab = stage === 'handwork';
          else if (sub === 'fabric_lot') matchesSubtab = stage === 'fabric lot';
          else matchesSubtab = stage === sub;

          const matchesDesign = !jobFilterDesign || s.design_no.toLowerCase().includes(jobFilterDesign.toLowerCase());
          const matchesKarigar = !jobFilterKarigar || (s.karigar_name || '').toLowerCase().includes(jobFilterKarigar.toLowerCase());
          const matchesStatus = !jobFilterStatus || s.status === jobFilterStatus;

          return matchesSubtab && matchesDesign && matchesKarigar && matchesStatus;
        });

        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">Job Sheets & Stage Varieties</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveSection('quality_checklists')}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Manage Checklists
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                {[
                  { id: 'master', label: 'Master Register' },
                  { id: 'fabric_lot', label: 'Fabric Lotting' },
                  { id: 'dyeing', label: 'Dyeing' },
                  { id: 'print', label: 'Print' },
                  { id: 'embr', label: 'Embroidery' },
                  { id: 'hand', label: 'Handwork' },
                  { id: 'cutt', label: 'Cutting' },
                  { id: 'stitch', label: 'Stitching' },
                  { id: 'press', label: 'QC & Pressing' },
                ].map(dept => (
                  <button 
                    key={dept.id}
                    onClick={() => setJobSubtab(dept.id as any)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                      jobSubtab === dept.id 
                        ? "bg-slate-900 text-white shadow-md" 
                        : "bg-transparent text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    {dept.label}
                  </button>
                ))}
              </div>

              {/* Filter Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Filter by Design..."
                    value={jobFilterDesign}
                    onChange={(e) => setJobFilterDesign(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Filter by Karigar..."
                    value={jobFilterKarigar}
                    onChange={(e) => setJobFilterKarigar(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <select 
                  value={jobFilterStatus}
                  onChange={(e) => setJobFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <button 
                  onClick={() => {
                    setJobFilterDesign('');
                    setJobFilterKarigar('');
                    setJobFilterStatus('');
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {jobSubtab === 'master' ? (
              <div className="space-y-6">
                {renderModuleHeader('Master Production Job Sheets', 
                  { label: 'Add Job Sheet', onClick: () => setShowNewEntryModal({ type: 'Job Sheet', title: 'Create New Job Sheet' }) },
                  [
                    { label: 'Export CSV', onClick: () => handleExport('Master Job Sheets'), icon: FileDown },
                    { label: 'Print Job Card', onClick: () => setShowJobCard({
                      job_card_no: `JC-${Date.now().toString().slice(-5)}`,
                      date: new Date().toLocaleDateString('en-IN'),
                      design_style_no: '',
                      process_grey: true,
                    }), icon: Printer }
                  ],
                  'Search job sheets...',
                  data.batches.length
                )}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  {renderTable(
                    ['Lot ID', 'Style', 'Current Stage', 'Qty', 'Priority', 'Checklist Status', 'Actions'],
                    data.batches.filter(b => 
                      (!jobFilterDesign || b.style.toLowerCase().includes(jobFilterDesign.toLowerCase()))
                    ),
                    (b: Batch, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => setSelectedDetail({ type: 'Lot', id: b.lot_id, data: b })}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            {b.lot_id}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-800">{b.style}</td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-blue-50 text-blue-600 border border-blue-100">
                            {b.stage}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-800">{b.qty}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                            b.priority === 'Urgent' ? "bg-rose-100 text-rose-600" : b.priority === 'High' ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"
                          )}>{b.priority}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: '60%' }} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">60%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => setShowJobCard({
                              job_card_no: `JC-${b.lot_id}`,
                              date: new Date().toLocaleDateString('en-IN'),
                              lot_no: b.lot_id,
                              design_style_no: b.style,
                              process_stitching: b.stage === 'Stitching',
                              process_embroidery: b.stage === 'Embroidery',
                              process_cutting: b.stage === 'Cutting',
                              process_finishing: b.stage === 'QC & Pressing',
                              process_handwork: b.stage === 'Handwork',
                            })}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Print Job Card"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setSelectedDetail({ type: 'Lot', id: b.lot_id, data: b })}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all ml-1"
                            title="View Job Sheet"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </div>
              </div>
            ) : jobSubtab === 'fabric_lot' ? (
              <div className="space-y-6">
                {renderModuleHeader('Fabric Lotting & Collection', 
                  { label: 'Add Lotting', onClick: () => setShowNewEntryModal({ type: 'Lotting', title: 'New Fabric Lotting' }) },
                  [
                    { label: 'Export CSV', onClick: () => handleExport('Fabric Lotting Register'), icon: FileDown }
                  ],
                  'Search lots...',
                  5
                )}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  {renderTable(
                    ['Date', 'Lot ID', 'Design/Style', 'Fabric Item', 'Color', 'Total Mtrs', 'Panna', 'Status'],
                    data.fabric_purchase.slice(0, 5),
                    (f: FabricPurchase, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 text-xs text-slate-500">{f.date}</td>
                        <td className="px-4 py-3 text-xs font-bold text-blue-600">LOT-{200+i}</td>
                        <td className="px-4 py-3 text-xs text-slate-800">Design {101+i}</td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-800">{f.item}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{f.color}</td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-800">{f.meter}m</td>
                        <td className="px-4 py-3 text-xs text-slate-500">44"</td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-emerald-100 text-emerald-600">Lotted</span>
                        </td>
                      </tr>
                    )
                  )}
                </div>

                {/* Job Sheets Section for Fabric Lot */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  {renderModuleHeader('Fabric Lot Job Sheets', 
                    { label: 'Add Job Sheet', onClick: () => setShowNewEntryModal({ type: 'Job Sheet', title: 'Create Fabric Lot Job Sheet' }) },
                    [
                      { label: 'Export CSV', onClick: () => handleExport('Fabric Lot Job Sheets'), icon: FileDown },
                      { label: 'Track Collection', onClick: () => {}, icon: FileText }
                    ],
                    'Search job sheets...',
                    filteredJobSheets.length
                  )}
                  {renderTable(
                    ['ID', 'Lot No', 'Design', 'Qty', 'Status', 'Actions'],
                    filteredJobSheets,
                    (s, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 text-xs font-bold text-slate-800">{s.id}</td>
                        <td className="px-4 py-3 text-xs font-bold text-blue-600">{s.lot_no}</td>
                        <td className="px-4 py-3 text-xs text-slate-800">{s.design_no}</td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-800">{s.qty}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {s.status === 'Completed' ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            ) : s.status === 'In Progress' ? (
                              <RefreshCw className="w-3 h-3 text-amber-500 animate-spin-slow" />
                            ) : (
                              <Clock className="w-3 h-3 text-slate-400" />
                            )}
                            <span className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                              s.status === 'Completed' ? "bg-emerald-100 text-emerald-600" : s.status === 'In Progress' ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"
                            )}>{s.status}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                            <FileText className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                  {filteredJobSheets.length === 0 && (
                    <div className="py-12 text-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-6 h-6 text-slate-200" />
                      </div>
                      <p className="text-xs text-slate-400 font-medium">No job sheets matching filters</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
            <div className="space-y-8">
              {/* Job Varieties Section */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Available {jobSubtab} Varieties
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.job_varieties.filter(v => {
                    const cat = v.category.toLowerCase();
                    const sub = jobSubtab.toLowerCase();
                    if (sub === 'embr') return cat === 'embroidery';
                    if (sub === 'cutt') return cat === 'cutting';
                    if (sub === 'stitch') return cat === 'stitching';
                    if (sub === 'press') return cat === 'pressing' || cat === 'qc';
                    if (sub === 'hand') return cat === 'handwork';
                    return cat === sub;
                  }).map(v => (
                    <div key={v.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600">{v.name}</div>
                        <Plus className="w-3 h-3 text-slate-300 group-hover:text-blue-400" />
                      </div>
                      <div className="text-[10px] text-slate-500 leading-relaxed">{v.details}</div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setShowNewEntryModal({ type: 'Job Variety', title: `New ${jobSubtab} Variety` })}
                    className="border-2 border-dashed border-slate-200 rounded-lg p-3 flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                  >
                    <Plus className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase">Add Variety</span>
                  </button>
                </div>
              </div>

              {/* Job Sheets Section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                {renderModuleHeader(`${jobSubtab} Job Sheets`, 
                  { label: 'Add Job Sheet', onClick: () => setShowNewEntryModal({ type: 'Job Sheet', title: `Create ${jobSubtab} Job Sheet` }) },
                  [{ label: 'Export CSV', onClick: () => handleExport(`${jobSubtab} Job Sheets`), icon: FileDown }],
                  `Search ${jobSubtab} job sheets...`,
                  filteredJobSheets.length
                )}
                {renderTable(
                  ['ID', 'Lot No', 'Design', 'Qty', 'Karigar', 'Issued', 'Status', 'Actions'],
                  filteredJobSheets,
                  (s, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs font-bold text-slate-800">{s.id}</td>
                      <td className="px-4 py-3 text-xs font-bold text-blue-600">{s.lot_no}</td>
                      <td className="px-4 py-3 text-xs text-slate-800">{s.design_no}</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-800">{s.qty}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{s.karigar_name || '-'}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{s.issued_date || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {s.status === 'Completed' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          ) : s.status === 'In Progress' ? (
                            <RefreshCw className="w-3 h-3 text-amber-500 animate-spin-slow" />
                          ) : (
                            <Clock className="w-3 h-3 text-slate-400" />
                          )}
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                            s.status === 'Completed' ? "bg-emerald-100 text-emerald-600" : s.status === 'In Progress' ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"
                          )}>{s.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => setSelectedDetail({ type: 'Job Sheet', id: s.id, data: s })}
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                )}
                {filteredJobSheets.length === 0 && (
                  <div className="py-12 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-slate-200" />
                    </div>
                    <p className="text-xs text-slate-400 font-medium">No job sheets matching filters</p>
                  </div>
                )}
              </div>

              {/* Karigar Ledger Section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                {renderModuleHeader(`${jobSubtab} Karigar Ledger`, 
                  { label: 'Add Entry', onClick: () => setShowNewEntryModal({ type: 'Karigar Entry', title: `New ${jobSubtab} Karigar Entry` }) },
                  [{ label: 'Export CSV', onClick: () => handleExport(`${jobSubtab} Karigar Ledger`), icon: FileDown }],
                  `Search ${jobSubtab} ledger...`,
                  data.karigar_ledger.filter(r => {
                    const dept = r.dept.toLowerCase();
                    if (jobSubtab === 'embr') return dept === 'embroidery';
                    if (jobSubtab === 'cutt') return dept === 'cutting';
                    if (jobSubtab === 'stitch') return dept === 'stitching';
                    if (jobSubtab === 'press') return dept === 'qc' || dept === 'pressing';
                    return dept === jobSubtab.toLowerCase();
                  }).length
                )}
                {renderTable(
                  ['Date', 'Karigar Name', 'Work Description', 'Debit', 'Credit', 'Balance', 'Status'],
                  data.karigar_ledger.filter(r => {
                    const dept = r.dept.toLowerCase();
                    if (jobSubtab === 'embr') return dept === 'embroidery';
                    if (jobSubtab === 'cutt') return dept === 'cutting';
                    if (jobSubtab === 'stitch') return dept === 'stitching';
                    if (jobSubtab === 'press') return dept === 'qc' || dept === 'pressing';
                    return dept === jobSubtab.toLowerCase();
                  }).slice(0, 10),
                  (r: KarigarLedger, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-800">{r.name}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{r.work}</td>
                      <td className="px-4 py-3 text-xs text-rose-600 font-bold">{r.debit > 0 ? formatCurrency(r.debit) : '-'}</td>
                      <td className="px-4 py-3 text-xs text-emerald-600 font-bold">{r.credit > 0 ? formatCurrency(r.credit) : '-'}</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-800">{formatCurrency(r.balance)}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-slate-100 text-slate-600">Verified</span>
                      </td>
                    </tr>
                  )
                )}
                {data.karigar_ledger.filter(r => {
                  const dept = r.dept.toLowerCase();
                  if (jobSubtab === 'embr') return dept === 'embroidery';
                  if (jobSubtab === 'cutt') return dept === 'cutting';
                  if (jobSubtab === 'stitch') return dept === 'stitching';
                  if (jobSubtab === 'press') return dept === 'qc' || dept === 'pressing';
                  return dept === jobSubtab.toLowerCase();
                }).length === 0 && (
                  <div className="py-12 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <HardHat className="w-6 h-6 text-slate-200" />
                    </div>
                    <p className="text-xs text-slate-400 font-medium">No ledger entries for {jobSubtab}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }
    case 'qcpack': return (
        <div className="space-y-6">
          <div className="flex gap-2 mb-4">
            {[
              { id: 'qc', label: '✅ Quality Check' },
              { id: 'packing', label: '📦 Packing' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setQcSubtab(tab.id as any)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                  qcSubtab === tab.id 
                    ? "bg-slate-900 text-white border-slate-900" 
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {qcSubtab === 'qc' && (
            <div className="space-y-6">
              {renderModuleHeader('QC Checker Report & Design Checklists', 
                { label: 'Add QC Entry', onClick: () => setShowNewEntryModal({ type: 'QC Entry', title: 'New QC Entry' }) },
                [{ label: 'Export CSV', onClick: () => handleExport('QC Report'), icon: FileDown }],
                'Search QC reports...',
                3
              )}

              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" />
                  Design-wise QC Checklist Chart
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.qc_checklists.map((qc, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                      <div className="text-xs font-bold text-slate-800 mb-2">Design: {qc.design_id}</div>
                      <div className="flex flex-wrap gap-2">
                        {qc.checks.map((check, ci) => (
                          <div key={ci} className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                            {check}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {renderTable(
                ['Date', 'Lot No', 'Color', 'Checked', 'Pass', 'Reject', 'Rework', 'Pass%', 'Status'],
                data.batches.slice(0, 3),
                (b: Batch, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500">{b.delivery}</td>
                    <td className="px-4 py-3 text-xs font-bold text-blue-600">{b.lot_id}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{b.color}</td>
                    <td className="px-4 py-3 text-xs text-slate-800">{b.qty}</td>
                    <td className="px-4 py-3 text-xs text-emerald-600">{b.done || b.qty}</td>
                    <td className="px-4 py-3 text-xs text-rose-600">{b.reject || 0}</td>
                    <td className="px-4 py-3 text-xs text-amber-600">0</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-800">98%</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-emerald-100 text-emerald-600">Active</span>
                    </td>
                  </tr>
                )
              )}
            </div>
          )}

          {qcSubtab === 'packing' && (
            <div className="space-y-6">
              {renderModuleHeader('Packing Varieties & Register', 
                { label: 'Add Packing Entry', onClick: () => setShowNewEntryModal({ type: 'Packing Entry', title: 'New Packing Entry' }) },
                [{ label: 'Export CSV', onClick: () => handleExport('Packing Register'), icon: FileDown }],
                'Search packing entries...',
                3
              )}

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Package className="w-3 h-3" />
                  Available Packing Type Varieties
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {data.packing_varieties.map(pv => (
                    <div key={pv.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      <div className="text-xs font-bold text-slate-800">{pv.name}</div>
                      <div className="text-[10px] text-slate-500 leading-relaxed">{pv.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {renderTable(
                ['Date', 'Lot No', 'Bundle No', 'Color', 'Size', 'Qty', 'Status'],
                data.batches.slice(0, 3).map((b, i) => ({ ...b, bundle: `B-${100+i}`, size: 'XL' })),
                (p, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500">{p.delivery}</td>
                    <td className="px-4 py-3 text-xs font-bold text-blue-600">{p.lot_id}</td>
                    <td className="px-4 py-3 text-xs text-slate-800">{p.bundle}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{p.color}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{p.size}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-800">{p.qty}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-emerald-100 text-emerald-600">Packed</span>
                    </td>
                  </tr>
                )
              )}
            </div>
          )}
        </div>
      );
      case 'invoice': return (
        <div className="space-y-4">
          {renderModuleHeader('GST Invoice Register', 
            { label: 'Add Invoice', onClick: () => setShowNewEntryModal({ type: 'Invoice', title: 'Create New Invoice' }) },
            [{ label: 'Export CSV', onClick: () => handleExport('Invoice Register'), icon: FileDown }],
            'Search invoices...',
            data.payments.length
          )}
          {renderTable(
            ['Invoice No', 'Date', 'Party', 'Design', 'Qty', 'Taxable', 'GST%', 'Total', 'Status', 'Action'],
            data.payments.map((p, i) => ({ ...p, inv: `INV-${202600+i}`, qty: 100, taxable: 45000, gst: 5, total: 47250 })),
            (r, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3">
                  <button 
                    onClick={() => setSelectedDetail({ type: 'Invoice', id: r.inv, data: r })}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    {r.inv}
                  </button>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                <td className="px-4 py-3 text-xs text-slate-800">{r.party}</td>
                <td className="px-4 py-3 text-xs text-slate-500">Design {i+1}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.qty}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{formatCurrency(r.taxable)}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.gst}%</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{formatCurrency(r.total)}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-blue-100 text-blue-600">Pending</span>
                </td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => window.print()}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'accounts': return (
        <div className="space-y-4">
          {renderModuleHeader('Accounts Ledger', 
            { label: 'Add Entry', onClick: () => setShowNewEntryModal({ type: 'Account Entry', title: 'Add New Account Entry' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Accounts Ledger', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Accounts Ledger' },
              { label: 'Export CSV', onClick: () => handleExport('Accounts Ledger'), icon: FileDown }
            ],
            'Search accounts...',
            data.karigar_ledger.length
          )}
          {renderTable(
            ['Date', 'Party', 'Type', 'Description', 'Debit', 'Credit', 'Balance'],
            data.karigar_ledger,
            (r: KarigarLedger, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{r.name}</td>
                <td className="px-4 py-3 text-xs text-blue-500 font-medium">Payment</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.work}</td>
                <td className="px-4 py-3 text-xs text-rose-500">{r.debit > 0 ? formatCurrency(r.debit) : '—'}</td>
                <td className="px-4 py-3 text-xs text-emerald-600">{r.credit > 0 ? formatCurrency(r.credit) : '—'}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{formatCurrency(r.balance)}</td>
              </tr>
            )
          )}
        </div>
      );
      case 'costing': return (
        <div className="space-y-6">
          {renderModuleHeader('Estimated vs Actual Costing', 
            { label: 'Add Costing', onClick: () => setShowNewEntryModal({ type: 'Costing', title: 'New Design Costing' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Costing Data', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Costing Data' },
              { label: 'Export CSV', onClick: () => handleExport('Costing Data'), icon: FileDown }
            ],
            'Search costing...',
            data.costing_comparisons.length
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.costing_comparisons.map((c, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-bold text-slate-800">Design: {c.design_id}</div>
                  <div className={cn(
                    "text-xs font-bold px-2 py-1 rounded",
                    c.variance > 0 ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                  )}>
                    Variance: {c.variance}%
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Estimated</div>
                    <div className="text-lg font-bold text-slate-800">{formatCurrency(c.estimated_cost)}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Actual</div>
                    <div className="text-lg font-bold text-slate-800">{formatCurrency(c.actual_cost)}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {Object.entries(c.breakdown).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 capitalize">{key}</span>
                      <span className="font-bold text-slate-800">{formatCurrency(val as number)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'tna': return (
        <div className="space-y-4">
          {renderModuleHeader('TNA (Time & Action) Calendar', 
            { label: 'Add Activity', onClick: () => setShowNewEntryModal({ type: 'TNA Activity', title: 'Add TNA Activity' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('TNA Calendar', 'google'), icon: Globe, disabled: isExportingToGoogle === 'TNA Calendar' },
              { label: 'Export', onClick: () => handleExport('TNA Calendar'), icon: Download }
            ],
            'Search TNA...',
            data.tna_events.length
          )}
          {renderTable(
            ['Lot ID', 'Activity', 'Planned Date', 'Actual Date', 'Responsible', 'Status'],
            data.tna_events,
            (r: TNAEvent, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{r.lot_id}</td>
                <td className="px-4 py-3 text-xs text-slate-800 font-medium">{r.activity}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.planned_date}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.actual_date || '—'}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.responsible}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    r.status === 'Completed' ? "bg-emerald-100 text-emerald-600" :
                    r.status === 'Delayed' ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                  )}>
                    {r.status}
                  </span>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'merchandising': return (
        <div className="space-y-4">
          {renderModuleHeader('Merchandising Approvals', 
            { label: 'New Submission', onClick: () => setShowNewEntryModal({ type: 'Merchandising Submission', title: 'New Merchandising Submission' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Merchandising Approvals', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Merchandising Approvals' },
              { label: 'Export', onClick: () => handleExport('Merchandising Approvals'), icon: Download }
            ],
            'Search approvals...',
            data.merch_approvals.length
          )}
          {renderTable(
            ['Design ID', 'Item', 'Sent Date', 'Status', 'Remarks'],
            data.merch_approvals,
            (r: MerchApproval, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{r.design_id}</td>
                <td className="px-4 py-3 text-xs text-slate-800">{r.item}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.sent_date}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    r.status === 'Approved' ? "bg-emerald-100 text-emerald-600" :
                    r.status === 'Rejected' ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"
                  )}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 italic">{r.remarks || 'No remarks'}</td>
              </tr>
            )
          )}
        </div>
      );
      case 'locations': return (
        <div className="space-y-6">
          {renderModuleHeader('Multi-Location Inventory', 
            { label: 'Add Location', onClick: () => setShowNewEntryModal({ type: 'Location', title: 'Add New Location' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Locations Data', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Locations Data' },
              { label: 'Export', onClick: () => handleExport('Locations Data'), icon: Download }
            ],
            'Search locations...',
            data.inventory_locations.length
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.inventory_locations.map((loc, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{loc.name}</h4>
                      <p className="text-[10px] text-slate-500">{loc.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-800">{formatCurrency(loc.stock_value)}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Stock Value</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-slate-400">Capacity Utilization</span>
                    <span className="text-slate-600">{loc.capacity_used}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all",
                        loc.capacity_used > 80 ? "bg-rose-500" : "bg-emerald-500"
                      )} 
                      style={{ width: `${loc.capacity_used}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'feedback': return (
        <div className="space-y-4">
          {renderModuleHeader('Buyer Feedback & Revision Log', 
            { label: '+ New Feedback', onClick: () => setShowNewEntryModal({ type: 'Feedback', title: 'New Feedback Entry' }) },
            [{ label: 'Export', onClick: () => handleExport('Buyer Feedback'), icon: Download }],
            'Search feedback...',
            data.buyer_feedback.length
          )}
          {renderTable(
            ['Date', 'Design ID', 'Buyer', 'Rev #', 'Feedback', 'Status'],
            data.buyer_feedback,
            (r: BuyerFeedback, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                <td className="px-4 py-3 text-xs font-bold text-blue-600">{r.design_id}</td>
                <td className="px-4 py-3 text-xs text-slate-800 font-medium">{r.buyer_name}</td>
                <td className="px-4 py-3 text-xs text-slate-500">Rev {r.revision_no}</td>
                <td className="px-4 py-3 text-xs text-slate-600 max-w-xs truncate">{r.feedback_text}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    r.status === 'Addressed' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                  )}>
                    {r.status}
                  </span>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'smart_inventory': return (
        <div className="space-y-6">
          {renderModuleHeader('Smart Inventory — Deadstock Alerts', 
            { label: 'Export Deadstock List', onClick: () => {} },
            [{ label: 'AI Analysis', onClick: () => {}, icon: Sparkles }],
            'Search alerts...',
            5
          )}
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
            <p>5 items identified as Deadstock (90+ days no movement) · Total value: ₹3.2 Lakh</p>
          </div>
          {renderTable(
            ['Design', 'Colour', 'Size', 'Stock Qty', 'Days Idle', 'Value', 'Action'],
            data.fg_stock.filter(s => (s.balance || 0) > 0).slice(0, 5),
            (r: FGStock, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{r.design}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{r.color}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{r.sizes}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{r.balance}</td>
                <td className="px-4 py-3 text-xs font-bold text-rose-600">90+ Days</td>
                <td className="px-4 py-3 text-xs text-slate-600">{formatCurrency((r.balance || 0) * 450)}</td>
                <td className="px-4 py-3">
                  <button className="text-[10px] font-bold text-blue-600 hover:underline">Markdown Pricing</button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'predictive': return (
        <div className="space-y-6">
          {renderModuleHeader('AI Predictive Analytics', 
            { label: 'Run Simulation', onClick: () => {} },
            [{ label: 'Export Insights', onClick: () => handleExport('AI Predictive'), icon: Download }],
            'Search insights...',
            data.predictive_delays.length
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-4">Predicted Production Delays</h4>
              <div className="space-y-4">
                {data.predictive_delays.map((d, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{d.lot_id} · {d.design_id}</div>
                      <div className="text-[10px] text-slate-500">{d.reason}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-rose-600">+{d.predicted_delay_days} Days</div>
                      <div className="text-[10px] text-slate-400">Confidence: {Math.round(d.confidence_score * 100)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-4">Demand Forecast (Next 30 Days)</h4>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PIPELINE_TRENDS}>
                    <Bar dataKey="issued" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-[10px] text-slate-400 italic">AI predicts a 15% surge in Anarkali designs due to upcoming festive season.</p>
            </div>
          </div>
        </div>
      );
      case 'sustainability': return (
        <div className="space-y-6">
          {renderModuleHeader('🌿 Eco-Tracking & Sustainability', 
            { label: 'Sustainability Report', onClick: () => window.print() },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Sustainability', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Sustainability' },
              { label: 'Carbon Audit', onClick: () => {}, icon: Sparkles }
            ]
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Water Usage</div>
              <div className="text-2xl font-black text-emerald-800">1,200 L</div>
              <div className="text-[10px] text-emerald-600 mt-1">↓ 8% vs last month</div>
            </div>
            <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Fabric Waste</div>
              <div className="text-2xl font-black text-blue-800">45 Kg</div>
              <div className="text-[10px] text-blue-600 mt-1">Recycled: 12 Kg</div>
            </div>
            <div className="p-6 bg-purple-50 border border-purple-100 rounded-2xl">
              <div className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">Organic Fabric</div>
              <div className="text-2xl font-black text-purple-800">15%</div>
              <div className="text-[10px] text-purple-600 mt-1">Target: 25% by 2027</div>
            </div>
          </div>
        </div>
      );
      case 'kpi': return (
        <div className="space-y-6">
          {renderModuleHeader('📊 KPI Dashboard', 
            { label: 'Refresh Stats', onClick: () => {} },
            [{ label: 'Export PDF', onClick: () => window.print(), icon: Download }]
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPI icon={Package} label="Monthly Production" value="18,420 pcs" change="↑ 15% vs last month" color="blue" />
            <KPI icon={Banknote} label="Revenue" value="₹34.2L" change="↑ 12%" color="emerald" />
            <KPI icon={TrendingUp} label="Rejection Rate" value="2.8%" change="↓ Better than 3.5% target" color="rose" />
            <KPI icon={Zap} label="On-Time Delivery" value="91%" change="↑ 3% this month" color="amber" />
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
            <h4 className="text-sm font-bold text-slate-800 mb-6">Production Efficiency Trend</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PIPELINE_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip />
                <Line type="monotone" dataKey="issued" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
                <Line type="monotone" dataKey="received" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
      case 'whatsapp': return (
        <div className="space-y-6">
          {renderModuleHeader('WhatsApp Communication Hub', 
            { label: 'Broadcast Message', onClick: () => setShowNewEntryModal({ type: 'WhatsApp Broadcast', title: 'Broadcast New Message' }) },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('WhatsApp Messages', 'google'), icon: Globe, disabled: isExportingToGoogle === 'WhatsApp Messages' },
              { label: 'Export', onClick: () => handleExport('WhatsApp Messages'), icon: Download }
            ]
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {renderTable(
                ['Timestamp', 'Recipient', 'Type', 'Message', 'Status'],
                data.whatsapp_messages,
                (r: WhatsAppMessage, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-[10px] text-slate-500">{r.timestamp}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-bold text-slate-800">{r.recipient}</div>
                      <div className="text-[10px] text-slate-400">{r.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-[10px] font-medium text-slate-500">{r.type}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 max-w-xs truncate">{r.message}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                        r.status === 'Read' ? "bg-blue-100 text-blue-600" :
                        r.status === 'Delivered' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                      )}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <h4 className="font-bold text-slate-800">Quick Templates</h4>
              <div className="space-y-3">
                {['Order Confirmed', 'Payment Received', 'Dispatch Alert', 'Marketing Promo'].map((t, i) => (
                  <button key={i} className="w-full text-left p-3 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">{t}</div>
                    <div className="text-[10px] text-slate-400">Click to use template</div>
                  </button>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800 mb-2">Daily Stats</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-emerald-600">142</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Sent</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-600">92%</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Read Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      case 'social_media': {
        const platforms = [
          { id: 'all', label: 'All Platforms', icon: Globe, color: 'text-slate-600' },
          { id: 'Facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
          { id: 'Instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
          { id: 'YouTube', label: 'YouTube', icon: Youtube, color: 'text-red-600' },
          { id: 'Twitter', label: 'Twitter', icon: Twitter, color: 'text-sky-500' },
          { id: 'Telegram', label: 'Telegram', icon: Send, color: 'text-blue-400' },
          { id: 'Shopping', label: 'Shopping Sites', icon: ShoppingBag, color: 'text-amber-600' },
        ];
        
        const filteredPosts = activePlatform === 'all' 
          ? data.social_posts 
          : activePlatform === 'Shopping' 
            ? data.social_posts.filter(p => ['Amazon', 'Flipkart', 'Myntra', 'Other Shopping Site'].includes(p.platform))
            : data.social_posts.filter(p => p.platform === activePlatform);

        return (
          <div className="space-y-6">
            {renderModuleHeader('Social Media Marketing Hub', 
              { label: '+ Create Campaign', onClick: () => {} },
              [
                { label: 'Sync Google Sheets', onClick: () => handleExport('Social Media', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Social Media' },
                { label: 'Engagement Analytics', onClick: () => {}, icon: TrendingUp }
              ]
            )}

            {/* Platform Tabs */}
            <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
              {platforms.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePlatform(p.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                    activePlatform === p.id 
                      ? "bg-slate-900 text-white shadow-lg" 
                      : "hover:bg-slate-50 text-slate-500"
                  )}
                >
                  <p.icon className={cn("w-4 h-4", activePlatform === p.id ? "text-white" : p.color)} />
                  {p.label}
                </button>
              ))}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Reach', value: '1.2M', sub: '+12% this month', icon: Globe, color: 'blue' },
                { label: 'Engagement Rate', value: '4.8%', sub: 'Avg across platforms', icon: TrendingUp, color: 'emerald' },
                { label: 'Scheduled Posts', value: data.social_posts.filter(p => p.status === 'Scheduled').length, sub: 'Next 7 days', icon: Clock, color: 'amber' },
                { label: 'Active Campaigns', value: '5', sub: 'Across 3 platforms', icon: Sparkles, color: 'purple' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                      <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {stat.sub}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.map((post, i) => (
                    <motion.div 
                      key={i} 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-blue-200 transition-all"
                    >
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-2">
                          {post.platform === 'Facebook' && <Facebook className="w-4 h-4 text-blue-600" />}
                          {post.platform === 'Instagram' && <Instagram className="w-4 h-4 text-pink-600" />}
                          {post.platform === 'YouTube' && <Youtube className="w-4 h-4 text-red-600" />}
                          {post.platform === 'Twitter' && <Twitter className="w-4 h-4 text-sky-500" />}
                          {post.platform === 'Telegram' && <Send className="w-4 h-4 text-blue-400" />}
                          {['Amazon', 'Flipkart', 'Myntra', 'Other Shopping Site'].includes(post.platform) && <ShoppingBag className="w-4 h-4 text-amber-600" />}
                          <span className="text-xs font-bold text-slate-800">{post.platform}</span>
                        </div>
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                          post.status === 'Published' ? "bg-emerald-100 text-emerald-600" :
                          post.status === 'Scheduled' ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"
                        )}>
                          {post.status}
                        </span>
                      </div>
                      <div className="p-5 flex-1">
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">{post.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.status === 'Published' ? 'Published on' : 'Scheduled for'}: {post.scheduled_date}
                          </div>
                        </div>
                      </div>
                      
                      {post.engagement && (
                        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 grid grid-cols-4 gap-2 text-center">
                          <div>
                            <div className="text-xs font-bold text-slate-800">{post.engagement.likes}</div>
                            <div className="text-[8px] text-slate-400 uppercase font-bold">Likes</div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{post.engagement.comments}</div>
                            <div className="text-[8px] text-slate-400 uppercase font-bold">Comments</div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{post.engagement.shares}</div>
                            <div className="text-[8px] text-slate-400 uppercase font-bold">Shares</div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{post.engagement.views || '-'}</div>
                            <div className="text-[8px] text-slate-400 uppercase font-bold">Views</div>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-3 border-t border-slate-100 flex gap-2 bg-white">
                        <button className="flex-1 text-[10px] font-bold text-slate-600 hover:bg-slate-50 py-2 rounded-lg transition-all border border-slate-100">Edit Post</button>
                        <button className="flex-1 text-[10px] font-bold text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-all border border-blue-100">Boost Post</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sidebar / Tools */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    AI Content Assistant
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Generate engaging captions and hashtags for your next collection.
                  </p>
                  <textarea 
                    placeholder="Describe your collection or product..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    <Wand2 className="w-4 h-4" />
                    Generate AI Content
                  </button>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-4">Upcoming Holidays</h4>
                  <div className="space-y-4">
                    {[
                      { date: 'Apr 14', event: 'Tamil New Year', platform: 'Instagram' },
                      { date: 'Apr 22', event: 'Earth Day', platform: 'Facebook' },
                      { date: 'May 01', event: 'Labor Day Sale', platform: 'All' },
                    ].map((h, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-center min-w-[40px]">
                          <div className="text-[10px] font-bold text-rose-500 uppercase">{h.date.split(' ')[0]}</div>
                          <div className="text-sm font-bold text-slate-800">{h.date.split(' ')[1]}</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-slate-800">{h.event}</div>
                          <div className="text-[10px] text-slate-400">Target: {h.platform}</div>
                        </div>
                        <button className="p-2 hover:bg-white rounded-lg text-blue-600 transition-all">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-xl shadow-blue-500/20">
                  <h4 className="font-bold mb-2">Pro Tip</h4>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    Posts with videos get 40% more engagement on Instagram. Try scheduling a "Behind the Scenes" video for your next batch!
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'karigar_wages': {
        const filteredEntries = selectedKarigar === 'all' 
          ? data.karigar_wage_entries 
          : data.karigar_wage_entries.filter(e => e.karigar_id === selectedKarigar);

        const filteredSlips = selectedKarigar === 'all'
          ? data.salary_slips
          : data.salary_slips.filter(s => s.karigar_id === selectedKarigar);

        return (
          <div className="space-y-6">
            {renderModuleHeader('Karigar Wage Management', 
              { label: wageTab === 'rates' ? '+ Add Rate' : wageTab === 'entries' ? '+ Record Work' : '+ Generate Slips', onClick: () => {} },
              [{ label: 'Wage Analytics', onClick: () => {}, icon: TrendingUp }]
            )}

            {/* Tabs & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                {[
                  { id: 'rates', label: 'Wage Master', icon: SettingsIcon },
                  { id: 'entries', label: 'Work Entries', icon: ClipboardList },
                  { id: 'slips', label: 'Salary Slips', icon: Receipt },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setWageTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all",
                      wageTab === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Karigar:</label>
                <select 
                  value={selectedKarigar}
                  onChange={(e) => setSelectedKarigar(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">All Karigars</option>
                  { (data.karigar_master || []).map(k => (
                    <option key={k.id} value={k.id}>{k.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {wageTab === 'rates' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Design / Stage</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Base Rate</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Size Modifiers</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pattern Modifiers</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.wage_rates.map((rate, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-slate-800">{rate.design_id}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{rate.stage}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-slate-800">₹{rate.base_rate}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(rate.size_modifiers).map(([size, mod]) => (
                              <span key={size} className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">
                                {size}: +₹{mod}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(rate.pattern_modifiers).map(([pattern, mod]) => (
                              <span key={pattern} className="text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-bold">
                                {pattern}: +₹{mod}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                            <FileText className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {wageTab === 'entries' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date / Karigar</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Work Details</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Qty</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rate (Base+Mod)</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Total Wage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEntries.map((entry, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-xs font-bold text-slate-800">{entry.karigar_name}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{entry.date}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs font-bold text-slate-800">{entry.lot_id} - {entry.design_id}</div>
                            <div className="text-[10px] text-slate-500">
                              {entry.stage} | {entry.size} | {entry.pattern}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-slate-800">{entry.qty}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs font-bold text-slate-800">₹{entry.final_rate}</div>
                            <div className="text-[9px] text-slate-400">₹{entry.base_rate} + ₹{entry.modifiers_total}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-sm font-bold text-emerald-600">₹{entry.total_wage}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 self-start">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-600" />
                    Wage Calculator
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Design</label>
                      <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500">
                        {data.designs.map(d => <option key={d.id} value={d.id}>{d.id} - {d.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Size</label>
                        <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500">
                          <option>M</option>
                          <option>L</option>
                          <option>XL</option>
                          <option>XXL</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Pattern</label>
                        <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Simple</option>
                          <option>Heavy</option>
                          <option>Complex</option>
                        </select>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-slate-600">Calculated Rate:</span>
                        <span className="text-lg font-bold text-blue-600">₹70.00</span>
                      </div>
                      <div className="text-[10px] text-blue-400">
                        Base (₹50) + Size XL (₹5) + Pattern Heavy (₹15)
                      </div>
                    </div>
                    <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                      Apply to Entry
                    </button>
                  </div>
                </div>
              </div>
            )}

            {wageTab === 'slips' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSlips.map((slip, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-blue-200 transition-all">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                          <Receipt className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                          slip.status === 'Paid' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                        )}>
                          {slip.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-lg">{slip.karigar_name}</h4>
                      <p className="text-xs text-slate-400 font-medium">Period: {slip.period_start} to {slip.period_end}</p>
                    </div>
                    
                    <div className="p-6 space-y-4 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500">Total Earnings</span>
                        <span className="text-sm font-bold text-slate-800">₹{slip.total_earnings}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500">Deductions</span>
                        <span className="text-sm font-bold text-rose-500">-₹{slip.deductions}</span>
                      </div>
                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-800">Net Payable</span>
                        <span className="text-xl font-black text-blue-600">₹{slip.net_payable}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                      <button 
                        onClick={() => setSelectedSlip({
                          ...slip,
                          entries: data.karigar_wage_entries.filter(e => e.karigar_id === slip.karigar_id)
                        })}
                        className="flex-1 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        Print Slip
                      </button>
                      <button className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        Send WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
      case 'quality_checklists': return (
        <div className="space-y-6">
          {renderModuleHeader('Quality Checklists by Stage', 
            { label: 'Add Parameter', onClick: () => {} },
            [
              { label: 'Sync Google Sheets', onClick: () => handleExport('Quality Checklists', 'google'), icon: Globe, disabled: isExportingToGoogle === 'Quality Checklists' },
              { label: 'Export Checklists', onClick: () => handleExport('Quality Checklists'), icon: Download }
            ]
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_DATA.stage_checklists.map((c, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    {c.stage}
                  </h4>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                    {c.parameters.length} Checks
                  </span>
                </div>
                <div className="space-y-2">
                  {c.parameters.map((param, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        {param}
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button className="w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                    + Add Check
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'importexport': return (
        <div className="space-y-6">
          {renderModuleHeader('Data Import & Export Hub', 
            { label: 'Bulk Sync Google Sheets', onClick: handleBulkExport },
            [{ label: 'Connect Google', onClick: handleGoogleAuth, icon: Globe }]
          )}
          {/* Main Sync Dashboard */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400 border border-blue-500/30">
                      <Globe className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight">Google Sheets Master Sync</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={cn("w-2 h-2 rounded-full animate-pulse", isGoogleAuthenticated ? "bg-emerald-400" : "bg-slate-500")} />
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                          {isGoogleAuthenticated ? "Cloud Connected" : "Not Connected"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
                    Directly synchronize your entire KARNI ERP database with Google Sheets. 
                    This creates a multi-tab spreadsheet with real-time data for all modules.
                  </p>
                  {debugRedirectUri && (
                    <div className="mt-4 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Copy this to Google Console (Redirect URI)</div>
                      <div className="text-[10px] font-mono text-blue-400 break-all select-all">{debugRedirectUri}</div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {!isGoogleAuthenticated ? (
                    <button 
                      onClick={handleGoogleAuth}
                      className="group bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/5"
                    >
                      <Globe className="w-5 h-5 text-blue-600 group-hover:rotate-12 transition-transform" />
                      Connect Google Account
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={handleBulkExport}
                        disabled={isBulkExporting}
                        className="group bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white px-10 py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-emerald-500/20"
                      >
                        {isBulkExporting ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                        )}
                        {isBulkExporting ? "Synchronizing..." : "Sync All to Google Sheets"}
                      </button>
                      
                      <button 
                        onClick={() => setShowGoogleImportModal(true)}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 border border-slate-700"
                      >
                        <Download className="w-5 h-5" />
                        Import from Sheets
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/5 blur-[100px] -ml-32 -mb-32" />
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Target Spreadsheet (URL or ID)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={spreadsheetId}
                    onChange={(e) => setSpreadsheetId(e.target.value)}
                    placeholder="Paste Google Sheet URL or ID here..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <button 
                    onClick={() => setSpreadsheetId('')}
                    className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-xl text-xs font-bold transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 italic">
                  * If provided, the system will update this specific sheet instead of creating a new one.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Automatic Formatting</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Headers are automatically bolded and styled.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <Layers className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Multi-Tab Export</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Separate sheets for Batches, Fabric, Karigar, etc.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Live Sync</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Data is pulled directly from your current ERP state.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileDown className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Individual Export</h3>
              </div>
              <div className="space-y-3">
                {[
                  'Design Register',
                  'Design_Master',
                  'Fabric_Purchase',
                  'Fabric_Issue',
                  'Fabric_Stock',
                  'Dyeing_Job',
                  'Print_Job',
                  'Embroidery_Job',
                  'Cutting_Job',
                  'Handwork_Job',
                  'Stitching_Job',
                  'Quality_Check',
                  'Pressing',
                  'Karigar_Ledger',
                  'Challan',
                  'Packing',
                  'Customers',
                  'Batches',
                  'GRN',
                  'Issue_Material',
                  'FG_Stock',
                  'Machines',
                  'Karigar_Entries',
                  'Payments',
                  'GST_Invoices'
                ].map(item => (
                  <div key={item} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group hover:border-blue-200 transition-all">
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleExport(item, 'google')}
                        disabled={isExportingToGoogle === item}
                        className="text-[10px] font-bold text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 border border-blue-100"
                      >
                        {isExportingToGoogle === item ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Globe className="w-3 h-3" />
                        )}
                        Sync Sheet
                      </button>
                      <button 
                        onClick={() => handleExport(item, 'csv')}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        CSV
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Upload className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Import & Restore</h3>
              </div>
              <div className="space-y-4">
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3">Google Sheets Import</h4>
                  <p className="text-[10px] text-slate-500 mb-4">Import data directly from any Google Spreadsheet by providing its ID or URL.</p>
                  <button 
                    onClick={() => isGoogleAuthenticated ? setShowGoogleImportModal(true) : handleGoogleAuth()}
                    className="w-full py-3 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm text-sm font-bold text-slate-700"
                  >
                    <Globe className="w-5 h-5 text-blue-600" />
                    {isGoogleAuthenticated ? "Open Import Tool" : "Connect & Import"}
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                    <span className="bg-white px-2">Legacy Import</span>
                  </div>
                </div>

                <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-300" />
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-600">Click or drag CSV to import</p>
                    <p className="text-[10px] text-slate-400">Supports Batch, Fabric, and Karigar data</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-50 rounded-lg">
                    <Trash2 className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">System Maintenance</h3>
                </div>
                <button 
                  onClick={handleCleanData}
                  className="px-4 py-2 bg-rose-600 text-white text-sm font-bold rounded-lg hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Clean & Reset Data
                </button>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Use this option to clear all current entries and reset the application to its original demo state. 
                This is useful for starting a fresh session or clearing imported test data.
              </p>
            </div>
          </div>
        </div>
      );
      case 'settings': return (
        <div className="space-y-6">
          {renderModuleHeader('Company Settings', 
            { label: 'Save Settings', onClick: () => {} },
            [{ label: 'Backup Data', onClick: () => {}, icon: Download }]
          )}
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Name</label>
              <input type="text" defaultValue="Karni Impex" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">GSTIN</label>
              <input type="text" defaultValue="24AUOPD2833Q1Z9" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</label>
              <input type="text" defaultValue="Surat, Gujarat, India" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Default GST%</label>
              <input type="number" defaultValue="5" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile</label>
              <input type="text" defaultValue="9876543210" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
            </div>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">Save Settings</button>
        </div>
      </div>
      );
      case 'demo_center': return <DemoHome onModuleClick={(id) => setActiveSection(id as Section)} />;
      default: return <div className="p-12 text-center text-slate-400">Section "{activeSection}" is under development.</div>;
    }
  };

  if (!isAuthReady) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg shadow-amber-500/20">👗</div>
            <h2 className="text-2xl font-bold text-slate-900">KarniERP Login</h2>
            <p className="text-sm text-slate-500">Enter your credentials to access the ERP</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  placeholder="admin"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Shield className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600 text-xs font-medium">
                <AlertTriangle className="w-4 h-4" />
                {loginError}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-slate-200"
            >
              {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Sign In to ERP"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <button 
              onClick={handleDemoLogin}
              className="w-full py-4 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl font-bold text-sm hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Try Live Demo Mode
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-[10px] text-slate-400">© 2026 Karni Impex. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="bg-slate-900 text-slate-300 flex-shrink-0 overflow-hidden relative z-50 no-print"
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-900 text-xl font-bold shadow-lg shadow-amber-500/20">👗</div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">KARNI IMPEX</h1>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-medium">ERP Master v3</p>
          </div>
        </div>
        
        <div className="p-4 h-[calc(100vh-88px)] overflow-y-auto custom-scrollbar">
          {categories.map(cat => (
            <div key={cat} className="mb-6">
              <h2 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3 px-4">{cat}</h2>
              <div className="space-y-1">
                {navItems.filter(item => item.category === cat).map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as Section)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group",
                      activeSection === item.id 
                        ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/10" 
                        : "hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", activeSection === item.id ? "text-slate-900" : "text-slate-500 group-hover:text-slate-300")} />
                    {item.label}
                    {activeSection === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={cn("flex-1 flex flex-col min-w-0 overflow-hidden", isGlobalEditMode && "edit-mode-active")}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 no-print">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsGlobalEditMode(!isGlobalEditMode)}
              className={cn(
                "hidden lg:flex items-center gap-2 px-3 py-1.5 border rounded-full transition-all",
                isGlobalEditMode 
                  ? "bg-amber-500 border-amber-600 text-white shadow-lg shadow-amber-500/20" 
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
              )}
            >
              <div className={cn("w-2 h-2 rounded-full", isGlobalEditMode ? "bg-white animate-pulse" : "bg-slate-300")} />
              <span className="text-[10px] font-bold uppercase tracking-tight">{isGlobalEditMode ? 'Edit Mode ON' : 'Edit Mode OFF'}</span>
            </button>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">System Live</span>
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-800">{user?.username || 'Kishan G.'}</div>
                <div className="text-[10px] text-slate-400">{user?.role || 'Administrator'}</div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all group"
              >
                <div className="group-hover:hidden">{(user?.username || 'KG').substring(0, 2).toUpperCase()}</div>
                <X className="w-5 h-5 hidden group-hover:block" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 no-print">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 capitalize">{activeSection.replace(/([A-Z])/g, ' $1').trim()}</h2>
                <p className="text-sm text-slate-500 mt-1">Manage your {activeSection} data and operations.</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm">
                  {formatDate(new Date())}
                </div>
              </div>
            </div>

            <div className="no-print">
              {renderKPIs()}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .edit-mode-active td:not(:last-child) {
          outline: 1px dashed #fbbf24;
          cursor: text;
          user-select: text;
        }
        .edit-mode-active td:not(:last-child):focus {
          outline: 2px solid #f59e0b;
          background: #fffbeb;
        }
        @media print {
          aside, 
          header, 
          .no-print,
          button,
          input[type="text"],
          select,
          .flex-shrink-0,
          .shadow-sm,
          .shadow-md,
          .shadow-lg,
          .shadow-xl,
          .shadow-2xl {
            display: none !important;
          }
          main {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            display: block !important;
          }
          .overflow-y-auto {
            overflow: visible !important;
            height: auto !important;
            padding: 0 !important;
          }
          .p-6 {
            padding: 0 !important;
          }
          .max-w-7xl {
            max-width: none !important;
          }
          .bg-white {
            background-color: white !important;
            border: none !important;
          }
          tr {
            page-break-inside: avoid;
          }
        }
      `}} />

      {isGlobalEditMode && (
        <motion.button
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-8 right-8 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl shadow-emerald-500/40 flex items-center gap-2 hover:bg-emerald-700 transition-all border-2 border-white"
          onClick={() => {
            setIsGlobalEditMode(false);
            // In a real app, we'd collect all contentEditable changes here
            alert("Changes saved successfully to the database!");
          }}
        >
          <Save className="w-5 h-5" />
          SAVE ALL CHANGES
        </motion.button>
      )}

      <AnimatePresence>
        {showGoogleImportModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg text-white">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Google Sheets Import</h3>
                </div>
                <button onClick={() => setShowGoogleImportModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Data Type</label>
                  <select 
                    value={importingType}
                    onChange={(e) => setImportingType(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  >
                    <option>Batch Management</option>
                    <option>Fabric Purchase Register</option>
                    <option>Karigar Ledger</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spreadsheet URL or ID</label>
                  <input 
                    type="text" 
                    placeholder="Paste Google Sheet URL here..."
                    value={spreadsheetId}
                    onChange={(e) => setSpreadsheetId(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-[10px] text-slate-400">Paste the full browser URL of your Google Sheet for direct sync.</p>
                </div>

                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <p className="text-[10px] text-amber-700 leading-relaxed">
                    Ensure your sheet has headers in the first row. The order should match the export format.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowGoogleImportModal(false)}
                    className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleGoogleImport}
                    disabled={isImporting}
                    className="flex-1 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                  >
                    {isImporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
                    {isImporting ? "Importing..." : "Start Import"}
                  </button>
                </div>
                
                <button 
                  onClick={handleBulkImport}
                  disabled={isImporting}
                  className="w-full py-3 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 border border-emerald-400"
                >
                  {isImporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                  {isImporting ? "Processing..." : "Bulk Import All Sheets"}
                </button>
                
                <p className="text-[9px] text-slate-400 text-center italic">
                  * Bulk import will update all modules based on sheet names.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDetail && (
          <DetailModal 
            detail={selectedDetail} 
            onClose={() => setSelectedDetail(null)} 
            onSave={(updatedData) => {
              const updatedAppState = { ...data };
              const map: Record<string, string> = {
                'Design Register': 'designs',
                'Design Master': 'designs',
                'Design_Master': 'designs',
                'Fabric Purchase': 'fabric_purchase',
                'Fabric_Purchase': 'fabric_purchase',
                'Client Order': 'client_orders',
                'Job Sheet': 'batches',
                'Lot': 'batches',
                'Batches': 'batches',
                'Karigar Ledger': 'karigar_ledger',
                'Karigar_Ledger': 'karigar_ledger'
              };
              
              // Fallback to normalized type name if not in map
              const collectionKey = map[selectedDetail.type] || selectedDetail.type.toLowerCase().replace(/[\s/]+/g, '_');
              
              if (collectionKey && (updatedAppState as any)[collectionKey]) {
                const list = (updatedAppState as any)[collectionKey];
                const index = list.findIndex((item: any) => 
                  String(item.id || item.lot_id || item.design_no || item.tank_id || item.order_id || item.card_id || item.loom_id || item.operator_id || item.style_id || item.lay_id || item.bundle_id || item.audit_id || item.return_id || item.invoice_no || item.receipt_id || item.note_id || item.dispatch_id || item.pack_id || item.doc_id) === String(selectedDetail.id)
                );
                if (index !== -1) {
                  list[index] = { ...list[index], ...updatedData };
                  setData(updatedAppState);
                }
              }
              setSelectedDetail(null);
            }}
          />
        )}
      </AnimatePresence>

      {renderNewEntryModal()}

      {showJobCard && (
        <JobCardPrint
          data={showJobCard}
          onClose={() => setShowJobCard(null)}
        />
      )}

      {showKarigarCard && (
        <KarigarJobCard
          data={showKarigarCard}
          onClose={() => setShowKarigarCard(null)}
        />
      )}

      {showOrderBook && (
        <OrderBookPDF
          data={showOrderBook}
          onClose={() => setShowOrderBook(null)}
        />
      )}

      {showGenericPDF && (
        <GenericPDF
          type={showGenericPDF.type}
          data={showGenericPDF.data}
          onClose={() => setShowGenericPDF(null)}
        />
      )}

      {selectedSlip && (
        <SalarySlipPDF
          slip={selectedSlip}
          onClose={() => setSelectedSlip(null)}
        />
      )}

      <ScannerModal />

      {aiAnalysis && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-600 text-white">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                <h3 className="text-xl font-black tracking-tight">{aiAnalysis.title}</h3>
              </div>
              <button 
                onClick={() => setAiAnalysis(null)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {aiAnalysis.loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">Analyzing ERP Intelligence...</p>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-medium">
                    {aiAnalysis.content}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setAiAnalysis(null)}
                className="px-6 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition-all"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
