import React, { useState } from 'react';

export interface DesignCardData {
  company_name: string;
  design_id: string;
  design_name: string;
  category: string;
  fabric_details: string;
  estimated_cost: number;
  date: string;
  image_url?: string;
}

interface Props {
  data?: Partial<DesignCardData>;
  onClose: () => void;
}

export const DesignCardPDF: React.FC<Props> = ({ data: propData, onClose }) => {
  const [d, setD] = useState<DesignCardData>({
    company_name: 'KARNI IMPEX',
    design_id: '',
    design_name: '',
    category: '',
    fabric_details: '',
    estimated_cost: 0,
    date: new Date().toLocaleDateString('en-IN'),
    ...propData
  });

  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        @media print {
          aside, header, main, .no-print { display: none !important; }
          #design-card-print { 
            position: absolute !important; 
            top: 0 !important; 
            left: 0 !important; 
            width: 100% !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            box-shadow: none !important;
            display: block !important;
          }
          body { background: white !important; }
          @page { margin: 10mm; size: A4 portrait; }
        }
      `}</style>

      <div className="no-print fixed inset-0 bg-black/60 z-[9998] flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
        <div className="fixed top-4 right-4 z-[10001] flex gap-2">
          <button onClick={handlePrint} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2">
            🖨️ Print Card
          </button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
            ✕ Close
          </button>
        </div>
      </div>

      <div id="design-card-print" className="fixed top-16 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-[800px] bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="bg-indigo-900 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight uppercase">{d.company_name}</h1>
            <p className="text-indigo-300 text-sm font-medium uppercase tracking-widest">Design Master Card</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-indigo-300 uppercase">Date</p>
            <p className="font-bold">{d.date}</p>
          </div>
        </div>

        <div className="p-8 grid grid-cols-3 gap-8">
          <div className="col-span-1">
            <div className="aspect-[3/4] bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 flex-col gap-2 overflow-hidden">
              {d.image_url ? (
                <img src={d.image_url} alt="Design" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Design Sketch</span>
                </>
              )}
            </div>
          </div>

          <div className="col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Design ID</label>
                <p className="text-lg font-bold text-slate-800 border-b-2 border-indigo-100 pb-1">{d.design_id || '—'}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Category</label>
                <p className="text-lg font-bold text-slate-800 border-b-2 border-indigo-100 pb-1">{d.category || '—'}</p>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Design Name</label>
              <p className="text-xl font-bold text-slate-900 border-b-2 border-indigo-100 pb-1">{d.design_name || '—'}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Estimated Cost</label>
                <p className="text-lg font-bold text-emerald-600">₹ {d.estimated_cost?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Fabric & Trim Details</label>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 min-h-[100px] text-sm text-slate-700 whitespace-pre-wrap">
                {d.fabric_details || 'No details provided.'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100 grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="h-12 border-b border-slate-300 mb-2"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Designer</p>
          </div>
          <div className="text-center">
            <div className="h-12 border-b border-slate-300 mb-2"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Merchandiser</p>
          </div>
          <div className="text-center">
            <div className="h-12 border-b border-slate-300 mb-2"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Approved By</p>
          </div>
        </div>
      </div>
    </>
  );
};
