export default function AnnouncementBar({ message }) {
  if (!message) return null;

  return (
    <div className="announcement-bar">
      <p>{message}</p>
    </div>
  );
}
