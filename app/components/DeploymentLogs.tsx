'use client'
import { useState, useEffect, useRef } from 'react'

interface DeploymentLogsProps {
  projectId: string;
}

export default function DeploymentLogs({ projectId }: DeploymentLogsProps) {
  const [logs, setLogs] = useState<string[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  // Load saved logs from localStorage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem(`deployment-logs-${projectId}`)
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs))
    }
  }, [projectId])

  // WebSocket connection
  useEffect(() => {
    // Connect to WebSocket
    wsRef.current = new WebSocket('ws://35.227.177.48:8080/logs')

    wsRef.current.onopen = () => {
      console.log('WebSocket Connected')
      // Send project ID to identify the connection
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ projectId }))
      }
    }

    wsRef.current.onmessage = (event) => {
      const newLog = event.data
      setLogs(prevLogs => {
        const updatedLogs = [...prevLogs, `[${new Date().toISOString()}] ${newLog}`]
        // Save to localStorage whenever we get new logs
        localStorage.setItem(`deployment-logs-${projectId}`, JSON.stringify(updatedLogs))
        return updatedLogs
      })
    }

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error)
      setLogs(prevLogs => [...prevLogs, `[${new Date().toISOString()}] WebSocket error: Connection failed`])
    }

    wsRef.current.onclose = () => {
      console.log('WebSocket Disconnected')
      // Attempt to reconnect
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          wsRef.current = new WebSocket('ws://35.227.177.48:8080/logs')
        }
      }, 3000)
    }

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [projectId])

  // Function to clear logs
  const clearLogs = () => {
    setLogs([])
    localStorage.removeItem(`deployment-logs-${projectId}`)
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-medium text-gray-200">Deployment Logs</h3>
          {/* WebSocket status indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              wsRef.current?.readyState === WebSocket.OPEN 
                ? 'bg-green-500' 
                : 'bg-red-500'
            }`} />
            <span className="text-xs text-gray-400">
              {wsRef.current?.readyState === WebSocket.OPEN ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        {logs.length > 0 && (
          <button
            onClick={clearLogs}
            className="px-3 py-1 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Clear Logs
          </button>
        )}
      </div>
      
      <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm h-[400px] overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-gray-500">No deployment logs yet.</p>
        ) : (
          logs.map((log, index) => (
            <div 
              key={index} 
              className="text-gray-300 whitespace-pre-wrap mb-1"
            >
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  )
}