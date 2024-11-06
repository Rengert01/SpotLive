import { useEffect, useState } from "react"
import axios from "@/config/axios"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
  const navigate = useNavigate()
  const [protectedRouteTest, setProtectedRouteTest] = useState<string>("")

  useEffect(() => {
    const fetchProtectedRoute = async () => {
      const res = await axios.get("/protected")
      setProtectedRouteTest(res.data.message)
    }
    fetchProtectedRoute()
  }, [])

  return (
    <div>
      {protectedRouteTest}
      <Button
        onClick={async () => {
          await axios.post("/api/auth/signOut")
          navigate("/login")
        }}
      >
        Logout
      </Button>
    </div>
  )
}