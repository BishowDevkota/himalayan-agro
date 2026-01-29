import SearchClient from "../components/SearchClient";

export default async function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const sp = (searchParams && typeof (searchParams as any)?.then === "function") ? await searchParams : (searchParams || {});
  const q = (sp as any).q || "";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Search products</h1>
        <p className="text-sm text-gray-600 mt-1">Find products across the catalog — recommendations appear as you type.</p>
      </div>

      <SearchClient initialQuery={q} />
    </div>
  );
}
