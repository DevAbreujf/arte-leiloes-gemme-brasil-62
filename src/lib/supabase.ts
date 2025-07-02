import { createClient } from '@supabase/supabase-js'

// Obter as variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificar se as variáveis estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL e Anon Key são obrigatórios. Verifique seu arquivo .env.local'
  )
}

// Criar o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Tipos auxiliares para TypeScript
export type Database = any // Substitua por seus tipos específicos do banco

// Funções utilitárias comuns
export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Verificar se o usuário é administrador
export const isAdmin = async () => {
  const user = await getUser()
  if (!user) return false
  
  try {
    // Verificar se o usuário está na tabela de admins
    const { data, error } = await supabase
      .from('admins')
      .select('id, role, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()
    
    if (error) {
      console.log('Usuário não é admin:', error.message)
      return false
    }
    
    return data ? true : false
  } catch (error) {
    console.error('Erro ao verificar admin:', error)
    
    // Fallback: verificar por email (temporário para desenvolvimento)
    const adminEmails = [
      'admin@exemplo.com',
      'joao@exemplo.com'
    ]
    
    return adminEmails.includes(user.email || '')
  }
}

// Obter dados completos do admin
export const getAdminData = async () => {
  const user = await getUser()
  if (!user) return null
  
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()
    
    if (error) return null
    return data
  } catch (error) {
    console.error('Erro ao obter dados do admin:', error)
    return null
  }
}

// Atualizar último login do admin
export const updateAdminLastLogin = async () => {
  const user = await getUser()
  if (!user) return
  
  try {
    await supabase
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('user_id', user.id)
  } catch (error) {
    console.error('Erro ao atualizar último login:', error)
  }
}

// Funções para gerenciar leilões
export const getActiveAuction = async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_active_auction')
    
    if (error) {
      console.error('Erro ao buscar leilão ativo:', error)
      return null
    }
    
    return data && data.length > 0 ? data[0] : null
  } catch (error) {
    console.error('Erro ao buscar leilão ativo:', error)
    return null
  }
}

// Verificar se há leilão ativo agora
export const hasActiveAuction = async () => {
  const auction = await getActiveAuction()
  return auction !== null
}

// Obter todos os leilões (para admin)
export const getAllAuctions = async () => {
  try {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Erro ao buscar leilões:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Erro ao buscar leilões:', error)
    return []
  }
}
