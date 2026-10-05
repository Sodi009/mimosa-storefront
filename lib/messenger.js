// Opens Facebook Messenger with the shop's Page. Unlike wa.me, Messenger
// links can't prefill the message text (Facebook removed that), so the
// order message is copied to the clipboard instead and the customer
// pastes it in once Messenger opens.
const MESSENGER_PAGE_ID = process.env.NEXT_PUBLIC_MESSENGER_PAGE_ID || "61571651470942";

export function getMessengerUrl() {
  return `https://m.me/${MESSENGER_PAGE_ID}`;
}
