import { useEffect, useRef, useState } from 'react';
import { MdAttachFile, MdMic, MdSend, MdStop, MdClose } from 'react-icons/md';
import { blobToDataUrl, CHAT_FILE_ACCEPT, fileToAttachmentPayload, validateChatFile } from '../../utils/chatMedia';
import './ChatComposeBar.css';

export default function ChatComposeBar({
  message,
  onMessageChange,
  onSend,
  sending = false,
  disabled = false,
  placeholder = 'Type your message...',
  sendLabel = 'Send',
  variant = 'panel',
}) {
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordChunksRef = useRef([]);
  const [pendingAttachment, setPendingAttachment] = useState(null);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const canSend = !disabled && !sending && (message.trim() || pendingAttachment);

  const handlePickFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setError('');
    try {
      const payload = await fileToAttachmentPayload(file);
      setPendingAttachment(payload);
    } catch (pickError) {
      setError(pickError.message || 'Could not attach file');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const startRecording = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recordChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordChunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        try {
          const blob = new Blob(recordChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          validateChatFile({ size: blob.size }, 'voice');
          const dataUrl = await blobToDataUrl(blob);
          setPendingAttachment({
            attachment: dataUrl,
            attachmentType: 'voice',
            attachmentName: `voice-note-${Date.now()}.webm`,
          });
        } catch (recordError) {
          setError(recordError.message || 'Could not save voice note');
        }
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch (micError) {
      setError(micError.message || 'Microphone access denied');
    }
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSend = async () => {
    if (!canSend) return;
    setError('');
    try {
      await onSend({
        body: message.trim(),
        ...pendingAttachment,
      });
      setPendingAttachment(null);
    } catch (sendError) {
      setError(sendError.message || 'Failed to send');
    }
  };

  return (
    <div className={`chat-compose chat-compose-${variant}`}>
      {pendingAttachment ? (
        <div className="chat-compose-preview">
          <span>
            Attached: {pendingAttachment.attachmentName || pendingAttachment.attachmentType}
          </span>
          <button type="button" className="chat-compose-icon-btn" onClick={() => setPendingAttachment(null)} aria-label="Remove attachment">
            <MdClose size={16} />
          </button>
        </div>
      ) : null}

      {error ? <p className="chat-compose-error">{error}</p> : null}

      <textarea
        rows={variant === 'drawer' ? 2 : 3}
        value={message}
        onChange={(event) => onMessageChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled || sending}
      />

      <div className="chat-compose-actions">
        <input
          ref={fileInputRef}
          type="file"
          accept={CHAT_FILE_ACCEPT}
          hidden
          onChange={handlePickFile}
        />
        <button
          type="button"
          className="chat-compose-icon-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || sending || recording}
          aria-label="Attach file"
        >
          <MdAttachFile size={18} />
        </button>
        <button
          type="button"
          className={`chat-compose-icon-btn${recording ? ' recording' : ''}`}
          onClick={toggleRecording}
          disabled={disabled || sending}
          aria-label={recording ? 'Stop recording' : 'Record voice note'}
        >
          {recording ? <MdStop size={18} /> : <MdMic size={18} />}
        </button>
        <button
          type="button"
          className="chat-compose-send"
          onClick={handleSend}
          disabled={!canSend}
        >
          <MdSend size={16} />
          {sending ? 'Sending...' : sendLabel}
        </button>
      </div>
    </div>
  );
}
