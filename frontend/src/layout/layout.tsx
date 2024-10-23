import Sidebar from "@/layout/sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center bg-background">
          <div className="w-full h-screen grid lg:grid-cols-5">
            <Sidebar />
            <div className="col-span-3 lg:col-span-4 lg:border-l">
              <div className="h-full px-4 py-6 lg:px-8">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}