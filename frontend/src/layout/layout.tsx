import MusicPlayer from "@/components/music-player";
import { Sidebar } from "@/components/sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="w-full h-screen grid grid-cols-[17rem,1fr] overflow-x-hidden">
            <Sidebar className="col-span-1" />
            <div className="col-span-1 lg:col-span-1 lg:border-l">
                <div className="h-full grid grid-rows-[1fr,4rem]">
                    <div className="px-4 py-6 lg:px-8 row-span-1 overflow-x-hidden">
                        <Outlet />
                    </div>
                    <div className="row-span-1 px-4 lg:px-8 border-y">
                        <MusicPlayer />
                    </div>
                </div>
            </div>
        </div>
    )
}