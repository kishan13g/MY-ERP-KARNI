import React, { useState, useMemo, useEffect } from 'react';
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
  Bell,
  RefreshCw,
  Trash2,
  Printer,
  Plus,
  Filter,
  Sparkles,
  Send,
  Wand2,
  Ruler,
  Image as ImageIcon,
  Upload,
  Camera,
  Layers as LayersIcon,
  Maximize2,
  Download,
  QrCode,
  Leaf,
  Globe,
  TrendingUp,
  AlertTriangle,
  Star,
  FlaskConical,
  Wrench,
  MapPin,
  MessageSquare,
  IndianRupee,
  FileText
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
import { Design, Batch, Customer, FabricPurchase, KarigarLedger, GRN, FGStock, Machine, Payment, ARAging, ProductionDept, TNAEvent, MerchApproval, BuyerFeedback, WhatsAppMessage, SocialMediaPost, MaterialForecast, StageChecklist } from './types';

type Section = 
  | 'dashboard' | 'production' | 'designs' | 'orders' | 'batches' 
  | 'customers' | 'fabric' | 'grn' | 'fgstock' | 'jobs' 
  | 'qcpack' | 'challan' | 'karigar' | 'accounts' | 'payments' 
  | 'araging' | 'machines' | 'invoice' | 'costing' | 'reports' 
  | 'analytics' | 'importexport' | 'settings' | 'ai-assistant'
  | 'creative_studio' | 'cad_library'
  | 'sustainability' | 'tracking' | 'client_portal' | 'predictive' | 'smart_inventory'
  | 'hr_attendance' | 'vendor_mgmt' | 'sample_tracking' | 'maintenance'
  | 'tna' | 'merchandising' | 'labels' | 'locations' | 'feedback'
  | 'whatsapp' | 'social_media' | 'material_forecasting' | 'quality_checklists' | 'designtracker';

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

const DetailModal = ({ detail, onClose }: { detail: { type: string, id: string, data?: any }, onClose: () => void }) => {
  if (!detail) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{detail.type} Details</h3>
              <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">{detail.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {detail.data ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(detail.data).map(([key, value]) => {
                  if (typeof value === 'object' && value !== null) return null;
                  return (
                    <div key={key} className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{key.replace(/_/g, ' ')}</label>
                      <div className="text-sm font-medium text-slate-800">
                        {typeof value === 'number' && (key.includes('amt') || key.includes('value') || key.includes('amount') || key.includes('rate') || key.includes('cost') || key.includes('credit') || key.includes('debit') || key.includes('balance')) 
                          ? formatCurrency(value) 
                          : String(value)}
                      </div>
                    </div>
                  );
                })}
              </div>

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
  const [selectedDetail, setSelectedDetail] = useState<{ type: string, id: string, data?: any } | null>(null);
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
  const [aiChatMessages, setAiChatMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Hello! I am your KARNI ERP AI Assistant. How can I help you today? You can ask me about production status, financial summaries, or batch details.' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [designAnalysis, setDesignAnalysis] = useState<{ [key: string]: string }>({});
  const [isAnalyzingDesign, setIsAnalyzingDesign] = useState<string | null>(null);
  const [batchForecasts, setBatchForecasts] = useState<{ [key: string]: string }>({});
  const [isForecastingBatch, setIsForecastingBatch] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const handleGenerateImage = async () => {
    if (!aiPrompt.trim() || isGeneratingImage) return;
    setIsGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ parts: [{ text: `A high-end women's garment design: ${aiPrompt}. Professional fashion photography, studio lighting, detailed fabric texture.` }] }],
        config: {
          imageConfig: {
            aspectRatio: "3:4",
          },
        },
      });

      const newImages: string[] = [];
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          newImages.push(`data:image/png;base64,${part.inlineData.data}`);
        }
      }
      
      if (newImages.length > 0) {
        setGeneratedImages(prev => [...newImages, ...prev]);
      }
    } catch (error) {
      console.error("Image Generation Error:", error);
    } finally {
      setIsGeneratingImage(false);
    }
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
    setIsGeneratingSummary(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: 'user',
            parts: [{ text: `Generate a professional executive summary for KARNI ERP based on this data:
            - Total Designs: ${data.kpis.total_designs}
            - Total Quantity: ${data.kpis.total_qty}
            - Fabric Value: ${formatCurrency(data.kpis.fabric_value)}
            - AR Outstanding: ${formatCurrency(data.kpis.ar_outstanding)}
            - Karigar Due: ${formatCurrency(data.kpis.karigar_pending)}
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
            - Total Designs: ${data.kpis.total_designs}
            - Total Quantity: ${data.kpis.total_qty}
            - Fabric Value: ${formatCurrency(data.kpis.fabric_value)}
            - AR Outstanding: ${formatCurrency(data.kpis.ar_outstanding)}
            - Karigar Due: ${formatCurrency(data.kpis.karigar_pending)}
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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Overview' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, category: 'Overview' },
    { id: 'analytics', label: 'Analytics', icon: PieChart, category: 'Overview' },
    { id: 'reports', label: 'Reports', icon: BarChart3, category: 'Overview' },
    
    { id: 'production', label: 'Production Summary', icon: Factory, category: 'Production' },
    { id: 'designtracker', label: 'Design Tracker', icon: ClipboardList, category: 'Production' },
    { id: 'batches', label: 'Batches / Lots', icon: ClipboardList, category: 'Production' },
    { id: 'designs', label: 'Design Register', icon: Palette, category: 'Production' },
    { id: 'jobs', label: 'Job Sheets', icon: Cpu, category: 'Production' },
    { id: 'qcpack', label: 'QC & Packing', icon: CheckCircle2, category: 'Production' },
    { id: 'machines', label: 'Machine Efficiency', icon: SettingsIcon, category: 'Production' },
    
    { id: 'customers', label: 'Customers', icon: Users, category: 'Sales' },
    { id: 'orders', label: 'Orders', icon: ClipboardList, category: 'Sales' },
    { id: 'challan', label: 'Challan / Dispatch', icon: Truck, category: 'Sales' },
    { id: 'invoice', label: 'GST Invoice', icon: Receipt, category: 'Sales' },
    { id: 'araging', label: 'AR Aging', icon: CalendarDays, category: 'Sales' },
    
    { id: 'fabric', label: 'Fabric Stock', icon: Scissors, category: 'Inventory' },
    { id: 'grn', label: 'GRN Inward', icon: Inbox, category: 'Inventory' },
    { id: 'fgstock', label: 'FG Stock', icon: Package, category: 'Inventory' },
    
    { id: 'karigar', label: 'Karigar Ledger', icon: HardHat, category: 'Finance' },
    { id: 'accounts', label: 'Accounts Ledger', icon: Wallet, category: 'Finance' },
    { id: 'payments', label: 'Payments', icon: CreditCard, category: 'Finance' },
    { id: 'costing', label: 'Auto Costing', icon: Banknote, category: 'Finance' },
    
    { id: 'creative_studio', label: 'AI Design Lab', icon: Sparkles, category: 'Creative' },
    { id: 'cad_library', label: 'CAD & Patterns', icon: Ruler, category: 'Creative' },
    
    { id: 'predictive', label: 'AI Predictions', icon: TrendingUp, category: 'Advanced' },
    { id: 'tracking', label: 'Live Tracking', icon: QrCode, category: 'Advanced' },
    { id: 'client_portal', label: 'Client Portal', icon: Globe, category: 'Advanced' },
    { id: 'sustainability', label: 'Eco Tracking', icon: Leaf, category: 'Advanced' },
    { id: 'smart_inventory', label: 'Smart Stock', icon: AlertTriangle, category: 'Advanced' },
    { id: 'material_forecasting', label: 'Material Forecast', icon: TrendingUp, category: 'Advanced' },
    
    { id: 'hr_attendance', label: 'HR & Attendance', icon: Users, category: 'Operations' },
    { id: 'vendor_mgmt', label: 'Vendor Ratings', icon: Star, category: 'Operations' },
    { id: 'sample_tracking', label: 'Sample Tracker', icon: FlaskConical, category: 'Operations' },
    { id: 'maintenance', label: 'Machine Health', icon: Wrench, category: 'Operations' },
    { id: 'tna', label: 'TNA Calendar', icon: Calendar, category: 'Operations' },
    { id: 'merchandising', label: 'Merch Approvals', icon: CheckCircle2, category: 'Operations' },
    { id: 'labels', label: 'Barcode Gen', icon: QrCode, category: 'Operations' },
    { id: 'locations', label: 'Multi-Location', icon: MapPin, category: 'Operations' },
    { id: 'feedback', label: 'Buyer Feedback', icon: MessageSquare, category: 'Operations' },
    { id: 'quality_checklists', label: 'Quality Checklists', icon: CheckCircle2, category: 'Operations' },
    { id: 'whatsapp', label: 'WhatsApp Marketing', icon: MessageSquare, category: 'Marketing' },
    { id: 'social_media', label: 'Social Media Hub', icon: Globe, category: 'Marketing' },
    
    { id: 'importexport', label: 'Import/Export', icon: FileDown, category: 'System' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, category: 'System' },
  ];

  const categories = Array.from(new Set(navItems.map(item => item.category)));

  const [showNewEntryModal, setShowNewEntryModal] = useState<{ type: string; title: string } | null>(null);
  const [selectedDesignId, setSelectedDesignId] = useState<string>('');
  const [activeDTTab, setActiveDTTab] = useState<string>('summary');
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState<boolean>(false);
  const [isExportingToGoogle, setIsExportingToGoogle] = useState<string | null>(null);
  const [showGoogleImportModal, setShowGoogleImportModal] = useState<boolean>(false);
  const [importingType, setImportingType] = useState<string>('Batch Management');
  const [spreadsheetId, setSpreadsheetId] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isBulkExporting, setIsBulkExporting] = useState<boolean>(false);

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

  const handleGoogleAuth = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();
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
        
        // Simple mapping logic based on type
        if (importingType === 'Batch Management') {
          const newBatches = rows.map((row: any[]) => ({
            id: Math.random().toString(36).substr(2, 9),
            lot_id: row[0] || '',
            style: row[1] || '',
            customer: row[2] || '',
            color: row[3] || '',
            qty: parseInt(row[4]) || 0,
            stage: row[5] || 'Cutting',
            status: row[6] || 'Active',
            delivery: row[7] || new Date().toISOString().split('T')[0],
            priority: row[8] || 'Medium',
          }));
          setData(prev => ({ ...prev, batches: [...newBatches, ...prev.batches] }));
        } else if (importingType === 'Fabric Purchase Register') {
          const newFabric = rows.map((row: any[]) => ({
            id: Math.random().toString(36).substr(2, 9),
            date: row[0] || new Date().toISOString().split('T')[0],
            challan: row[1] || '',
            party: row[2] || '',
            item: row[3] || '',
            color: row[4] || '',
            meter: parseFloat(row[5]) || 0,
            rate: parseFloat(row[6]) || 0,
            amount: parseFloat(row[7]) || 0,
            status: row[8] || 'Pending',
          }));
          setData(prev => ({ ...prev, fabric_purchase: [...newFabric, ...prev.fabric_purchase] }));
        } else if (importingType === 'Karigar Ledger') {
          const newKarigar = rows.map((row: any[]) => ({
            id: Math.random().toString(36).substr(2, 9),
            date: row[0] || new Date().toISOString().split('T')[0],
            name: row[1] || '',
            work: row[2] || '',
            debit: parseFloat(row[3]) || 0,
            credit: parseFloat(row[4]) || 0,
            balance: parseFloat(row[5]) || 0,
            dept: row[6] || 'Stitching',
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

  const handleBulkExport = async () => {
    if (!isGoogleAuthenticated) {
      handleGoogleAuth();
      return;
    }

    setIsBulkExporting(true);
    try {
      const datasets = [
        {
          sheetName: 'Batches',
          headers: ['Lot ID', 'Style', 'Customer', 'Color', 'Qty', 'Stage', 'Status', 'Delivery', 'Priority'],
          rows: data.batches.map(b => [b.lot_id, b.style, b.customer, b.color, b.qty, b.stage, b.status, b.delivery, b.priority])
        },
        {
          sheetName: 'Fabric',
          headers: ['Date', 'Challan', 'Party', 'Item', 'Color', 'Meter', 'Rate', 'Amount', 'Status'],
          rows: data.fabric_purchase.map(f => [f.date, f.challan, f.party, f.item, f.color, f.meter, f.rate, f.amount, f.status])
        },
        {
          sheetName: 'Karigar',
          headers: ['Date', 'Karigar Name', 'Work Description', 'Debit', 'Credit', 'Balance', 'Dept'],
          rows: data.karigar_ledger.map(r => [r.date, r.name, r.work, r.debit, r.credit, r.balance, r.dept])
        },
        {
          sheetName: 'Designs',
          headers: ['Design Name', 'Category', 'Status', 'Created At'],
          rows: data.designs.map(d => [d.name, d.category, d.status, d.created_at])
        },
        {
          sheetName: 'Customers',
          headers: ['Name', 'Email', 'Phone', 'Address', 'Total Orders'],
          rows: data.customers.map(c => [c.name, c.email, c.mobile, c.city, c.lifetime_value])
        }
      ];

      const res = await fetch('/api/google/sheets/export-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName: 'KARNI IMPEX', datasets }),
      });
      const result = await res.json();
      if (result.success) {
        window.open(result.url, '_blank');
      } else {
        alert("Bulk export failed: " + result.error);
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
        body: JSON.stringify({ title, headers, rows }),
      });
      const result = await res.json();
      if (result.success) {
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

  const handleExport = (title: string, mode: 'csv' | 'google' = 'csv') => {
    let csvContent = "";
    let fileName = `${title.toLowerCase().replace(/\s+/g, '_')}_export.csv`;
    let headers: string[] = [];
    let rows: any[][] = [];

    const generateCSV = (h: string[], r: any[][]) => {
      headers = h;
      rows = r;
      return [h.join(','), ...r.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    };

    if (title === 'Batch Management' || title === 'Master Job Sheets' || title.includes('Job Sheets')) {
      const h = ['Lot ID', 'Style', 'Customer', 'Color', 'Qty', 'Stage', 'Status', 'Delivery', 'Priority'];
      csvContent = generateCSV(h, data.batches.map(b => [b.lot_id, b.style, b.customer, b.color, b.qty, b.stage, b.status, b.delivery, b.priority]));
    } else if (title === 'Fabric Lotting Register' || title === 'Fabric Purchase Register') {
      const h = ['Date', 'Challan', 'Party', 'Item', 'Color', 'Meter', 'Rate', 'Amount', 'Status'];
      csvContent = generateCSV(h, data.fabric_purchase.map(f => [f.date, f.challan, f.party, f.item, f.color, f.meter, f.rate, f.amount, f.status]));
    } else if (title.includes('Karigar Ledger') || title === 'Karigar List') {
      const h = ['Date', 'Karigar Name', 'Work Description', 'Debit', 'Credit', 'Balance', 'Dept'];
      csvContent = generateCSV(h, data.karigar_ledger.map(r => [r.date, r.name, r.work, r.debit, r.credit, r.balance, r.dept]));
    } else if (title === 'Design Tracker' || title === 'Design Register') {
      const h = ['Design Name', 'Category', 'Status', 'Created At'];
      csvContent = generateCSV(h, data.designs.map(d => [d.name, d.category, d.status, d.created_at]));
    } else if (title === 'Customer Master') {
      const h = ['Name', 'Email', 'Phone', 'Address', 'Total Orders'];
      csvContent = generateCSV(h, data.customers.map(c => [c.name, c.email, c.phone, c.address, c.total_orders]));
    } else if (title === 'Packing Register') {
      const h = ['Variety Name', 'Details'];
      csvContent = generateCSV(h, data.packing_varieties.map(v => [v.name, v.details]));
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

  const renderNewEntryModal = () => {
    if (!showNewEntryModal) return null;

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
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Lot No</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="e.g. LOT-501" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Design No</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="e.g. D-101" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Quantity</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Karigar / Vendor</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="Select Karigar" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Remarks</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm h-20" placeholder="Special instructions..."></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowNewEntryModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={() => setShowNewEntryModal(null)} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Create Job Sheet</button>
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
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">{showNewEntryModal.title}</h3>
              <button onClick={() => setShowNewEntryModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Variety Name</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. Single Needle Stitching" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Technical Details</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24" placeholder="Enter specifications..."></textarea>
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
    const k = data.kpis;
    const kpiCards = [
      { id: 'designs', section: 'designs', label: 'Active Designs', value: k.total_designs, sub: 'In production', icon: Palette, color: 'text-amber-500', bg: 'bg-amber-500/10' },
      { id: 'qty', section: 'batches', label: 'Total Qty', value: k.total_qty.toLocaleString(), sub: 'Pieces', icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
      { id: 'fabric', section: 'fabric', label: 'Fabric Value', value: formatCurrency(k.fabric_value), sub: 'Current stock', icon: Scissors, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
      { id: 'ar', section: 'araging', label: 'AR Outstanding', value: formatCurrency(k.ar_outstanding), sub: 'Receivable', icon: CalendarDays, color: 'text-rose-500', bg: 'bg-rose-500/10' },
      { id: 'karigar', section: 'karigar', label: 'Karigar Due', value: formatCurrency(k.karigar_pending), sub: 'Payable', icon: HardHat, color: 'text-pink-500', bg: 'bg-pink-500/10' },
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

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Production Status — Issued vs Received</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.production}>
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
              dept.pending > 0 && "bg-amber-50/30"
            )}>
              <div className="text-2xl font-bold text-slate-800 font-mono">{dept.issued - dept.received}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{dept.full}</div>
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
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${batch.progress}%` }} />
                </div>
                <span className="text-[10px] font-bold text-slate-600">{batch.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
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

  const renderCreativeStudio = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">AI Design Lab</h3>
          <p className="text-sm text-slate-500">Generate and visualize new garment concepts using AI</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Upload className="w-4 h-4" /> Upload Reference
          </button>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
            <Download className="w-4 h-4" /> Export All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generation Controls */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Design Prompt</label>
            <textarea 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., A floral print summer dress with bohemian style, silk fabric, vibrant colors..."
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fabric Type</label>
              <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none">
                <option>Silk</option>
                <option>Cotton</option>
                <option>Linen</option>
                <option>Chiffon</option>
                <option>Georgette</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Style Category</label>
              <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none">
                <option>Ethnic Wear</option>
                <option>Western Wear</option>
                <option>Indo-Western</option>
                <option>Formal</option>
                <option>Casual</option>
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
            {isGeneratingImage ? 'Generating Design...' : 'Generate AI Design'}
          </button>

          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Quick Presets</h4>
            <div className="flex flex-wrap gap-2">
              {['Floral Print', 'Embroidered Silk', 'Modern Kurti', 'Evening Gown', 'Sustainable Cotton'].map(preset => (
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

        {/* Generation Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-bold text-slate-800">Design Canvas</h4>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            {generatedImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedImages.map((img, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
                  >
                    <img src={img} alt={`AI Generated ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 p-6 text-center">
                      <p className="text-white text-xs font-medium">Generated concept for "{aiPrompt.substring(0, 30)}..."</p>
                      <div className="flex gap-2">
                        <button className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">Save to Library</button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">Create Tech Pack</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-slate-400 gap-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-sm font-medium">Enter a prompt and click generate to see AI concepts</p>
              </div>
            )}
          </div>
        </div>
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
                  <div className="flex items-center gap-1"><LayersIcon className="w-3 h-3" /> 8 Pieces</div>
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
                          <td className="py-2 text-right font-bold text-blue-600">{r.qty}</td>
                          <td className="py-2 text-right font-bold text-slate-800">{(r.qty * r.rate).toFixed(2)}</td>
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

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'ai-assistant': return renderAIAssistant();
      case 'production': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Department-wise Production</h3>
            <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-900 transition-colors">Export Summary</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.production.map((dept, i) => {
                const pct = Math.round((dept.received / dept.issued) * 100) || 0;
                return (
                  <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-bold text-slate-800">{dept.full}</div>
                      <div className={cn("text-xs font-bold", pct > 90 ? "text-emerald-500" : pct > 70 ? "text-amber-500" : "text-rose-500")}>{pct}%</div>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Issued: {dept.issued}</span>
                      <span>Recd: {dept.received}</span>
                      <span className="text-rose-500">Pend: {dept.pending}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
      );
      case 'designs': return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Design Register</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('Design Register', 'google')}
                disabled={isExportingToGoogle === 'Design Register'}
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-2"
              >
                {isExportingToGoogle === 'Design Register' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                Sync Google Sheets
              </button>
              <button 
                onClick={() => handleExport('Design Register', 'csv')}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> CSV
              </button>
              <button 
                onClick={() => setShowNewEntryModal({ type: 'Design', title: 'Create New Design' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                + New Design
              </button>
            </div>
          </div>
          {renderTable(
            ['ID', 'Name', 'Buyer', 'Qty', 'Status', 'AI Analysis', 'Action'],
            data.designs,
            (d: Design, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3">
                  <button 
                    onClick={() => setSelectedDetail({ type: 'Design', id: d.id, data: d })}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    {d.id}
                  </button>
                </td>
                <td className="px-4 py-3 text-xs font-medium text-slate-800">{d.name}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{d.buyer}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{d.qty}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    d.status === 'Dispatched' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                  )}>{d.status}</span>
                </td>
                <td className="px-4 py-3">
                  {designAnalysis[d.id] ? (
                    <div className="text-[10px] text-slate-600 italic max-w-[200px] leading-tight">
                      {designAnalysis[d.id]}
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleDesignAnalysis(d.id, d.name)}
                      disabled={isAnalyzingDesign === d.id}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-all disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3" />
                      {isAnalyzingDesign === d.id ? 'Analyzing...' : 'AI Suggest'}
                    </button>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'batches': return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Batch / Lot Management</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('Batch Management', 'google')}
                disabled={isExportingToGoogle === 'Batch Management'}
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-2"
              >
                {isExportingToGoogle === 'Batch Management' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                Sync Google Sheets
              </button>
              <button 
                onClick={() => handleExport('Batch Management', 'csv')}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> CSV
              </button>
              <button 
                onClick={() => setShowNewEntryModal({ type: 'Batch', title: 'Create New Batch' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                + Create Batch
              </button>
            </div>
          </div>
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Customer Master</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('Customer Master', 'google')}
                disabled={isExportingToGoogle === 'Customer Master'}
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-2"
              >
                {isExportingToGoogle === 'Customer Master' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                Sync Google Sheets
              </button>
              <button 
                onClick={() => handleExport('Customer Master', 'csv')}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> CSV
              </button>
              <button 
                onClick={() => setShowNewEntryModal({ type: 'Customer', title: 'Add New Customer' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                + Add Customer
              </button>
            </div>
          </div>
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
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Fabric Purchase Register</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleExport('Fabric Purchase Register', 'google')}
                    disabled={isExportingToGoogle === 'Fabric Purchase Register'}
                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-2"
                  >
                    {isExportingToGoogle === 'Fabric Purchase Register' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                    Sync Google Sheets
                  </button>
                  <button 
                    onClick={() => handleExport('Fabric Purchase Register', 'csv')}
                    className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> CSV
                  </button>
                  <button 
                    onClick={() => setActiveSection('material_forecasting')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" /> Forecast Report
                  </button>
                  <button 
                    onClick={() => setShowNewEntryModal({ type: 'GRN', title: 'New Fabric GRN Entry' })}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    + GRN Entry
                  </button>
                </div>
              </div>
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
              <h3 className="text-lg font-bold text-slate-800">Fabric Stock Register</h3>
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
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Fabric Issue Log</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleExport('Fabric Issue Log')}
                    className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Export
                  </button>
                  <button 
                    onClick={() => setShowNewEntryModal({ type: 'Fabric Issue', title: 'New Fabric Issue Entry' })}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    + Issue Entry
                  </button>
                </div>
              </div>
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
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Market Running Fabrics</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  High Demand Trends
                </div>
              </div>
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">GRN Inward Register</h3>
              <div className="flex gap-2">
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
                <button 
                  onClick={() => setShowNewEntryModal({ type: 'GRN', title: 'Create New GRN' })}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> New GRN
                </button>
              </div>
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Finished Goods Stock</h3>
              <div className="flex gap-2">
                <select 
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={fgFilterStatus}
                  onChange={(e) => setFgFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-900 transition-colors">Stock Adjustment</button>
              </div>
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Machine Efficiency Tracker</h3>
              <div className="flex gap-2">
                <select 
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={machineFilterStatus}
                  onChange={(e) => setMachineFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">+ Add Machine</button>
              </div>
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Karigar Master</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('Karigar Ledger', 'google')}
                disabled={isExportingToGoogle === 'Karigar Ledger'}
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-2"
              >
                {isExportingToGoogle === 'Karigar Ledger' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                Sync Google Sheets
              </button>
              <button 
                onClick={() => handleExport('Karigar List', 'csv')}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> CSV
              </button>
              <button 
                onClick={() => setShowNewEntryModal({ type: 'Karigar', title: 'Add New Karigar' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                + Add Karigar
              </button>
              <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-900 transition-colors">+ Ledger Entry</button>
            </div>
          </div>
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
                  <button className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Payment Register</h3>
              <div className="flex gap-2">
                <select 
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={paymentFilterStatus}
                  onChange={(e) => setPaymentFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">+ Record Payment</button>
              </div>
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">AR Aging Report</h3>
              <div className="flex gap-2">
                <select 
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={arFilterParty}
                  onChange={(e) => setArFilterParty(e.target.value)}
                >
                  <option value="">All Parties</option>
                  {parties.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-900 transition-colors">Export Report</button>
              </div>
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
      case 'analytics': return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Order Status Split</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={[
                      { name: 'In Progress', value: 4 },
                      { name: 'QC Stage', value: 1 },
                      { name: 'Dispatched', value: 1 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Department Efficiency %</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.production}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="received" fill="#10b981" radius={[4, 4, 0, 0]} name="Received" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Production Pipeline Status — 7 Day Trend</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PIPELINE_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="issued" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} name="Issued" />
                  <Line type="monotone" dataKey="received" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} name="Received" />
                  <Line type="monotone" dataKey="pending" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} name="Pending" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
      case 'jobs': return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-800">Job Sheets & Stage Varieties</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <button 
                onClick={() => setActiveSection('quality_checklists')}
                className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Manage Checklists
              </button>
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
                    "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                    jobSubtab === dept.id 
                      ? "bg-slate-900 text-white border-slate-900" 
                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  )}
                >
                  {dept.label}
                </button>
              ))}
            </div>
          </div>

          {jobSubtab === 'master' ? (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Master Production Job Sheets</h4>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleExport('Master Job Sheets')}
                      className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
                    >
                      Export All
                    </button>
                    <button 
                      onClick={() => setShowNewEntryModal({ type: 'Job Sheet', title: 'Create New Job Sheet' })}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors"
                    >
                      + New Job Sheet
                    </button>
                  </div>
                </div>
                {renderTable(
                  ['Lot ID', 'Style', 'Current Stage', 'Qty', 'Priority', 'Checklist Status', 'Actions'],
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
                          onClick={() => setSelectedDetail({ type: 'Lot', id: b.lot_id, data: b })}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
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
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Fabric Lotting & Collection</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Initial fabric allocation and lot creation</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleExport('Fabric Lotting Register')}
                      className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
                    >
                      Export
                    </button>
                    <button 
                      onClick={() => setShowNewEntryModal({ type: 'Lotting', title: 'New Fabric Lotting' })}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                      + New Lotting
                    </button>
                  </div>
                </div>
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
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Fabric Lot Job Sheets</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Track fabric collection and preparation</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowNewEntryModal({ type: 'Job Sheet', title: 'Create Fabric Lot Job Sheet' })}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                  >
                    + Create Job Sheet
                  </button>
                </div>
                {renderTable(
                  ['ID', 'Lot No', 'Design', 'Qty', 'Status', 'Actions'],
                  data.job_sheets.filter(s => s.current_stage === 'Fabric Lot'),
                  (s, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs font-bold text-slate-800">{s.id}</td>
                      <td className="px-4 py-3 text-xs font-bold text-blue-600">{s.lot_no}</td>
                      <td className="px-4 py-3 text-xs text-slate-800">{s.design_no}</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-800">{s.qty}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                          s.status === 'Completed' ? "bg-emerald-100 text-emerald-600" : s.status === 'In Progress' ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"
                        )}>{s.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                          <FileText className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                )}
                {data.job_sheets.filter(s => s.current_stage === 'Fabric Lot').length === 0 && (
                  <div className="py-12 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-slate-200" />
                    </div>
                    <p className="text-xs text-slate-400 font-medium">No active fabric lot job sheets</p>
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
                    if (jobSubtab === 'embr') return cat === 'embroidery';
                    if (jobSubtab === 'cutt') return cat === 'cutting';
                    if (jobSubtab === 'stitch') return cat === 'stitching';
                    if (jobSubtab === 'press') return cat === 'pressing';
                    return cat === jobSubtab.toLowerCase();
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
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">{jobSubtab} Job Sheets</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Track active {jobSubtab} work orders</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleExport(`${jobSubtab} Job Sheets`)}
                      className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
                    >
                      Export
                    </button>
                    <button 
                      onClick={() => setShowNewEntryModal({ type: 'Job Sheet', title: `Create ${jobSubtab} Job Sheet` })}
                      className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                      + Create Job Sheet
                    </button>
                  </div>
                </div>
                {renderTable(
                  ['ID', 'Lot No', 'Design', 'Qty', 'Karigar', 'Issued', 'Status', 'Actions'],
                  data.job_sheets.filter(s => {
                    const stage = s.current_stage.toLowerCase();
                    if (jobSubtab === 'embr') return stage === 'embroidery';
                    if (jobSubtab === 'cutt') return stage === 'cutting';
                    if (jobSubtab === 'stitch') return stage === 'stitching';
                    if (jobSubtab === 'press') return stage === 'qc & pressing';
                    if (jobSubtab === 'fabric_lot') return stage === 'fabric lot';
                    return stage === jobSubtab.toLowerCase();
                  }),
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
                        <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                          <FileText className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                )}
                {data.job_sheets.filter(s => {
                  const stage = s.current_stage.toLowerCase();
                  if (jobSubtab === 'embr') return stage === 'embroidery';
                  if (jobSubtab === 'cutt') return stage === 'cutting';
                  if (jobSubtab === 'stitch') return stage === 'stitching';
                  if (jobSubtab === 'press') return stage === 'qc & pressing';
                  return stage === jobSubtab.toLowerCase();
                }).length === 0 && (
                  <div className="py-12 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-slate-200" />
                    </div>
                    <p className="text-xs text-slate-400 font-medium">No active job sheets for {jobSubtab}</p>
                  </div>
                )}
              </div>

              {/* Karigar Ledger Section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <HardHat className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">{jobSubtab} Karigar Ledger</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Payment and work history for {jobSubtab} department</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleExport(`${jobSubtab} Karigar Ledger`)}
                      className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
                    >
                      Export
                    </button>
                    <button 
                      onClick={() => setShowNewEntryModal({ type: 'Karigar Entry', title: `New ${jobSubtab} Karigar Entry` })}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                      + New Entry
                    </button>
                  </div>
                </div>
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
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">QC Checker Report & Design Checklists</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleExport('QC Report')}
                    className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Export
                  </button>
                  <button 
                    onClick={() => setShowNewEntryModal({ type: 'QC Entry', title: 'New QC Entry' })}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    + QC Entry
                  </button>
                </div>
              </div>

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
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Packing Varieties & Register</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleExport('Packing Register')}
                    className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Export
                  </button>
                  <button 
                    onClick={() => setShowNewEntryModal({ type: 'Packing Entry', title: 'New Packing Entry' })}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    + Packing Entry
                  </button>
                </div>
              </div>

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
      case 'challan': return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Challan / Dispatch Register</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('Challan Register')}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button 
                onClick={() => setShowNewEntryModal({ type: 'Challan', title: 'New Challan Entry' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                + New Challan
              </button>
            </div>
          </div>
          {renderTable(
            ['Date', 'Challan No', 'Party', 'Design', 'Qty', 'Rate', 'Total', 'Paid', 'Balance', 'Status', 'Action'],
            data.payments.map((p, i) => ({ ...p, qty: 100, rate: 500, total: 50000, balance: 50000 - p.amount })),
            (r, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => setSelectedDetail({ type: 'Challan', id: `CH-${100+i}`, data: r })}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    CH-{100+i}
                  </button>
                </td>
                <td className="px-4 py-3 text-xs text-slate-800">{r.party}</td>
                <td className="px-4 py-3 text-xs text-slate-500">Design {i+1}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.qty}</td>
                <td className="px-4 py-3 text-xs text-slate-500">₹{r.rate}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{formatCurrency(r.total)}</td>
                <td className="px-4 py-3 text-xs text-emerald-600">{formatCurrency(r.amount)}</td>
                <td className="px-4 py-3 text-xs font-bold text-rose-600">{formatCurrency(r.balance)}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-emerald-100 text-emerald-600">Generated</span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'invoice': return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">GST Invoice Register</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('Invoice Register')}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button 
                onClick={() => setShowNewEntryModal({ type: 'Invoice', title: 'Create New Invoice' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                + Create Invoice
              </button>
            </div>
          </div>
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
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Accounts Ledger</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('Accounts Ledger')}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button 
                onClick={() => setShowNewEntryModal({ type: 'Account Entry', title: 'Add New Account Entry' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                + Add Entry
              </button>
            </div>
          </div>
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Estimated vs Actual Costing</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('Costing Data')}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button 
                onClick={() => setShowNewEntryModal({ type: 'Costing', title: 'New Costing Entry' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                + New Costing
              </button>
            </div>
          </div>
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">TNA (Time & Action) Calendar</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('TNA Calendar')}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button 
                onClick={() => setShowNewEntryModal({ type: 'TNA Activity', title: 'Add TNA Activity' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                + Add Activity
              </button>
            </div>
          </div>
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Merchandising Approvals</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('Merchandising Approvals')}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button 
                onClick={() => setShowNewEntryModal({ type: 'Merchandising Submission', title: 'New Merchandising Submission' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                + New Submission
              </button>
            </div>
          </div>
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
      case 'labels': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Barcode / QR Label Generator</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('Labels Data')}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">Print Batch Labels</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.batches.slice(0, 6).map((b, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-3">
                <QrCode className="w-24 h-24 text-slate-800" />
                <div className="text-center">
                  <div className="text-sm font-bold text-slate-800">{b.lot_id}</div>
                  <div className="text-[10px] text-slate-500">{b.style}</div>
                  <div className="text-[10px] text-slate-400">{b.color} · Qty: {b.qty}</div>
                </div>
                <button className="w-full bg-slate-50 text-slate-600 py-1.5 rounded-lg text-[10px] font-bold border border-slate-100 hover:bg-slate-100 transition-all">
                  Download Label
                </button>
              </div>
            ))}
          </div>
        </div>
      );
      case 'locations': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Multi-Location Inventory</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('Locations Data')}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button 
                onClick={() => setShowNewEntryModal({ type: 'Location', title: 'Add New Location' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                + Add Location
              </button>
            </div>
          </div>
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Buyer Feedback & Revision Log</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('Buyer Feedback')}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button 
                onClick={() => setShowNewEntryModal({ type: 'Feedback', title: 'New Feedback Entry' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                + New Feedback
              </button>
            </div>
          </div>
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
      case 'whatsapp': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">WhatsApp Communication Hub</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('WhatsApp Messages')}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button 
                onClick={() => setShowNewEntryModal({ type: 'WhatsApp Broadcast', title: 'Broadcast New Message' })}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Broadcast Message
              </button>
            </div>
          </div>
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
      case 'social_media': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Social Media Marketing Hub</h3>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">+ Schedule Post</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.social_posts.map((post, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      post.platform === 'Instagram' ? "bg-pink-500" :
                      post.platform === 'Facebook' ? "bg-blue-600" :
                      post.platform === 'LinkedIn' ? "bg-blue-800" : "bg-sky-400"
                    )} />
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
                <div className="p-4 flex-1">
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4">{post.content}</p>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {post.status === 'Published' ? 'Published on' : 'Scheduled for'}: {post.scheduled_date}
                  </div>
                </div>
                {post.engagement && (
                  <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
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
                  </div>
                )}
                <div className="p-3 border-t border-slate-100 flex gap-2">
                  <button className="flex-1 text-[10px] font-bold text-slate-600 hover:bg-slate-50 py-1.5 rounded-lg transition-all border border-slate-100">Edit</button>
                  <button className="flex-1 text-[10px] font-bold text-rose-600 hover:bg-rose-50 py-1.5 rounded-lg transition-all border border-rose-100">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'material_forecasting': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">AI Material Forecasting</h3>
            <div className="flex gap-2">
              <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
                <FileDown className="w-4 h-4" /> Export Report
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Recalculate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {renderTable(
                ['Fabric Item', 'Current Stock', 'Required Qty', 'Shortfall', 'Suggested Purchase', 'Lead Time', 'Priority'],
                data.material_forecasts,
                (r: MaterialForecast, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-bold text-slate-800">{r.fabric_item}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{r.current_stock}m</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{r.required_qty}m</td>
                    <td className="px-4 py-3 text-xs font-bold text-rose-600">{r.shortfall}m</td>
                    <td className="px-4 py-3 text-xs font-bold text-emerald-600">{r.suggested_purchase}m</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{r.lead_time_days} Days</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                        r.priority === 'High' ? "bg-rose-100 text-rose-600" :
                        r.priority === 'Medium' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                      )}>
                        {r.priority}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> AI Insights
                </h4>
                <div className="space-y-4">
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <div className="text-xs font-bold text-indigo-800 mb-1">Critical Shortage</div>
                    <p className="text-[10px] text-indigo-600">Cotton Voile stock is critically low for LOT-001 and LOT-004. Immediate purchase recommended.</p>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <div className="text-xs font-bold text-amber-800 mb-1">Lead Time Warning</div>
                    <p className="text-[10px] text-amber-600">Silk Satin has a 14-day lead time. Order now to avoid production delays in mid-April.</p>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <div className="text-xs font-bold text-emerald-800 mb-1">Optimization Tip</div>
                    <p className="text-[10px] text-emerald-600">Bulk purchase of Georgette could save 5% on material costs based on current market trends.</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl text-white">
                <h4 className="font-bold mb-4">Forecast Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Total Fabric Needed:</span>
                    <span className="text-sm font-bold">2,900m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Estimated Cost:</span>
                    <span className="text-sm font-bold">₹2,45,000</span>
                  </div>
                  <div className="pt-3 border-t border-slate-800">
                    <button className="w-full bg-indigo-600 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all">
                      Generate Purchase Orders
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      case 'quality_checklists': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Quality Checklists by Stage</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Parameter
            </button>
          </div>
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
      case 'creative_studio': return renderCreativeStudio();
      case 'cad_library': return renderCADLibrary();
      case 'reports': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">System Reports</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">Download PDF</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">AI Executive Summary</h3>
                <button 
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingSummary}
                  className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" />
                  {isGeneratingSummary ? 'Generating...' : 'Regenerate'}
                </button>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 min-h-[200px]">
                {aiSummary ? (
                  <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {aiSummary}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 py-8">
                    <Sparkles className="w-8 h-8 opacity-20" />
                    <p className="text-xs font-medium">Click regenerate to get AI insights</p>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Production Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Dyeing', 'Print', 'Embroidery', 'Cutting', 'Handwork', 'Stitching', 'QC', 'Packing'].map((t, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-600">{Math.floor(Math.random() * 10) + 1}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">{t}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Financial Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <span className="text-sm font-medium text-emerald-800">Total Credit</span>
                  <span className="text-lg font-bold text-emerald-600">{formatCurrency(540000)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg border border-rose-100">
                  <span className="text-sm font-medium text-rose-800">Total Debit</span>
                  <span className="text-lg font-bold text-rose-600">{formatCurrency(320000)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="text-sm font-medium text-blue-800">Net Balance</span>
                  <span className="text-lg font-bold text-blue-600">{formatCurrency(220000)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      case 'importexport': return (
        <div className="space-y-6">
          {/* Quick Sync Dashboard */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">Direct Google Sheets Sync</h3>
                </div>
                <p className="text-slate-400 text-sm max-w-md">
                  Sync your entire ERP data directly with Google Sheets. No files, no downloads—just direct cloud integration.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {!isGoogleAuthenticated ? (
                  <button 
                    onClick={handleGoogleAuth}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
                  >
                    <Globe className="w-4 h-4" /> Connect Google Account
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleBulkExport}
                      disabled={isBulkExporting}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                    >
                      {isBulkExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {isBulkExporting ? "Syncing..." : "Sync All to Google Sheets"}
                    </button>
                    <button 
                      onClick={() => setShowGoogleImportModal(true)}
                      className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center gap-2 shadow-lg shadow-white/10"
                    >
                      <Download className="w-4 h-4" /> Import from Sheets
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32" />
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
                  'Batch Management',
                  'Design Register',
                  'Fabric Purchase Register',
                  'Karigar Ledger',
                  'Customer Master'
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
          </div>
        </div>
      );
      case 'settings': return (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Company Settings</h3>
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
      );
      case 'orders': return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Order Book</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">+ New Order</button>
          </div>
          {renderTable(
            ['Order No', 'Date', 'Customer', 'Style', 'Color', 'Qty', 'Rate', 'Delivery', 'Status'],
            data.batches.map((b, i) => ({ ...b, order_no: `ORD-${100+i}`, date: '2026-03-20', rate: 850 })),
            (r, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3">
                  <button 
                    onClick={() => setSelectedDetail({ type: 'Order', id: r.order_no, data: r })}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    {r.order_no}
                  </button>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                <td className="px-4 py-3 text-xs text-slate-800 font-medium">{r.customer}</td>
                <td className="px-4 py-3 text-xs text-slate-800">{r.style}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.color}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{r.qty}</td>
                <td className="px-4 py-3 text-xs text-slate-500">₹{r.rate}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.delivery}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-amber-100 text-amber-600">In Progress</span>
                </td>
              </tr>
            )
          )}
        </div>
      );
      case 'predictive': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">AI Predictive Analytics</h3>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">AI Forecasting Active</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.predictive_delays.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm font-bold text-slate-800">{p.lot_id}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">{p.design_id}</div>
                  </div>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    p.impact_level === 'High' ? "bg-rose-100 text-rose-600" : 
                    p.impact_level === 'Medium' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                  )}>{p.impact_level} Risk</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Predicted Delay:</span>
                    <span className="text-sm font-bold text-slate-800">{p.predicted_delay_days} Days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Confidence:</span>
                    <span className="text-sm font-bold text-blue-600">{p.confidence_score}%</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">AI Reason</div>
                    <div className="text-xs text-slate-600 italic">"{p.reason}"</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'tracking': return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Live RFID / QR Bundle Tracking</h3>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              Scan Bundle
            </button>
          </div>
          {renderTable(
            ['Bundle ID', 'Lot ID', 'Design', 'Current Stage', 'Location', 'Operator', 'Last Scan'],
            data.bundle_tracking,
            (b, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{b.id}</td>
                <td className="px-4 py-3 text-xs text-blue-600 font-bold">{b.lot_id}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{b.design_id}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-blue-100 text-blue-600">{b.current_stage}</span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{b.location}</td>
                <td className="px-4 py-3 text-xs text-slate-800">{b.operator}</td>
                <td className="px-4 py-3 text-xs text-slate-400 font-mono">{b.last_scan_time}</td>
              </tr>
            )
          )}
        </div>
      );
      case 'client_portal': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">B2B Client Portal (Buyer View)</h3>
            <div className="text-xs text-slate-500">Viewing as: <span className="font-bold text-slate-800">All Clients</span></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.client_orders.map((o, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">Order ID</div>
                    <div className="text-sm font-bold text-slate-800">{o.id}</div>
                  </div>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    o.status === 'Dispatched' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                  )}>{o.status}</span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Client:</span>
                    <span className="text-xs font-bold text-slate-800">{o.client_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Design:</span>
                    <span className="text-xs font-bold text-slate-800">{o.design_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Quantity:</span>
                    <span className="text-xs font-bold text-slate-800">{o.qty} Pcs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Est. Delivery:</span>
                    <span className="text-xs font-bold text-amber-600">{o.estimated_delivery}</span>
                  </div>
                </div>
                <button className="w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                  View Full Status
                </button>
              </div>
            ))}
          </div>
        </div>
      );
      case 'sustainability': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Eco-Tracking & Sustainability</h3>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Eco-Certified Facility</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Avg Waste</div>
              <div className="text-xl font-bold text-slate-800">11.9 kg <span className="text-xs text-rose-500 font-normal">/day</span></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Water Usage</div>
              <div className="text-xl font-bold text-slate-800">450 L <span className="text-xs text-blue-500 font-normal">/day</span></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Organic Fabric</div>
              <div className="text-xl font-bold text-emerald-600">63.3%</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Carbon Score</div>
              <div className="text-xl font-bold text-blue-600">80.6 <span className="text-xs text-slate-400 font-normal">/100</span></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-4">Sustainability Trends</h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.sustainability}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="fabric_waste_kg" name="Waste (kg)" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="organic_fabric_percent" name="Organic %" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
      case 'smart_inventory': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Smart Inventory (Deadstock Alerts)</h3>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-full">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-tight">Capital Optimization Active</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.deadstock_alerts.map((a, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-rose-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm font-bold text-slate-800">{a.fabric_name}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">ID: {a.fabric_id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-rose-600">{a.days_idle} Days Idle</div>
                    <div className="text-[10px] text-slate-400">Last used: {a.last_used_date}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4 p-3 bg-slate-50 rounded-lg">
                  <span className="text-xs text-slate-500">Stock Value:</span>
                  <span className="text-sm font-bold text-slate-800">{formatCurrency(a.stock_value)}</span>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1">
                    <Sparkles className="w-3 h-3" />
                    Smart Suggestion
                  </div>
                  <div className="text-xs text-slate-700 font-medium">"{a.suggestion}"</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'hr_attendance': return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Karigar Attendance & Payroll</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">+ Mark Attendance</button>
          </div>
          {renderTable(
            ['ID', 'Name', 'Department', 'Date', 'Status', 'Check In', 'Check Out', 'OT Hrs'],
            data.karigar_attendance,
            (k, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{k.id}</td>
                <td className="px-4 py-3 text-xs text-slate-800 font-medium">{k.name}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{k.dept}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{k.date}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    k.status === 'Present' ? "bg-emerald-100 text-emerald-600" : 
                    k.status === 'Half Day' ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                  )}>{k.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{k.check_in || '—'}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{k.check_out || '—'}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{k.overtime_hrs}h</td>
              </tr>
            )
          )}
        </div>
      );
      case 'vendor_mgmt': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Vendor Performance Ratings</h3>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold">Audit Vendor</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.vendor_ratings.map((v, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm font-bold text-slate-800">{v.name}</div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold">{v.overall_rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {['Quality', 'Delivery', 'Price'].map(metric => (
                    <div key={metric} className="space-y-1">
                      <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-400">
                        <span>{metric} Score</span>
                        <span>{(v as any)[`${metric.toLowerCase()}_score`]}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${(v as any)[`${metric.toLowerCase()}_score`]}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400">
                  Last Audit: <span className="text-slate-600 font-bold">{v.last_audit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'sample_tracking': return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Sampling & Approvals</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">+ New Sample</button>
          </div>
          {renderTable(
            ['Sample ID', 'Design ID', 'Type', 'Sent Date', 'Status', 'Feedback'],
            data.sample_tracking,
            (s, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-slate-800">{s.id}</td>
                <td className="px-4 py-3 text-xs text-blue-600 font-bold">{s.design_id}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{s.sample_type}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{s.sent_date}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    s.status === 'Approved' ? "bg-emerald-100 text-emerald-600" : 
                    s.status === 'Rejected' ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"
                  )}>{s.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600 italic">{s.feedback || '—'}</td>
              </tr>
            )
          )}
        </div>
      );
      case 'maintenance': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Machine Maintenance & Health</h3>
            <button className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Schedule Service</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.machine_maintenance.map((m, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm font-bold text-slate-800">{m.machine_id}</div>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                    m.status === 'Healthy' ? "bg-emerald-100 text-emerald-600" : 
                    m.status === 'Warning' ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                  )}>{m.status}</span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-400">
                      <span>Health Score</span>
                      <span>{m.health_score}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full", m.health_score > 80 ? "bg-emerald-500" : m.health_score > 50 ? "bg-amber-500" : "bg-rose-500")} 
                        style={{ width: `${m.health_score}%` }} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest">Last Service</div>
                      <div className="text-xs font-bold text-slate-800">{m.last_service}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest">Next Due</div>
                      <div className="text-xs font-bold text-blue-600">{m.next_service}</div>
                    </div>
                  </div>
                  {m.issues_reported > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-rose-50 border border-rose-100 rounded text-rose-600 text-[10px] font-bold uppercase">
                      <AlertTriangle className="w-3 h-3" />
                      {m.issues_reported} Open Issues
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'designtracker': return renderDesignTracker();
      default: return <div className="p-12 text-center text-slate-400">Section "{activeSection}" is under development.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="bg-slate-900 text-slate-300 flex-shrink-0 overflow-hidden relative z-50"
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
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
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
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">System Live</span>
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-800">Kishan G.</div>
                <div className="text-[10px] text-slate-400">Administrator</div>
              </div>
              <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 font-bold">KG</div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
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

            {renderKPIs()}

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
      `}} />

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

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => setShowGoogleImportModal(false)}
                  className="flex-1 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleGoogleImport}
                  disabled={isImporting}
                  className="flex-1 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  {isImporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
                  {isImporting ? "Importing..." : "Start Import"}
                </button>
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
          />
        )}
      </AnimatePresence>

      {renderNewEntryModal()}
    </div>
  );
}
