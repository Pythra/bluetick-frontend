export default function MessageBubbleContent({ message, brandName }) {
  if (!message) return null;

  const body = message.body?.trim();
  const attachments = message.attachments || [];
  const voiceFromAttachment = attachments.find((item) => item.type === 'voice');
  const voiceUrl = message.voiceNoteUrl || voiceFromAttachment?.url || null;
  const nonVoiceAttachments = attachments.filter(
    (item) => item.type !== 'voice' || (voiceUrl && item.url !== voiceUrl)
  );

  return (
    <>
      {body ? <p className="chat-bubble-body">{message.body}</p> : null}
      {voiceUrl ? (
        <audio className="chat-bubble-audio" src={voiceUrl} controls preload="metadata" />
      ) : null}
      {nonVoiceAttachments.map((attachment, index) => {
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
      {!body && !voiceUrl && !nonVoiceAttachments.length ? (
        <p className="chat-bubble-body chat-bubble-muted">Sent an attachment</p>
      ) : null}
    </>
  );
}
