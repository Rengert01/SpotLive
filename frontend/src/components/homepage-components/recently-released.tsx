// FILE: RecentlyReleased.tsx
import TrackSection from '@/components/ui/track-section';

export default function RecentlyReleased() {
  return (
    <TrackSection
      title="Recently Released"
      filterFunction={(track) => track.recent}
    />
  );
}
