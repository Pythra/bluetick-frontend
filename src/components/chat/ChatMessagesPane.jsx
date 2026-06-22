import useChatAutoScroll from '../../hooks/useChatAutoScroll';
import './ChatMessages.css';

export default function ChatMessagesPane({
  className = '',
  threadKey,
  messageCount = 0,
  children,
}) {
  const { containerRef, onScroll } = useChatAutoScroll(messageCount, threadKey);

  return (
    <div
      ref={containerRef}
      className={`chat-messages-pane ${className}`.trim()}
      onScroll={onScroll}
    >
      {children}
    </div>
  );
}
