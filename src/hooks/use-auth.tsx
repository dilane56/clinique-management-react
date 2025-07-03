"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"


interface  User{
    id: number,
    email: string,
    nom: string,
    prenom : string,
    role:"ADMIN" | "MEDECIN" | "SECRETAIRE",
    telephone?:string,
    specialite?: string,



}

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<User>
    logout: () => void
    isLoading: boolean
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function  AUthProvider({ children }:{children: ReactNode}){
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setisLoading] = useState(true)

    useEffect(() => {
        //verifier sil'utilisateur est deja connecté au chargement
        const  token = localStorage.getItem("auth_token")
        const userData = localStorage.getItem("user_data")

        if (token && userData){
            try {
                const parseUser = JSON.parse(userData)
                setUser(parseUser)
                console.log("Utilisateur cnnecté :", parseUser)
            } catch (error){
                console.error("Erreur lors du parsn des données utilisateur: ", error)
                localStorage.removeItem("auth_token")
                localStorage.removeItem("user_data")
            }
        }
        setisLoading(false)
    }, [])

    const apiUrl =""

    const login = async (email: string , password: string ): Promise<User> =>{
        console.log("Tentative de connextion pour: ", email)

        try{
            const response = await fetch(`${apiUrl}/login`,{
                method: "POST",
                headers: {
                    "content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok){
                throw new Error("Echec de la connexion : identifiants invalides");
            }
            const data = await response.json();
            const {token, user} = data;

            //Stocker le token et les donées utilisateur
            localStorage.setItem("auth_token", token);
            localStorage.setItem("user_data", JSON.stringify(user));
            setUser(user)
            console.log("connexion réussie:", user);
            return user

        } catch(error){
            console.error("Erreur de connexion:", error)
            throw  new Error("Echec de la connexion : "+ error)
        }



    }
    const logout = () => {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_data")
        setUser(null)
        console.log("Déconnexion réussie")
    }
    return (
        <AuthContext.Provider value={{user, login, logout, isLoading}}>{children}</AuthContext.Provider>)



}
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}