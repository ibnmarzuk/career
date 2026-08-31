import React from 'react';
import { ResumeCustomization, TemplateId } from '../../types/resume';
import { TEMPLATES } from '../../data/templates';
import { Palette, Type, Sliders, Check, LayoutTemplate } from 'lucide-react';

interface TemplateCustomizerProps {
  currentTemplateId: TemplateId;
  customization: ResumeCustomization;
  onSelectTemplate: (templateId: TemplateId) => void;
  onChangeCustomization: (updated: Partial<ResumeCustomization>) => void;
}

export const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({
  currentTemplateId,
  customization,
  onSelectTemplate,
  onChangeCustomization,
}) => {
  const colorPresets = [
    { label: 'Royal Blue', hex: '#2563eb' },
    { label: 'Slate Executive', hex: '#0f172a' },
    { label: 'Emerald Tech', hex: '#059669' },
    { label: 'Indigo Modern', hex: '#4f46e5' },
    { label: 'Violet Creative', hex: '#7c3aed' },
    { label: 'Amber Heritage', hex: '#b45309' },
    { label: 'Crimson Bold', hex: '#dc2626' },
    { label: 'Charcoal Minimal', hex: '#334155' },
  ];

  const fonts = [
    { name: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Modern Tech)' },
    { name: 'Inter', label: 'Inter (High ATS Clarity)' },
    { name: 'EB Garamond', label: 'EB Garamond (Editorial Serif)' },
    { name: 'Playfair Display', label: 'Playfair Display (Executive)' },
    { name: 'Outfit', label: 'Outfit (Geometric Clean)' },
    { name: 'Space Grotesk', label: 'Space Grotesk (Engineering)' },
    { name: 'Fira Code', label: 'Fira Code (Developer Mono)' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Template Selector Gallery */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Choose Resume Template</h3>
        </div>
        <p className="text-xs text-slate-500">
          All templates share the exact same structured data. Switch instantly without losing content.
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          {TEMPLATES.map(tmpl => {
            const isSelected = tmpl.id === currentTemplateId;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onSelectTemplate(tmpl.id)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{tmpl.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
                <span className="text-[10px] text-slate-500 block truncate">{tmpl.category}</span>
                <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded mt-1 inline-block">
                  ATS: {tmpl.atsSuitability}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Color Scheme Accent */}
      <div className="space-y-2.5 pt-2 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Accent Color</h3>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {colorPresets.map(preset => (
            <button
              key={preset.hex}
              type="button"
              onClick={() => onChangeCustomization({ accentColor: preset.hex })}
              title={preset.label}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                customization.accentColor === preset.hex ? 'scale-110 ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: preset.hex }}
            >
              {customization.accentColor === preset.hex && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          ))}
          <input
            type="color"
            value={customization.accentColor}
            onChange={e => onChangeCustomization({ accentColor: e.target.value })}
            className="w-7 h-7 rounded-full border border-slate-300 cursor-pointer overflow-hidden p-0"
            title="Custom Hex Color"
          />
        </div>
      </div>

      {/* 3. Typography & Sizing */}
      <div className="space-y-3 pt-2 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Typography & Scale</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Font Family</label>
            <select
              value={customization.fontFamily}
              onChange={e => onChangeCustomization({ fontFamily: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              {fonts.map(f => (
                <option key={f.name} value={f.name}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Base Font Size</label>
            <select
              value={customization.fontSize}
              onChange={e => onChangeCustomization({ fontSize: e.target.value as any })}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="sm">Compact (12px) - Fits 1 Page</option>
              <option value="base">Standard (13px) - Balanced</option>
              <option value="lg">Spacious (14.5px) - High Readability</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Section Margins</label>
            <select
              value={customization.margins}
              onChange={e => onChangeCustomization({ margins: e.target.value as any })}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="compact">Compact (0.5 in / 12mm)</option>
              <option value="normal">Standard (0.75 in / 19mm)</option>
              <option value="spacious">Spacious (1.0 in / 25mm)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Bullet Point Style</label>
            <select
              value={customization.bulletStyle}
              onChange={e => onChangeCustomization({ bulletStyle: e.target.value as any })}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="disc">• Standard Disc</option>
              <option value="circle">○ Modern Circle</option>
              <option value="dash">– Minimal Dash</option>
              <option value="arrow">▸ Sharp Arrow</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Date Format</label>
            <select
              value={customization.dateFormat}
              onChange={e => onChangeCustomization({ dateFormat: e.target.value as any })}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="MMM YYYY">Jan 2024</option>
              <option value="MM/YYYY">01/2024</option>
              <option value="YYYY">2024 Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Paper Export Format</label>
            <select
              value={customization.paperSize}
              onChange={e => onChangeCustomization({ paperSize: e.target.value as any })}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="a4">Standard A4 (International)</option>
              <option value="letter">US Letter (North America)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
