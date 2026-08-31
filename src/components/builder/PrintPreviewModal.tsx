import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ResumeData } from '../../types/resume';
import { ResumeTemplateRenderer } from '../templates/ResumeTemplateRenderer';
import { exportResumeToPDF, printResume } from '../../utils/pdfExport';
import {
  Printer,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCheck,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  onShowToast?: (toast: { type: 'success' | 'error' | 'info' | 'warning'; title: string; message?: string }) => void;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  resume,
  onShowToast,
}) => {
  const [zoomScale, setZoomScale] = useState(0.85);
  const [paperFormat, setPaperFormat] = useState<'a4' | 'letter'>('a4');
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handlePrint = () => {
    printResume();
    if (onShowToast) {
      onShowToast({
        type: 'info',
        title: 'Opening Print Dialog',
        message: 'Ensure margins are set to "Default" or "None" in your browser print settings.',
      });
    }
  };

  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);
    if (onShowToast) {
      onShowToast({
        type: 'info',
        title: 'Generating Document PDF...',
        message: 'Compiling high-resolution vector layout.',
      });
    }

    try {
      const fileName = `${resume.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_Print.pdf`;
      const success = await exportResumeToPDF('resume-document-root', fileName);
      if (success && onShowToast) {
        onShowToast({
          type: 'success',
          title: 'PDF Downloaded',
          message: `Saved ${fileName}`,
        });
      }
    } catch (e) {
      if (onShowToast) {
        onShowToast({
          type: 'error',
          title: 'Export Failed',
          message: 'Falling back to browser print dialog.',
        });
      }
      printResume();
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Print & Document Preview"
      subtitle="A4/Letter sheet rendering with precision typography, page break optimization, and vector margins."
      maxWidth="5xl"
    >
      <div className="space-y-4">
        {/* Controls Toolbar */}
        <div className="no-print bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          {/* Paper format & dimensions */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Paper Format:</span>
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setPaperFormat('a4')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  paperFormat === 'a4'
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A4 (210 × 297mm)
              </button>
              <button
                type="button"
                onClick={() => setPaperFormat('letter')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  paperFormat === 'letter'
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                US Letter (8.5 × 11")
              </button>
            </div>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs">
            <button
              type="button"
              onClick={() => setZoomScale(Math.max(0.5, zoomScale - 0.1))}
              className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] font-semibold text-slate-700 min-w-[40px] text-center">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomScale(Math.min(1.2, zoomScale + 0.1))}
              className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomScale(0.85)}
              className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors"
              title="Reset 85%"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingPDF ? 'Exporting...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* Paper Canvas Preview Area */}
        <div className="bg-slate-800/95 rounded-xl border border-slate-700 p-4 sm:p-8 overflow-x-auto overflow-y-auto max-h-[65vh] flex justify-center items-start shadow-inner">
          <div
            className="transition-transform duration-150 origin-top"
            style={{
              width: paperFormat === 'a4' ? '210mm' : '8.5in',
              minHeight: paperFormat === 'a4' ? '297mm' : '11in',
              transform: `scale(${zoomScale})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Real Document Container */}
            <div className="shadow-2xl ring-1 ring-slate-900/10">
              <ResumeTemplateRenderer resume={resume} isPreview={false} />
            </div>
          </div>
        </div>

        {/* Footer info & tips */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>A4 Print CSS Optimized</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-slate-600">
              <FileCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Vector Text Output</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>In the print dialog, select "Save as PDF" or your physical printer.</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
