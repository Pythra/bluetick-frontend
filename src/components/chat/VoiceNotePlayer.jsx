import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getVoiceNoteSource } from '../../utils/chatMedia';

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export default function VoiceNotePlayer({ message }) {
  const { apiUrl } = useAuth();
  const voice = getVoiceNoteSource(message, apiUrl);
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const voiceUrl = voice?.url || null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !voiceUrl) return undefined;

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onEnded = () => setPlaying(false);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [voiceUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  if (!voiceUrl) return null;

  const mimeType = voice.mimeType?.includes('webm')
    ? 'audio/webm'
    : voice.mimeType?.includes('mp4') || voice.mimeType?.includes('m4a')
      ? 'audio/mp4'
      : voice.mimeType || 'audio/webm';

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const handleSeek = (event) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
  };

  return (
    <div className="chat-voice-player">
      <audio ref={audioRef} preload="metadata" playsInline>
        <source src={voiceUrl} type={mimeType} />
      </audio>
      <div className="chat-voice-player-controls">
        <button type="button" className="chat-voice-player-btn" onClick={togglePlay}>
          {playing ? '❚❚' : '▶'}
        </button>
        <div
          className="chat-voice-player-progress"
          onClick={handleSeek}
          onKeyDown={() => {}}
          role="presentation"
        >
          <div className="chat-voice-player-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="chat-voice-player-meta">
        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        <div className="chat-voice-player-speeds">
          {[1, 1.5, 2].map((value) => (
            <button
              key={value}
              type="button"
              className={speed === value ? 'active' : ''}
              onClick={() => setSpeed(value)}
            >
              {value}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { ChatMediaImage, ChatMediaVideo } from './VoiceNotePlayerMedia.jsx';
