"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

export default function SubscribeForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      })
      setEmail("")
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-xs mx-auto">
      <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <Input
            type="email"
            placeholder="Yout email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pr-32 text-xs font-body placeholder:text-xs  bg-zinc-950 text-white rounded-xl placeholder:text-zinc-400 border-zinc-800"
            required
          />
          <Button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-[calc(100%-8px)] px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800/70 text-xs text-white"
            disabled={isLoading}
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </div>
      </form>
    </div>
  )
}

