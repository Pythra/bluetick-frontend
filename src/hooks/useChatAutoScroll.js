import { useCallback, useEffect, useRef } from 'react';

export default function useChatAutoScroll(messageCount, threadKey) {
  const containerRef = useRef(null);
  const stickToBottomRef = useRef(true);

  const onScroll = useCallback(() => {
    const element = containerRef.current;
    if (!element) return;

    const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
    stickToBottomRef.current = distanceFromBottom < 72;
  }, []);

  useEffect(() => {
    stickToBottomRef.current = true;
  }, [threadKey]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !stickToBottomRef.current) return;

    element.scrollTop = element.scrollHeight;
  }, [messageCount, threadKey]);

  return { containerRef, onScroll };
}
