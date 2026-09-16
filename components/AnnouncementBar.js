import { getAnnouncement } from "@/lib/announcement";

export default async function AnnouncementBar() {
  const message = await getAnnouncement();
  if (!message) return null;

  return (
    <div className="announcement-bar">
      <p>{message}</p>
    </div>
  );
}
