import { createClient } from '@supabase/supabase-js';
import { Monument } from '../types';

// These would come from environment variables in a real app
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveMonument = async (monument: Monument): Promise<Monument | null> => {
  try {
    // First upload the image
    let imageUrl = monument.imageUrl;
    
    // If the image is a data URL, upload it to Supabase Storage
    if (imageUrl.startsWith('data:')) {
      const fileName = `monument-${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('monuments')
        .upload(fileName, base64ToBlob(imageUrl), {
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('monuments')
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    // Then save the monument data
    const { data, error } = await supabase
      .from('monuments')
      .insert({
        name: monument.name,
        description: monument.description,
        image_url: imageUrl,
        latitude: monument.latitude,
        longitude: monument.longitude,
        timestamp: monument.timestamp,
        user_name: monument.userName || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving monument:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      imageUrl: data.image_url,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: data.timestamp,
      userName: data.user_name,
    };
  } catch (error) {
    console.error('Error in saveMonument:', error);
    return null;
  }
};

export const getMonuments = async (): Promise<Monument[]> => {
  try {
    const { data, error } = await supabase
      .from('monuments')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching monuments:', error);
      throw error;
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      imageUrl: item.image_url,
      latitude: item.latitude,
      longitude: item.longitude,
      timestamp: item.timestamp,
      userName: item.user_name,
    }));
  } catch (error) {
    console.error('Error in getMonuments:', error);
    return [];
  }
};

export const getMonumentById = async (id: string): Promise<Monument | null> => {
  try {
    const { data, error } = await supabase
      .from('monuments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching monument:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      imageUrl: data.image_url,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: data.timestamp,
      userName: data.user_name,
    };
  } catch (error) {
    console.error('Error in getMonumentById:', error);
    return null;
  }
};

// Helper function to convert base64 to Blob
const base64ToBlob = (dataUrl: string): Blob => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};