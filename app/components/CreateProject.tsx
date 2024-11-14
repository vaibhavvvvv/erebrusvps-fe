'use client'
import { useState } from 'react'

interface CreateProjectProps {
  onSubmit: (projectName: string) => void;
  onCancel: () => void;
}

export default function CreateProject({ onSubmit, onCancel }: CreateProjectProps) {
  const [projectName, setProjectName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(projectName)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Project Name
        </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-100 
            placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter project name"
          required
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Project
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-700 text-gray-300 rounded hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}