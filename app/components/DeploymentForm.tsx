'use client'
import { useState } from 'react'
import axios from 'axios'
import { Project } from './index'
import { saveProject } from '../utils/walrus'  

interface DeploymentFormProps {
  project: Project;
  onDeployStart: () => void;
  onDeployComplete: (result: any) => void;
}

export default function DeploymentForm({ project, onDeployStart, onDeployComplete }: DeploymentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    git_url: project.metadata?.githubUrl || '',
    project_name: project.name,
    port: '3000',
    env_vars: project.metadata?.envVars || {}
  })
  
  const [envVars, setEnvVars] = useState<{ key: string; value: string; }[]>(
    Object.entries(project.metadata?.envVars || {}).map(([key, value]) => ({ key, value }))
      .concat([{ key: '', value: '' }])
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEnvVarChange = (index: number, field: 'key' | 'value', value: string) => {
    const newEnvVars = [...envVars]
    newEnvVars[index][field] = value

    // Add new row if last row is being filled
    if (index === envVars.length - 1 && (value !== '')) {
      newEnvVars.push({ key: '', value: '' })
    }

    setEnvVars(newEnvVars)
  }

  const removeEnvVar = (index: number) => {
    if (envVars.length > 1) {
      const newEnvVars = envVars.filter((_, i) => i !== index)
      setEnvVars(newEnvVars)
    }
  }

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    onDeployStart()

    try {
      // Filter out empty env vars and convert to object
      const filteredEnvVars = envVars.reduce((acc, curr) => {
        if (curr.key && curr.value) {
          acc[curr.key] = curr.value
        }
        return acc
      }, {} as Record<string, string>)

      // Save project data to Supabase
      const updatedProject = await saveProject({
        ...project,
        metadata: {
          ...project.metadata,
          githubUrl: formData.git_url,
          envVars: filteredEnvVars,
        },
        status: 'created'
      })

      // Deploy the project
      const response = await axios.post('http://35.227.177.48:8080/deploy', {
        git_url: formData.git_url,
        project_name: formData.project_name,
        port: formData.port,
        env_vars: filteredEnvVars
      })
         // Update project with deployment result
         const finalProject = await saveProject({
          ...updatedProject,
          metadata: {
            ...updatedProject.metadata,
            deploymentUrl: response.data.url,
            port: response.data.port,
          },
          status: 'deployed'
        })
  
        onDeployComplete(response.data)
      } catch (error: any) {
        console.error('Deployment failed:', error)
        // Update project status to failed
        await saveProject({
          ...project,
          status: 'failed'
        })
        alert('Deployment failed: ' + error.message)
      } finally {
        setIsLoading(false)
      }
    }

  // const handlePinSubmit = async (pin: string) => {
  //   setIsLoading(true)
  //   onDeployStart()

  //   try {
  //     // Filter out empty env vars and convert to object
  //     const filteredEnvVars = envVars.reduce((acc, curr) => {
  //       if (curr.key && curr.value) {
  //         acc[curr.key] = curr.value
  //       }
  //       return acc
  //     }, {} as Record<string, string>)

  //     // Save project data to Walrus
  //     const updatedProject = await saveProject({
  //       ...project,
  //       githubUrl: formData.git_url,
  //       envVars: filteredEnvVars,
  //       status: 'created'
  //     }, pin)

  //     // Deploy the project
  //     const response = await axios.post('http://35.227.177.48:8080/deploy', {
  //       git_url: formData.git_url,
  //       project_name: formData.project_name,
  //       port: formData.port,
  //       env_vars: filteredEnvVars
  //     })

  //     // Update project with deployment result
  //     const finalProject = await saveProject({
  //       ...updatedProject,
  //       deploymentUrl: response.data.url,
  //       port: response.data.port,
  //       status: 'deployed'
  //     }, pin)

  //     onDeployComplete(response.data)
  //   } catch (error: any) {
  //     console.error('Deployment failed:', error)
  //     // Update project status to failed
  //     await saveProject({
  //       ...project,
  //       status: 'failed'
  //     }, pin)
  //     alert('Deployment failed: ' + error.message)
  //   } finally {
  //     setIsLoading(false)
  //     setIsPinModalOpen(false)
  //   }
  // }

  return (
    <>
      <form onSubmit={handleDeploy} className="space-y-6 bg-white text-gray-700 p-6 rounded-lg shadow">
        {/* Required Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              GitHub URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="git_url"
              value={formData.git_url}
              onChange={handleInputChange}
              placeholder="https://github.com/username/repo"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleInputChange}
              placeholder="my-project"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Environment Variables */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Environment Variables</h3>
            <span className="text-sm text-gray-500">Optional</span>
          </div>
          
          <div className="space-y-3">
            {envVars.map((envVar, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="KEY"
                  value={envVar.key}
                  onChange={(e) => handleEnvVarChange(index, 'key', e.target.value)}
                  className="w-1/3 p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="VALUE"
                  value={envVar.value}
                  onChange={(e) => handleEnvVarChange(index, 'value', e.target.value)}
                  className="w-2/3 p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                />
                {index !== envVars.length - 1 && (
                  <button
                    type="button"
                    onClick={() => removeEnvVar(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white p-3 rounded hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? 'Deploying...' : 'Deploy Project'}
        </button>
      </form>

      {/* <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSubmit={handlePinSubmit}
        isLoading={isLoading}
      /> */}
    </>
  )
}