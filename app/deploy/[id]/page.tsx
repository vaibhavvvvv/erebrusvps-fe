'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import DeploymentForm from '../../components/DeploymentForm'
import DeploymentLogs from '../../components/DeploymentLogs'
import PreviewCard from '../../components/PreviewCard'
import { getProject } from '../../utils/storage'
import { Project, DeploymentResult } from '../../components/index'

export default function DeployPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (params.id) {
          const fetchedProject = await getProject(params.id as string)
          setProject(fetchedProject)
          // If project is already deployed, set deployment result
          if (fetchedProject.status === 'deployed' && fetchedProject.metadata?.port) {
            setDeploymentResult({
              status: 'deployed',
              url: fetchedProject.metadata.deploymentUrl || '',
              port: fetchedProject.metadata.port
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch project:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
            <div className="h-64 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
            <p className="text-gray-300">Project not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <span className={`px-3 py-1 rounded-full text-sm ${
              project.status === 'deployed' ? 'bg-green-900 text-green-300' :
              project.status === 'failed' ? 'bg-red-900 text-red-300' :
              'bg-gray-800 text-gray-300'
            }`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>

          <DeploymentForm
            project={project}
            onDeployStart={() => {
              setIsDeploying(true)
              setDeploymentResult(null)
            }}
            onDeployComplete={(result) => {
              setIsDeploying(false)
              setDeploymentResult(result)
              // Refresh project data after deployment
              getProject(project.id).then(setProject)
            }}
          />

          {/* Show deployment logs during deployment */}
          {isDeploying && (
            <div className="mt-6">
              <DeploymentLogs projectId={project.id} />
            </div>
          )}

          {/* Show preview card after successful deployment */}
          {deploymentResult && deploymentResult.status === 'deployed' && (
            <div className="mt-6">
              <PreviewCard deployment={deploymentResult} />
            </div>
          )}

          {/* Always show logs if project is deployed */}
          {project.status === 'deployed' && !isDeploying && (
            <div className="mt-6">
              <DeploymentLogs projectId={project.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 