export default function TypingIndicator({ name }) {
  if (!name) return null;
  return (
    <div className="messaging-crm-typing" aria-live="polite">
      {name} is typing…
    </div>
  );
}
