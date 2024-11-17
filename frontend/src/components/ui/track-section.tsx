// FILE: components/TrackSection.tsx
import tracks from '@/data/tracks.json';
import Track from '@/components/ui/track'; // Adjust the import path as necessary

type TrackType = (typeof tracks)[0];

interface TrackSectionProps {
  title: string;
  filterFunction: (track: TrackType) => boolean;
}

export default function TrackSection({
  title,
  filterFunction,
}: TrackSectionProps) {
  const filteredTracks = tracks.filter(filterFunction);

  return (
    <div className="">
      <h2 className="text-3xl font-bold mb-6 text-black">{title}</h2>
      <div className="relative">
        <div
          className="flex space-x-4 overflow-x-auto"
          style={{ width: '100%' }}
        >
          {filteredTracks.map((track) => (
            <Track key={track.id} track={track} />
          ))}
        </div>
      </div>
    </div>
  );
}
