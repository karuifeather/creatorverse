import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env file.',
    )
  }

  return supabase
}

export async function getCreators() {
  const client = requireSupabase()
  const { data, error } = await client
    .from('creators')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message || 'Failed to load creators')
  }

  return data ?? []
}

export async function getCreatorById(id) {
  const client = requireSupabase()
  const { data, error } = await client
    .from('creators')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message || 'Failed to load creator')
  }

  return data
}

export async function createCreator(creator) {
  const client = requireSupabase()

  const imageURL =
    typeof creator.imageURL === 'string' && creator.imageURL.trim() !== ''
      ? creator.imageURL.trim()
      : null

  const row = {
    name: creator.name,
    url: creator.url,
    description: creator.description,
    imageURL,
  }

  const { data, error } = await client
    .from('creators')
    .insert(row)
    .select()
    .single()

  if (error) {
    throw new Error(error.message || 'Failed to create creator')
  }

  return data
}

export async function updateCreator(id, creator) {
  const client = requireSupabase()

  const imageURL =
    typeof creator.imageURL === 'string' && creator.imageURL.trim() !== ''
      ? creator.imageURL.trim()
      : null

  const row = {
    name: creator.name,
    url: creator.url,
    description: creator.description,
    imageURL,
  }

  const { data, error } = await client
    .from('creators')
    .update(row)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message || 'Failed to update creator')
  }

  return data
}

export async function deleteCreator(id) {
  const client = requireSupabase()
  const { error } = await client.from('creators').delete().eq('id', id)

  if (error) {
    throw new Error(error.message || 'Failed to delete creator')
  }

  return { ok: true }
}
