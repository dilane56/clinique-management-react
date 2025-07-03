"use client"

import React, {useState} from "react";
import {useAuth} from "@/hooks/use-auth";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Label} from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { Stethoscope, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try{
            const user = await login(email, password);
            console.log("Utilisateur connecté :", user);
            // Rediriger vers la page d'accueil ou tableau de bord
            switch (user.role) {
                case "ADMIN":
                    router.push("/admin/dashboard");
                    break;
                case "MEDECIN":
                    router.push("/medecin/dashboard");
                    break;
                case "SECRETAIRE":
                    router.push("/secretaire/dashboard");
                    break;
                default:
                    setError("Rôle utilisateur non reconnu");
            }
            //router.push("/dashboard");
        } catch (err) {
           console.error("Erreur de connexion :", err);
            setError("Email ou mot de passe incorrect");
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-600 rounded-full">
                            <Stethoscope className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Clinique Médicale</CardTitle>
                    <CardDescription>Connectez-vous à votre espace professionnel</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="votre.email@clinique.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                            {isLoading ? "Connexion..." : "Se connecter"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )



}