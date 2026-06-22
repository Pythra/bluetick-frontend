import { useAuth } from '../../contexts/AuthContext';
import { getVoiceNoteSource, resolveChatMediaUrl } from '../../utils/chatMedia';

export default function VoiceNotePlayer({ message }) {
  const { apiUrl } = useAuth();
  const voice = getVoiceNoteSource(message, apiUrl);

  if (!voice?.url) return null;

  const mimeType = voice.mimeType?.includes('webm')
    ? 'audio/webm'
    : voice.mimeType?.includes('mp4') || voice.mimeType?.includes('m4a')
      ? 'audio/mp4'
      : voice.mimeType || 'audio/webm';

  return (
    <div className="chat-voice-note">
      <span className="chat-voice-note-label">Voice note</span>
      <audio className="chat-bubble-audio" controls preload="metadata" playsInline>
        <source src={voice.url} type={mimeType} />
        <a href={voice.url} target="_blank" rel="noopener noreferrer">
          Download voice note
        </a>
      </audio>
    </div>
  );
}

export function ChatMediaImage({ attachment, apiUrl }) {
  const src = resolveChatMediaUrl(attachment?.url, apiUrl);
  if (!src) return null;
  return (
    <a href={src} target="_blank" rel="noopener noreferrer" className="chat-bubble-media-link">
      <img src={src} alt={attachment.name || 'Image'} className="chat-bubble-image" />
    </a>
  );
}

export function ChatMediaVideo({ attachment, apiUrl }) {
  const src = resolveChatMediaUrl(attachment?.url, apiUrl);
  if (!src) return null;
  return (
    <video className="chat-bubble-video" src={src} controls playsInline preload="metadata" />
  );
}
