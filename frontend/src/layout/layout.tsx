import MusicPlayer from "@/components/music-player";
import { Sidebar } from "@/components/sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="w-full h-screen grid grid-cols-[17rem,1fr]">
      <Sidebar className="col-span-1" />
      <div className="col-span-1 lg:col-span-1 lg:border-l h-[100%] overflow-hidden">
        <div className="h-full grid grid-rows-[1fr,4rem]">
          <div className="px-4 py-6 lg:px-8 row-span-1 overflow-x-hidden overflow-y-scroll hide-scrollbar">
            <Outlet />
          </div>
          <div className="row-span-1 border-t px-4 lg:px-8">
            <MusicPlayer />
          </div>
        </div>
      </div>
    </div>
  )
}