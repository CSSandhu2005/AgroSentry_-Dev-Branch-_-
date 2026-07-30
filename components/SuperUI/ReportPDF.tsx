'use client';
import { useState, useEffect } from 'react';
import type { ReportResponse } from '@/lib/agents/report-agent';

interface Props {
  data: ReportResponse;
  farmerName: string;
}

export default function ReportPDFButton({ data, farmerName }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load jsPDF from CDN dynamically
    if (typeof window !== 'undefined' && !window.hasOwnProperty('jspdf')) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.async = true;
      script.onload = () => {
        const autoTableScript = document.createElement('script');
        autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js';
        autoTableScript.async = true;
        autoTableScript.onload = () => setIsLoaded(true);
        document.body.appendChild(autoTableScript);
      };
      document.body.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  const downloadPDF = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Header & Branding
    doc.setFillColor(15, 45, 25); // Dark Green
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('AGROSENTRY FARM ADVISORY REPORT', 15, 20);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`REPORT ID: ${data.metadata.reportId} • GENERATED: ${new Date(data.metadata.generatedAt).toLocaleDateString()}`, 15, 30);

    // 2. Farmer Summary
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(`Farmer: ${farmerName || data.overview.name}`, 15, 52);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Location: ${data.overview.village}, ${data.overview.state} | Land: ${data.overview.landSize} Acres | Soil: ${data.overview.soilType}`, 15, 60, { maxWidth: pageWidth - 30 });

    // 3. Executive Status
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Status: ${data.executiveSummary.status}`, 15, 75);

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    const splitSit = doc.splitTextToSize(data.executiveSummary.currentSituation, pageWidth - 30);
    doc.text(splitSit, 15, 83);

    // 4. Action Items Table
    const actionY = 83 + (splitSit.length * 5) + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DETERMINISTIC FARMER ACTION CHECKLIST:', 15, actionY);

    const actionBody = data.actionPlan.map((act) => [
      act.task,
      act.category,
      act.priority,
      act.sourceAgent,
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc as any).autoTable({
      startY: actionY + 5,
      head: [['Task', 'Category', 'Priority', 'Source Agent']],
      body: actionBody,
      headStyles: { fillColor: [22, 101, 52] },
      styles: { fontSize: 8.5, cellPadding: 4 },
      columnStyles: { 0: { cellWidth: 80 } },
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    doc.text(data.disclaimer, pageWidth / 2, 285, { align: 'center', maxWidth: pageWidth - 30 });

    doc.save(`AgroSentry_Report_${farmerName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <button 
      onClick={downloadPDF}
      disabled={!isLoaded}
      className="btn btn-primary"
      style={{ 
        background: isLoaded ? 'linear-gradient(135deg, #16a34a, #15803d)' : '#333', 
        boxShadow: isLoaded ? '0 4px 14px rgba(22, 163, 74, 0.4)' : 'none',
        fontWeight: 700,
        gap: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        opacity: isLoaded ? 1 : 0.7,
        cursor: isLoaded ? 'pointer' : 'not-allowed'
      }}
    >
      {isLoaded ? '📄 Download Official PDF Report' : '⌛ Preparing PDF Engine...'}
    </button>
  );
}
