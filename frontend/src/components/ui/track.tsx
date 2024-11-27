import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Adjust the import path as necessary
import { Pause, Play, PlusCircle } from 'lucide-react'; // Adjust the import path as necessary
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useAudioStore } from '@/stores/audio-store';

const playlists = [
  'Recently Added',
  'Recently Played',
  'Top Songs',
  'Top Albums',
  'Top Artists',
  'Logic Discography',
  'Bedtime Beats',
  'Feeling Happy',
  'I miss Y2K Pop',
  'Runtober',
  'Mellow Days',
  'Eminem Essentials',
];

function TrackItem({
  track,
  onClick,
}: {
  track: TrackType;
  onClick: (track: TrackType) => void;
}) {
  const { audio } = useAudioStore();
  return (
    <div key={track.id} className="group relative flex-shrink-0 w-48">
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="aspect-square overflow-hidden rounded-lg bg-transparent">
            <img
              src={`${import.meta.env.VITE_APP_API_URL}/api/uploads/image/${track.cover}`}
              alt={`${track.title} by ${track.artist.username}`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center border-0 group-hover:border-black transition-all duration-300">
              <Button
                onClick={() => onClick(track)}
                size="icon"
                variant="secondary"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:translate-y-0"
              >
                {audio.isPlaying && audio.audioSrc === track.id ? (
                  <Pause className="stroke-black" />
                ) : (
                  <Play className="stroke-black" />
                )}
                <span className="sr-only">Play {track.title}</span>
              </Button>
            </div>
          </div>
        </ContextMenuTrigger>
        <div className="mt-2 relative">
          <h3 className="text-lg font-semibold text-black truncate">
            {track.title}
          </h3>
          <Link
            to={`/user/${track.id}`}
            className="text-muted-foreground underline-offset-4 hover:underline"
          >
            {track.artist.username}
          </Link>
        </div>
        <ContextMenuContent className="w-40">
          <ContextMenuItem>Add to Library</ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Playlist
              </ContextMenuItem>
              <ContextMenuSeparator />
              {playlists.map((playlist) => (
                <ContextMenuItem key={playlist}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 15V6M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 12H3M16 6H3M12 18H3" />
                  </svg>
                  {playlist}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem>Play Next</ContextMenuItem>
          <ContextMenuItem>Play Later</ContextMenuItem>
          <ContextMenuItem>Create Station</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Like</ContextMenuItem>
          <ContextMenuItem>Share</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

export default TrackItem;
