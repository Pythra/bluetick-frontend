export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const CHAT_FILE_ACCEPT =
  'image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar';

export const CHAT_MEDIA_LIMITS = {
  image: 5 * 1024 * 1024,
  video: 25 * 1024 * 1024,
  voice: 10 * 1024 * 1024,
  file: 15 * 1024 * 1024,
};

export function validateChatFile(file, kind = 'file') {
  if (!file) return null;
  const limit = CHAT_MEDIA_LIMITS[kind] || CHAT_MEDIA_LIMITS.file;
  if (file.size > limit) {
    const mb = Math.round(limit / (1024 * 1024));
    throw new Error(`File is too large (max ${mb}MB)`);
  }
  return file;
}

export async function fileToAttachmentPayload(file) {
  validateChatFile(file, file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file');
  const dataUrl = await readFileAsDataUrl(file);
  return {
    attachment: dataUrl,
    attachmentType: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file',
    attachmentName: file.name,
  };
}

export function messagePreviewText(message) {
  if (!message) return '—';
  if (message.body?.trim()) return message.body.trim().slice(0, 72);
  if (message.voiceNoteUrl || message.attachments?.some((item) => item.type === 'voice')) {
    return 'Voice note';
  }
  const first = message.attachments?.[0];
  if (first?.type === 'image') return 'Image';
  if (first?.type === 'video') return 'Video';
  if (first?.name) return first.name;
  if (first) return 'Attachment';
  return '—';
}

export function resolveChatMediaUrl(url, apiUrl) {
  const trimmed = String(url || '').trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('data:')) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/^http:\/\//i, 'https://');
  }

  if (trimmed.startsWith('/')) {
    const base = String(apiUrl || import.meta.env.VITE_API_URL || 'https://bluetick.fly.dev').replace(/\/$/, '');
    return `${base}${trimmed}`;
  }

  if (
    trimmed.includes('.cloudfront.net/') ||
    trimmed.includes('amazonaws.com/') ||
    /^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(trimmed)
  ) {
    return `https://${trimmed.replace(/^\/+/, '')}`;
  }

  return trimmed;
}

export function getVoiceNoteSource(message, apiUrl) {
  const attachments = message?.attachments || [];
  const voiceAttachment = attachments.find((item) => item.type === 'voice');
  const rawUrl = message?.voiceNoteUrl || voiceAttachment?.url || null;
  const url = resolveChatMediaUrl(rawUrl, apiUrl);

  if (!url) return null;

  return {
    url,
    mimeType: voiceAttachment?.mimeType || 'audio/webm',
    name: voiceAttachment?.name || 'Voice note',
  };
}
