import LivestreamCard from '@/components/livestream-card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
// import { useAudioStore } from '@/stores/audio-store';
import socket from '@/config/socket';
import { useToast } from '@/hooks/use-toast';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useBlocker, useNavigate } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  const { toast } = useToast();
  const [listening, setListening] = useState(false);
  const blocker = useBlocker(listening);
  const navigate = useNavigate();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [nextLocation, setNextLocation] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioBuffer[]>([]); // Queue to handle continuous playback
  const isPlayingRef = useRef(false);

  const [currLivestream, setCurrLivestream] = useState<Livestream | null>(null);

  const playFromQueue = useCallback(() => {
    if (!audioContextRef.current || audioQueueRef.current.length === 0) return;

    isPlayingRef.current = true;

    const audioBuffer = audioQueueRef.current.shift(); // Get the next buffer
    if (!audioBuffer) {
      isPlayingRef.current = false;
      return;
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);

    source.onended = () => {
      if (audioQueueRef.current.length > 0) {
        playFromQueue(); // Continue playback
      } else {
        isPlayingRef.current = false; // No more buffers to play
      }
    };

    source.start();
  }, []);

  useEffect(() => {
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    socket.on('audio-data', async (audioData: ArrayBuffer) => {
      try {
        if (!audioContextRef.current) return;
        console.log(audioData);

        // Decode the audio data
        const decodedAudio =
          await audioContextRef.current.decodeAudioData(audioData);
        audioQueueRef.current.push(decodedAudio);

        // If not already playing, start playback
        if (!isPlayingRef.current) {
          playFromQueue();
        }
      } catch (err) {
        console.error('Error decoding audio data:', err);
      }
    });

    return () => {
      // Cleanup: Stop audio context and socket listener
      audioContext.close();
      socket.off('audio-data');
    };
  }, [playFromQueue]);

  const joinLivestream = (livestream: Livestream) => {
    socket.emit('join-livestream', livestream.id);

    socket.on('success-join-livestream', (id: string, title: string) => {
      setListening(true);
      setCurrLivestream(livestream);
      toast({
        title: 'Joined Livestream!',
        description: 'You are now listening to ' + title + ' ' + id,
      });
    });

    socket.on('error-join-livestream', (message: string) => {
      toast({
        title: 'Something went wrong!',
        description: message,
      });
    });
  };

  const leaveLivestream = useCallback(
    (livestream: Livestream) => {
      socket.emit('leave-livestream', livestream.id);

      socket.on('success-leave-livestream', () => {
        setListening(false);
        setCurrLivestream(null);
        toast({
          title: 'Stopped Listening to Livestream!',
          description: 'We are sad to see you go :(',
        });
      });

      socket.on('error-leave-livestream', (message: string) => {
        toast({
          title: 'Something went wrong!',
          description: message,
        });
      });
    },
    [toast]
  );

  const handleLivestreamClick = (livestream: Livestream) => {
    console.log(livestream);

    if (!listening) {
      joinLivestream(livestream);
    } else {
      leaveLivestream(livestream);
    }

    socket.on('end-livestream', () => {
      setListening(false);
      setCurrLivestream(null);
      toast({
        title: 'Livestream Ended!',
        description: 'Hope you enjoyed it!',
      });
    });
  };

  useEffect(() => {
    if (blocker.state === 'blocked') {
      console.log('Navigation is blocked');
      setIsPromptOpen(true);
      setNextLocation(blocker.location.pathname);
    }
  }, [blocker]);

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      if (currLivestream) leaveLivestream(currLivestream);
    });

    return () => {
      window.removeEventListener('beforeunload', () => {
        if (currLivestream) leaveLivestream(currLivestream);
      });
    };
  }, [leaveLivestream, currLivestream]);

  const handleConfirmLeave = () => {
    setIsPromptOpen(false);

    if (currLivestream) leaveLivestream(currLivestream);

    if (nextLocation) {
      navigate(nextLocation); // Navigate to the stored location
    }

    if (blocker.state === 'blocked') blocker.proceed();
  };

  const handleCancelLeave = () => {
    setIsPromptOpen(false); // Stay on the current page
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
            <LivestreamCard
              key={livestream.id}
              livestream={livestream}
              onClick={handleLivestreamClick}
            />
          ))}
          <ScrollBar orientation="horizontal" />
        </div>
      </ScrollArea>

      {/* Navigation Confirmation Modal */}
      <Dialog open={isPromptOpen} onOpenChange={handleCancelLeave}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to leave?</DialogTitle>
            <DialogDescription>
              Leaving the page will stop your livestream.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCancelLeave}>Stay</Button>
            <Button variant="destructive" onClick={handleConfirmLeave}>
              Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
