import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Adjust the import path as necessary
import { Play } from 'lucide-react'; // Adjust the import path as necessary

interface TrackProps {
  track: {
    id: string;
    cover: string;
    title: string;
    artist: string;
  };
}

const TrackItem: React.FC<TrackProps> = ({ track }) => {
  return (
    <div key={track.id} className="group relative flex-shrink-0 w-48">
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-800">
        <img
          src={`/assets/tracks/${track.cover}`}
          alt={`${track.title} by ${track.artist}`}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center border-0 group-hover:border-4 group-hover:border-black transition-all duration-300">
          <Button
            size="icon"
            variant="secondary"
            className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-1/2 group-hover:translate-y-0"
          >
            <Play className="w-4 h-4" />
            <span className="sr-only">Play {track.title}</span>
          </Button>
        </div>
      </div>
      <div className="mt-2 relative">
        <h3 className="text-lg font-semibold text-black">{track.title}</h3>
        <p className="text-sm text-gray-400">
          <Link
            to={`/user/${track.id}`}
            className="text-blue-500 hover:underline z-10 relative"
          >
            {track.artist}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default TrackItem;
