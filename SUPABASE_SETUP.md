# Supabase Storage Setup Instructions

## Step 1: Create Storage Bucket in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **New Bucket**
5. Enter bucket name: `paw photos` (exactly as shown)
6. Set it as **Public** bucket (so photos can be viewed)
7. Click **Create Bucket**

## Step 2: Configure Storage Policies (Optional but Recommended)

To allow public uploads and reads:

1. Click on the `paw photos` bucket
2. Go to **Policies** tab
3. Add the following policies:

### Upload Policy
```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'paw photos');
```

### Read Policy
```sql
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'paw photos');
```

### Delete Policy (if needed)
```sql
CREATE POLICY "Allow public deletes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'paw photos');
```

## Step 3: Get Your Supabase Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy your **Project URL** 
3. Copy your **anon/public** API key
4. Update the `.env.local` file in your project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Restart Your Development Server

After updating the `.env.local` file, restart your Next.js dev server:

```bash
npm run dev
```

## Testing

1. Go to `/pets/new` in your application
2. Select a pet photo
3. Fill in the pet details
4. Submit the form
5. The photo should upload to Supabase and the URL will be saved with the pet data

## Troubleshooting

- **Upload fails**: Check your Supabase credentials in `.env.local`
- **Bucket not found**: Make sure the bucket name is exactly `paw photos`
- **403 errors**: Check your storage policies allow public access
- **CORS errors**: Make sure your Supabase project allows your localhost domain
