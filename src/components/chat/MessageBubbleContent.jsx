import { useAuth } from '../../contexts/AuthContext';
import { resolveChatMediaUrl } from '../../utils/chatMedia';
import VoiceNotePlayer from './VoiceNotePlayer';
import { ChatMediaImage, ChatMediaVideo } from './VoiceNotePlayerMedia.jsx';

function formatFileSize(size) {
  const bytes = Number(size);
  if (!Number.isFinite(bytes) || bytes <= 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MessageBubbleContent({ message }) {
  const { apiUrl } = useAuth();

  if (!message) return null;

  const body = message.body?.trim();
  const attachments = (message.attachments || []).filter((item) => item.type !== 'voice');

  return (
    <>
      {body ? <p className="chat-bubble-body">{message.body}</p> : null}
      {message.editedAt ? (
        <span className="chat-bubble-edited">Edited</span>
      ) : null}
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
        const sizeLabel = formatFileSize(attachment.size);
        return (
          <div key={key} className="chat-attachment-card">
            <div className="chat-attachment-card-meta">
              <strong>{attachment.name || 'Attachment'}</strong>
              {sizeLabel ? <span>{sizeLabel}</span> : null}
            </div>
            <div className="chat-attachment-card-actions">
              {fileUrl ? (
                <>
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer">Open</a>
                  <a href={fileUrl} download={attachment.name || 'download'}>Download</a>
                </>
              ) : null}
            </div>
          </div>
        );
      })}
      {!body && !message.voiceNoteUrl && !attachments.length && !(message.attachments || []).some((item) => item.type === 'voice') ? (
        <p className="chat-bubble-body chat-bubble-muted">Sent an attachment</p>
      ) : null}
    </>
  );
}
