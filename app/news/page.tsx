import Link from "next/link";
import SubHeroSection from "../components/SubHeroSection";
import { Section as AnimatedSection, Div as AnimatedDiv } from "../components/AnimatedClient";
import connectToDatabase from "../../lib/mongodb";
import News from "../../models/News";

export const metadata = {
  title: "News — Himalaya Nepal Agriculture",
  description: "Latest news, updates, and announcements from Himalaya Nepal Agriculture.",
};

const categoryColors: Record<string, string> = {
  Expansion: "bg-sky-100 text-sky-700",
  Partnership: "bg-emerald-100 text-emerald-700",
  Financial: "bg-amber-100 text-amber-700",
  Infrastructure: "bg-violet-100 text-violet-700",
  Community: "bg-rose-100 text-rose-700",
  Technology: "bg-cyan-100 text-cyan-700",
  Awards: "bg-yellow-100 text-yellow-700",
};

function formatDate(dateValue?: string | null) {
  if (!dateValue) return "";
  return new Date(dateValue).toLocaleDateString();
}

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, "").trim();
}

export default async function NewsPage() {
  await connectToDatabase();
  const items = await News.find({ status: "published" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();

  const safe = items.map((n: any) => ({
    _id: String(n._id),
    title: n.title,
    slug: n.slug,
    category: n.category || "News",
    excerpt: n.excerpt || stripHtml(n.contentHtml || "").slice(0, 160),
    coverImage: n.coverImage || "",
    date: formatDate(n.publishedAt ? new Date(n.publishedAt).toISOString() : n.createdAt ? new Date(n.createdAt).toISOString() : null),
  }));

  const featured = safe[0];
  const articles = safe.slice(1);

  return (
    <main className="bg-white text-slate-900 selection:bg-sky-100">
      <SubHeroSection
        title="News & Updates"
        description="Stay up to date with the latest developments, milestones, and stories from Himalaya Nepal Agriculture."
        image="https://images.unsplash.com/photo-1504711434969-e33886168d4c?auto=format&fit=crop&q=80&w=2000"
        tag="Latest From HNA"
        stats={[
          { value: "340+", label: "Partner Farms" },
          { value: "156K", label: "Hectares" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 mb-32">
        {/* Featured Article */}
        <AnimatedSection className="mt-24">
          <span className="text-sky-600 font-bold tracking-widest text-xs uppercase mb-4 block">
            Featured Story
          </span>
          {featured ? (
            <div className="grid lg:grid-cols-2 gap-10 items-center bg-slate-50/50 border border-slate-100 rounded-[40px] overflow-hidden">
              <div className="aspect-video lg:aspect-auto lg:h-full overflow-hidden">
                <img
                  src={featured.coverImage || "/placeholder.png"}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 lg:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${categoryColors[featured.category] || "bg-slate-100 text-slate-600"}`}
                  >
                    {featured.category}
                  </span>
                  <span className="text-xs text-slate-400">{featured.date}</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-black leading-tight mb-4">
                  {featured.title}
                </h2>
                <p className="text-slate-500 leading-relaxed mb-6">
                  {featured.excerpt}
                </p>
                <Link href={`/news/${featured.slug}`} className="text-sm font-bold text-[#0891b2] hover:underline">
                  Read Full Story →
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-100 p-8 text-sm text-slate-500">
              No published news yet.
            </div>
          )}
        </AnimatedSection>

        {/* All Articles Grid */}
        <AnimatedSection className="mt-24">
          <h2 className="text-3xl font-black mb-12">Latest News</h2>
          {articles.length === 0 ? (
            <div className="text-sm text-slate-500">No additional news to show.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, i) => (
                <AnimatedDiv key={article._id + i}>
                  <article className="group cursor-pointer h-full flex flex-col border border-slate-100 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.coverImage || "/placeholder.png"}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${categoryColors[article.category] || "bg-slate-100 text-slate-600"}`}
                        >
                          {article.category}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {article.date}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold leading-snug mb-3 group-hover:text-[#0891b2] transition-colors duration-200">
                        {article.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed flex-1">
                        {article.excerpt}
                      </p>
                      <Link href={`/news/${article.slug}`} className="text-sm font-bold text-[#0891b2] mt-4 inline-block">
                        Read More →
                      </Link>
                    </div>
                  </article>
                </AnimatedDiv>
              ))}
            </div>
          )}
        </AnimatedSection>

        {/* Newsletter CTA */}
        <AnimatedSection className="mt-32 text-center py-20 px-8 bg-slate-900 rounded-[60px] text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full -ml-32 -mt-32" />
          <h2 className="text-4xl sm:text-5xl font-black mb-6 relative z-10">
            Stay Informed
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto relative z-10 leading-relaxed">
            Subscribe to receive the latest updates, reports, and announcements
            directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-sky-400 transition-colors"
            />
            <button className="px-8 py-3.5 bg-white text-slate-900 rounded-full font-bold text-sm hover:bg-sky-500 hover:text-white transition-all">
              Subscribe
            </button>
          </div>
        </AnimatedSection>
      </div>
    </main>
  );
}
