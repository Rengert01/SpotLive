import Track from '@/components/ui/track';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useAudioStore } from '@/stores/audio-store';

interface TrackSectionProps {
  title: string;
  subtitle: string;
  tracks: TrackType[];
}

export default function TrackSection({
  title,
  subtitle,
  tracks,
}: TrackSectionProps) {
  const { audio, setAudio, togglePlayPause } = useAudioStore();

  const handleTrackClick = (track: TrackType) => {
    setAudio({
      ...audio,
      isPlaying: audio.audioSrc === track.id && audio.isPlaying,
      audioSrc: track.id,
      audioTitle: track.title,
      audioArtist: track.artist.username,
      audioCoverSrc: track.cover,
      duration: track.duration,
      playbackPosition: 0,
      progress: 0,
      isLivestream: false,
    });

    togglePlayPause();
  };

  return (
    <div>
      <div className="space-y-1">
        <h2 className="text-3xl font-bold text-black">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Separator className="my-4" />
      <ScrollArea className="w-full">
        <div className="flex w-max space-x-4 mb-4">
          {tracks.map((track) => (
            <Track key={track.id} track={track} onClick={handleTrackClick} />
          ))}
          <ScrollBar orientation="horizontal" />
        </div>
      </ScrollArea>
    </div>
  );
}
