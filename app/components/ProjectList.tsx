'use client'
import { Project } from './index'

interface ProjectListProps {
  projects: Project[];
  isLoading: boolean;
  onSelect: (project: Project) => void;
}

export default function ProjectList({ projects, isLoading, onSelect }: ProjectListProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4">
            <div className="h-4 bg-gray-800 rounded w-3/4"></div>
            <div className="h-4 bg-gray-800 rounded"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!projects.length) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg text-center border border-gray-800">
        <p className="text-gray-400">No projects found. Create your first project!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => onSelect(project)}
          className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-gray-700 
            cursor-pointer transition-all shadow-lg hover:shadow-xl"
        >
          <h3 className="text-lg font-medium text-gray-100 mb-2">{project.name}</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-400">Status: <span className="text-blue-400">{project.status}</span></p>
            {project.metadata?.deploymentUrl && (
              <p className="text-gray-400 truncate">
                URL: <a href={`http://35.227.177.48:${project.metadata.port}`} target="_blank" rel="noopener noreferrer" 
                  className="text-blue-400 hover:text-blue-300">{`http://35.227.177.48:${project.metadata.port}`}</a>
              </p>
            )}
            <p className="text-gray-400">Created: {new Date(project.metadata?.createdAt || '').toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}