// SQLite Database Layer for BIS Sentinel using Node.js DatabaseSync (node:sqlite)
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const DB_PATH = path.resolve(process.cwd(), 'bis_sentinel.db');

export function initDatabase() {
  const db = new DatabaseSync(DB_PATH);

  // Enable WAL mode for high performance
  db.exec('PRAGMA journal_mode = WAL;');

  // 1. Checks Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS checks (
      id TEXT PRIMARY KEY,
      scenario_id INTEGER,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      thumbnail TEXT,
      outcome TEXT NOT NULL,
      outcome_key TEXT NOT NULL,
      summary_sentence TEXT NOT NULL,
      next_action TEXT NOT NULL,
      date TEXT NOT NULL,
      input_method TEXT NOT NULL,
      licence_number TEXT NOT NULL,
      standard_number TEXT NOT NULL,
      scope4_json TEXT NOT NULL,
      ocr_json TEXT,
      record_comparison_json TEXT,
      timeline_json TEXT,
      evidence_trail_json TEXT,
      eco_data_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Reports Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      check_id TEXT,
      product_title TEXT NOT NULL,
      licence_number TEXT NOT NULL,
      complaint_type TEXT NOT NULL,
      status TEXT NOT NULL,
      status_code TEXT NOT NULL,
      submitted_at TEXT NOT NULL,
      last_updated_at TEXT NOT NULL,
      tracking_number TEXT NOT NULL UNIQUE,
      summary TEXT NOT NULL,
      evidence_files_json TEXT,
      reviewer_note TEXT,
      timeline_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Collection Points Table (Coimbatore)
  db.exec(`
    CREATE TABLE IF NOT EXISTS collection_points (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      distance TEXT NOT NULL,
      contact TEXT NOT NULL,
      timing TEXT NOT NULL,
      accepts_json TEXT NOT NULL,
      lat REAL,
      lng REAL
    );
  `);

  // Check if seeding is required
  const checkCountStmt = db.prepare('SELECT COUNT(*) as count FROM checks');
  const countResult = checkCountStmt.get();

  if (countResult.count === 0) {
    seedDatabase(db);
  }

  return db;
}

export function seedDatabase(db) {
  console.log('[SQLite] Seeding initial 4 scenarios and 8 historical checks into SQLite...');

  const insertCheck = db.prepare(`
    INSERT INTO checks (
      id, scenario_id, title, category, thumbnail, outcome, outcome_key,
      summary_sentence, next_action, date, input_method, licence_number,
      standard_number, scope4_json, ocr_json, record_comparison_json,
      timeline_json, evidence_trail_json, eco_data_json
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  // Scenario 1: Electric Kettle (No Mismatch)
  insertCheck.run(
    'check-kettle-101',
    1,
    'Prestige 1.5L Stainless Steel Electric Kettle',
    'Electric Kettles & Jugs',
    'kettle',
    'No mismatch detected in the available evidence',
    'NO_MISMATCH',
    'The standard mark, licence number, manufacturer details, and validity window are consistent with official BIS records.',
    'Product claim appears consistent with records. You may keep this evidence record for your reference.',
    '2026-10-08T14:20:00Z',
    'photo_scan',
    'CM/L-8400123',
    'IS 302-2-15:2009',
    JSON.stringify({
      claim: { status: 'Supported', title: 'Mark Claim', detail: 'Standard ISI mark detected on packaging rating plate.' },
      identity: { status: 'Supported', title: 'Manufacturer Identity', detail: 'Brand Prestige corresponds directly to licence holder TTK Prestige Ltd.' },
      scope: { status: 'Supported', title: 'Product Scope', detail: 'Licence scope covers Electric Kettles up to 2.0L.' },
      time: { status: 'Supported', title: 'Validity Period', detail: 'Licence valid until 14-May-2027. Active.' }
    }),
    JSON.stringify({
      confidence: 96,
      extractedLicence: 'CM/L-8400123',
      rawText: 'IS 302-2-15:2009\nCM/L-8400123\nPRESTIGE 1500W',
      boundingBoxes: [{ label: 'ISI Logo', x: 28, y: 34, width: 44, height: 32 }]
    }),
    JSON.stringify([
      { field: 'Manufacturer', product: 'TTK Prestige Ltd', official: 'TTK Prestige Ltd (Plant 02, Hosur)', match: 'match' },
      { field: 'Brand Name', product: 'Prestige', official: 'Prestige', match: 'match' },
      { field: 'Product Variety', product: '1.5L Stainless Steel Kettle', official: 'Electric Kettles / Jugs (up to 2L)', match: 'match' },
      { field: 'Indian Standard', product: 'IS 302-2-15:2009', official: 'IS 302-2-15:2009', match: 'match' },
      { field: 'Licence Status', product: 'Marked on item', official: 'Operative / Active', match: 'match' },
      { field: 'Valid Through', product: 'Current batch 2026', official: '14-May-2027', match: 'match' }
    ]),
    JSON.stringify({
      licenceGranted: '2022-05-15',
      licenceExpires: '2027-05-14',
      itemManufactureDate: '2026-08-10',
      checkDate: '2026-10-08',
      status: 'active'
    }),
    JSON.stringify([
      { fileName: 'kettle_front_rating_plate.jpg', fileType: 'Image', timestamp: '2026-10-08T14:19:42Z', sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', size: '1.8 MB' }
    ]),
    null
  );

  // Scenario 2: Helmet (Inconsistency / Mismatch)
  insertCheck.run(
    'check-helmet-102',
    2,
    'AeroRide Full Face Motorcyclist Helmet',
    'Protective Helmets for Two-Wheeler Riders',
    'helmet',
    'Possible inconsistency requiring review',
    'INCONSISTENCY',
    'The licence number printed on this helmet corresponds to automotive hydraulic brake fluids registered to a different chemical company.',
    'We suggest withholding purchase until verified, or submitting an inquiry via the pre-filled BIS report form below.',
    '2026-10-07T11:45:00Z',
    'listing_url',
    'CM/L-7200456',
    'IS 4151:2015',
    JSON.stringify({
      claim: { status: 'Supported', title: 'Mark Claim', detail: 'ISI mark and CM/L-7200456 displayed on helmet sticker.' },
      identity: { status: 'Contradiction', title: 'Manufacturer Identity', detail: 'Licence held by ChemTech Fluids India Pvt Ltd, not AeroRide.' },
      scope: { status: 'Contradiction', title: 'Product Scope', detail: 'Licence is granted for Automotive Brake Fluid, not Helmets.' },
      time: { status: 'Supported', title: 'Validity Period', detail: 'Fluid licence is active, but does not pertain to protective helmets.' }
    }),
    JSON.stringify({
      confidence: 91,
      extractedLicence: 'CM/L-7200456',
      rawText: 'IS 4151:2015\nCM/L-7200456\nAERORIDE MOTO'
    }),
    JSON.stringify([
      { field: 'Manufacturer', product: 'AeroRide Safety Gear', official: 'ChemTech Fluids India Pvt Ltd', match: 'differing' },
      { field: 'Brand Name', product: 'AeroRide', official: 'ChemShield Fluids', match: 'differing' },
      { field: 'Product Variety', product: 'Protective Motorcycle Helmet', official: 'Automotive Hydraulic Brake Fluid', match: 'differing' },
      { field: 'Indian Standard', product: 'IS 4151:2015 (Helmets)', official: 'IS 8654:2001 (Brake Fluids)', match: 'differing' },
      { field: 'Licence Status', product: 'Displayed on helmet', official: 'Operative for Brake Fluids', match: 'match' },
      { field: 'Valid Through', product: '2026 Batch', official: '30-Nov-2028', match: 'match' }
    ]),
    JSON.stringify({
      licenceGranted: '2019-12-01',
      licenceExpires: '2028-11-30',
      itemManufactureDate: '2026-06-15',
      checkDate: '2026-10-07',
      status: 'scope_mismatch'
    }),
    JSON.stringify([
      { fileName: 'listing_snapshot_aeroride_helmet.html', fileType: 'Web Archive', timestamp: '2026-10-07T11:44:10Z', sha256: '9b73c68f783f399679f2222384a329d27a052ff379d71c48ef2d4e73b22cf331', size: '840 KB' },
      { fileName: 'rear_decal_crop_highres.png', fileType: 'Image', timestamp: '2026-10-07T11:44:35Z', sha256: '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b', size: '1.2 MB' }
    ]),
    null
  );

  // Scenario 3: Charger (Unable to Verify / Blurred)
  insertCheck.run(
    'check-charger-103',
    3,
    'FastCharge 33W Type-C Wall Adapter',
    'Power Adaptors for IT Equipment',
    'charger',
    'Unable to verify with available records',
    'UNABLE_TO_VERIFY',
    'The licence number on the casing is partially worn or blurred; the visible digits (CM/L-72??914) do not yield a conclusive record.',
    'Try taking another close-up photo under direct lighting, or enter the full 7-digit number manually if legible.',
    '2026-10-05T09:15:00Z',
    'photo_scan',
    'CM/L-72??914',
    'IS 13252 (Part 1):2010',
    JSON.stringify({
      claim: { status: 'Supported', title: 'Mark Claim', detail: 'CRS logo outline detected.' },
      identity: { status: 'Unknown', title: 'Manufacturer Identity', detail: 'Manufacturer cannot be resolved from incomplete registration string.' },
      scope: { status: 'Unknown', title: 'Product Scope', detail: 'Unable to match product scope without full licence.' },
      time: { status: 'Unknown', title: 'Validity Period', detail: 'Validity dates remain unknown.' }
    }),
    JSON.stringify({
      confidence: 48,
      extractedLicence: 'CM/L-72??914',
      rawText: 'IS 13252\nR-410????'
    }),
    JSON.stringify([
      { field: 'Manufacturer', product: 'FastCharge Tech', official: 'No record found with partial string', match: 'missing' },
      { field: 'Brand Name', product: 'FastCharge', official: 'No record found with partial string', match: 'missing' }
    ]),
    JSON.stringify({
      licenceGranted: null,
      licenceExpires: null,
      itemManufactureDate: '2026-01-10',
      checkDate: '2026-10-05',
      status: 'unknown'
    }),
    JSON.stringify([
      { fileName: 'charger_underside_glare.jpg', fileType: 'Image', timestamp: '2026-10-05T09:14:20Z', sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0', size: '1.4 MB' }
    ]),
    null
  );

  // Scenario 4: Refrigerator (Eco Separate Claim)
  insertCheck.run(
    'check-fridge-104',
    4,
    'FrostFree 265L Double Door Refrigerator',
    'Frost-free Refrigerators',
    'fridge',
    'Environmental claim requires separate verification',
    'ECO_SEPARATE',
    'The BIS safety mark (IS 302-2-24) matches official records; however, the BEE 5-Star Energy rating and eco claims require verification via the BEE registry.',
    'Review the EcoLoop guide below to verify the BEE Energy Label and locate authorized e-waste recycling collection points.',
    '2026-10-04T16:30:00Z',
    'listing_url',
    'CM/L-9100234',
    'IS 302-2-24:2019',
    JSON.stringify({
      claim: { status: 'Supported', title: 'Mark Claim', detail: 'BIS Safety Standard Mark present and valid.' },
      identity: { status: 'Supported', title: 'Manufacturer Identity', detail: 'Manufacturer CoolTech Appliances India matches register.' },
      scope: { status: 'Supported', title: 'Product Scope', detail: 'Scope includes Refrigerating Appliances up to 350L.' },
      time: { status: 'Supported', title: 'Validity Period', detail: 'Licence valid until 31-Dec-2027.' }
    }),
    JSON.stringify({
      confidence: 94,
      extractedLicence: 'CM/L-9100234',
      rawText: 'IS 302-2-24:2019\nCM/L-9100234\nCOOLTECH FROSTFREE 265L\nBEE 5 STAR RATING 2024'
    }),
    JSON.stringify([
      { field: 'Manufacturer', product: 'CoolTech Appliances India', official: 'CoolTech Appliances India Pvt Ltd', match: 'match' },
      { field: 'Brand Name', product: 'CoolTech', official: 'CoolTech', match: 'match' },
      { field: 'Indian Standard', product: 'IS 302-2-24:2019', official: 'IS 302-2-24:2019', match: 'match' },
      { field: 'Energy Scheme', product: 'BEE 5-Star (Independent)', official: 'Subject to Bureau of Energy Efficiency register', match: 'unknown' }
    ]),
    JSON.stringify({
      licenceGranted: '2021-01-01',
      licenceExpires: '2027-12-31',
      itemManufactureDate: '2026-07-20',
      checkDate: '2026-10-04',
      status: 'active'
    }),
    JSON.stringify([
      { fileName: 'fridge_energy_label_close_up.jpg', fileType: 'Image', timestamp: '2026-10-04T16:29:10Z', sha256: '68e656b251e67e8358bef8483ab0d51c6619f3e7a1a9f0e75838d41ff368f728', size: '2.1 MB' }
    ]),
    JSON.stringify({
      beeLabelClaimed: '5 Star Energy Rating',
      beeLabelStandard: 'BEE/REF/2024/089',
      annualEnergyConsumption: '198 kWh/Year (as stated by seller)',
      disposalGuidance: 'Contains cyclopentane foam and R600a refrigerant. Do not discard in municipal trash.',
      authorizedCollectionAvailable: true,
      takeBackProgramName: 'CoolTech National Green Exchange',
      eWasteTollFree: '1800-267-3344'
    })
  );

  // Additional 4 historical checks to reach 8 total
  const additionalChecks = [
    {
      id: 'check-cooker-105',
      title: 'Hawkins Classic 3L Pressure Cooker',
      category: 'Domestic Pressure Cookers',
      thumbnail: 'cooker',
      licence: 'CM/L-0128945',
      std: 'IS 2347:2017',
      date: '2026-09-28T10:12:00Z',
      summary: 'Licence and brand match the official pressure cooker register.'
    },
    {
      id: 'check-toys-106',
      title: 'Wooden Building Blocks Set (Ages 3+)',
      category: 'Safety of Toys',
      thumbnail: 'toy',
      licence: 'CM/L-6300781',
      std: 'IS 9873 (Part 1):2019',
      date: '2026-09-21T18:04:00Z',
      summary: 'Toy safety certification active under QCO mandatory toys scheme.'
    },
    {
      id: 'check-wire-107',
      title: 'Havells 2.5 sq mm Flame Retardant Wire',
      category: 'PVC Insulated Cables',
      thumbnail: 'wire',
      licence: 'CM/L-2100984',
      std: 'IS 694:2010',
      date: '2026-09-14T12:40:00Z',
      summary: 'Cable manufacture plant in Alwar verified in official register.'
    },
    {
      id: 'check-geyser-108',
      title: 'HotStream 15L Storage Water Heater',
      category: 'Stationary Storage Water Heaters',
      thumbnail: 'geyser',
      licence: 'CM/L-5400321',
      std: 'IS 2082:2018',
      date: '2026-09-02T15:20:00Z',
      summary: 'Licence expired on 30-June-2025 according to central portal database.'
    }
  ];

  for (const ac of additionalChecks) {
    const isGeyser = ac.id === 'check-geyser-108';
    insertCheck.run(
      ac.id,
      null,
      ac.title,
      ac.category,
      ac.thumbnail,
      isGeyser ? 'Possible inconsistency requiring review' : 'No mismatch detected in the available evidence',
      isGeyser ? 'INCONSISTENCY' : 'NO_MISMATCH',
      ac.summary,
      'Keep this evidence record for your reference.',
      ac.date,
      'photo_scan',
      ac.licence,
      ac.std,
      JSON.stringify({
        claim: { status: 'Supported', title: 'Mark Claim', detail: 'Standard mark claimed.' },
        identity: { status: 'Supported', title: 'Manufacturer Identity', detail: 'Manufacturer matched.' },
        scope: { status: 'Supported', title: 'Product Scope', detail: 'Category covered.' },
        time: { status: isGeyser ? 'Contradiction' : 'Supported', title: 'Validity Period', detail: isGeyser ? 'Licence expired.' : 'Licence active.' }
      }),
      null,
      null,
      null,
      JSON.stringify([]),
      null
    );
  }

  // Seed Reports
  const insertReport = db.prepare(`
    INSERT INTO reports (
      id, check_id, product_title, licence_number, complaint_type,
      status, status_code, submitted_at, last_updated_at, tracking_number,
      summary, evidence_files_json, reviewer_note, timeline_json
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  insertReport.run(
    'rep-2026-0041',
    'check-helmet-102',
    'AeroRide Full Face Motorcyclist Helmet',
    'CM/L-7200456',
    'misuse_of_mark',
    'More information requested',
    'INFO_REQUESTED',
    '2026-10-07T12:00:00Z',
    '2026-10-08T09:30:00Z',
    'BIS-CARE-2026-TN-04821',
    'Product displays CM/L-7200456 on motorcycle helmet packaging; registry indicates licence is granted for hydraulic brake fluids.',
    JSON.stringify([
      { name: 'listing_snapshot_aeroride_helmet.html', sha256: '9b73c68f783f399679f2222384a329d27a052ff379d71c48ef2d4e73b22cf331' },
      { name: 'rear_decal_crop_highres.png', sha256: '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b' }
    ]),
    'Please provide an uncropped photograph showing the invoice or seller details from the order confirmation to establish product origin.',
    JSON.stringify([
      { status: 'Submitted', timestamp: '2026-10-07T12:00:00Z', note: 'Complaint logged under BIS Care portal reference.' },
      { status: 'Under review', timestamp: '2026-10-07T16:15:00Z', note: 'Assigned to Coimbatore Branch Office Technical Officer.' },
      { status: 'More information requested', timestamp: '2026-10-08T09:30:00Z', note: 'Officer requested proof of purchase or invoice copy.' }
    ])
  );

  insertReport.run(
    'rep-2026-0038',
    'check-geyser-108',
    'HotStream 15L Storage Water Heater',
    'CM/L-5400321',
    'misuse_of_mark',
    'Under review',
    'UNDER_REVIEW',
    '2026-09-02T16:00:00Z',
    '2026-09-05T11:20:00Z',
    'BIS-CARE-2026-TN-03910',
    'Storage water heater offered online with licence CM/L-5400321 which was not renewed past June 2025.',
    JSON.stringify([
      { name: 'heater_listing_cart_screenshot.png', sha256: 'c8f49e0134bcdef98124859a8c17b5f2e185012351ab64ef93102485bcde2190' }
    ]),
    'Initial documentation verified. Verification query initiated with licence holder firm.',
    JSON.stringify([
      { status: 'Submitted', timestamp: '2026-09-02T16:00:00Z', note: 'Complaint filed.' },
      { status: 'Under review', timestamp: '2026-09-05T11:20:00Z', note: 'Transferred to Enforcement Division.' }
    ])
  );

  insertReport.run(
    'rep-2026-0029',
    'check-charger-103',
    'Unbranded Fast Charger 65W with blurred mark',
    'Unverified / Partial',
    'misleading_advertisement',
    'Submitted',
    'SUBMITTED',
    '2026-09-18T08:45:00Z',
    '2026-09-18T08:45:00Z',
    'BIS-CARE-2026-TN-04199',
    'E-commerce marketplace product page claims BIS Certification without legible registration number.',
    JSON.stringify([
      { name: 'product_box_unclear_r_number.jpg', sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0' }
    ]),
    null,
    JSON.stringify([
      { status: 'Submitted', timestamp: '2026-09-18T08:45:00Z', note: 'Complaint received by BIS National Consumer Cell.' }
    ])
  );

  // Seed Collection Points
  const insertCP = db.prepare(`
    INSERT INTO collection_points (id, name, address, distance, contact, timing, accepts_json, lat, lng)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCP.run(
    'cp-01',
    'Coimbatore Municipal Corporation E-Waste Collection Point',
    'Near Flower Market, Mettupalayam Road, RS Puram, Coimbatore - 641002',
    '2.4 km',
    '0422-2541234',
    'Mon - Sat: 9:00 AM - 5:30 PM',
    JSON.stringify(['Refrigerators', 'Washing Machines', 'Small Domestic Appliances', 'Electronics']),
    11.0168,
    76.9558
  );

  insertCP.run(
    'cp-02',
    'GreenEarth Authorized E-Waste Recycler Hub',
    'Plot 48, SIDCO Industrial Estate, Kurichi, Coimbatore - 641021',
    '6.8 km',
    '1800-425-9898',
    'Mon - Fri: 10:00 AM - 6:00 PM',
    JSON.stringify(['All Domestic Appliances', 'Cooling Appliances (CFC/HCFC/HFC)', 'Cables']),
    10.9521,
    76.9692
  );

  insertCP.run(
    'cp-03',
    'CoolTech Brand Authorized Exchange & Takeback Center',
    '74, Cross Cut Road, Gandhipuram, Coimbatore - 641012',
    '3.1 km',
    '0422-4399000',
    'Mon - Sun: 10:30 AM - 8:30 PM',
    JSON.stringify(['CoolTech Refrigerators', 'Televisions', 'Air Conditioners']),
    11.0183,
    76.9725
  );

  console.log('[SQLite] Seed complete. bis_sentinel.db is ready.');
}
