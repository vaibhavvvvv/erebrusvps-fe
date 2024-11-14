import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Project } from '../components/index'

export const saveProject = async (project: Project): Promise<Project> => {
  try {
    const supabase = createClientComponentClient()
    
    const { data, error } = await supabase
      .from('projects')
      .upsert({
        ...project
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