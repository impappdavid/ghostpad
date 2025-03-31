"use client"

import type React from "react"
import logo from "../../../../public/ghostpad.png";
import { useState } from "react"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { EyeIcon, EyeOffIcon, GithubIcon } from "lucide-react"

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log({ email, password, rememberMe })
        // Add your authentication logic here
    }



    return (
        <>
            <div className="w-full h-screen flex justify-center items-center">
                <div className="w-full sm:max-w-sm h-full sm:h-fit bg-zinc-900/50 p-4 py-8 sm:rounded-2xl sm:border flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <div className="text-center text-xl font-semibold">SignIn to <a href="./" className="text-[#ab9ff2] underline">GhostPad</a></div>
                        <div className="text-center text-sm text-zinc-400">Enter your credentials to access your account.</div>
                    </div>
                    <form onSubmit={handleSubmit} >

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
                                    <span className="bg-zinc-900/50 px-2 text-muted-foreground">Or</span>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-start font-body">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="rounded-xl font-body text-xs placeholder:text-xs"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-start font-body">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="rounded-xl"
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
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => {
                                        setRememberMe(checked as boolean)
                                    }}
                                    className="rounded-md"
                                />
                                <Label htmlFor="remember" className="text-xs font-medium font-body">
                                    Remember me
                                </Label>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Button type="submit" className="w-full rounded-xl font-body bg-[#ab9ff2c9]  hover:bg-[#ab9ff2c1] text-white">
                                Login
                            </Button>
                            <div className="text-center text-xs font-body">
                                Don't have an account yet?{" "}
                                <a href="./signup" className="text-primary underline font-medium">
                                    Sign up
                                </a>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </>
    )
}






