/* eslint-disable @typescript-eslint/no-unused-vars */
import { Bug } from "@/type"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { changeBugStatus, deleteProject } from "../server"
import BugTable from "./BugTable"
import CodeBlockWithCopy from "./CodeBlockWithCopy"
import { Tab, Tabs } from "./Tabs"

interface BugProps {
  bugs: Bug[]
  projectId: string
  apikey: string | null
  projectName: string
  fetchProject: (id: string) => void
}

const BugFilter = ({
  bugs,
  projectId,
  apikey,
  projectName,
  fetchProject,
}: BugProps) => {
  const [updatedBugs, setUpdatedBugs] = useState<Bug[]>(bugs)
  const envVar1 = `NEXT_PUBLIC_BUG_PROJECT_ID=${projectId}`
  const envVar2 = `NEXT_PUBLIC_BUG_API_KEY=${apikey}`
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmName, setConfirmName] = useState("")
  const router = useRouter()
  const getFilteredBugs = (filter: string) => {
    switch (filter) {
      case "enAttente":
        return updatedBugs
          .filter((bug) => bug.status === 1)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      case "Corrigé":
        return updatedBugs
          .filter((bug) => bug.status === 2)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      case "Tous":
        return [...updatedBugs].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      default:
        return updatedBugs
    }
  }

  const handleStatusChange = async (bugIds: string[], newStatus: number) => {
    try {
      await changeBugStatus(bugIds, newStatus)
      fetchProject(projectId)
    } catch (error) {
      console.error(error)
    }
  }

  const handleConfirmDelete = async () => {
    if (confirmName != projectName) {
      alert("Le nom du projet ne correspond pas")
      return
    }
    setIsDeleting(true)

    try {
      await deleteProject(projectId)
      router.push("/")
    } catch (error) {
      console.error("Error deleting project:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="w-full">
      <Tabs>
        <Tab label="En Attente">
          <div className="overflow-x-auto">
            <BugTable
              bugs={getFilteredBugs("enAttente")}
              handleStatusChange={handleStatusChange}
            />
          </div>
        </Tab>

        <Tab label="Corrigé">
          <div className="overflow-x-auto">
            <BugTable
              bugs={getFilteredBugs("Corrigé")}
              handleStatusChange={handleStatusChange}
            />
          </div>
        </Tab>

        <Tab label="Tous les bugs">
          <div className="overflow-x-auto">
            <BugTable
              bugs={getFilteredBugs("tous")}
              handleStatusChange={handleStatusChange}
            />
          </div>
        </Tab>

        <Tab label="Paramètres">
          <h1>
            Copiez ces variables dans votre fichier
            <code className="text-primary">.env</code>
          </h1>
          <CodeBlockWithCopy envVar1={envVar1} envVar2={envVar2} />
          <div className="flex justify-between flex-col md:flex-row items-center border p-4 border-error/30 rounded-xl">
            <div className="flex flex-col gap-0.5">
              <p className="font-bold">Supprimer ce projet</p>
              <h2 className="text-sm">
                Une fois que vous avez supprimé un projet, vous ne pourrez plus
                le retrouver dans cette liste.
              </h2>
            </div>

            <button
              className="btn btn-error btn-sm w-full md:w-fit mt-4 md:mt-0"
              onClick={() =>
                (
                  document.getElementById("delete_project") as HTMLDialogElement
                ).showModal()
              }
            >
              Supprimer le projet
            </button>
          </div>
        </Tab>
      </Tabs>

      <dialog id="delete_project" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Suppression</h3>
          <p className="py-3">
            Pour confirmer la supression du projet, veuillez sasir le nom exact
            du projet : <strong>{projectName}</strong>
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              className="input input-bordered input-sm w-full"
              placeholder="Nom du projet"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              disabled={isDeleting}
            />
            <button
              className="btn btn-sm btn-error"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Supprimer" : "Confirmer"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default BugFilter
