import { useEffect, useRef, useState } from 'react';

const BAR_COUNT = 18;

function formatElapsed(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function VoiceRecordingIndicator({ stream }) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [bars, setBars] = useState(() => Array.from({ length: BAR_COUNT }, () => 0.22));
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
    setElapsedMs(0);
    const timer = window.setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 200);
    return () => window.clearInterval(timer);
  }, [stream]);

  useEffect(() => {
    if (!stream) return undefined;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return undefined;

    const audioContext = new AudioContextClass();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.72;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    let animationFrame = 0;

    const updateBars = () => {
      analyser.getByteFrequencyData(frequencyData);
      const step = Math.max(1, Math.floor(frequencyData.length / BAR_COUNT));
      const nextBars = Array.from({ length: BAR_COUNT }, (_, index) => {
        const sample = frequencyData[index * step] / 255;
        return Math.max(0.18, Math.min(1, sample * 1.35));
      });
      setBars(nextBars);
      animationFrame = window.requestAnimationFrame(updateBars);
    };

    updateBars();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      source.disconnect();
      audioContext.close().catch(() => {});
    };
  }, [stream]);

  return (
    <div className="chat-voice-recording" role="status" aria-live="polite" aria-label="Recording voice note">
      <div className="chat-voice-recording-top">
        <span className="chat-voice-recording-dot" aria-hidden="true" />
        <div className="chat-voice-recording-copy">
          <strong>Recording voice note</strong>
          <span className="chat-voice-recording-time">{formatElapsed(elapsedMs)}</span>
        </div>
      </div>

      <div className="chat-voice-recording-wave" aria-hidden="true">
        {bars.map((scale, index) => (
          <span
            key={index}
            className="chat-voice-recording-bar"
            style={{ '--bar-scale': scale }}
          />
        ))}
      </div>

      <p className="chat-voice-recording-hint">Speak clearly — press stop when finished</p>
    </div>
  );
}
