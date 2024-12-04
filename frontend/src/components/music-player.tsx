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
import axios from '@/config/axios';

export default function MusicPlayer() {
  const {
    audio,
    setAudio,
    togglePlayPause,
    handleVolumeChange,
    handleSeek,
    updatePlaybackPosition,
  } = useAudioStore();

  const handleSkipBack = async () => {
    // random ID between 4 and 7
    let randomId = Math.floor(Math.random() * (7 - 4) + 4);
    while (randomId === Number(audio.audioSrc)) {
      randomId = Math.floor(Math.random() * (7 - 4) + 4);
    }

    const music = await axios.get(`/api/music/info/${randomId}`);

    console.log(music.data.music);

    setAudio({
      ...audio,
      isPlaying: false,
      audioSrc: randomId.toString(),
      audioTitle: music.data.music.title,
      audioArtist: music.data.music.artist.username,
      audioCoverSrc: music.data.music.cover,
      duration: music.data.music.duration,
      playbackPosition: 0,
    });

    togglePlayPause();
  };

  const handleSkipForward = async () => {
    // random ID between 4 and 7
    let randomId = Math.floor(Math.random() * (7 - 4) + 4);
    while (randomId === Number(audio.audioSrc)) {
      randomId = Math.floor(Math.random() * (7 - 4) + 4);
    }

    const music = await axios.get(`/api/music/info/${randomId}`);

    console.log(music.data.music);

    setAudio({
      ...audio,
      isPlaying: false,
      audioSrc: randomId.toString(),
      audioTitle: music.data.music.title,
      audioArtist: music.data.music.artist.username,
      audioCoverSrc: music.data.music.cover,
      duration: music.data.music.duration,
      playbackPosition: 0,
    });

    togglePlayPause();
  };

  return (
    <div className="flex items-center justify-between text-white h-full">
      <audio
        ref={audio.ref}
        onTimeUpdate={updatePlaybackPosition}
        onEnded={handleSkipForward}
      />

      <div className="hidden md:flex items-center space-x-3">
        <img
          src={`${import.meta.env.VITE_APP_API_URL}/api/uploads/image/${audio.audioCoverSrc}`}
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
