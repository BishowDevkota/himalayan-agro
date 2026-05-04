import { educationList } from "../../../lib/data/sharma";

export default function EducationSection() {
  return (
    <section id="education" className="py-10 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold mb-6">Education</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {educationList.map((e, i) => (
            <div key={i} className="border-t-4 border-green-400 bg-white p-4 rounded-md shadow-sm">
              <div className="text-lg font-semibold">{e.degree}</div>
              <div className="text-sm text-gray-600">{e.field}</div>
              <div className="mt-2 text-sm text-gray-500">{e.institution} • {e.year}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
