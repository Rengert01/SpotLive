// FILE: MadeForYou.tsx
import TrackSection from "@/components/ui/track-section";

export default function MadeForYou() {
    return (
        <TrackSection
            title="Made For You"
            filterFunction={(track) => track.madeforyou}
        />
    );
}