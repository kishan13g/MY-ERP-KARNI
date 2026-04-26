import React, { useState } from 'react';

export interface PaymentVoucherData {
  company_name: string;
  voucher_no: string;
  date: string;
  party_name: string;
  amount: number;
  payment_mode: string;
  reference_no: string;
  remarks: string;
}

interface Props {
  data?: Partial<PaymentVoucherData>;
  onClose: () => void;
}

export const PaymentVoucherPDF: React.FC<Props> = ({ data: propData, onClose }) => {
  const [d] = useState<PaymentVoucherData>({
    company_name: 'KARNI IMPEX',
    voucher_no: 'PV-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    date: new Date().toLocaleDateString('en-IN'),
    party_name: '',
    amount: 0,
    payment_mode: 'Cash',
    reference_no: '',
    remarks: '',
    ...propData
  });

  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        @media print {
          aside, header, main, .no-print { display: none !important; }
          #voucher-print { 
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
          <button onClick={handlePrint} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2">
            🖨️ Print Voucher
          </button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
            ✕ Close
          </button>
        </div>
      </div>

      <div id="voucher-print" className="fixed top-16 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-[700px] bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col p-8 border-2 border-slate-800" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold uppercase">{d.company_name}</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Payment Receipt / Voucher</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">No: <span className="text-red-600">{d.voucher_no}</span></p>
            <p className="text-sm font-bold">Date: {d.date}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold uppercase min-w-[150px]">Received with thanks from:</span>
            <span className="flex-1 border-b border-dotted border-slate-400 font-bold text-lg px-2">{d.party_name || '—'}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold uppercase min-w-[150px]">The sum of Rupees:</span>
            <span className="flex-1 border-b border-dotted border-slate-400 font-bold text-lg px-2 italic">
               {d.amount > 0 ? `${d.amount.toLocaleString('en-IN')} Only` : '—'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold uppercase min-w-[100px]">By:</span>
              <span className="flex-1 border-b border-dotted border-slate-400 font-bold px-2">{d.payment_mode}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold uppercase min-w-[100px]">Ref No:</span>
              <span className="flex-1 border-b border-dotted border-slate-400 font-bold px-2">{d.reference_no || '—'}</span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="text-sm font-bold uppercase min-w-[150px]">On Account of:</span>
            <span className="flex-1 border-b border-dotted border-slate-400 font-medium px-2 min-h-[60px]">{d.remarks || '—'}</span>
          </div>
        </div>

        <div className="mt-12 flex justify-between items-end">
          <div className="bg-slate-100 p-4 border-2 border-slate-800 rounded flex items-center gap-4">
            <span className="text-xl font-bold">₹</span>
            <span className="text-2xl font-black">{d.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          
          <div className="text-center w-48">
            <div className="h-12 border-b border-slate-300 mb-2"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Receiver's Signature</p>
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
