import SubHeroSection from '../components/SubHeroSection';

export const metadata = {
  title: 'About Managing Director - Himalaya Nepal Agriculture',
  description: 'Learn more about our Managing Director and his vision for Himalaya Nepal Agriculture Company Limited.',
};

export default function ManagingDirectorPage() {
  return (
    <main>
      <SubHeroSection
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About Managing Director', href: '/managing-director', active: true },
        ]}
        title="About Managing Director"
        subtitle="Our Leader's Vision for Agricultural Excellence"
        imageUrl="/managing-director.jpg"
      />

      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Dolindra Paudel Sharma
            </h2>
            <p className="text-lg text-gray-600 font-semibold mb-8">Managing Director, Himalaya Nepal Agriculture Company Limited</p>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                As the Managing Director of Himalaya Nepal Agriculture Company Limited, our leader brings decades of experience and unwavering commitment to transforming Nepal's agricultural landscape into a modern, sustainable, and commercially viable sector that empowers farmers and strengthens the national economy.
              </p>

              <p>
                His vision is rooted in bridging the gap between traditional farming practices and innovative agricultural solutions by promoting technology, value addition, and efficient market access. Through strong collaboration with farmers, cooperatives, and stakeholders, he ensures quality production, fair pricing, and long-term growth for all involved.
              </p>

              <p>
                The Managing Director's focus remains on enhancing productivity, encouraging youth participation in agriculture, and building a reliable supply chain that meets both domestic and international standards. He believes that agriculture is not just a profession, but a foundation for national prosperity and food security.
              </p>

              <p>
                Under his leadership, Himalaya Nepal Agriculture Company Limited has become a beacon of innovation and sustainability in the agricultural sector. His strategic initiatives have empowered thousands of farmers, generated significant employment opportunities, and contributed to Nepal's economic growth.
              </p>

              <p>
                He sincerely invites all stakeholders to join in the journey towards building a resilient, competitive, and prosperous agricultural future for Nepal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
