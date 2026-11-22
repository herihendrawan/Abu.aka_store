export default function WaFloat({ number }) {
  if (!number) return null;
  return (
    <a
      href={`https://wa.me/${number}?text=${encodeURIComponent("Assalamu'alaikum, saya ingin bertanya.")}`}
      target="_blank" rel="noopener noreferrer" aria-label="Chat WhatsApp"
      className="fixed bottom-4 right-4 z-50 flex h-12 w-12 md:bottom-5 md:right-5 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5 14.2c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.3-1-2.5s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.5 1.9 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.5.2.5.3.1.1.1.6-.1 1.2z"/></svg>
    </a>
  );
}
