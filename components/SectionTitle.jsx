export default function SectionTitle({ children }) {
  return (
    <div className="mb-6">
      <h2 className="font-heading text-2xl font-bold text-brand md:text-3xl">{children}</h2>
      <span className="mt-2 block h-1 w-10 rounded bg-gold" />
    </div>
  );
}
