import * as dotenv from 'dotenv';
dotenv.config();

import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || '';
if (!connectionString) {
  console.error('DATABASE_URL is missing in .env');
  process.exit(1);
}

const sql = postgres(connectionString);

async function updateMansionPhotos() {
  console.log('🔄 Updating Sanjay Mansion photos in Supabase database...');

  const realPhotos = [
    {
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.20.jpeg',
      title: 'Main Building Elevation & Entrance Gate',
      cat: 'Exterior',
      sort: 1,
      feat: true
    },
    {
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.45.jpeg',
      title: 'Reception & Waiting Lounge',
      cat: 'Facilities',
      sort: 2,
      feat: true
    },
    {
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.47.jpeg',
      title: 'Spacious 2-Sharing Bedroom',
      cat: 'Rooms',
      sort: 3,
      feat: true
    },
    {
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.37.10.jpeg',
      title: 'Comfortable Multi-Sharing Room',
      cat: 'Rooms',
      sort: 4,
      feat: true
    },
    {
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.57.jpeg',
      title: 'Single Private Room with Study Desk',
      cat: 'Rooms',
      sort: 5,
      feat: false
    },
    {
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.37.12.jpeg',
      title: 'Spacious Dormitory with Bunk Beds',
      cat: 'Rooms',
      sort: 6,
      feat: false
    },
    {
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.43.jpeg',
      title: 'In-House Laundry Facility',
      cat: 'Facilities',
      sort: 7,
      feat: false
    },
    {
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.44.jpeg',
      title: 'Automated Washing Machines',
      cat: 'Facilities',
      sort: 8,
      feat: false
    },
    {
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.37.13.jpeg',
      title: 'Clean Granite Hallway & Corridors',
      cat: 'Facilities',
      sort: 9,
      feat: false
    },
    {
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.37.jpeg',
      title: 'Building Elevation & Frontage',
      cat: 'Exterior',
      sort: 10,
      feat: false
    },
    {
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.42.jpeg',
      title: 'Front Entrance Portico & Signboard',
      cat: 'Exterior',
      sort: 11,
      feat: false
    },
    {
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.35.jpeg',
      title: 'Avenue Trees & Two-Wheeler Parking',
      cat: 'Campus',
      sort: 12,
      feat: false
    }
  ];

  // 1. Update western_stay_images
  console.log('1. Replacing western_stay_images with real photos...');
  await sql`DELETE FROM western_stay_images;`;
  for (const p of realPhotos) {
    await sql`
      INSERT INTO western_stay_images (url, title, category, alt_text, sort_order, is_featured)
      VALUES (${p.url}, ${p.title}, ${p.cat}, ${p.title}, ${p.sort}, ${p.feat});
    `;
  }

  // 2. Update western_stay_settings hero_image_url
  console.log('2. Updating western_stay_settings hero image...');
  await sql`
    UPDATE western_stay_settings
    SET hero_image_url = '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.20.jpeg'
    WHERE id = 'singleton';
  `;

  // 3. Update properties table where slug = 'sanjay-mansion'
  console.log('3. Updating properties table for sanjay-mansion...');
  await sql`
    UPDATE properties
    SET hero_image_url = '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.20.jpeg',
        og_image_url = '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.20.jpeg'
    WHERE slug = 'sanjay-mansion';
  `;

  console.log('✅ Successfully updated Supabase database with all real Sanjay Mansion photos!');
  await sql.end();
}

updateMansionPhotos().catch((err) => {
  console.error('❌ Failed to update mansion photos in DB:', err);
  process.exit(1);
});
