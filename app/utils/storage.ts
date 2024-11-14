import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Project } from '../components/index'

export const saveProject = async (project: Project): Promise<Project> => {
  try {
    const supabase = createClientComponentClient()
    
    const { data, error } = await supabase
      .from('projects')
      .upsert({
        id: project.id,
        name: project.name,
        description: project.description,
        address: project.address,
        chain_id: project.chainId,
        metadata: project.metadata,
        status: project.status,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data

  } catch (error) {
    console.error('Error saving project:', error)
    throw new Error('Failed to save project')
  }
}

export const getProject = async (id: string): Promise<Project> => {
  try {
    const supabase = createClientComponentClient()
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data

  } catch (error) {
    console.error('Error fetching project:', error)
    throw new Error('Failed to fetch project')
  }
}

export const getProjectsByAddress = async (address: string): Promise<Project[]> => {
  try {
    const supabase = createClientComponentClient()
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('address', address)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []

  } catch (error) {
    console.error('Error fetching projects:', error)
    throw new Error('Failed to fetch projects')
  }
}

export const deleteProject = async (id: string): Promise<void> => {
  try {
    const supabase = createClientComponentClient()
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error

  } catch (error) {
    console.error('Error deleting project:', error)
    throw new Error('Failed to delete project')
  }
}