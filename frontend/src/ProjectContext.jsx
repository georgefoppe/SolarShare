import { createContext, useState, useContext, useEffect } from 'react'

const ProjectContext = createContext()

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Load projects from storage on mount
  useEffect(() => {
    loadProjects()
  }, [])

  // Save projects whenever they change
  useEffect(() => {
    if (!loading && projects.length > 0) {
      saveProjects()
    }
  }, [projects, loading])

  const loadProjects = async () => {
    try {
      const result = await window.storage.get('octosolar-projects')
      if (result && result.value) {
        setProjects(JSON.parse(result.value))
      }
    } catch (error) {
      console.log('No saved projects yet')
    } finally {
      setLoading(false)
    }
  }

  const saveProjects = async () => {
    try {
      await window.storage.set('octosolar-projects', JSON.stringify(projects))
    } catch (error) {
      console.error('Error saving projects:', error)
    }
  }

  const addProject = (project) => {
    setProjects(prev => [...prev, { 
      ...project, 
      id: Date.now(),
      currentFunding: 0,
      investors: [],
      createdAt: new Date().toISOString()
    }])
  }

  const investInProject = (projectId, amount, investorName) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          currentFunding: project.currentFunding + amount,
          investors: [...project.investors, { 
            name: investorName, 
            amount,
            date: new Date().toLocaleString()
          }]
        }
      }
      return project
    }))
  }

  const clearAllData = async () => {
    if (window.confirm('Are you sure? This will delete all projects!')) {
      setProjects([])
      await window.storage.delete('octosolar-projects')
      alert('All data cleared!')
    }
  }

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      addProject, 
      investInProject,
      clearAllData,
      loading 
    }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  return useContext(ProjectContext)
}