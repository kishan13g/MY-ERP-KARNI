import React, { useRef, useState } from 'react';

// ── Types ────────────────────────────────────────────────────
export interface KarigarJobCardData {
  company_name?: string;
  date: string;
  job_card_no: string;
  shift: string;
  karigar_name: string;
  mobile_no: string;
  department: string;
  supervisor: string;
  karigar_code: string;
  machine_no: string;
  lot_no: string;
  design_no: string;
  colour: string;
  size: string;
  fabric_type: string;
  production: Array<{
    sr: number;
    process: string;
    qty: number;
    rate: number;
    remark: string;
  }>;
  qc_status: 'pass' | 'fail' | 'rework' | '';
  qc_inspector: string;
  qc_remarks: string;
}

// ── Default Data ─────────────────────────────────────────────
const BLANK_KARIGAR_CARD: KarigarJobCardData = {
  company_name: 'KARNI IMPEX',
  date: new Date().toISOString().split('T')[0],
  job_card_no: '',
  shift: '',
  karigar_name: '',
  mobile_no: '',
  department: '',
  supervisor: '',
  karigar_code: '',
  machine_no: '',
  lot_no: '',
  design_no: '',
  colour: '',
  size: '',
  fabric_type: '',
  production: Array.from({ length: 6 }, (_, i) => ({
    sr: i + 1,
    process: '',
    qty: 0,
    rate: 0,
    remark: '',
  })),
  qc_status: '',
  qc_inspector: '',
  qc_remarks: '',
};

// ── Main Component ────────────────────────────────────────────
interface Props {
  data?: Partial<KarigarJobCardData>;
  onClose: () => void;
}

export const KarigarJobCard: React.FC<Props> = ({ data: propData, onClose }) => {
  const [d, setD] = useState<KarigarJobCardData>({ ...BLANK_KARIGAR_CARD, ...propData });
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();

  const updateField = (field: keyof KarigarJobCardData, value: any) => {
    setD(prev => ({ ...prev, [field]: value }));
  };

  const updateProduction = (index: number, field: string, value: any) => {
    const newProd = [...d.production];
    newProd[index] = { ...newProd[index], [field]: value };
    setD(prev => ({ ...prev, production: newProd }));
  };

  const addRow = () => {
    setD(prev => ({
      ...prev,
      production: [
        ...prev.production,
        { sr: prev.production.length + 1, process: '', qty: 0, rate: 0, remark: '' }
      ]
    }));
  };

  const totalQty = d.production.reduce((sum, r) => sum + (Number(r.qty) || 0), 0);
  const totalAmt = d.production.reduce((sum, r) => sum + ((Number(r.qty) || 0) * (Number(r.rate) || 0)), 0);

  return (
    <>
      <style>{`
        @media print {
          aside, header, main, .no-print { display: none !important; }
          #karigar-job-card-print { 
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
          @page { margin: 10mm; size: A4 portrait; }
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
              background: '#1e3a5f', color: 'white', border: 'none',
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
        id="karigar-job-card-print"
        ref={printRef}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, width: 720, backgroundColor: 'white',
          fontFamily: 'Arial, sans-serif', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          borderRadius: 8, overflow: 'hidden',
          maxHeight: 'calc(100vh - 80px)', overflowY: 'auto',
          color: '#333'
        }}
      >
        {/* Header */}
        <div style={{ background: '#1A2B4A', padding: '18px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: '#fff', letterSpacing: '0.5px', margin: 0 }}>KARIGAR JOB CARD</h1>
          <p style={{ fontSize: 12, color: '#93C5FD', marginTop: 4, margin: 0 }}>Pro Format &nbsp;•&nbsp; Internal Work Record</p>
        </div>

        {/* Sections */}
        <div style={{ padding: '0 16px 16px' }}>
          
          {/* Basic Details */}
          <div style={{ background: '#1e40af', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', fontSize: 12, fontWeight: 500, color: '#fff', marginTop: 16, borderRadius: '4px 4px 0 0' }}>
            Basic Details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '0.5px solid #e2e8f0', borderRadius: '0 0 6px 6px', overflow: 'hidden' }}>
            {[
              { label: 'Company Name', value: d.company_name, field: 'company_name' },
              { label: 'Date', value: d.date, field: 'date', type: 'date' },
              { label: 'Job Card No.', value: d.job_card_no, field: 'job_card_no' },
              { label: 'Shift', value: d.shift, field: 'shift', type: 'select', options: ['Morning', 'Afternoon', 'Night'] },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '8px 12px', borderRight: i % 2 === 0 ? '0.5px solid #e2e8f0' : 'none', borderBottom: i < 2 ? '0.5px solid #e2e8f0' : 'none' }}>
                <label style={{ fontSize: 10, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 5 }}>{f.label}</label>
                {f.type === 'select' ? (
                  <select 
                    value={f.value} 
                    onChange={(e) => updateField(f.field as any, e.target.value)}
                    style={{ border: 'none', borderBottom: '1.5px solid #3b82f6', background: 'transparent', fontSize: 13, color: '#1e293b', padding: '1px 0', width: '100%', outline: 'none' }}
                  >
                    <option value="">Select {f.label.toLowerCase()}</option>
                    {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input 
                    type={f.type || 'text'} 
                    value={f.value} 
                    onChange={(e) => updateField(f.field as any, e.target.value)}
                    style={{ border: 'none', borderBottom: '1.5px solid #3b82f6', background: 'transparent', fontSize: 13, color: '#1e293b', padding: '1px 0', width: '100%', outline: 'none' }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Karigar Details */}
          <div style={{ background: '#3730a3', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', fontSize: 12, fontWeight: 500, color: '#fff', marginTop: 16, borderRadius: '4px 4px 0 0' }}>
            Karigar Details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '0.5px solid #e2e8f0', borderRadius: '0 0 6px 6px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 12px', borderRight: '0.5px solid #e2e8f0', borderBottom: '0.5px solid #e2e8f0' }}>
              <label style={{ fontSize: 10, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 5 }}>Karigar Name</label>
              <input value={d.karigar_name} onChange={(e) => updateField('karigar_name', e.target.value)} style={{ border: 'none', borderBottom: '1.5px solid #3b82f6', background: 'transparent', fontSize: 13, color: '#1e293b', padding: '1px 0', width: '100%', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 12px', borderBottom: '0.5px solid #e2e8f0' }}>
              <label style={{ fontSize: 10, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 5 }}>Mobile No.</label>
              <input value={d.mobile_no} onChange={(e) => updateField('mobile_no', e.target.value)} style={{ border: 'none', borderBottom: '1.5px solid #3b82f6', background: 'transparent', fontSize: 13, color: '#1e293b', padding: '1px 0', width: '100%', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 12px', borderRight: '0.5px solid #e2e8f0', gridColumn: 'span 2', borderBottom: '0.5px solid #e2e8f0' }}>
              <label style={{ fontSize: 10, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 5 }}>Department</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                {['Embroidery', 'Stitching', 'Handwork', 'Cutting', 'Finishing'].map(dept => (
                  <span 
                    key={dept} 
                    onClick={() => updateField('department', dept)}
                    style={{ 
                      padding: '3px 10px', borderRadius: 20, fontSize: 11, border: '0.5px solid #cbd5e1', cursor: 'pointer', transition: 'all 0.15s',
                      background: d.department === dept ? '#dbeafe' : '#f8fafc',
                      color: d.department === dept ? '#1e40af' : '#64748b',
                      borderColor: d.department === dept ? '#93c5fd' : '#cbd5e1'
                    }}
                  >{dept}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 12px', borderRight: '0.5px solid #e2e8f0' }}>
              <label style={{ fontSize: 10, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 5 }}>Supervisor</label>
              <input value={d.supervisor} onChange={(e) => updateField('supervisor', e.target.value)} style={{ border: 'none', borderBottom: '1.5px solid #3b82f6', background: 'transparent', fontSize: 13, color: '#1e293b', padding: '1px 0', width: '100%', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 12px' }}>
              <label style={{ fontSize: 10, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 5 }}>Karigar Code</label>
              <input value={d.karigar_code} onChange={(e) => updateField('karigar_code', e.target.value)} style={{ border: 'none', borderBottom: '1.5px solid #3b82f6', background: 'transparent', fontSize: 13, color: '#1e293b', padding: '1px 0', width: '100%', outline: 'none' }} />
            </div>
          </div>

          {/* Work Details */}
          <div style={{ background: '#334155', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', fontSize: 12, fontWeight: 500, color: '#fff', marginTop: 16, borderRadius: '4px 4px 0 0' }}>
            Work Details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '0.5px solid #e2e8f0', borderRadius: '0 0 6px 6px', overflow: 'hidden' }}>
            {[
              { label: 'Machine No.', field: 'machine_no' },
              { label: 'Lot No.', field: 'lot_no' },
              { label: 'Design No. / Name', field: 'design_no' },
              { label: 'Colour', field: 'colour' },
              { label: 'Size', field: 'size' },
              { label: 'Fabric Type', field: 'fabric_type' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '8px 12px', borderRight: i % 2 === 0 ? '0.5px solid #e2e8f0' : 'none', borderBottom: i < 4 ? '0.5px solid #e2e8f0' : 'none' }}>
                <label style={{ fontSize: 10, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 5 }}>{f.label}</label>
                <input value={(d as any)[f.field]} onChange={(e) => updateField(f.field as any, e.target.value)} style={{ border: 'none', borderBottom: '1.5px solid #3b82f6', background: 'transparent', fontSize: 13, color: '#1e293b', padding: '1px 0', width: '100%', outline: 'none' }} />
              </div>
            ))}
          </div>

          {/* Production Details */}
          <div style={{ background: '#1e40af', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', fontSize: 12, fontWeight: 500, color: '#fff', marginTop: 16, borderRadius: '4px 4px 0 0' }}>
            Production Details
          </div>
          <div style={{ border: '0.5px solid #e2e8f0', borderRadius: '0 0 6px 6px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#1A2B4A', color: '#fff' }}>
                  <th style={{ width: 40, padding: '7px 8px', textAlign: 'left', fontWeight: 500, fontSize: 11 }}>Sr.</th>
                  <th style={{ padding: '7px 8px', textAlign: 'left', fontWeight: 500, fontSize: 11 }}>Process / Description</th>
                  <th style={{ width: 90, padding: '7px 8px', textAlign: 'center', fontWeight: 500, fontSize: 11 }}>Qty</th>
                  <th style={{ width: 90, padding: '7px 8px', textAlign: 'center', fontWeight: 500, fontSize: 11 }}>Rate (₹)</th>
                  <th style={{ width: 100, padding: '7px 8px', textAlign: 'center', fontWeight: 500, fontSize: 11 }}>Amount (₹)</th>
                  <th style={{ width: 120, padding: '7px 8px', textAlign: 'left', fontWeight: 500, fontSize: 11 }}>Remark</th>
                </tr>
              </thead>
              <tbody>
                {d.production.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 1 ? '#f8fafc' : 'white', borderBottom: '0.5px solid #e2e8f0' }}>
                    <td style={{ textAlign: 'center', color: '#64748b', fontSize: 11, padding: '5px 8px' }}>{row.sr}</td>
                    <td style={{ padding: '5px 8px' }}>
                      <input value={row.process} onChange={(e) => updateProduction(i, 'process', e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 12, color: '#1e293b', outline: 'none' }} />
                    </td>
                    <td style={{ padding: '5px 8px', textAlign: 'center' }}>
                      <input type="number" value={row.qty || ''} onChange={(e) => updateProduction(i, 'qty', e.target.value)} style={{ width: 70, border: 'none', background: 'transparent', fontSize: 12, color: '#1e293b', textAlign: 'center', outline: 'none' }} />
                    </td>
                    <td style={{ padding: '5px 8px', textAlign: 'center' }}>
                      <input type="number" value={row.rate || ''} onChange={(e) => updateProduction(i, 'rate', e.target.value)} style={{ width: 70, border: 'none', background: 'transparent', fontSize: 12, color: '#1e293b', textAlign: 'center', outline: 'none' }} />
                    </td>
                    <td style={{ padding: '5px 8px', textAlign: 'center', fontSize: 12, color: '#1e293b' }}>
                      {row.qty * row.rate > 0 ? `₹ ${(row.qty * row.rate).toFixed(2)}` : '—'}
                    </td>
                    <td style={{ padding: '5px 8px' }}>
                      <input value={row.remark} onChange={(e) => updateProduction(i, 'remark', e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 12, color: '#64748b', outline: 'none' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#fef3c7', fontWeight: 500, fontSize: 12, color: '#92400e' }}>
                  <td colSpan={2} style={{ textAlign: 'right', padding: '8px 12px', fontSize: 11, letterSpacing: '0.3px' }}>TOTAL</td>
                  <td style={{ textAlign: 'center' }}>{totalQty || ''}</td>
                  <td style={{ textAlign: 'center' }}>—</td>
                  <td style={{ textAlign: 'center', fontWeight: 500, color: '#c2410c', fontSize: 13 }}>₹ {totalAmt.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
            <button className="no-print" onClick={addRow} style={{ margin: '8px', padding: '4px 12px', border: '0.5px dashed #cbd5e1', borderRadius: 4, background: 'transparent', fontSize: 11, color: '#64748b', cursor: 'pointer' }}>+ Add row</button>
          </div>

          {/* Quality Check */}
          <div style={{ background: '#166534', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', fontSize: 12, fontWeight: 500, color: '#fff', marginTop: 16, borderRadius: '4px 4px 0 0' }}>
            Quality Check
          </div>
          <div style={{ border: '0.5px solid #e2e8f0', borderRadius: '0 0 6px 6px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: '0.5px solid #e2e8f0' }}>
              <label style={{ fontSize: 11, fontWeight: 500, color: '#64748b', minWidth: 120 }}>Status</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['pass', 'fail', 'rework'].map(status => (
                  <label key={status} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#1e293b', cursor: 'pointer' }}>
                    <input type="radio" name="qc" value={status} checked={d.qc_status === status} onChange={() => updateField('qc_status', status)} style={{ accentColor: '#166534', width: 14, height: 14 }} />
                    <span style={{ textTransform: 'capitalize' }}>{status}</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: '0.5px solid #e2e8f0' }}>
              <label style={{ fontSize: 11, fontWeight: 500, color: '#64748b', minWidth: 120 }}>QC Inspector</label>
              <input value={d.qc_inspector} onChange={(e) => updateField('qc_inspector', e.target.value)} style={{ flex: 1, border: 'none', borderBottom: '1.5px solid #16a34a', background: 'transparent', fontSize: 12, color: '#1e293b', padding: '1px 0', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
              <label style={{ fontSize: 11, fontWeight: 500, color: '#64748b', minWidth: 120 }}>QC Remarks</label>
              <input value={d.qc_remarks} onChange={(e) => updateField('qc_remarks', e.target.value)} style={{ flex: 1, border: 'none', borderBottom: '1.5px solid #16a34a', background: 'transparent', fontSize: 12, color: '#1e293b', padding: '1px 0', outline: 'none' }} />
            </div>
          </div>

          {/* Signatures */}
          <div style={{ background: '#c2410c', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', fontSize: 12, fontWeight: 500, color: '#fff', marginTop: 16, borderRadius: '4px 4px 0 0' }}>
            Authorisation & Signatures
          </div>
          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {['Karigar Signature', 'Supervisor Signature', 'Manager / Owner Signature'].map(label => (
                <div key={label} style={{ background: '#f8fafc', border: '0.5px solid #e2e8f0', borderRadius: 6, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ borderBottom: '1.5px solid #3b82f6', margin: '28px 8px 8px', display: 'block' }}></div>
                  <span style={{ fontSize: 10, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, background: '#f8fafc', border: '0.5px solid #e2e8f0', borderRadius: 6, padding: '8px 12px', fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>
              <strong style={{ color: '#1e293b' }}>Note:</strong> This card must be filled accurately and returned to the office upon completion. Any discrepancy should be reported immediately to the Supervisor.
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
