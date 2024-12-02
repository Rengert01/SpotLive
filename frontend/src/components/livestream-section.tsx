import LivestreamCard from '@/components/livestream-card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useAudioStore } from '@/stores/audio-store';

interface LivestreamSectionProps {
  title: string;
  subtitle: string;
  livestreams: Livestream[];
}

export default function LivestreamSection({
  title,
  subtitle,
  livestreams,
}: LivestreamSectionProps) {
  const { audio, setAudio, togglePlayPause } = useAudioStore();

  const handleLivestreamClick = (livestream: Livestream) => {
    console.log(livestream)
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
          {livestreams.map((livestream) => (
            <LivestreamCard key={livestream.id} livestream={livestream} onClick={handleLivestreamClick} />
          ))}
          <ScrollBar orientation="horizontal" />
        </div>
      </ScrollArea>
    </div>
  );
}
