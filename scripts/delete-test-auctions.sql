-- Script para deletar leilões mockados "TESTE"
-- Execute este script no banco de dados para remover os leilões de teste

DELETE FROM auctions WHERE name = 'TESTE';

-- Verificar se a exclusão foi bem-sucedida
SELECT * FROM auctions WHERE name = 'TESTE';
