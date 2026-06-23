import { resolveChatMediaUrl } from '../../utils/chatMedia';

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
