import React, { useState } from 'react';

export interface LedgerEntry {
  date: string;
  particulars: string;
  voucher_type: string;
  voucher_no: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface LedgerData {
  company_name: string;
  party_name: string;
  party_address?: string;
  gstin?: string;
  period: string;
  entries: LedgerEntry[];
  opening_balance: number;
}

interface Props {
  data?: Partial<LedgerData>;
  onClose: () => void;
}

export const VendorLedgerPDF: React.FC<Props> = ({ data: propData, onClose }) => {
  const [d] = useState<LedgerData>({
    company_name: 'KARNI IMPEX',
    party_name: '',
    period: `01-Apr-${new Date().getFullYear()} to ${new Date().toLocaleDateString('en-IN')}`,
    entries: [],
    opening_balance: 0,
    ...propData
  });

  const handlePrint = () => window.print();

  const totalDebit = d.entries.reduce((sum, e) => sum + (e.debit || 0), 0);
  const totalCredit = d.entries.reduce((sum, e) => sum + (e.credit || 0), 0);
  const closingBalance = d.opening_balance + totalDebit - totalCredit;

  return (
    <>
      <style>{`
        @media print {
          aside, header, main, .no-print { display: none !important; }
          #ledger-print { 
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
          <button onClick={handlePrint} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2">
            🖨️ Print Ledger
          </button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
            ✕ Close
          </button>
        </div>
      </div>

      <div id="ledger-print" className="fixed top-16 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-[900px] bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col p-8" onClick={e => e.stopPropagation()}>
        <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
          <h1 className="text-2xl font-bold uppercase">{d.company_name}</h1>
          <p className="text-sm text-slate-600 uppercase tracking-widest">Vendor Account Ledger</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Vendor Name</label>
            <p className="text-lg font-bold text-slate-800">{d.party_name || '—'}</p>
            {d.party_address && <p className="text-xs text-slate-500 mt-1">{d.party_address}</p>}
            {d.gstin && <p className="text-xs font-mono mt-1">GSTIN: {d.gstin}</p>}
          </div>
          <div className="text-right">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Period</label>
            <p className="text-sm font-bold text-slate-800">{d.period}</p>
          </div>
        </div>

        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 border-y border-slate-300">
              <th className="p-2 text-left border-r border-slate-300">Date</th>
              <th className="p-2 text-left border-r border-slate-300">Particulars</th>
              <th className="p-2 text-left border-r border-slate-300">Vch Type</th>
              <th className="p-2 text-left border-r border-slate-300">Vch No.</th>
              <th className="p-2 text-right border-r border-slate-300">Debit (₹)</th>
              <th className="p-2 text-right border-r border-slate-300">Credit (₹)</th>
              <th className="p-2 text-right">Balance (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200 italic text-slate-500">
              <td className="p-2 border-r border-slate-300"></td>
              <td className="p-2 border-r border-slate-300">Opening Balance</td>
              <td className="p-2 border-r border-slate-300"></td>
              <td className="p-2 border-r border-slate-300"></td>
              <td className="p-2 border-r border-slate-300 text-right"></td>
              <td className="p-2 border-r border-slate-300 text-right"></td>
              <td className="p-2 text-right font-bold">{d.opening_balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
            {d.entries.length > 0 ? d.entries.map((e, i) => (
              <tr key={i} className="border-b border-slate-200">
                <td className="p-2 border-r border-slate-300">{e.date}</td>
                <td className="p-2 border-r border-slate-300">{e.particulars}</td>
                <td className="p-2 border-r border-slate-300">{e.voucher_type}</td>
                <td className="p-2 border-r border-slate-300">{e.voucher_no}</td>
                <td className="p-2 border-r border-slate-300 text-right">{e.debit > 0 ? e.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}</td>
                <td className="p-2 border-r border-slate-300 text-right">{e.credit > 0 ? e.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}</td>
                <td className="p-2 text-right font-bold">{e.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400 uppercase tracking-widest">No transactions found for this period</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 font-bold border-t-2 border-slate-800">
              <td colSpan={4} className="p-3 text-right uppercase tracking-widest">Current Total</td>
              <td className="p-3 text-right border-x border-slate-300">{totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              <td className="p-3 text-right border-r border-slate-300">{totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              <td className="p-3 text-right text-blue-700">{closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-12 flex justify-between">
          <div className="text-center w-48">
            <div className="h-12 border-b border-slate-300 mb-2"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prepared By</p>
          </div>
          <div className="text-center w-48">
            <div className="h-12 border-b border-slate-300 mb-2"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorised Signatory</p>
          </div>
        </div>
      </div>
    </>
  );
};
