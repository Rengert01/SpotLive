import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, SkipBack, SkipForward, Volume1, Volume2 } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
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
    console.log("Skipped to previous song");
  };

  const handleSkipForward = () => {
    console.log("Skipped to next song");
  };

  const updateDuration = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateDuration);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateDuration);
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
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
    setProgress(newProgress);
  };

  return (
    <div className="flex items-center justify-between text-white h-full">

      <audio ref={audioRef} src="/public/test.mp3" />

      <div className="flex items-center space-x-4">
        <img
          src="/public/image.jpg"
          alt="Song Image"
          className="w-12 h-12 rounded-md" 
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
        {isPlaying ? <Pause className="stroke-black" /> : <Play className="stroke-black" />}
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
