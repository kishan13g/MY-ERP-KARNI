import React, { useRef } from 'react';
import { SalarySlip, KarigarWageEntry } from './types';

interface Props {
  slip: SalarySlip;
  onClose: () => void;
}

export const SalarySlipPDF: React.FC<Props> = ({ slip, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const PRINT_STYLES = `
    @media print {
      aside, header, nav, .no-print { display: none !important; }
      #salary-slip-print { 
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
      @page { margin: 15mm; size: A4 portrait; }
    }
  `;

  return (
    <>
      <style>{PRINT_STYLES}</style>
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-4 no-print" onClick={onClose}>
        <div className="absolute top-4 right-4 flex gap-3 z-[10001]">
          <button 
            onClick={handlePrint}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <span>🖨️</span> Print Salary Slip
          </button>
          <button 
            onClick={onClose}
            className="bg-white text-slate-600 px-4 py-2.5 rounded-xl font-bold shadow-lg hover:bg-slate-50 transition-all"
          >
            ✕ Close
          </button>
        </div>

        {/* Slip Container */}
        <div 
          id="salary-slip-print"
          ref={printRef}
          onClick={e => e.stopPropagation()}
          className="bg-white w-full max-w-[800px] shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-slate-900 p-8 text-white flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black tracking-tighter mb-1">KARNI IMPEX</h1>
              <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">Premium Textile Manufacturing</p>
              <div className="mt-6 space-y-1">
                <p className="text-[10px] text-slate-400">Plot No. 45, GIDC Pandesara, Surat, Gujarat - 394221</p>
                <p className="text-[10px] text-slate-400">GSTIN: 24AUOPD2833Q1Z9 | Phone: +91 98765 43210</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                Salary Slip
              </div>
              <h2 className="text-xl font-bold">#{slip.id}</h2>
              <p className="text-slate-400 text-xs">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="p-8 overflow-y-auto">
            {/* Employee Info */}
            <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-100">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Karigar Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Name:</span>
                    <span className="text-xs font-bold text-slate-800">{slip.karigar_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">ID:</span>
                    <span className="text-xs font-bold text-slate-800">{slip.karigar_id}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Payment Period</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">From:</span>
                    <span className="text-xs font-bold text-slate-800">{slip.period_start}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">To:</span>
                    <span className="text-xs font-bold text-slate-800">{slip.period_end}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Table */}
            <div className="mb-8">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Earnings Breakdown (Piece-Rate)</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <th className="px-4 py-3 rounded-l-lg">Date / Lot</th>
                    <th className="px-4 py-3">Design / Stage</th>
                    <th className="px-4 py-3">Size/Pattern</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Rate</th>
                    <th className="px-4 py-3 text-right rounded-r-lg">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {slip.entries.map((entry, idx) => (
                    <tr key={idx} className="text-xs">
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-800">{entry.date}</div>
                        <div className="text-[10px] text-slate-400">{entry.lot_id}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-800">{entry.design_id}</div>
                        <div className="text-[10px] text-slate-400">{entry.stage}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-600">{entry.size} | {entry.pattern}</div>
                      </td>
                      <td className="px-4 py-4 text-center font-bold">{entry.qty}</td>
                      <td className="px-4 py-4 text-right font-medium">₹{entry.final_rate}</td>
                      <td className="px-4 py-4 text-right font-bold text-slate-800">₹{entry.total_wage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Notes</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Wages calculated based on approved piece-rates including size and pattern modifiers. 
                    Any discrepancy should be reported to the accounts department within 24 hours.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-500">Gross Earnings:</span>
                  <span className="font-bold text-slate-800">₹{slip.total_earnings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-500">Total Deductions:</span>
                  <span className="font-bold text-rose-500">-₹{slip.deductions.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-center">
                  <span className="text-base font-black text-slate-900 uppercase">Net Payable:</span>
                  <span className="text-2xl font-black text-blue-600">₹{slip.net_payable.toLocaleString()}</span>
                </div>
                <div className="text-[10px] text-right text-slate-400 font-medium italic">
                  Amount in words: Rupees {slip.net_payable.toLocaleString()} Only
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-16 grid grid-cols-2 gap-24">
              <div className="text-center">
                <div className="border-b border-slate-300 mb-2 h-12"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Karigar Signature</p>
              </div>
              <div className="text-center">
                <div className="border-b border-slate-300 mb-2 h-12 flex items-center justify-center">
                  <div className="text-slate-200 font-black text-2xl opacity-20 rotate-[-10deg]">KARNI IMPEX</div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Signatory</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <p className="text-[9px] text-slate-400 font-medium">
              This is a computer generated document and does not require a physical signature.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
