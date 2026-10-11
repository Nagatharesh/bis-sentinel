import { initDatabase } from './database.js';

let db = null;

function getDb() {
  if (!db) {
    db = initDatabase();
  }
  return db;
}

function parseJsonRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    scenarioId: row.scenario_id,
    title: row.title,
    category: row.category,
    thumbnail: row.thumbnail,
    outcome: row.outcome,
    outcomeKey: row.outcome_key,
    summarySentence: row.summary_sentence,
    nextAction: row.next_action,
    date: row.date,
    inputMethod: row.input_method,
    licenceNumber: row.licence_number,
    standardNumber: row.standard_number,
    scope4: row.scope4_json ? JSON.parse(row.scope4_json) : null,
    ocrData: row.ocr_json ? JSON.parse(row.ocr_json) : null,
    recordComparison: row.record_comparison_json ? JSON.parse(row.record_comparison_json) : null,
    timeline: row.timeline_json ? JSON.parse(row.timeline_json) : null,
    evidenceTrail: row.evidence_trail_json ? JSON.parse(row.evidence_trail_json) : [],
    ecoData: row.eco_data_json ? JSON.parse(row.eco_data_json) : null,
  };
}

function parseReportRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    checkId: row.check_id,
    productTitle: row.product_title,
    licenceNumber: row.licence_number,
    complaintType: row.complaint_type,
    status: row.status,
    statusCode: row.status_code,
    submittedAt: row.submitted_at,
    lastUpdatedAt: row.last_updated_at,
    trackingNumber: row.tracking_number,
    summary: row.summary,
    evidenceFiles: row.evidence_files_json ? JSON.parse(row.evidence_files_json) : [],
    reviewerNote: row.reviewer_note,
    timeline: row.timeline_json ? JSON.parse(row.timeline_json) : [],
  };
}

export function handleApiRequest(req, res) {
  const database = getDb();
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method;

  // Set standard JSON headers
  res.setHeader('Content-Type', 'application/json');

  // 1. GET /api/checks
  if (pathname === '/api/checks' && method === 'GET') {
    const stmt = database.prepare('SELECT * FROM checks ORDER BY date DESC');
    const rows = stmt.all();
    const data = rows.map(parseJsonRow);
    res.statusCode = 200;
    res.end(JSON.stringify(data));
    return true;
  }

  // 2. GET /api/checks/:id
  if (pathname.startsWith('/api/checks/') && method === 'GET') {
    const id = pathname.replace('/api/checks/', '');
    const stmt = database.prepare('SELECT * FROM checks WHERE id = ? OR scenario_id = ?');
    const row = stmt.get(id, id);
    if (!row) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Record not found in SQLite' }));
      return true;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(parseJsonRow(row)));
    return true;
  }

  // 3. POST /api/checks
  if (pathname === '/api/checks' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const item = JSON.parse(body);
        const insertStmt = database.prepare(`
          INSERT INTO checks (
            id, scenario_id, title, category, thumbnail, outcome, outcome_key,
            summary_sentence, next_action, date, input_method, licence_number,
            standard_number, scope4_json, ocr_json, record_comparison_json,
            timeline_json, evidence_trail_json, eco_data_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        insertStmt.run(
          item.id || `check-live-${Date.now()}`,
          item.scenarioId || null,
          item.title || 'Manual Product Check',
          item.category || 'Consumer Item',
          item.thumbnail || 'kettle',
          item.outcome || 'No mismatch detected in the available evidence',
          item.outcomeKey || 'NO_MISMATCH',
          item.summarySentence || 'Verified in central registry.',
          item.nextAction || 'Keep this evidence record.',
          item.date || new Date().toISOString(),
          item.inputMethod || 'licence_manual',
          item.licenceNumber || 'Not Stated',
          item.standardNumber || 'IS Standard',
          JSON.stringify(item.scope4 || {}),
          JSON.stringify(item.ocrData || {}),
          JSON.stringify(item.recordComparison || []),
          JSON.stringify(item.timeline || {}),
          JSON.stringify(item.evidenceTrail || []),
          JSON.stringify(item.ecoData || null)
        );

        res.statusCode = 201;
        res.end(JSON.stringify({ success: true, item }));
      } catch (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return true;
  }

  // 4. GET /api/reports
  if (pathname === '/api/reports' && method === 'GET') {
    const stmt = database.prepare('SELECT * FROM reports ORDER BY submitted_at DESC');
    const rows = stmt.all();
    const data = rows.map(parseReportRow);
    res.statusCode = 200;
    res.end(JSON.stringify(data));
    return true;
  }

  // 5. POST /api/reports
  if (pathname === '/api/reports' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const rep = JSON.parse(body);
        const id = rep.id || `rep-${Date.now()}`;
        const trackingNumber = rep.trackingNumber || `BIS-CARE-2026-TN-${Math.floor(10000 + Math.random() * 90000)}`;
        const now = new Date().toISOString();

        const insertStmt = database.prepare(`
          INSERT INTO reports (
            id, check_id, product_title, licence_number, complaint_type,
            status, status_code, submitted_at, last_updated_at, tracking_number,
            summary, evidence_files_json, reviewer_note, timeline_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        insertStmt.run(
          id,
          rep.checkId || 'manual',
          rep.productTitle || 'Reported Consumer Item',
          rep.licenceNumber || 'Not Stated',
          rep.complaintType || 'misuse_of_mark',
          rep.status || 'Submitted',
          rep.statusCode || 'SUBMITTED',
          now,
          now,
          trackingNumber,
          rep.summary || 'Observed mark inconsistency.',
          JSON.stringify(rep.evidenceFiles || []),
          null,
          JSON.stringify(rep.timeline || [
            { status: 'Submitted', timestamp: now, note: 'Complaint logged in BIS Care queue.' }
          ])
        );

        const created = database.prepare('SELECT * FROM reports WHERE id = ?').get(id);
        res.statusCode = 201;
        res.end(JSON.stringify(parseReportRow(created)));
      } catch (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return true;
  }

  // 6. PATCH /api/reports/:id/evidence
  if (pathname.includes('/evidence') && method === 'PATCH') {
    const reportId = pathname.split('/')[3];
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const current = database.prepare('SELECT * FROM reports WHERE id = ?').get(reportId);
        if (!current) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Report not found' }));
          return;
        }

        const files = current.evidence_files_json ? JSON.parse(current.evidence_files_json) : [];
        files.push(payload.file || { name: 'additional_evidence.jpg', sha256: '9876543210abcdef' });

        const timeline = current.timeline_json ? JSON.parse(current.timeline_json) : [];
        timeline.push({
          status: 'Under review',
          timestamp: new Date().toISOString(),
          note: 'Additional evidence received from complainant.'
        });

        const updateStmt = database.prepare(`
          UPDATE reports
          SET evidence_files_json = ?, status = 'Under review', status_code = 'UNDER_REVIEW', last_updated_at = ?, timeline_json = ?
          WHERE id = ?
        `);

        updateStmt.run(JSON.stringify(files), new Date().toISOString(), JSON.stringify(timeline), reportId);

        const updated = database.prepare('SELECT * FROM reports WHERE id = ?').get(reportId);
        res.statusCode = 200;
        res.end(JSON.stringify(parseReportRow(updated)));
      } catch (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return true;
  }

  // 7. GET /api/collection-points
  if (pathname === '/api/collection-points' && method === 'GET') {
    const stmt = database.prepare('SELECT * FROM collection_points');
    const rows = stmt.all();
    const data = rows.map((r) => ({
      id: r.id,
      name: r.name,
      address: r.address,
      distance: r.distance,
      contact: r.contact,
      timing: r.timing,
      accepts: JSON.parse(r.accepts_json),
      lat: r.lat,
      lng: r.lng,
    }));
    res.statusCode = 200;
    res.end(JSON.stringify(data));
    return true;
  }

  // 8. GET /api/stats
  if (pathname === '/api/stats' && method === 'GET') {
    const checksCount = database.prepare('SELECT COUNT(*) as count FROM checks').get().count;
    const reportsCount = database.prepare('SELECT COUNT(*) as count FROM reports').get().count;
    res.statusCode = 200;
    res.end(JSON.stringify({
      database: 'SQLite 3 (bis_sentinel.db)',
      totalChecks: checksCount,
      totalReports: reportsCount,
      status: 'Connected',
    }));
    return true;
  }

  return false;
}
