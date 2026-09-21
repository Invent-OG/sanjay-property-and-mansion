import { getSupabaseClient } from '../lib/supabase';
import type { PropertyImageRecord, ImageCategory } from '../types/database';

export interface UploadMediaResult {
  data: PropertyImageRecord | null;
  error: string | null;
}

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

    const client = getSupabaseClient();
    if (!client) {
      // In local preview mode, create a browser blob URL
      const previewUrl = URL.createObjectURL(file);
      const mockRecord: PropertyImageRecord = {
        id: 'img-' + Date.now(),
        property_id: propertyId,
        url: previewUrl,
        storage_path: null,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category,
        alt_text: altText || file.name,
        sort_order: 10,
        is_featured: false,
        created_at: new Date().toISOString()
      };
      return { data: mockRecord, error: null };
    }

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const filePath = `properties/${propertyId}/${Date.now()}_${cleanFileName}.${fileExt}`;

      // 1. Upload to Supabase Storage bucket 'property-images'
      const { data: storageData, error: uploadError } = await client.storage
        .from('property-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        return { data: null, error: uploadError.message };
      }

      // 2. Get Public URL
      const { data: publicUrlData } = client.storage
        .from('property-images')
        .getPublicUrl(storageData.path);

      const publicUrl = publicUrlData.publicUrl;

      // 3. Insert record into property_images table
      const { data: imageRecord, error: dbError } = await client
        .from('property_images')
        .insert({
          property_id: propertyId,
          url: publicUrl,
          storage_path: storageData.path,
          title: file.name.replace(/\.[^/.]+$/, ''),
          category,
          alt_text: altText || file.name,
          sort_order: 0,
          is_featured: false
        })
        .select()
        .single();

      if (dbError) {
        return { data: null, error: dbError.message };
      }

      return { data: imageRecord as PropertyImageRecord, error: null };
    } catch (err: any) {
      console.error('Error uploading image:', err);
      return { data: null, error: err.message || 'Failed to upload image' };
    }
  },

  // Fetch all media items across properties
  async getAllMedia(): Promise<PropertyImageRecord[]> {
    const client = getSupabaseClient();
    if (!client) {
      return [
        {
          id: 'img-1',
          property_id: 'sanjay-mansion-uuid-101',
          url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
          title: 'Main Building Elevation',
          category: 'Exterior',
          alt_text: 'Main Building Elevation',
          sort_order: 1,
          is_featured: true,
          created_at: new Date().toISOString()
        },
        {
          id: 'img-2',
          property_id: 'sanjay-mansion-uuid-101',
          url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
          title: 'Facade & Covered Parking',
          category: 'Exterior',
          alt_text: 'Facade & Parking',
          sort_order: 2,
          is_featured: false,
          created_at: new Date().toISOString()
        },
        {
          id: 'img-3',
          property_id: 'sanjay-mansion-uuid-101',
          url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85',
          title: 'Comfortable Individual Room',
          category: 'Rooms',
          alt_text: 'Individual Room',
          sort_order: 3,
          is_featured: false,
          created_at: new Date().toISOString()
        }
      ];
    }

    try {
      const { data, error } = await client
        .from('property_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data as PropertyImageRecord[];
    } catch (err) {
      console.error('Error fetching media:', err);
      return [];
    }
  },

  // Delete media item from storage and database
  async deleteMedia(id: string, storagePath?: string | null): Promise<boolean> {
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
      return false;
    }
  }
};
