import React, { useRef, useState } from 'react';

// ── Types ────────────────────────────────────────────────────
export interface JobCardData {
  // Header
  company_name?: string;
  job_card_no: string;
  date: string;
  checker_name: string;
  // Process type checkboxes
  process_grey?: boolean;
  process_colour?: boolean;
  process_handwork?: boolean;
  process_embroidery?: boolean;
  process_cutting?: boolean;
  process_stitching?: boolean;
  process_finishing?: boolean;
  // Fabric / Style
  fabric_type: string;
  design_style_no: string;
  colour_shade: string;
  width_inch?: string;
  // Roll / Lot
  loom_no?: string;
  lot_no?: string;
  total_meter?: string;
  // QC Checks — Grey Fabric
  grey_hole_cut?: boolean;
  grey_slub_knot?: boolean;
  grey_reed_mark?: boolean;
  grey_oil_stain?: boolean;
  grey_remarks?: string;
  // QC Checks — Colour Fabric
  col_shade_match?: boolean;
  col_shade_variation?: boolean;
  col_print_defect?: boolean;
  col_remarks?: string;
  // QC Checks — Embroidery
  embr_design_match?: boolean;
  embr_thread_break?: boolean;
  embr_missing_stitch?: boolean;
  embr_zari_damage?: boolean;
  embr_remarks?: string;
  // QC Checks — Hand Work
  hand_missing_beads?: boolean;
  hand_broken_mirror?: boolean;
  hand_uneven_work?: boolean;
  hand_remarks?: string;
  // QC Checks — Cutting
  cut_marker_correct?: boolean;
  cut_shade_lot?: boolean;
  cut_accuracy?: boolean;
  cut_notch_drill?: boolean;
  cut_remarks?: string;
  // QC Checks — Stitching
  stitch_measurement?: boolean;
  stitch_quality?: boolean;
  stitch_no_broken_seam?: boolean;
  stitch_thread_clean?: boolean;
  stitch_remarks?: string;
  // QC Checks — Finishing
  finish_cleaning?: boolean;
  finish_iron?: boolean;
  finish_no_stain?: boolean;
  finish_packing?: boolean;
  finish_remarks?: string;
  // Defect Entry (4-Point System)
  defects?: Array<{ sr: number; defect: string; size: string; points: number; remark: string }>;
  // Summary
  total_defects?: number;
  total_points?: number;
  points_per_100yard?: number;
  shade_status?: string;
  final_result?: 'ACCEPT' | 'REWORK' | 'SECOND' | 'REJECT' | '';
  final_remarks?: string;
  supervisor?: string;
  // Process Parameters
  machine_no?: string;
  operator_name?: string;
  start_time?: string;
  end_time?: string;
  target_qty?: string;
  actual_qty?: string;
}

// ── Default Data ─────────────────────────────────────────────
const BLANK_JOB_CARD: JobCardData = {
  company_name: 'KARNI IMPEX',
  job_card_no: '',
  date: new Date().toISOString().split('T')[0],
  checker_name: '',
  fabric_type: '',
  design_style_no: '',
  colour_shade: '',
  defects: [
    { sr: 1, defect: '', size: '', points: 0, remark: '' },
    { sr: 2, defect: '', size: '', points: 0, remark: '' },
    { sr: 3, defect: '', size: '', points: 0, remark: '' },
    { sr: 4, defect: '', size: '', points: 0, remark: '' },
    { sr: 5, defect: '', size: '', points: 0, remark: '' },
  ],
  final_result: '',
};

// ── Helper ────────────────────────────────────────────────────
const Checkbox: React.FC<{ checked?: boolean; label: string; onChange?: (val: boolean) => void }> = ({ checked, label, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3, cursor: 'pointer' }}>
    <input 
      type="checkbox" 
      checked={!!checked} 
      onChange={(e) => onChange?.(e.target.checked)}
      style={{ width: 13, height: 13, accentColor: '#1e3a5f' }}
    />
    <span style={{ fontSize: 9, color: '#222' }}>{label}</span>
  </label>
);

const Field: React.FC<{ label: string; value?: string; width?: string | number; onChange?: (val: string) => void; type?: string }> = ({ label, value, width, onChange, type = 'text' }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4, width }}>
    <span style={{ fontSize: 9, color: '#444', whiteSpace: 'nowrap', flexShrink: 0 }}>{label}:</span>
    <div style={{ flex: 1, borderBottom: '1px solid #888', minWidth: 60, paddingBottom: 1 }}>
      <input 
        type={type}
        value={value || ''} 
        onChange={(e) => onChange?.(e.target.value)}
        style={{ 
          border: 'none', 
          outline: 'none', 
          width: '100%', 
          fontSize: 9, 
          color: '#111', 
          background: 'transparent',
          padding: 0,
          margin: 0
        }}
      />
    </div>
  </div>
);

const SectionHeader = ({ color, label }: { color: string; label: string }) => (
  <div style={{
    backgroundColor: color, color: 'white', fontWeight: 700,
    fontSize: 9, padding: '3px 6px', marginBottom: 4, letterSpacing: 0.5,
    textTransform: 'uppercase', borderRadius: 2
  }}>
    {label}
  </div>
);

// ── Print Styles ──────────────────────────────────────────────
const PRINT_STYLES = `
  @media print {
    aside, header, main, .no-print { display: none !important; }
    #karni-job-card-print { 
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
    input[type="checkbox"] { -webkit-print-color-adjust: exact; }
    @page { margin: 10mm; size: A4 portrait; }
  }
`;

// ── Main Component ────────────────────────────────────────────
interface Props {
  data?: Partial<JobCardData>;
  onClose: () => void;
}

export const JobCardPrint: React.FC<Props> = ({ data: propData, onClose }) => {
  const [d, setD] = useState<JobCardData>({ ...BLANK_JOB_CARD, ...propData });
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();

  const updateField = (field: keyof JobCardData, value: any) => {
    setD(prev => ({ ...prev, [field]: value }));
  };

  const updateDefect = (index: number, field: string, value: any) => {
    const newDefects = [...(d.defects || [])];
    newDefects[index] = { ...newDefects[index], [field]: value };
    setD(prev => ({ ...prev, defects: newDefects }));
  };

  const addDefectRow = () => {
    const newDefects = [...(d.defects || [])];
    newDefects.push({ sr: newDefects.length + 1, defect: '', size: '', points: 0, remark: '' });
    setD(prev => ({ ...prev, defects: newDefects }));
  };

  const totalPts = d.defects?.reduce((s, r) => s + (Number(r.points) || 0), 0) ?? 0;

  return (
    <>
      <style>{PRINT_STYLES}</style>

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
        id="karni-job-card-print"
        ref={printRef}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, width: 680, backgroundColor: 'white',
          fontFamily: 'Arial, sans-serif', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          borderRadius: 6, overflow: 'hidden',
          maxHeight: 'calc(100vh - 80px)', overflowY: 'auto'
        }}
      >
        {/* ── HEADER ─────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5986 100%)',
          padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: 14, letterSpacing: 1 }}>
              {d.company_name || 'KARNI IMPEX'}
            </div>
            <div style={{ color: '#a8d4ff', fontSize: 9, marginTop: 1 }}>
              ALL FABRIC &amp; GARMENT PROCESS — MASTER JOB CARD
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#a8d4ff', fontSize: 8 }}>JOB CARD NO.</div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: 13 }}>
              <input 
                type="text" 
                value={d.job_card_no} 
                onChange={(e) => updateField('job_card_no', e.target.value)}
                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', color: 'white', textAlign: 'right', outline: 'none', fontWeight: 800, fontSize: 13, width: 100 }}
              />
            </div>
          </div>
        </div>

        <div style={{ padding: '10px 14px', borderBottom: '1px solid #e2e8f0' }}>
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 6 }}>
            <Field label="Date" value={d.date} type="date" onChange={(v) => updateField('date', v)} />
            <Field label="Checker Name" value={d.checker_name} onChange={(v) => updateField('checker_name', v)} />
            <Field label="Supervisor" value={d.supervisor} onChange={(v) => updateField('supervisor', v)} />
          </div>

          {/* Process checkboxes */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#1e3a5f', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Process Type:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 16px' }}>
              <Checkbox label="Grey" checked={d.process_grey} onChange={(v) => updateField('process_grey', v)} />
              <Checkbox label="Colour" checked={d.process_colour} onChange={(v) => updateField('process_colour', v)} />
              <Checkbox label="Handwork" checked={d.process_handwork} onChange={(v) => updateField('process_handwork', v)} />
              <Checkbox label="Embroidery" checked={d.process_embroidery} onChange={(v) => updateField('process_embroidery', v)} />
              <Checkbox label="Cutting" checked={d.process_cutting} onChange={(v) => updateField('process_cutting', v)} />
              <Checkbox label="Stitching" checked={d.process_stitching} onChange={(v) => updateField('process_stitching', v)} />
              <Checkbox label="Finishing" checked={d.process_finishing} onChange={(v) => updateField('process_finishing', v)} />
            </div>
          </div>

          {/* Fabric / Style / Lot */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 4 }}>
            <Field label="Fabric Type" value={d.fabric_type} onChange={(v) => updateField('fabric_type', v)} />
            <Field label="Design / Style No" value={d.design_style_no} onChange={(v) => updateField('design_style_no', v)} />
            <Field label="Colour / Shade" value={d.colour_shade} onChange={(v) => updateField('colour_shade', v)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <Field label="Width (inch)" value={d.width_inch} onChange={(v) => updateField('width_inch', v)} />
            <Field label="Lot No" value={d.lot_no} onChange={(v) => updateField('lot_no', v)} />
            <Field label="Total Meter" value={d.total_meter} onChange={(v) => updateField('total_meter', v)} />
          </div>
        </div>

        {/* ── PROCESS PARAMETERS ────────────────────────── */}
        <div style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            ▶ Process Parameters & Production Log
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
            <Field label="Machine / Table No" value={d.machine_no} onChange={(v) => updateField('machine_no', v)} />
            <Field label="Operator Name" value={d.operator_name} onChange={(v) => updateField('operator_name', v)} />
            <Field label="Start Time" value={d.start_time} type="time" onChange={(v) => updateField('start_time', v)} />
            <Field label="End Time" value={d.end_time} type="time" onChange={(v) => updateField('end_time', v)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginTop: 4 }}>
            <Field label="Target Qty" value={d.target_qty} onChange={(v) => updateField('target_qty', v)} />
            <Field label="Actual Qty" value={d.actual_qty} onChange={(v) => updateField('actual_qty', v)} />
            <div style={{ gridColumn: 'span 2' }}>
              <Field label="Process Remarks" value={d.final_remarks} onChange={(v) => updateField('final_remarks', v)} />
            </div>
          </div>
        </div>

        {/* ── QC CHECKS GRID ───────────────────────────── */}
        <div style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            ▶ Checking Section (All Process)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {/* Grey Fabric */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: 4, overflow: 'hidden' }}>
              <SectionHeader color="#475569" label="Grey Fabric" />
              <div style={{ padding: '4px 6px' }}>
                <Checkbox label="Hole / Cut" checked={d.grey_hole_cut} onChange={(v) => updateField('grey_hole_cut', v)} />
                <Checkbox label="Slub / Knot" checked={d.grey_slub_knot} onChange={(v) => updateField('grey_slub_knot', v)} />
                <Checkbox label="Reed Mark" checked={d.grey_reed_mark} onChange={(v) => updateField('grey_reed_mark', v)} />
                <Checkbox label="Oil Stain" checked={d.grey_oil_stain} onChange={(v) => updateField('grey_oil_stain', v)} />
                <div style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 8, color: '#666' }}>Remarks: </span>
                  <input 
                    type="text" 
                    value={d.grey_remarks || ''} 
                    onChange={(e) => updateField('grey_remarks', e.target.value)}
                    style={{ border: 'none', borderBottom: '1px solid #ccc', width: '100%', fontSize: 9, outline: 'none' }}
                  />
                </div>
              </div>
            </div>
            {/* Colour Fabric */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: 4, overflow: 'hidden' }}>
              <SectionHeader color="#1d4ed8" label="Colour Fabric" />
              <div style={{ padding: '4px 6px' }}>
                <Checkbox label="Shade Match (Lab dip)" checked={d.col_shade_match} onChange={(v) => updateField('col_shade_match', v)} />
                <Checkbox label="Shade Variation (Side/End)" checked={d.col_shade_variation} onChange={(v) => updateField('col_shade_variation', v)} />
                <Checkbox label="Print Defect" checked={d.col_print_defect} onChange={(v) => updateField('col_print_defect', v)} />
                <div style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 8, color: '#666' }}>Remarks: </span>
                  <input 
                    type="text" 
                    value={d.col_remarks || ''} 
                    onChange={(e) => updateField('col_remarks', e.target.value)}
                    style={{ border: 'none', borderBottom: '1px solid #ccc', width: '100%', fontSize: 9, outline: 'none' }}
                  />
                </div>
              </div>
            </div>
            {/* Embroidery */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: 4, overflow: 'hidden' }}>
              <SectionHeader color="#7c3aed" label="Embroidery" />
              <div style={{ padding: '4px 6px' }}>
                <Checkbox label="Design Match" checked={d.embr_design_match} onChange={(v) => updateField('embr_design_match', v)} />
                <Checkbox label="Thread Break" checked={d.embr_thread_break} onChange={(v) => updateField('embr_thread_break', v)} />
                <Checkbox label="Missing Stitch" checked={d.embr_missing_stitch} onChange={(v) => updateField('embr_missing_stitch', v)} />
                <Checkbox label="Sequence/Zari Damage" checked={d.embr_zari_damage} onChange={(v) => updateField('embr_zari_damage', v)} />
                <div style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 8, color: '#666' }}>Remarks: </span>
                  <input 
                    type="text" 
                    value={d.embr_remarks || ''} 
                    onChange={(e) => updateField('embr_remarks', e.target.value)}
                    style={{ border: 'none', borderBottom: '1px solid #ccc', width: '100%', fontSize: 9, outline: 'none' }}
                  />
                </div>
              </div>
            </div>
            {/* Hand Work */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: 4, overflow: 'hidden' }}>
              <SectionHeader color="#b45309" label="Hand Work" />
              <div style={{ padding: '4px 6px' }}>
                <Checkbox label="Missing Beads / Stone" checked={d.hand_missing_beads} onChange={(v) => updateField('hand_missing_beads', v)} />
                <Checkbox label="Broken Mirror" checked={d.hand_broken_mirror} onChange={(v) => updateField('hand_broken_mirror', v)} />
                <Checkbox label="Uneven Work" checked={d.hand_uneven_work} onChange={(v) => updateField('hand_uneven_work', v)} />
                <div style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 8, color: '#666' }}>Remarks: </span>
                  <input 
                    type="text" 
                    value={d.hand_remarks || ''} 
                    onChange={(e) => updateField('hand_remarks', e.target.value)}
                    style={{ border: 'none', borderBottom: '1px solid #ccc', width: '100%', fontSize: 9, outline: 'none' }}
                  />
                </div>
              </div>
            </div>
            {/* Cutting */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: 4, overflow: 'hidden' }}>
              <SectionHeader color="#065f46" label="Cutting" />
              <div style={{ padding: '4px 6px' }}>
                <Checkbox label="Marker Correct" checked={d.cut_marker_correct} onChange={(v) => updateField('cut_marker_correct', v)} />
                <Checkbox label="Shade Lot Same" checked={d.cut_shade_lot} onChange={(v) => updateField('cut_shade_lot', v)} />
                <Checkbox label="Cutting Accuracy" checked={d.cut_accuracy} onChange={(v) => updateField('cut_accuracy', v)} />
                <Checkbox label="Notch / Drill Correct" checked={d.cut_notch_drill} onChange={(v) => updateField('cut_notch_drill', v)} />
                <div style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 8, color: '#666' }}>Remarks: </span>
                  <input 
                    type="text" 
                    value={d.cut_remarks || ''} 
                    onChange={(e) => updateField('cut_remarks', e.target.value)}
                    style={{ border: 'none', borderBottom: '1px solid #ccc', width: '100%', fontSize: 9, outline: 'none' }}
                  />
                </div>
              </div>
            </div>
            {/* Stitching */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: 4, overflow: 'hidden' }}>
              <SectionHeader color="#0f766e" label="Stitching" />
              <div style={{ padding: '4px 6px' }}>
                <Checkbox label="Measurement OK" checked={d.stitch_measurement} onChange={(v) => updateField('stitch_measurement', v)} />
                <Checkbox label="Stitching Quality" checked={d.stitch_quality} onChange={(v) => updateField('stitch_quality', v)} />
                <Checkbox label="No Broken Seam" checked={d.stitch_no_broken_seam} onChange={(v) => updateField('stitch_no_broken_seam', v)} />
                <Checkbox label="Thread Clean" checked={d.stitch_thread_clean} onChange={(v) => updateField('stitch_thread_clean', v)} />
                <div style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 8, color: '#666' }}>Remarks: </span>
                  <input 
                    type="text" 
                    value={d.stitch_remarks || ''} 
                    onChange={(e) => updateField('stitch_remarks', e.target.value)}
                    style={{ border: 'none', borderBottom: '1px solid #ccc', width: '100%', fontSize: 9, outline: 'none' }}
                  />
                </div>
              </div>
            </div>
            {/* Finishing */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: 4, overflow: 'hidden' }}>
              <SectionHeader color="#be185d" label="Finishing" />
              <div style={{ padding: '4px 6px' }}>
                <Checkbox label="Cleaning Done" checked={d.finish_cleaning} onChange={(v) => updateField('finish_cleaning', v)} />
                <Checkbox label="Iron Proper" checked={d.finish_iron} onChange={(v) => updateField('finish_iron', v)} />
                <Checkbox label="No Stain" checked={d.finish_no_stain} onChange={(v) => updateField('finish_no_stain', v)} />
                <Checkbox label="Packing OK" checked={d.finish_packing} onChange={(v) => updateField('finish_packing', v)} />
                <div style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 8, color: '#666' }}>Remarks: </span>
                  <input 
                    type="text" 
                    value={d.finish_remarks || ''} 
                    onChange={(e) => updateField('finish_remarks', e.target.value)}
                    style={{ border: 'none', borderBottom: '1px solid #ccc', width: '100%', fontSize: 9, outline: 'none' }}
                  />
                </div>
              </div>
            </div>
            {/* 4-Point legend */}
            <div style={{ border: '1px solid #fbbf24', borderRadius: 4, overflow: 'hidden', backgroundColor: '#fffbeb' }}>
              <div style={{ background: '#d97706', color: 'white', fontWeight: 700, fontSize: 9, padding: '3px 6px', letterSpacing: 0.5 }}>
                4-POINT SYSTEM
              </div>
              <div style={{ padding: '4px 6px' }}>
                {[['0–3 inch', 1], ['3–6 inch', 2], ['6–9 inch', 3], ['9+ inch', 4]].map(([s, p]) => (
                  <div key={s as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, marginBottom: 2 }}>
                    <span style={{ color: '#444' }}>{s}</span>
                    <span style={{ fontWeight: 700, color: '#b45309' }}>{p} pt</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── DEFECT TABLE ─────────────────────────────── */}
        <div style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: 1 }}>
              ▶ Defect Entry (4-Point System)
            </div>
            <button 
              className="no-print"
              onClick={addDefectRow}
              style={{ fontSize: 8, background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}
            >
              + Add Row
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9 }}>
            <thead>
              <tr style={{ backgroundColor: '#1e3a5f' }}>
                {['Sr', 'Defect Description', 'Size', 'Points', 'Remark'].map(h => (
                  <th key={h} style={{ color: 'white', padding: '4px 6px', textAlign: 'left', fontWeight: 700, fontSize: 8 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(d.defects || []).map((row, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#f8fafc' : 'white' }}>
                  <td style={{ padding: '5px 6px', border: '1px solid #e2e8f0', width: 24, textAlign: 'center', fontWeight: 700 }}>{row.sr}</td>
                  <td style={{ padding: '5px 6px', border: '1px solid #e2e8f0' }}>
                    <input 
                      type="text" 
                      value={row.defect} 
                      onChange={(e) => updateDefect(i, 'defect', e.target.value)}
                      style={{ border: 'none', background: 'transparent', width: '100%', fontSize: 9, outline: 'none' }}
                    />
                  </td>
                  <td style={{ padding: '5px 6px', border: '1px solid #e2e8f0', width: 60 }}>
                    <input 
                      type="text" 
                      value={row.size} 
                      onChange={(e) => updateDefect(i, 'size', e.target.value)}
                      style={{ border: 'none', background: 'transparent', width: '100%', fontSize: 9, outline: 'none' }}
                    />
                  </td>
                  <td style={{ padding: '5px 6px', border: '1px solid #e2e8f0', width: 44, textAlign: 'center', fontWeight: 700 }}>
                    <input 
                      type="number" 
                      value={row.points || ''} 
                      onChange={(e) => updateDefect(i, 'points', e.target.value)}
                      style={{ border: 'none', background: 'transparent', width: '100%', fontSize: 9, outline: 'none', textAlign: 'center', fontWeight: 700 }}
                    />
                  </td>
                  <td style={{ padding: '5px 6px', border: '1px solid #e2e8f0' }}>
                    <input 
                      type="text" 
                      value={row.remark} 
                      onChange={(e) => updateDefect(i, 'remark', e.target.value)}
                      style={{ border: 'none', background: 'transparent', width: '100%', fontSize: 9, outline: 'none' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── SUMMARY & RESULT ─────────────────────────── */}
        <div style={{ padding: '8px 14px 10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {/* Summary */}
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                ▶ Summary
              </div>
              <div style={{ backgroundColor: '#f1f5f9', borderRadius: 4, padding: '6px 8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 9, color: '#555' }}>Total Defects</span>
                  <input 
                    type="number" 
                    value={d.total_defects ?? ''} 
                    onChange={(e) => updateField('total_defects', e.target.value)}
                    style={{ border: 'none', background: 'transparent', textAlign: 'right', fontSize: 9, fontWeight: 700, color: '#1e3a5f', width: 40, outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 9, color: '#555' }}>Total Points</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#1e3a5f' }}>{totalPts}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 9, color: '#555' }}>Points / 100 sq yd</span>
                  <input 
                    type="number" 
                    value={d.points_per_100yard ?? ''} 
                    onChange={(e) => updateField('points_per_100yard', e.target.value)}
                    style={{ border: 'none', background: 'transparent', textAlign: 'right', fontSize: 9, fontWeight: 700, color: '#1e3a5f', width: 40, outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 9, color: '#555' }}>Shade Status</span>
                  <input 
                    type="text" 
                    value={d.shade_status ?? ''} 
                    onChange={(e) => updateField('shade_status', e.target.value)}
                    style={{ border: 'none', background: 'transparent', textAlign: 'right', fontSize: 9, fontWeight: 700, color: '#1e3a5f', width: 80, outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* Final Result */}
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                ▶ Final Result
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
                {(['ACCEPT', 'REWORK', 'SECOND', 'REJECT'] as const).map(r => (
                  <div 
                    key={r} 
                    onClick={() => updateField('final_result', r)}
                    style={{
                      border: `2px solid ${d.final_result === r ? (r === 'ACCEPT' ? '#16a34a' : r === 'REJECT' ? '#dc2626' : '#d97706') : '#cbd5e1'}`,
                      borderRadius: 4, padding: '6px 8px', textAlign: 'center',
                      backgroundColor: d.final_result === r ? (r === 'ACCEPT' ? '#dcfce7' : r === 'REJECT' ? '#fef2f2' : '#fffbeb') : '#f8fafc',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 800, color: d.final_result === r ? (r === 'ACCEPT' ? '#15803d' : r === 'REJECT' ? '#b91c1c' : '#b45309') : '#94a3b8' }}>
                      {d.final_result === r ? '✓ ' : ''}{r}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 5 }}>
                <Field label="Final Remarks" value={d.final_remarks} onChange={(v) => updateField('final_remarks', v)} />
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 10 }}>
            {['Checked By', 'Supervisor Sign', 'Approval'].map(label => (
              <div key={label}>
                <div style={{ borderBottom: '1px solid #333', marginBottom: 3, height: 20 }} />
                <div style={{ fontSize: 9, color: '#555', textAlign: 'center' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 8, textAlign: 'center', fontSize: 8, color: '#94a3b8' }}>
            Karni Impex — GSTIN: 24AUOPD2833Q1Z9 · Surat, Gujarat
            &nbsp;|&nbsp; Printed: {new Date().toLocaleString('en-IN')}
          </div>
        </div>
      </div>
    </>
  );
};
