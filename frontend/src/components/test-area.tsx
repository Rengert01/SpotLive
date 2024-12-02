import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Mic } from "lucide-react";
import { useEffect, useState, useRef } from "react";

type TestAreaProps = {
  type: "microphone" | "obs";
};

const TestMic: React.FC = () => {
  const [micLevel, setMicLevel] = useState(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopMicTesting(); // Cleanup resources on unmount
    };
  }, []);

  const setupMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);

      const analyserNode = context.createAnalyser();
      analyserNode.fftSize = 256;
      source.connect(analyserNode);

      setAudioContext(context);
      setAnalyser(analyserNode);

      // Start measuring audio level
      monitorMicLevel(analyserNode);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const monitorMicLevel = (analyserNode: AnalyserNode) => {
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

    const updateMicLevel = () => {
      analyserNode.getByteFrequencyData(dataArray);
      const volume = Math.max(...dataArray) / 255;
      setMicLevel(volume * 100);

      animationFrameRef.current = requestAnimationFrame(updateMicLevel);
    };

    updateMicLevel();
  };

  const startMicTesting = async () => {
    if (!audioContext) {
      await setupMicrophone();
    }
    setIsTesting(true);
    if (analyser) {
      monitorMicLevel(analyser);
    }
  };

  const stopMicTesting = () => {
    setIsTesting(false);
    setMicLevel(0);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
      setAnalyser(null);
    }
  };

  const toggleMicTesting = async () => {
    if (isTesting) {
      stopMicTesting();
    } else {
      await startMicTesting();
    }
  };

  return (
    <>
      <Separator />
      <div className="grid gap-4">
        <p className="text-sm text-muted-foreground">Test your Input</p>
        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={toggleMicTesting}>
            <Mic className="h-4 w-4 mr-2" />
            {isTesting ? "Stop Test" : "Test Mic"}
          </Button>
          <div className="w-full flex flex-col justify-center">
            <Label className="ml-1 text-muted-foreground leading-6">
              Microphone Level
            </Label>
            <Progress value={micLevel} className="transition-none" />
          </div>
        </div>
      </div>
      <Separator />
    </>
  );
};

const TestOBS: React.FC = () => {
  return (
    <>
      <Separator />
      <div className="grid gap-4 py-4">
        <p className="text-muted-foreground">OBS is currently unsupported</p>
      </div>
      <Separator />
    </>
  );
};

export default function TestArea({ type }: TestAreaProps) {
  switch (type) {
    case "microphone":
      return <TestMic />;
    case "obs":
      return <TestOBS />;
    default:
      return null;
  }
}