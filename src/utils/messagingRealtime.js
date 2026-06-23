export function computeClientUnreadCount(threads = []) {
  return threads.reduce((sum, thread) => sum + (thread.unreadCount || 0), 0);
}

export function patchClientThreadSummaries(threads, payload) {
  if (!payload?.threadId || !payload?.message) {
    return { threads, changed: false };
  }

  const index = threads.findIndex((thread) => thread.threadId === payload.threadId);
  if (index < 0) {
    return { threads, changed: false, needsReload: true };
  }

  const message = payload.message;
  const existing = threads[index];
  const alreadySeen = existing.lastMessage?.id === message.id;
  const incomingUnread = message.senderType === 'partner' && !message.readAt ? 1 : 0;

  const next = [...threads];
  next[index] = {
    ...existing,
    lastMessage: message,
    lastMessageAt: payload.lastMessageAt || message.createdAt || existing.lastMessageAt,
    unreadCount: alreadySeen
      ? existing.unreadCount || 0
      : (existing.unreadCount || 0) + incomingUnread,
  };
  next.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));

  return { threads: next, changed: true };
}

export function upsertClientThreadSummary(threads, threadDetail) {
  if (!threadDetail?.threadId) return threads;

  const summary = {
    threadId: threadDetail.threadId,
    subject: threadDetail.subject,
    participantEmail: threadDetail.participantEmail,
    lastMessage: threadDetail.messages?.[threadDetail.messages.length - 1] || null,
    lastMessageAt: threadDetail.lastMessageAt,
    unreadCount: 0,
  };

  const index = threads.findIndex((thread) => thread.threadId === threadDetail.threadId);
  if (index < 0) {
    return [summary, ...threads];
  }

  const next = [...threads];
  next[index] = { ...next[index], ...summary };
  next.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
  return next;
}

export function appendThreadMessage(activeThread, payload, { hideSenderTypes = [] } = {}) {
  if (!activeThread || activeThread.threadId !== payload.threadId) {
    return activeThread;
  }

  const message = payload.message;
  if (!message || hideSenderTypes.includes(message.senderType)) {
    return activeThread;
  }

  if ((activeThread.messages || []).some((entry) => entry.id === message.id)) {
    return activeThread;
  }

  return {
    ...activeThread,
    messages: [...(activeThread.messages || []), message],
    lastMessageAt: payload.lastMessageAt || message.createdAt || activeThread.lastMessageAt,
  };
}

export function clearThreadUnread(threads, threadId) {
  return threads.map((thread) =>
    thread.threadId === threadId ? { ...thread, unreadCount: 0 } : thread
  );
}

export function patchPartnerThreadSummaries(threads, payload) {
  if (!payload?.threadId || !payload?.message) {
    return { threads, changed: false };
  }

  const index = threads.findIndex((thread) => thread.threadId === payload.threadId);
  if (index < 0) {
    return { threads, changed: false, needsReload: true };
  }

  const message = payload.message;
  const existing = threads[index];
  const next = [...threads];
  next[index] = {
    ...existing,
    lastMessage: message,
    lastMessageAt: payload.lastMessageAt || message.createdAt || existing.lastMessageAt,
  };
  next.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));

  return { threads: next, changed: true };
}

export function patchAdminPartnerInbox(threads, payload) {
  if (!payload?.threadId || !payload?.message) {
    return threads;
  }

  const index = threads.findIndex((thread) => thread.threadId === payload.threadId);
  if (index < 0) {
    return threads;
  }

  const message = payload.message;
  const existing = threads[index];
  const incomingUnread =
    ['partner', 'client'].includes(message.senderType) && !message.readAt && !message.isInternal
      ? 1
      : 0;
  const alreadySeen = existing.lastMessage?.id === message.id;

  const next = [...threads];
  next[index] = {
    ...existing,
    lastMessage: message,
    lastMessageAt: payload.lastMessageAt || message.createdAt || existing.lastMessageAt,
    unreadCount: alreadySeen
      ? existing.unreadCount || 0
      : (existing.unreadCount || 0) + incomingUnread,
  };
  next.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
  return next;
}

export function patchAdminClientPartners(clientPartners, payload) {
  if (!payload?.threadId || !payload?.message || !payload?.partnerApplicationId) {
    return clientPartners;
  }

  const partnerId = String(payload.partnerApplicationId);
  const message = payload.message;
  const incomingUnread = ['client', 'partner'].includes(message.senderType) && !message.readAt ? 1 : 0;

  return clientPartners.map((partner) => {
    if (String(partner.partnerId) !== partnerId) {
      return partner;
    }

    const threadIndex = (partner.threads || []).findIndex(
      (thread) => thread.threadId === payload.threadId
    );

    if (threadIndex < 0) {
      return partner;
    }

    const existing = partner.threads[threadIndex];
    const alreadySeen = existing.lastMessage?.id === message.id;
    const threads = [...partner.threads];
    threads[threadIndex] = {
      ...existing,
      lastMessage: message,
      lastMessageAt: payload.lastMessageAt || message.createdAt || existing.lastMessageAt,
      unreadCount: alreadySeen
        ? existing.unreadCount || 0
        : (existing.unreadCount || 0) + incomingUnread,
    };
    threads.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));

    const unreadCount = threads.reduce((sum, thread) => sum + (thread.unreadCount || 0), 0);
    return { ...partner, threads, unreadCount };
  });
}

export function upsertAdminThreadSummary(threads, threadDetail) {
  if (!threadDetail?.threadId) return threads;

  const index = threads.findIndex((thread) => thread.threadId === threadDetail.threadId);
  if (index < 0) {
    return [threadDetail, ...threads];
  }

  const next = [...threads];
  next[index] = {
    ...next[index],
    ...threadDetail,
    unreadCount: 0,
    lastMessage: threadDetail.messages?.[threadDetail.messages.length - 1] || next[index].lastMessage,
    lastMessageAt: threadDetail.lastMessageAt || next[index].lastMessageAt,
  };
  next.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
  return next;
}

export function clearAdminClientThreadUnread(clientPartners, threadDetail) {
  if (!threadDetail?.threadId || !threadDetail?.partnerId) {
    return clientPartners;
  }

  const partnerId = String(threadDetail.partnerId);
  return clientPartners.map((partner) => {
    if (String(partner.partnerId) !== partnerId) {
      return partner;
    }

    const threads = (partner.threads || []).map((thread) =>
      thread.threadId === threadDetail.threadId ? { ...thread, unreadCount: 0 } : thread
    );
    const unreadCount = threads.reduce((sum, thread) => sum + (thread.unreadCount || 0), 0);
    return { ...partner, threads, unreadCount };
  });
}
