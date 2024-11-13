import RecentlyReleasedTracks from "@/components/homepage-components/recently-released.tsx";
import MadeForYouTracks from "@/components/homepage-components/made-for-you.tsx";

export default function HomePage() {
    return (
        <div>
            <MadeForYouTracks />
            <RecentlyReleasedTracks />
        </div>
    );
}