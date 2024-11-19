import { useState } from 'react';
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
import { useAudioStore } from '@/stores/audio-store';

export default function MusicPlayer() {
  const {
    audio,
    togglePlayPause,
    handleVolumeChange,
    handleSeek,
    updatePlaybackPosition,
  } = useAudioStore();

  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const playlist = [
    '/public/test.mp3',
    '/public/song1.mp3',
    '/public/song2.mp3',
    '/public/song3.mp3',
  ];

  const handleSkipBack = () => {
    if (audio.ref.current) {
      const currentTime = audio.ref.current.currentTime;

      if (currentTime > 10) {
        // Restart the current song
        audio.ref.current.currentTime = 0;
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
    const newIndex = (currentSongIndex + 1) % playlist.length;
    setCurrentSongIndex(newIndex);
    loadSong(newIndex);
  };

  const loadSong = (index: number) => {
    if (audio.ref.current) {
      audio.ref.current.src = playlist[index];
      audio.ref.current.load();
      if (audio.isPlaying) {
        audio.ref.current.play();
      }
    }
  };

  return (
    <div className="flex items-center justify-between text-white h-full">
      <audio
        ref={audio.ref}
        onTimeUpdate={updatePlaybackPosition}
        onEnded={handleSkipForward}
      />

      <div className="flex items-center space-x-3">
        <img
          src={`http://localhost:3001/uploads/image/${audio.audioCoverSrc}`}
          alt="Song Image"
          className="w-12 h-12 rounded-md object-cover"
        />
        <div className="w-[130px] space-y-1">
          <p className="text-sm font-semibold text-black truncate">
            {audio.audioTitle}
          </p>
          <p className="text-xs text-muted-foreground">{audio.audioArtist}</p>
        </div>
      </div>

      <Button variant="ghost" onClick={handleSkipBack}>
        <SkipBack className="stroke-black" />
      </Button>

      <Button variant="ghost" onClick={togglePlayPause}>
        {audio.isPlaying ? (
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
          value={[audio.progress]}
          onValueChange={handleSeek}
          aria-label="Seek"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Volume1 className="stroke-black" />
        <Slider
          max={100}
          step={1}
          value={[audio.volume * 100]}
          onValueChange={handleVolumeChange}
          aria-label="Volume"
          className="w-24"
        />
        <Volume2 className="stroke-black" />
      </div>
    </div>
  );
}
