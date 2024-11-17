import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
} from 'lucide-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const playlist = [
    '/public/test.mp3',
    '/public/song1.mp3',
    '/public/song2.mp3',
    '/public/song3.mp3',
  ];

  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;

      if (currentTime > 10) {
        // Restart the current song
        audioRef.current.currentTime = 0;
      } else {
        // Skip to the previous song
        let newIndex = currentSongIndex - 1;
        if (newIndex < 0) newIndex = playlist.length - 1; // Wrap to the last song
        setCurrentSongIndex(newIndex);
        loadSong(newIndex);
      }
    }
  };

  const handleSkipForward = () => {
    console.log('Skipped to next song');
    const newIndex = (currentSongIndex + 1) % playlist.length;
    setCurrentSongIndex(newIndex);
    loadSong(newIndex);
  };

  const loadSong = (index: number) => {
    if (audioRef.current) {
      audioRef.current.src = playlist[index];
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  };

  const updateDuration = () => {
    if (audioRef.current) {
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  useEffect(() => {
    let audioRefValue = null;

    if (audioRef.current) {
      audioRefValue = audioRef.current;
      audioRefValue.addEventListener('timeupdate', updateDuration);
    }
    return () => {
      if (audioRefValue) {
        audioRefValue.removeEventListener('timeupdate', updateDuration);
      }
    };
  }, []);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    const volumeValue = newVolume / 100;
    if (audioRef.current) {
      audioRef.current.volume = volumeValue;
    }
    setVolume(newVolume);
    console.log(`Volume set to ${newVolume}%`);
  };

  const handleSeek = (value: number[]) => {
    const newProgress = value[0];
    if (audioRef.current) {
      audioRef.current.currentTime =
        (newProgress / 100) * audioRef.current.duration;
    }
    setProgress(newProgress);
  };

  return (
    <div className="flex items-center justify-between text-white h-full">
      <audio ref={audioRef} src="/test.mp3" />

      <div className="flex items-center space-x-4">
        <img
          src="/image.jpg"
          alt="Song Image"
          className="w-12 h-12 rounded-md object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-black">Song Name</p>
          <p className="text-xs text-gray-400">Artist Name</p>
        </div>
      </div>

      <Button variant="ghost" onClick={handleSkipBack}>
        <SkipBack className="stroke-black" />
      </Button>

      <Button variant="ghost" onClick={togglePlayPause}>
        {isPlaying ? (
          <Pause className="stroke-black" />
        ) : (
          <Play className="stroke-black" />
        )}
      </Button>

      <Button variant="ghost" onClick={handleSkipForward} size="sm">
        <SkipForward className="stroke-black" />
      </Button>

      <div className="flex-1 mx-4">
        <Slider
          max={100}
          step={1}
          value={[progress]}
          onValueChange={handleSeek}
          aria-label="Seek"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Volume1 className="stroke-black" />
        <Slider
          max={100}
          step={1}
          value={[volume]}
          onValueChange={handleVolumeChange}
          aria-label="Volume"
          className="w-24"
        />
        <Volume2 className="stroke-black" />
      </div>
    </div>
  );
}
