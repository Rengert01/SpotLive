import RecentlyReleasedTracks from "@/components/homepage-components/recently-released.tsx";
import MadeForYouTracks from "@/components/homepage-components/made-for-you.tsx";
import UserProfile from "./user-page";

export default function HomePage() {
    return (
        <div>
            {/*<h1>Home Page</h1>*/}
            <MadeForYouTracks />
            <RecentlyReleasedTracks />
        </div>
    );
}