import React, { useRef, useState } from 'react';

// ── Types ────────────────────────────────────────────────────
export interface OrderBookEntry {
  order_id: string;
  date: string;
  design_id: string;
  design_name: string;
  party_name: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface OrderBookData {
  company_name: string;
  entries: OrderBookEntry[];
}

// ── Default Data ─────────────────────────────────────────────
const BLANK_ENTRIES = Array.from({ length: 25 }, () => ({
  order_id: '',
  date: '',
  design_id: '',
  design_name: '',
  party_name: '',
  qty: 0,
  rate: 0,
  amount: 0,
}));

// ── Main Component ────────────────────────────────────────────
interface Props {
  data?: Partial<OrderBookData>;
  onClose: () => void;
}

export const OrderBookPDF: React.FC<Props> = ({ data: propData, onClose }) => {
  const [d, setD] = useState<OrderBookData>({
    company_name: 'KARNI IMPEX',
    entries: BLANK_ENTRIES,
    ...propData
  });

  const handlePrint = () => window.print();

  const updateEntry = (index: number, field: keyof OrderBookEntry, value: any) => {
    const newEntries = [...d.entries];
    const entry = { ...newEntries[index], [field]: value };
    
    // Auto-calculate amount if qty or rate changes
    if (field === 'qty' || field === 'rate') {
      entry.amount = (Number(entry.qty) || 0) * (Number(entry.rate) || 0);
    }
    
    newEntries[index] = entry;
    setD(prev => ({ ...prev, entries: newEntries }));
  };

  const totalQty = d.entries.reduce((sum, e) => sum + (Number(e.qty) || 0), 0);
  const totalAmt = d.entries.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  return (
    <>
      <style>{`
        @media print {
          aside, header, main, .no-print { display: none !important; }
          #order-book-print { 
            position: absolute !important; 
            top: 0 !important; 
            left: 0 !important; 
            width: 100% !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            box-shadow: none !important;
            max-height: none !important;
            overflow: visible !important;
            display: block !important;
          }
          body { background: white !important; }
          @page { margin: 10mm; size: A4 landscape; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000 !important; padding: 6px !important; }
          .hdr-print { background: #8B2323 !important; color: white !important; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {/* Overlay backdrop */}
      <div
        className="no-print"
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 9998, display: 'flex', alignItems: 'flex-start',
          justifyContent: 'center', overflowY: 'auto', padding: '20px 0'
        }}
        onClick={onClose}
      >
        {/* Control bar */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'fixed', top: 12, right: 16, zIndex: 10001,
            display: 'flex', gap: 8, alignItems: 'center'
          }}
        >
          <button
            onClick={handlePrint}
            style={{
              background: '#8B2323', color: 'white', border: 'none',
              borderRadius: 8, padding: '8px 20px', fontWeight: 700,
              fontSize: 13, cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center'
            }}
          >
            🖨️ Print / Save PDF
          </button>
          <button
            onClick={onClose}
            style={{
              background: '#ef4444', color: 'white', border: 'none',
              borderRadius: 8, padding: '8px 14px', fontWeight: 700,
              fontSize: 13, cursor: 'pointer'
            }}
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* Printable Card */}
      <div
        id="order-book-print"
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, width: '95%', maxWidth: 1100, backgroundColor: 'white',
          fontFamily: 'Arial, sans-serif', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          borderRadius: 4, overflow: 'hidden',
          maxHeight: 'calc(100vh - 80px)', overflowY: 'auto',
          color: '#333', paddingBottom: 40
        }}
      >
        {/* Header */}
        <div style={{ background: '#8B2323', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'white', padding: 4, borderRadius: 2 }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B2323" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '1px' }}>
            {d.company_name} • ORDER BOOK
          </h1>
        </div>

        <div style={{ padding: 10 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left', width: '10%' }}>Order ID</th>
                <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left', width: '10%' }}>Date</th>
                <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left', width: '10%' }}>Design ID</th>
                <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left', width: '15%' }}>Design Name</th>
                <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left', width: '20%' }}>Party Name</th>
                <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'center', width: '10%' }}>Quantity (Pcs)</th>
                <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'center', width: '10%' }}>RATE</th>
                <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'right', width: '15%' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {d.entries.map((row, i) => (
                <tr key={i}>
                  <td style={{ border: '1px solid #dee2e6', padding: 0 }}>
                    <input value={row.order_id} onChange={e => updateEntry(i, 'order_id', e.target.value)} style={{ width: '100%', border: 'none', padding: '6px 8px', fontSize: 11, outline: 'none' }} />
                  </td>
                  <td style={{ border: '1px solid #dee2e6', padding: 0 }}>
                    <input type="text" value={row.date} onChange={e => updateEntry(i, 'date', e.target.value)} placeholder="DD/MM/YY" style={{ width: '100%', border: 'none', padding: '6px 8px', fontSize: 11, outline: 'none' }} />
                  </td>
                  <td style={{ border: '1px solid #dee2e6', padding: 0 }}>
                    <input value={row.design_id} onChange={e => updateEntry(i, 'design_id', e.target.value)} style={{ width: '100%', border: 'none', padding: '6px 8px', fontSize: 11, outline: 'none' }} />
                  </td>
                  <td style={{ border: '1px solid #dee2e6', padding: 0 }}>
                    <input value={row.design_name} onChange={e => updateEntry(i, 'design_name', e.target.value)} style={{ width: '100%', border: 'none', padding: '6px 8px', fontSize: 11, outline: 'none' }} />
                  </td>
                  <td style={{ border: '1px solid #dee2e6', padding: 0 }}>
                    <input value={row.party_name} onChange={e => updateEntry(i, 'party_name', e.target.value)} style={{ width: '100%', border: 'none', padding: '6px 8px', fontSize: 11, outline: 'none' }} />
                  </td>
                  <td style={{ border: '1px solid #dee2e6', padding: 0 }}>
                    <input type="number" value={row.qty || ''} onChange={e => updateEntry(i, 'qty', e.target.value)} style={{ width: '100%', border: 'none', padding: '6px 8px', fontSize: 11, textAlign: 'center', outline: 'none' }} />
                  </td>
                  <td style={{ border: '1px solid #dee2e6', padding: 0 }}>
                    <input type="number" value={row.rate || ''} onChange={e => updateEntry(i, 'rate', e.target.value)} style={{ width: '100%', border: 'none', padding: '6px 8px', fontSize: 11, textAlign: 'center', outline: 'none' }} />
                  </td>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'right', fontSize: 11, background: '#fff9f9' }}>
                    {row.amount > 0 ? row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f1f3f5', fontWeight: 700 }}>
                <td colSpan={5} style={{ border: '1px solid #dee2e6', padding: '10px', textAlign: 'right', fontSize: 12 }}>TOTAL</td>
                <td style={{ border: '1px solid #dee2e6', padding: '10px', textAlign: 'center', fontSize: 12 }}>{totalQty || 0}</td>
                <td style={{ border: '1px solid #dee2e6', padding: '10px', textAlign: 'center' }}>—</td>
                <td style={{ border: '1px solid #dee2e6', padding: '10px', textAlign: 'right', fontSize: 12, color: '#8B2323' }}>
                  {totalAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};
