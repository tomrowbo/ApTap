import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  const handleExploreTickets = () => {
    navigate("/login");
  };

  return (
    <section className="relative w-full overflow-hidden flex flex-col">
      {/* Background image container */}
      <div className="relative w-full max-w-full h-[60vh] md:h-[75vh] lg:h-[85vh]">
        <img
          src="entrance.jpg"
          alt="Universal Studios Gate"
          className="w-full h-full max-w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#5C0E8B]/30 to-[#0268da]" />
      </div>
      
      {/* Overlay content */}
      <div className="relative z-20 max-w-4xl mx-auto px-5 pt-4 pb-4 -mt-48 sm:-mt-64 md:-mt-72 lg:-mt-80 text-center text-white">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-sm md:text-base uppercase tracking-widest mb-1 text-white/80">Universal Orlando Resort Presents</h2>
          <h1 className="font-bold text-3xl md:text-5xl mb-2 md:mb-3 text-white drop-shadow-lg">EPIC UNIVERSE</h1>
          <div className="w-20 h-1 bg-white/50 rounded-full mb-4"></div>
        </div>
        <p className="mb-4 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
          Embark on an epic journey through new worlds and immersive experiences. Discover adventures beyond your imagination in Universal's most ambitious theme park ever created, opening 2025.
        </p>
        {/* Location and tickets info card */}
        <div className="bg-gradient-to-r from-[#5C0E8B] to-[#0268da] bg-opacity-80 rounded-xl px-3 md:px-5 py-3 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between shadow-lg max-w-2xl mx-auto border border-white/20">
          <div className="flex flex-col text-left mb-2 md:mb-0">
            <span className="uppercase text-xs text-[#fbfbfb]/70 tracking-wider">Opening</span>
            <span className="font-semibold">2025 - Preview Access Available</span>
          </div>
          <div className="flex flex-col text-left mb-2 md:mb-0">
            <span className="uppercase text-xs text-[#fbfbfb]/70 tracking-wider">Location</span>
            <span className="font-semibold">Orlando, Florida</span>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleExploreTickets}
              className="bg-white hover:bg-opacity-90 text-[#0268da] rounded-full font-semibold px-4 py-1.5 md:px-5 md:py-2 transition border border-white text-sm"
            >
              Preview Passes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 