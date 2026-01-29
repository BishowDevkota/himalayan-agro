export type SubHeroSectionProps = {
  title?: string;
  description?: string;
  image?: string;
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000";

export default function SubHeroSection({
  title = "Contact Us",
  description =
    "Step into the future of design. Reach out today for bespoke collaborations and technical inquiries.",
  image = DEFAULT_IMAGE,
}: SubHeroSectionProps) {
  const bg = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('${image}')`;

  return (
    <header
      className="w-full text-center flex items-center justify-center"
      style={{
        minHeight: '80vh',
        background: bg,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      role="img"
      aria-label={title}
    >
      <div className="px-6 max-w-5xl mx-auto flex flex-col items-center fade-in">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mb-4 leading-tight">
          {title}
        </h1>

        <div className="w-20 h-1 bg-[#29A8DD] mb-6" />

        {description ? (
          <p className="text-gray-200 text-lg md:text-xl font-light max-w-2xl leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}