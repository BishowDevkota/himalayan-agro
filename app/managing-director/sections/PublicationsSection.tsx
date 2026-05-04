import { publications } from "../../../lib/data/sharma";

export default function PublicationsSection() {
  return (
    <section id="publications" className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold mb-6">Publications</h3>
        <div className="space-y-4">
          {publications.map((p, i) => (
            <div key={i} className="border-l-4 border-green-400 bg-white p-4 rounded-md">
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-600">{p.venue} {p.year ? `• ${p.year}` : ''}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
