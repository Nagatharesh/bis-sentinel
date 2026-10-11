import { PRELOADED_SCENARIOS } from './mockData';

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export const recordService = {
  /**
   * Look up licence by number (CM/L-xxxxxxx or R-xxxxxxxx)
   */
  async lookupLicence(licenceNumber) {
    await delay(400);
    const cleanNumber = String(licenceNumber).trim().toUpperCase();

    const scenario = PRELOADED_SCENARIOS.find((s) => s.licenceNumber.toUpperCase() === cleanNumber);

    if (scenario) {
      return {
        found: true,
        record: scenario,
      };
    }

    // Default mock response for arbitrary 7-digit CM/L
    if (/^CM\/L-\d{7}$/i.test(cleanNumber)) {
      return {
        found: true,
        record: {
          licenceNumber: cleanNumber,
          holderName: 'National Certified Manufacturer Ltd',
          brand: 'Standard Certified Goods',
          isNumber: 'IS 302-2-15:2009',
          validFrom: '2023-01-01',
          validTill: '2028-01-01',
          status: 'Operative',
          scopeDescription: 'Domestic appliances and kitchen electricals',
        },
      };
    }

    return {
      found: false,
      message: 'No active record matching this registration identifier was found in the BIS database.',
    };
  },

  /**
   * Search registry by product category / name
   */
  async searchByProduct(query) {
    await delay(300);
    const q = String(query).toLowerCase();
    const results = PRELOADED_SCENARIOS.filter(
      (s) => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.licenceNumber.toLowerCase().includes(q)
    );
    return results;
  },
};
