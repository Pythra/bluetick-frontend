import { useAuth } from '../../contexts/AuthContext';
import { resolveChatMediaUrl } from '../../utils/chatMedia';
import VoiceNotePlayer, { ChatMediaImage, ChatMediaVideo } from './VoiceNotePlayer';

export default function MessageBubbleContent({ message }) {
  const { apiUrl } = useAuth();

  if (!message) return null;

  const body = message.body?.trim();
  const attachments = (message.attachments || []).filter((item) => item.type !== 'voice');

  return (
    <>
      {body ? <p className="chat-bubble-body">{message.body}</p> : null}
      <VoiceNotePlayer message={message} />
      {attachments.map((attachment, index) => {
        const key = `${attachment.url || attachment.name}-${index}`;
        if (attachment.type === 'image') {
          return <ChatMediaImage key={key} attachment={attachment} apiUrl={apiUrl} />;
        }
        if (attachment.type === 'video') {
          return <ChatMediaVideo key={key} attachment={attachment} apiUrl={apiUrl} />;
        }
        const fileUrl = resolveChatMediaUrl(attachment.url, apiUrl);
        return (
          <a key={key} href={fileUrl || attachment.url} target="_blank" rel="noopener noreferrer" className="chat-bubble-file">
            {attachment.name || 'Download file'}
          </a>
        );
      })}
      {!body && !message.voiceNoteUrl && !attachments.length && !(message.attachments || []).some((item) => item.type === 'voice') ? (
        <p className="chat-bubble-body chat-bubble-muted">Sent an attachment</p>
      ) : null}
    </>
  );
}
