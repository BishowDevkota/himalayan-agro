
import type { Metadata } from "next";
import ContactForm from "../components/ContactForm";
import SubHeroSection from "../components/SubHeroSection";

export const metadata: Metadata = {
  title: "Contact",
};

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
      </main>
    </main>
  );
}