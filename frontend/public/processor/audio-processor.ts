export default class AudioProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0]; // Get the input audio
    if (input) {
      const channelData = input[0]; // Access the first channel
      if (channelData) {
        // Post audio data to the main thread
        this.port.postMessage(channelData.slice(0)); // Send a copy of the data
      }
    }
    return true; // Keep the processor alive
  }
}

registerProcessor('audio-processor', AudioProcessor);
