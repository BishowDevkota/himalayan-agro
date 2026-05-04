import { patronages } from "../../../lib/data/sharma";

export default function PatronagesSection() {
  return (
    <section id="patronages" className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold mb-6">Patronages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patronages.map((p, i) => (
            <div key={i} className="bg-white p-4 rounded-md shadow-sm border-l-4 border-amber-400">
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-600">{p.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
