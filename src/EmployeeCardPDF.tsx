import React, { useState } from 'react';

export interface EmployeeCardData {
  company_name: string;
  employee_id: string;
  full_name: string;
  department: string;
  designation: string;
  mobile: string;
  joining_date: string;
  blood_group?: string;
  address?: string;
  image_url?: string;
}

interface Props {
  data?: Partial<EmployeeCardData>;
  onClose: () => void;
}

export const EmployeeCardPDF: React.FC<Props> = ({ data: propData, onClose }) => {
  const [d] = useState<EmployeeCardData>({
    company_name: 'KARNI IMPEX',
    employee_id: '',
    full_name: '',
    department: '',
    designation: '',
    mobile: '',
    joining_date: '',
    ...propData
  });

  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        @media print {
          aside, header, main, .no-print { display: none !important; }
          #id-card-print { 
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
            🖨️ Print ID Card
          </button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
            ✕ Close
          </button>
        </div>
      </div>

      <div id="id-card-print" className="fixed top-16 left-1/2 -translate-x-1/2 z-[9999] w-[350px] bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-slate-200" onClick={e => e.stopPropagation()}>
        <div className="bg-indigo-900 p-6 text-center text-white">
          <h1 className="text-xl font-bold tracking-tight uppercase">{d.company_name}</h1>
          <p className="text-indigo-300 text-[10px] font-medium uppercase tracking-widest mt-1">Employee Identity Card</p>
        </div>

        <div className="p-8 flex flex-col items-center">
          <div className="w-32 h-32 bg-slate-100 rounded-full border-4 border-indigo-50 flex items-center justify-center text-slate-300 overflow-hidden mb-6 shadow-inner">
            {d.image_url ? (
              <img src={d.image_url} alt="Employee" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            )}
          </div>

          <h2 className="text-xl font-bold text-slate-800 text-center uppercase tracking-tight">{d.full_name || 'Employee Name'}</h2>
          <p className="text-indigo-600 font-bold text-sm uppercase mt-1">{d.designation || 'Designation'}</p>
          
          <div className="w-full mt-8 space-y-4">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee ID</span>
              <span className="text-sm font-bold text-slate-700">{d.employee_id || '—'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</span>
              <span className="text-sm font-bold text-slate-700">{d.department || '—'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joining Date</span>
              <span className="text-sm font-bold text-slate-700">{d.joining_date || '—'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile</span>
              <span className="text-sm font-bold text-slate-700">{d.mobile || '—'}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <div className="w-32 h-8 bg-white border border-slate-200 rounded mx-auto mb-2 flex items-center justify-center">
             <span className="text-[8px] text-slate-300">AUTHORISED SIGNATORY</span>
          </div>
          <p className="text-[8px] text-slate-400 uppercase tracking-widest">This card is property of {d.company_name}</p>
        </div>
      </div>
    </>
  );
};
