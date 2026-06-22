export default function MessageBubbleContent({ message, brandName }) {
  if (!message) return null;

  const body = message.body?.trim();

  return (
    <>
      {body ? <p className="chat-bubble-body">{message.body}</p> : null}
      {message.voiceNoteUrl ? (
        <audio className="chat-bubble-audio" src={message.voiceNoteUrl} controls preload="metadata" />
      ) : null}
      {(message.attachments || []).map((attachment, index) => {
        const key = `${attachment.url || attachment.name}-${index}`;
        if (attachment.type === 'image') {
          return (
            <a key={key} href={attachment.url} target="_blank" rel="noopener noreferrer" className="chat-bubble-media-link">
              <img src={attachment.url} alt={attachment.name || 'Image'} className="chat-bubble-image" />
            </a>
          );
        }
        if (attachment.type === 'video') {
          return (
            <video key={key} className="chat-bubble-video" src={attachment.url} controls playsInline preload="metadata" />
          );
        }
        if (attachment.type === 'voice') {
          return (
            <audio key={key} className="chat-bubble-audio" src={attachment.url} controls preload="metadata" />
          );
        }
        return (
          <a key={key} href={attachment.url} target="_blank" rel="noopener noreferrer" className="chat-bubble-file">
            {attachment.name || 'Download file'}
          </a>
        );
      })}
      {!body && !message.voiceNoteUrl && !(message.attachments || []).length ? (
        <p className="chat-bubble-body chat-bubble-muted">Sent an attachment</p>
      ) : null}
    </>
  );
}
