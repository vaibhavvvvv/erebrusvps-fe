'use client'
import { useState, useEffect } from 'react'
import { WalletKitProvider, useWalletKit } from '@mysten/wallet-kit'
import { Project, DeploymentResult } from './components/index'
import DeploymentForm from './components/DeploymentForm'
import PreviewCard from './components/PreviewCard'
import CreateProject from './components/CreateProject'
import ProjectList from './components/ProjectList'
import { getProjectsByAddress, saveProject } from './utils/storage'  // Updated import


function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { currentAccount } = useWalletKit()

  useEffect(() => {
    if (currentAccount) {
      fetchProjects(currentAccount.address)
    }
  }, [currentAccount])

  const fetchProjects = async (address: string) => {
    try {
      setIsLoading(true)
      const fetchedProjects = await getProjectsByAddress(address)
      setProjects(fetchedProjects)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProjectCreate = async (projectName: string) => {
    if (!currentAccount) return
    try {
      const newProject = await saveProject({
        id: crypto.randomUUID(), // Generate a new UUID for the project
        name: projectName,
        description: '', // Can be updated later
        address: currentAccount.address,
        chainId: 0, // Set appropriate default chain ID
        status: 'created',
        metadata: {
          createdAt: new Date().toISOString()
        }
      })

      setProjects([...projects, newProject])
      setCurrentProject(newProject)
      setIsCreatingProject(false)
    } catch (error) {
      console.error('Failed to create project:', error)
      alert('Failed to create project. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {currentAccount ? (
          <>
            {isCreatingProject ? (
              <div className="bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-800">
                <CreateProject onSubmit={handleProjectCreate} onCancel={() => setIsCreatingProject(false)} />
              </div>
            ) : currentProject ? (
              <div className="space-y-6">
                <button
                  onClick={() => setCurrentProject(null)}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                >
                  ← Back to Projects
                </button>
                <DeploymentForm
                  project={currentProject}
                  onDeployStart={() => setIsDeploying(true)}
                  onDeployComplete={() => {
                    setIsDeploying(false);
                    setCurrentProject(null);
                  }}
                />
                {deploymentResult && <PreviewCard deployment={deploymentResult} />}
              </div>
            ) : (
              <div className="space-y-6">
                <button
                  onClick={() => setIsCreatingProject(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create New Project
                </button>
                <ProjectList
                  projects={projects}
                  isLoading={isLoading}
                  onSelect={setCurrentProject}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
            <p className="text-gray-300">Please connect your wallet to continue</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <WalletKitProvider>
      <HomePage />
    </WalletKitProvider>
  )
}