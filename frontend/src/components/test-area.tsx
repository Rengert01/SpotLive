import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Mic } from 'lucide-react';
import { useEffect, useState } from 'react';

type TestAreaProps = {
  type: 'microphone' | 'obs';
};

const TestMic: React.FC = () => {
  const [micLevel, setMicLevel] = useState(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [workletNode, setWorkletNode] = useState<AudioWorkletNode | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    return () => {
      stopMicTesting(); // Cleanup resources on unmount
    };
  }, []);

  const setupMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const context = new AudioContext();

      await context.audioWorklet.addModule('/processor/mic-meter-processor.ts'); // Path to your processor

      const source = context.createMediaStreamSource(stream);
      const worklet = new AudioWorkletNode(context, 'mic-meter-processor', {
        parameterData: {
          clipLevel: 0.98,
          averaging: 0.9,
          clipLag: 750
        }
      });

      // Listen for volume updates from the processor
      worklet.port.onmessage = (event: MessageEvent) => {
        const volumes = event.data; // Volume is RMS value (0 to 1)
        setMicLevel(volumes.volume[0].value * 100); // Convert to percentage
      };

      source.connect(worklet); // Connect the source to the worklet
      setAudioContext(context);
      setWorkletNode(worklet);

      console.log('Microphone audio capture started with Audio Worklet');
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const startMicTesting = async () => {
    if (!audioContext) {
      await setupMicrophone();
    }
    setIsTesting(true);
  };

  const stopMicTesting = () => {
    setIsTesting(false);
    setMicLevel(0);

    if (workletNode) {
      workletNode.disconnect();
      setWorkletNode(null);
    }

    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
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
            {isTesting ? 'Stop Test' : 'Test Mic'}
          </Button>
          <div className="w-full flex flex-col justify-center">
            <Label className="ml-1 text-muted-foreground leading-3 h-4">
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
    case 'microphone':
      return <TestMic />;
    case 'obs':
      return <TestOBS />;
    default:
      return null;
  }
}
