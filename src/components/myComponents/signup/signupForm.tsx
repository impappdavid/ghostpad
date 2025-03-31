"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { EyeIcon, EyeOffIcon, GithubIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"



export default function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [acceptPolicy, setAcceptPolicy] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert("Passwords do not match")
            return
        }
        console.log({ name, email, password, acceptPolicy })
        // Add your registration logic here
    }

    return (


        <>
            <div className="w-full h-screen flex justify-center items-center ">
                <div className="w-full sm:max-w-sm h-full sm:h-fit bg-zinc-900/50 p-4 py-8 sm:rounded-2xl sm:border flex flex-col gap-2">
                    <div className="flex flex-col gap-1 font-body">
                        <div className="text-center text-xl font-semibold">SignUp to <a href="./" className="text-[#ab9ff2] underline">GhostPad</a></div>
                        <div className="text-center text-sm text-zinc-400">Create an account to get started.</div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" type="button" className="flex items-center gap-2 rounded-xl bg-zinc-900/50 font-body">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                        <path d="M1 1h22v22H1z" fill="none" />
                                    </svg>
                                    Google
                                </Button>
                                <Button variant="outline" type="button" className="flex items-center gap-2 bg-zinc-900/50 rounded-xl font-body">
                                    <GithubIcon className="h-5 w-5" />
                                    GitHub
                                </Button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-zinc-900/50 px-2 text-muted-foreground font-body">Or</span>
                                </div>
                            </div>
                            <div className="grid gap-2 font-body">
                                <Label htmlFor="name" className="text-start">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="rounded-xl text-xs placeholder:text-xs"
                                />
                            </div>
                            <div className="grid gap-2 font-body">
                                <Label htmlFor="email" className="text-start">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="rounded-xl text-xs placeholder:text-xs"
                                />
                            </div>
                            <div className="grid gap-2 font-body">
                                <Label htmlFor="password" className="text-start">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Password"
                                        className="rounded-xl text-xs placeholder:text-xs"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 rounded-xl"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                                    </Button>
                                </div>
                            </div>
                            <div className="grid gap-2 font-body">
                                <Label htmlFor="confirm-password" className="text-start">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirm-password"
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        placeholder="Confirm Password"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="rounded-xl text-xs placeholder:text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 py-2 mb-2">
                            <Checkbox
                                id="policy"
                                checked={acceptPolicy}
                                onCheckedChange={(checked) => {
                                    setAcceptPolicy(checked as boolean)
                                }}
                                className="rounded-md mt-1"
                            />
                            <Label htmlFor="policy" className="text-xs font-medium font-body">
                                I acknowledge and agree to the{" "}
                                <a href="/privacy-policy" className="text-primary underline">
                                    Privacy Policy
                                </a>
                            </Label>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Button type="submit" className="w-full rounded-xl font-body" disabled={!acceptPolicy}>
                                Create Account
                            </Button>
                            <div className="text-center text-sm font-body">
                                Already have an account?{" "}
                                <a href="./signin" className="text-primary underline font-medium text-xs font-body" >
                                    Login
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

