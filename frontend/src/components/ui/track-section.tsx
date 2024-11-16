// FILE: components/TrackSection.tsx
import tracks from '@/data/tracks.json';
import Track from '@/components/ui/track'; // Adjust the import path as necessary

interface TrackSectionProps {
    title: string;
    filterFunction: (track: any) => boolean;
}

export default function TrackSection({ title, filterFunction }: TrackSectionProps) {
    const filteredTracks = tracks.filter(filterFunction);

    return (
        <section className="">
            <h2 className="text-3xl font-bold mb-6 text-black">{title}</h2>
            <div className="relative">
                <div className="flex space-x-4 overflow-x-auto" style={{ width: '100%' }}>
                    {filteredTracks.map((track) => (
                        <Track key={track.id} track={track} />
                    ))}
                </div>
            </div>
        </section>
    );
}