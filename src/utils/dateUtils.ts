/**
 * Utilitários para manipulação de datas
 * Garante que as datas sejam exibidas corretamente independente do timezone
 */

/**
 * Formata uma data UTC para exibição no formato brasileiro
 * @param dateString - String da data em formato ISO
 * @returns String formatada no padrão brasileiro
 */
export const formatDateBR = (dateString: string): string => {
  if (!dateString) return '';
  
  // Cria a data considerando que ela está em UTC
  const date = new Date(dateString);
  
  // Formata para o timezone do Brasil
  return date.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Converte uma data local para UTC para salvar no banco
 * @param localDateString - String da data no formato datetime-local
 * @returns String da data em formato ISO (UTC)
 */
export const localToUTC = (localDateString: string): string => {
  if (!localDateString) return '';
  
  // O input datetime-local já retorna no timezone local
  // Precisamos converter para UTC antes de salvar
  const date = new Date(localDateString);
  return date.toISOString();
};

/**
 * Converte uma data UTC para o formato datetime-local para edição
 * @param utcDateString - String da data em formato ISO (UTC)
 * @returns String no formato datetime-local
 */
export const utcToLocal = (utcDateString: string): string => {
  if (!utcDateString) return '';
  
  // Cria a data a partir da string UTC
  const date = new Date(utcDateString);
  
  // Obtém o offset do timezone local em minutos
  const tzOffset = date.getTimezoneOffset() * 60000;
  
  // Ajusta a data para o timezone local
  const localDate = new Date(date.getTime() - tzOffset);
  
  // Formata para o formato esperado pelo input datetime-local
  return localDate.toISOString().slice(0, 16);
};

/**
 * Verifica se um leilão está ativo baseado nas datas
 * @param startDate - Data de início
 * @param endDate - Data de fim (opcional)
 * @returns boolean indicando se está ativo
 */
export const isAuctionActive = (startDate: string, endDate?: string): boolean => {
  const now = new Date();
  const start = new Date(startDate);
  
  if (now < start) return false;
  
  if (endDate) {
    const end = new Date(endDate);
    return now <= end;
  }
  
  return true;
};
