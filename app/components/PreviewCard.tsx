'use client'
import { useState, useRef } from 'react'

interface DeploymentResult {
  status: string;
  url: string;
  port: string;
  error?: string;
}

interface PreviewCardProps {
  deployment: DeploymentResult;
}

export default function PreviewCard({ deployment }: PreviewCardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const previewUrl = `http://35.227.177.48:${deployment.port}`

  const handleRefresh = () => {
    setIsLoading(true)
    if (iframeRef.current) {
      iframeRef.current.src = previewUrl
    }
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-800">
      <h2 className="text-xl font-bold mb-4 text-gray-100">Deployment Complete!</h2>
      
      <div className="space-y-4">
        <div className="space-y-2 text-gray-300">
          <div>
            <span className="font-medium">Status:</span> 
            <span className="text-green-400">{deployment.status}</span>
          </div>
          
          <div>
            <span className="font-medium">Preview URL:</span>
            <a 
              href={previewUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-blue-400 hover:text-blue-300 hover:underline"
            >
              {previewUrl}
            </a>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3 text-gray-300">Live Preview</h3>
          <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 relative">
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-[400px] border-0"
              onLoad={() => setIsLoading(false)}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mt-4">
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Open in New Tab
          </a>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 border border-gray-700 rounded hover:bg-gray-800 text-gray-300 text-sm"
          >
            Refresh Preview
          </button>
        </div>
      </div>
    </div>
  )
}