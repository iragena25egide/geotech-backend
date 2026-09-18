require('dotenv').config();
const { Client } = require('pg');

async function seedDatabase() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    console.log('🌱 Connected to PostgreSQL for seeding...');

    // 1. Ensure tables exist or insert sample data
    // Check if projects exist
    const projectRes = await client.query(`SELECT COUNT(*) FROM projects`);
    let projectId;

    if (parseInt(projectRes.rows[0].count) === 0) {
      console.log('Inserting sample projects...');
      const insertProj = await client.query(`
        INSERT INTO projects (name, description, location, client, engineer, status, budget, "startDate", "endDate")
        VALUES 
          ('Kigali Highway Expansion', 'Geotechnical site investigation for major arterial road expansion', 'Kigali, Rwanda', 'Ministry of Infrastructure', 'Eng. John Mugisha', 'active', 250000.00, NOW(), NOW() + INTERVAL '6 months'),
          ('Nyarugenge Tower Foundation', 'Subsurface investigation and soil bearing capacity testing for high-rise commercial building', 'Nyarugenge, Kigali', 'City Developers Ltd', 'Eng. Alice Uwase', 'active', 180000.00, NOW(), NOW() + INTERVAL '3 months'),
          ('Musanze Bridge Stabilization', 'Soil mechanics and embankment slope stability assessment', 'Musanze, Northern Province', 'Rwanda Transport Development Agency', 'Eng. David Nkurunziza', 'completed', 95000.00, NOW() - INTERVAL '4 months', NOW() - INTERVAL '1 month')
        RETURNING id;
      `);
      projectId = insertProj.rows[0].id;
      console.log(`✅ Sample projects inserted. Primary Project ID: ${projectId}`);
    } else {
      const existingProj = await client.query(`SELECT id FROM projects LIMIT 1`);
      projectId = existingProj.rows[0].id;
      console.log(`ℹ️ Projects already exist. Using Project ID: ${projectId}`);
    }

    // 2. Check and insert sample soil samples
    const soilRes = await client.query(`SELECT COUNT(*) FROM soil_samples`);
    let soilSampleId;

    if (parseInt(soilRes.rows[0].count) === 0) {
      console.log('Inserting sample soil samples...');
      const insertSoil = await client.query(`
        INSERT INTO soil_samples (
          ll, pl, pi, p200, p4, p40, p10, d60, d30, d10, cu, cc, symbol, group_name, aashto_class, color, sample_depth, sampling_date, remarks, natural_moisture, dry_density, specific_gravity, project_id
        )
        VALUES 
          (45.0, 22.0, 23.0, 65.5, 98.0, 85.0, 92.0, 0.045, 0.012, 0.002, 22.50, 1.60, 'CL', 'Lean Clay with Sand', 'A-6', 'Reddish Brown', '2.5m - 3.0m', NOW(), 'Slightly plastic clay subgrade sample', 18.5, 1.65, 2.68, ${projectId}),
          (28.0, 18.0, 10.0, 12.0, 88.0, 45.0, 68.0, 1.200, 0.450, 0.150, 8.00, 1.12, 'SW', 'Well-graded Sand with Gravel', 'A-1-a', 'Light Brown', '1.0m - 1.5m', NOW(), 'Dense sandy gravel layer ideal for foundation support', 8.2, 1.92, 2.65, ${projectId}),
          (58.0, 26.0, 32.0, 82.0, 99.0, 94.0, 97.0, 0.018, 0.005, 0.001, 18.00, 1.38, 'CH', 'Fat Clay', 'A-7-6', 'Dark Gray', '4.0m - 4.5m', NOW(), 'High compressibility clay layer requiring surcharge loading', 24.1, 1.52, 2.71, ${projectId})
        RETURNING id;
      `);
      soilSampleId = insertSoil.rows[0].id;
      console.log(`✅ Sample soil samples inserted. Primary Soil Sample ID: ${soilSampleId}`);
    } else {
      const existingSoil = await client.query(`SELECT id FROM soil_samples LIMIT 1`);
      soilSampleId = existingSoil.rows[0].id;
      console.log(`ℹ️ Soil samples already exist. Using Soil Sample ID: ${soilSampleId}`);
    }

    // 3. Check and insert sample report
    const reportRes = await client.query(`SELECT COUNT(*) FROM reports`);
    if (parseInt(reportRes.rows[0].count) === 0) {
      console.log('Inserting sample report...');
      await client.query(`
        INSERT INTO reports (
          title, description, report_type, status, generated_at, approved_at, approved_by, project_id, soil_sample_id, content, statistics
        )
        VALUES (
          'Geotechnical Soil Analysis & Foundation Assessment',
          'Comprehensive lab analysis report containing Atterberg limits, sieve distribution, USCS classification, and bearing capacity recommendations.',
          'soil_analysis',
          'approved',
          NOW(),
          NOW(),
          'Chief Geotechnical Engineer',
          ${projectId},
          ${soilSampleId},
          '{"summary": "The tested subgrade exhibits lean clay characteristics (CL) with allowable bearing capacity of 180 kPa.", "conclusions": ["Soil layer at 2.5m depth is suitable for shallow strip footings.", "Moisture control required during compaction."], "recommendations": ["Compact to 95% Modified Proctor Density.", "Install perimeter subsoil drainage."]}',
          '{"totalSamples": 3, "averageLL": 43.67, "averagePL": 22.00, "averagePI": 21.67}'
        );
      `);
      console.log('✅ Sample report inserted successfully.');
    } else {
      console.log('ℹ️ Reports already exist.');
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await client.end();
  }
}

seedDatabase();
