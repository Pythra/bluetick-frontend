export function getDisplayName(name, email) {
  const trimmedName = String(name || '').trim();
  if (trimmedName && !trimmedName.includes('@')) {
    return trimmedName;
  }

  const source = String(email || trimmedName || '').trim();
  if (source.includes('@')) {
    const local = source.split('@')[0];
    return local.replace(/[._-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return trimmedName || 'User';
}

export function getInitials(name, email) {
  const display = getDisplayName(name, email);
  const parts = display.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
  }

  return display.slice(0, 2).toUpperCase();
}

export function getAvatarColor(seed) {
  const palette = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#0891b2', '#059669', '#4f46e5'];
  const value = String(seed || 'user');
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = value.charCodeAt(index) + ((hash << 5) - hash);
  }

  return palette[Math.abs(hash) % palette.length];
}

export function isOwnMessage(senderType, viewerRole) {
  return senderType === viewerRole;
}
