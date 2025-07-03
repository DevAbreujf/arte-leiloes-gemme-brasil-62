-- SQL para configurar o storage bucket para imagens de leilões
-- Execute este script no Supabase SQL Editor

-- 1. Criar o bucket para imagens de leilões
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'auction-images',
  'auction-images',
  true,
  5242880, -- 5MB em bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- 2. Criar política para permitir upload público (apenas usuários autenticados)
CREATE POLICY "Authenticated users can upload auction images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'auction-images');

-- 3. Criar política para permitir visualização pública das imagens
CREATE POLICY "Public can view auction images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'auction-images');

-- 4. Criar política para permitir admins excluírem imagens
CREATE POLICY "Authenticated users can delete auction images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'auction-images');

-- 5. Criar política para permitir admins atualizarem imagens
CREATE POLICY "Authenticated users can update auction images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'auction-images');
