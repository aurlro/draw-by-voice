class AudioRecorderProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.bufferSize = 4096;
        this.buffer = new Float32Array(this.bufferSize);
        this.bufferIndex = 0;
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input && input.length > 0) {
            const inputChannel = input[0];

            // Buffer the input
            // Note: inputChannel.length is usually 128 (render quantum)
            for (let i = 0; i < inputChannel.length; i++) {
                this.buffer[this.bufferIndex++] = inputChannel[i];

                // When buffer is full, flush
                if (this.bufferIndex >= this.bufferSize) {
                    this.flush();
                }
            }
        }
        return true;
    }

    flush() {
        // Send buffer to main thread
        // We create a copy to avoid race conditions with standard array buffers (though slice does copy)
        const bufferToSend = this.buffer.slice(0, this.bufferIndex);
        this.port.postMessage(bufferToSend);
        this.bufferIndex = 0;
    }
}

registerProcessor('audio-recorder-processor', AudioRecorderProcessor);
