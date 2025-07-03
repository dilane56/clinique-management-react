"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
    id: number
    email: string
    nom: string
    prenom: string
    role: "ADMIN" | "MEDECIN" | "SECRETAIRE"
    telephone?: string
    specialite?: string
}

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<User>
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Vérifier si l'utilisateur est déjà connecté au chargement
        const token = localStorage.getItem("auth_token")
        const userData = localStorage.getItem("user_data")

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData)
                setUser(parsedUser)
                console.log("Utilisateur connecté:", parsedUser)
            } catch (error) {
                console.error("Erreur lors du parsing des données utilisateur:", error)
                localStorage.removeItem("auth_token")
                localStorage.removeItem("user_data")
            }
        }

        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string): Promise<User> => {
        console.log("Tentative de connexion pour:", email)

        // Simulation d'un appel API avec les utilisateurs de test
        const mockUsers = [
            {
                id: 1,
                email: "admin@clinique.com",
                password: "admin123",
                nom: "Administrateur",
                prenom: "Système",
                role: "ADMIN" as const,
                telephone: "01 23 45 67 89",
            },
            {
                id: 2,
                email: "dr.martin@clinique.com",
                password: "medecin123",
                nom: "Martin",
                prenom: "Dr. Pierre",
                role: "MEDECIN" as const,
                telephone: "01 23 45 67 90",
                specialite: "Médecine générale",
            },
            {
                id: 3,
                email: "secretaire@clinique.com",
                password: "secretaire123",
                nom: "Dubois",
                prenom: "Marie",
                role: "SECRETAIRE" as const,
                telephone: "01 23 45 67 91",
            },
        ]

        // Simuler un délai d'API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

        if (!foundUser) {
            throw new Error("Identifiants incorrects")
        }

        // Enlever le mot de passe de l'objet utilisateur
        const { password: _, ...userWithoutPassword } = foundUser
        const token = "mock_jwt_token_" + Date.now()

        // Sauvegarder dans localStorage
        localStorage.setItem("auth_token", token)
        localStorage.setItem("user_data", JSON.stringify(userWithoutPassword))

        setUser(userWithoutPassword)
        console.log("Connexion réussie:", userWithoutPassword)

        return userWithoutPassword
    }

    const logout = () => {
        console.log("Déconnexion de l'utilisateur")
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_data")
        setUser(null)
    }

    return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
