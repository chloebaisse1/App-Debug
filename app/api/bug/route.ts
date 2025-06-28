import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get("Authorization")?.split(" ")[1]

    if (!apiKey) {
      return NextResponse.json({ error: "Clé API manquante" }, { status: 401 })
    }
    const { title, description, projectId } = await request.json()
    if (!title || !description || !projectId) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      )
    }
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 })
    }
    await prisma.bug.create({
      data: {
        title,
        description,
        projectId,
      },
    })
    return NextResponse.json(
      { message: "Bug enregistré avec succès" },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
