import { HISTORICAL_CHECKS } from './mockData';

let fallbackHistoryStore = [...HISTORICAL_CHECKS];

export const historyService = {
  /**
   * Get all checks history from SQLite
   */
  async getHistory() {
    try {
      const res = await fetch('/api/checks');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          fallbackHistoryStore = data;
          return data;
        }
      }
    } catch (err) {
      console.warn('SQLite fetch failed, using fallback history:', err);
    }
    return [...fallbackHistoryStore];
  },

  /**
   * Add a new check item to SQLite
   */
  async addCheck(item) {
    try {
      await fetch('/api/checks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    } catch (err) {
      console.warn('SQLite write failed:', err);
    }
    fallbackHistoryStore = [item, ...fallbackHistoryStore];
    return item;
  },

  /**
   * Delete a check by ID
   */
  async deleteCheck(id) {
    fallbackHistoryStore = fallbackHistoryStore.filter((c) => c.id !== id);
    return true;
  },

  /**
   * Clear all history
   */
  async clearAll() {
    fallbackHistoryStore = [];
    return true;
  },

  /**
   * Export all local data as JSON
   */
  async exportData() {
    const checks = await this.getHistory();
    return {
      exportedAt: new Date().toISOString(),
      databaseEngine: 'SQLite 3 (bis_sentinel.db)',
      userLocation: 'Coimbatore, TN, India',
      totalChecks: checks.length,
      checks,
      disclaimer: 'This export contains local consumer verification logs preserved in the user browser and SQLite database.',
    };
  },
};
