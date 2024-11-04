import MusicPlayer from "@/components/music-player";
import { Sidebar } from "@/components/sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center bg-background">
          <div className="w-full h-screen grid lg:grid-cols-5">
            <Sidebar />
            <div className="col-span-3 lg:col-span-4 lg:border-l">
              <div className="h-full grid grid-rows-[1fr,4rem]">
                <div className="px-4 py-6 lg:px-8 row-span-1">
                  <Outlet />
                </div>
                <div className="row-span-1 border-t px-4 lg:px-8">
                  <MusicPlayer />
                </div>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}