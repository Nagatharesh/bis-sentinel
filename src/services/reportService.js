import { SUBMITTED_REPORTS } from './mockData';

let fallbackReportsStore = [...SUBMITTED_REPORTS];

export const reportService = {
  /**
   * Get all filed reports from SQLite
   */
  async getReports() {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          fallbackReportsStore = data;
          return data;
        }
      }
    } catch (err) {
      console.warn('SQLite reports fetch failed, using fallback:', err);
    }
    return [...fallbackReportsStore];
  },

  /**
   * Get report by ID
   */
  async getReportById(id) {
    const list = await this.getReports();
    const rep = list.find((r) => r.id === id);
    if (!rep) throw new Error('Report not found');
    return JSON.parse(JSON.stringify(rep));
  },

  /**
   * Submit a new report matching BIS Care portal format into SQLite
   */
  async submitReport({
    checkId,
    productTitle,
    licenceNumber,
    complaintType,
    summary,
    shareContactConsent,
    contactDetails,
    evidenceFiles = [],
  }) {
    const trackingNumber = `BIS-CARE-2026-TN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReport = {
      id: `rep-${Date.now()}`,
      checkId: checkId || 'manual-check',
      productTitle: productTitle || 'Reported Consumer Item',
      licenceNumber: licenceNumber || 'Not Stated',
      complaintType: complaintType || 'misuse_of_mark',
      status: 'Submitted',
      statusCode: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      trackingNumber,
      summary,
      shareContactConsent: !!shareContactConsent,
      contactDetails: shareContactConsent ? contactDetails : null,
      evidenceFiles: evidenceFiles.length > 0 ? evidenceFiles : [
        {
          name: 'preserved_evidence_bundle.json',
          sha256: 'a9b8c7d6e5f43210fedcba9876543210abcdef0123456789abcdef0123456789',
        },
      ],
      reviewerNote: null,
      timeline: [
        {
          status: 'Submitted',
          timestamp: new Date().toISOString(),
          note: 'Complaint registered in BIS Care grievance management queue. A designated BIS enforcement officer will review the evidence.',
        },
      ],
    };

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport),
      });
      if (res.ok) {
        const created = await res.json();
        fallbackReportsStore = [created, ...fallbackReportsStore];
        return created;
      }
    } catch (err) {
      console.warn('SQLite report write failed:', err);
    }

    fallbackReportsStore = [newReport, ...fallbackReportsStore];
    return newReport;
  },

  /**
   * Upload additional evidence for a report in SQLite
   */
  async uploadAdditionalEvidence(reportId, newFile) {
    try {
      const res = await fetch(`/api/reports/${reportId}/evidence`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: newFile }),
      });
      if (res.ok) {
        const updated = await res.json();
        fallbackReportsStore = fallbackReportsStore.map((r) => (r.id === reportId ? updated : r));
        return updated;
      }
    } catch (err) {
      console.warn('SQLite update failed:', err);
    }

    const index = fallbackReportsStore.findIndex((r) => r.id === reportId);
    if (index === -1) throw new Error('Report not found');

    const updated = { ...fallbackReportsStore[index] };
    updated.evidenceFiles = [
      ...updated.evidenceFiles,
      {
        name: newFile.name || 'additional_evidence_doc.jpg',
        sha256: 'e8d7c6b5a41234567890abcdefabcdef01234567890abcdefabcdef0123456789',
      },
    ];
    updated.status = 'Under review';
    updated.statusCode = 'UNDER_REVIEW';
    updated.lastUpdatedAt = new Date().toISOString();
    updated.timeline.push({
      status: 'Under review',
      timestamp: new Date().toISOString(),
      note: 'Additional evidence received from complainant. Forwarded back to officer for evaluation.',
    });

    fallbackReportsStore[index] = updated;
    return updated;
  },
};
