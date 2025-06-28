/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { Project } from "@/type"
import { useUser } from "@clerk/nextjs"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import ProjectCard from "./components/ProjectCard"
import Wrapper from "./components/Wrapper"
import { addProject, getAllProjects } from "./server"

export default function Home() {
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress as string
  const [projectName, setProjectName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      alert("Veuillez entrer un nom de projet valide.")
      return
    }
    setIsSubmitting(true)

    try {
      await addProject(email, projectName)
      const modal = document.getElementById("new_project") as HTMLDialogElement
      fetchProjects()
      modal?.close()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchProjects = async () => {
    if (email) {
      const fetchedProjects = await getAllProjects(email)
      setProjects(fetchedProjects)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [email])

  return (
    <Wrapper>
      <button
        onClick={() =>
          (
            document.getElementById("new_project") as HTMLDialogElement
          ).showModal()
        }
        className=" btn btn-sm btn-primary mb-4"
      >
        <Plus className="w-4 h-4" />
        Nouveau projet
      </button>

      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <dialog id="new_project" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-2">
            Commencer par créer votre projet
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Vous devez créer un projet pour commencer à débugger.
          </p>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nom du projet"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="input input-sm input-bordered w-full"
            />
            <button
              onClick={handleCreateProject}
              className="btn btn-sm btn-primary w-full mt-2"
            >
              {isSubmitting ? "Création en cours ..." : "Créer le projet"}
            </button>
          </div>
        </div>
      </dialog>
    </Wrapper>
  )
}
