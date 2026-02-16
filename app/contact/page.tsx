import ContactForm from "../components/ContactForm";
import SubHeroSection from "../components/SubHeroSection";

export default function ContactPage() {
  return (
    <main className="bg-white text-gray-900">
      <SubHeroSection
        title="Contact Us"
        description="Connect with our team to bring your vision to life. We are ready when you are."
        image="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000"
        tag="Get In Touch"
        stats={[
          { value: "753", label: "Sales Centers" },
          { value: "12", label: "Countries" },
        ]}
      />

      <main className="max-w-7xl mx-auto px-6 mt-12 lg:mt-20 mb-24">
        <section className="w-full">
          <ContactForm />
        </section>

        {/* Map Section */}
        <section className="w-full mt-24">
          <div className="w-full h-125 rounded-[3rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 border border-gray-100 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215!2d-73.987!3d40.758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzI4LjgiTiA3M8KwNTknMTMuMiJX!5e0!3m2!1sen!2sus!4v123456789"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="location"
            />
          </div>
        </section>
      </main>
    </main>
  );
}