import ContactForm from "../components/ContactForm";
import SubHeroSection from "../components/SubHeroSection";

export default function ContactPage() {
  return (
    <main className="bg-white text-gray-900">
      <SubHeroSection
        title={"Contact Us"}
        description={"Connect with our team to bring your vision to life. We are ready when you are."}
        image={"https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000"}
      />

      <main className="max-w-7xl mx-auto px-6 mt-12 lg:mt-20 mb-24">
        <section className="w-full">
          <div className="flex flex-col md:flex-row bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden border border-gray-100">

            {/* Sidebar: Sky Blue #29A8DD */}
            <div className="md:w-1/3 bg-[#29A8DD] p-10 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full" />

              <div className="relative z-10">
                <h2 className="text-4xl font-black leading-tight mb-6">Reach out<br/>anytime.</h2>
                <p className="text-white/80 mb-12 font-medium">Ready to take the next step? Our specialists are standing by to assist.</p>

                <div className="space-y-10">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl">✉️</div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-blue-100 font-bold">Email</p>
                      <p className="text-white font-medium">hello@skystudio.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl">📍</div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-blue-100 font-bold">Office</p>
                      <p className="text-white font-medium">102 Sky Tower, NY</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-12 flex gap-8">
                {/* Social links using direct hover color */}
                <a href="#" className="font-black uppercase text-xs tracking-widest hover:text-[#64cc98] transition-colors duration-300">LinkedIn</a>
                <a href="#" className="font-black uppercase text-xs tracking-widest hover:text-[#64cc98] transition-colors duration-300">Instagram</a>
              </div>
            </div>

            <div className="md:w-2/3 p-8 lg:p-16 relative bg-white">
              <ContactForm />
            </div>
          </div>
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