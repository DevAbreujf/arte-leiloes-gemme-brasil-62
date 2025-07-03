-- Script para adicionar coluna de imagem à tabela auctions
-- Execute este comando no seu banco de dados Supabase

ALTER TABLE auctions ADD COLUMN image_url TEXT;

-- Comentário da coluna para documentação
COMMENT ON COLUMN auctions.image_url IS 'URL da imagem do leilão para exibição nos cards';
