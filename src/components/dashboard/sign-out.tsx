'use client'

import { ExitIcon } from "@radix-ui/react-icons"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

export default function SignOut() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const data = await axios.post("/auth/signout")
      if (data.status === 200) {
        router.push("/login");
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Button
      onClick={handleSignOut}
      variant={"ghost"}
      size={"stiny"}
      className="flex items-center gap-2"
    >
      <ExitIcon className="w-4 h-4" />
      <span>Sign out</span>
    </Button>
  )
}