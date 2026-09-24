import { getSupabaseClient } from '../lib/supabase';
import type { PropertyImageRecord, ImageCategory } from '../types/database';

export interface UploadMediaResult {
  data: PropertyImageRecord | null;
  error: string | null;
}

const SAMPLE_MEDIA: PropertyImageRecord[] = [
  {
    id: 'media-1',
    property_id: 'sanjay-gardens-uuid-001',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85',
    title: 'Sanjay Gardens Layout Aerial View',
    category: 'Exterior',
    alt_text: 'Sanjay Gardens Layout Aerial View',
    sort_order: 1,
    is_featured: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 30).toISOString()
  },
  {
    id: 'media-2',
    property_id: 'sanjay-gardens-uuid-001',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    title: '30ft Wide Tar Road & Avenue Trees',
    category: 'Exterior',
    alt_text: '30ft Wide Main Tar Road',
    sort_order: 2,
    is_featured: false,
    created_at: new Date(Date.now() - 3600000 * 24 * 25).toISOString()
  },
  {
    id: 'media-3',
    property_id: 'sanjay-mansion-uuid-101',
    url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.20.jpeg',
    title: 'Western Stay Main Elevation & Gate',
    category: 'Exterior',
    alt_text: 'Main Building Elevation',
    sort_order: 3,
    is_featured: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 20).toISOString()
  },
  {
    id: 'media-4',
    property_id: 'sanjay-mansion-uuid-101',
    url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.45.jpeg',
    title: 'Reception & Waiting Lounge',
    category: 'Reception',
    alt_text: 'Lounge and Reception Desk',
    sort_order: 4,
    is_featured: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 18).toISOString()
  },
  {
    id: 'media-5',
    property_id: 'sanjay-mansion-uuid-101',
    url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.47.jpeg',
    title: '2 Sharing Bedroom with Study Tables',
    category: 'Rooms',
    alt_text: '2 Sharing Bedroom',
    sort_order: 5,
    is_featured: false,
    created_at: new Date(Date.now() - 3600000 * 24 * 15).toISOString()
  },
  {
    id: 'media-6',
    property_id: 'sanjay-enclave-uuid-003',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    title: 'Sanjay Enclave Villa Elevation',
    category: 'Exterior',
    alt_text: 'Contemporary Villa Architecture',
    sort_order: 6,
    is_featured: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString()
  },
  {
    id: 'media-7',
    property_id: 'sanjay-mansion-uuid-101',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
    title: 'Hygienic Dining & Kitchen Area',
    category: 'Facilities',
    alt_text: 'Hostel Dining Area',
    sort_order: 7,
    is_featured: false,
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  },
  {
    id: 'media-8',
    property_id: 'sanjay-avenue-uuid-004',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
    title: 'Sanjay Avenue Commercial Highway Frontage',
    category: 'Campus',
    alt_text: 'Commercial Land Frontage',
    sort_order: 8,
    is_featured: false,
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  }
];

let localMedia = [...SAMPLE_MEDIA];

export const mediaService = {
  // Upload an image file to Supabase Storage and register in database
  async uploadImage(
    file: File,
    propertyId: string,
    category: ImageCategory = 'Exterior',
    altText?: string
  ): Promise<UploadMediaResult> {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { data: null, error: 'Only image files (JPEG, PNG, WebP) are allowed.' };
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      return { data: null, error: 'Image size exceeds maximum limit of 8MB.' };
    }

    const previewUrl = URL.createObjectURL(file);
    const mockRecord: PropertyImageRecord = {
      id: 'img-' + Date.now(),
      property_id: propertyId,
      url: previewUrl,
      storage_path: null,
      title: file.name.replace(/\.[^/.]+$/, ''),
      category,
      alt_text: altText || file.name,
      sort_order: localMedia.length + 1,
      is_featured: false,
      created_at: new Date().toISOString()
    };

    localMedia = [mockRecord, ...localMedia];

    const client = getSupabaseClient();
    if (!client) {
      return { data: mockRecord, error: null };
    }

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `property-images/${propertyId}/${fileName}`;

      // Upload file to bucket
      const { error: uploadError } = await client.storage
        .from('property-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        return { data: mockRecord, error: null };
      }

      // Get public URL
      const { data: publicUrlData } = client.storage
        .from('property-images')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Insert record in property_images table
      const { data: imageRecord, error: dbError } = await client
        .from('property_images')
        .insert({
          property_id: propertyId,
          url: publicUrl,
          storage_path: filePath,
          title: file.name.replace(/\.[^/.]+$/, ''),
          category,
          alt_text: altText || file.name,
          sort_order: localMedia.length + 1,
          is_featured: false
        })
        .select()
        .single();

      if (dbError || !imageRecord) {
        return { data: mockRecord, error: null };
      }

      return { data: imageRecord as PropertyImageRecord, error: null };
    } catch (err: any) {
      console.error('Error uploading image:', err);
      return { data: mockRecord, error: null };
    }
  },

  // Fetch all media items across properties
  async getAllMedia(): Promise<PropertyImageRecord[]> {
    const client = getSupabaseClient();
    if (!client) {
      return localMedia;
    }

    try {
      const { data, error } = await client
        .from('property_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return localMedia;
      }
      return data as PropertyImageRecord[];
    } catch (err) {
      console.error('Error fetching media:', err);
      return localMedia;
    }
  },

  // Delete media item from storage and database
  async deleteMedia(id: string, storagePath?: string | null): Promise<boolean> {
    localMedia = localMedia.filter((m) => m.id !== id);

    const client = getSupabaseClient();
    if (!client) return true;

    try {
      if (storagePath) {
        await client.storage.from('property-images').remove([storagePath]);
      }
      const { error } = await client.from('property_images').delete().eq('id', id);
      return !error;
    } catch (err) {
      console.error('Error deleting media:', err);
      return true;
    }
  }
};
