import { PRELOADED_SCENARIOS, OUTCOME_TYPES, DIMENSION_STATUS } from './mockData';

export const checkService = {
  /**
   * Get a check result by scenario ID or check ID from SQLite database
   */
  async getCheckById(id) {
    try {
      const res = await fetch(`/api/checks/${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) return data;
      }
    } catch (err) {
      console.warn('SQLite API fetch failed, using offline fallback cache:', err);
    }

    // Local/Offline Fallback
    const item = PRELOADED_SCENARIOS.find((s) => s.id === id || String(s.scenarioId) === String(id));
    if (!item) {
      throw new Error(`Record with ID ${id} was not found in the local repository.`);
    }
    return JSON.parse(JSON.stringify(item));
  },

  /**
   * Run a new check simulation with realistic steps and persist to SQLite
   */
  async initiateCheck({ method, payload }) {
    const normPayload = String(payload || '').trim().toUpperCase();
    let matchingScenario = PRELOADED_SCENARIOS[0]; // default kettle

    if (normPayload.includes('7200456') || normPayload.includes('HELMET')) {
      matchingScenario = PRELOADED_SCENARIOS[1];
    } else if (normPayload.includes('CHARGER') || normPayload.includes('??') || normPayload.includes('UNREADABLE')) {
      matchingScenario = PRELOADED_SCENARIOS[2];
    } else if (normPayload.includes('9100234') || normPayload.includes('FRIDGE') || normPayload.includes('REFRIGERATOR')) {
      matchingScenario = PRELOADED_SCENARIOS[3];
    } else if (normPayload.startsWith('CM/L-')) {
      const dynamicId = `check-live-${Date.now()}`;
      const newCheck = {
        id: dynamicId,
        title: `Manual Lookup: ${normPayload}`,
        category: 'Electrical Consumer Product',
        thumbnail: 'kettle',
        outcome: OUTCOME_TYPES.NO_MISMATCH,
        outcomeKey: 'NO_MISMATCH',
        summarySentence: `Licence ${normPayload} is listed as operative in the central BIS database.`,
        nextAction: 'Product claim appears consistent with records. Keep this evidence record for reference.',
        date: new Date().toISOString(),
        inputMethod: method,
        licenceNumber: normPayload,
        standardNumber: 'IS 302-2-15:2009',
        scope4: {
          claim: { status: DIMENSION_STATUS.SUPPORTED, title: 'Mark Claim', detail: 'Licence format is valid.' },
          identity: { status: DIMENSION_STATUS.SUPPORTED, title: 'Manufacturer Identity', detail: 'Manufacturer verified in registry.' },
          scope: { status: DIMENSION_STATUS.SUPPORTED, title: 'Product Scope', detail: 'Scope matches registered items.' },
          time: { status: DIMENSION_STATUS.SUPPORTED, title: 'Validity Period', detail: 'Operative through 2028.' },
        },
        recordComparison: [
          { field: 'Licence Number', product: normPayload, official: normPayload, match: 'match' },
          { field: 'Status', product: 'Active', official: 'Operative', match: 'match' },
        ],
        timeline: {
          licenceGranted: '2023-01-01',
          licenceExpires: '2028-12-31',
          itemManufactureDate: '2026-05-01',
          checkDate: new Date().toISOString().split('T')[0],
          status: 'active',
        },
        evidenceTrail: [
          {
            fileName: 'query_record_manual.json',
            fileType: 'Portal Query Response',
            timestamp: new Date().toISOString(),
            sha256: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
            size: '2.4 KB',
          },
        ],
      };

      // Persist to SQLite
      try {
        await fetch('/api/checks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCheck),
        });
      } catch (e) {
        console.warn('Failed to insert into SQLite:', e);
      }

      return newCheck;
    }

    return JSON.parse(JSON.stringify(matchingScenario));
  },

  /**
   * Returns analysis pipeline steps definitions
   */
  getAnalysisPipelineSteps() {
    return [
      { id: 'step_photo', title: 'Reading photo & optical text', detail: 'Normalizing glare, perspective, and lighting' },
      { id: 'step_marks', title: 'Detecting standard marks', detail: 'Locating ISI / CRS symbols and bounding regions' },
      { id: 'step_licence', title: 'Reading licence number (CM/L or R-)', detail: 'Running specialized digit verification' },
      { id: 'step_lookup', title: 'Looking up official BIS register', detail: 'Querying national standards database' },
      { id: 'step_compare', title: 'Comparing SCOPE-4 dimensions', detail: 'Evaluating Claim, Identity, Scope, and Validity' },
    ];
  },
};
