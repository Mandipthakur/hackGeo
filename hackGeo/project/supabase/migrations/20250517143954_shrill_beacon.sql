/*
  # Create monuments table and storage

  1. New Tables
    - `monuments`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, not null)
      - `image_url` (text, not null)
      - `latitude` (double precision, not null)
      - `longitude` (double precision, not null)
      - `timestamp` (timestamptz, not null, default now())
      - `user_name` (text, optional)

  2. Security
    - Enable RLS on `monuments` table
    - Add policy for public to select from the monuments table
    - Add policy for anonymous insert into monuments table
*/

-- Create monuments table
CREATE TABLE IF NOT EXISTS monuments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  user_name text
);

-- Enable Row Level Security
ALTER TABLE monuments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read monuments
CREATE POLICY "Public can view all monuments"
  ON monuments
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert monuments
CREATE POLICY "Public can insert monuments"
  ON monuments
  FOR INSERT
  WITH CHECK (true);

-- Create a storage bucket for monument images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('monuments', 'monuments', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public to read from the storage bucket
CREATE POLICY "Public can view monument images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'monuments');

-- Create policy to allow anyone to upload to the storage bucket
CREATE POLICY "Public can upload monument images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'monuments');