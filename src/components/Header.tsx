import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleBuyTickets = () => {
    navigate("/login");
  };

  return (
    <header className="bg-[#0268da] w-full py-2 px-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src="https://ext.same-assets.com/229193237/3499826306.png"
          alt="Universal Orlando Logo"
          className="h-8"
        />
        <nav className="hidden md:flex gap-5 text-white font-medium text-sm ml-4">
          <a href="#" className="hover:underline">Worlds</a>
          <a href="#" className="hover:underline">Attractions</a>
          <a href="#" className="hover:underline">Preview Passes</a>
          <a href="#" className="hover:underline">Plans & Packages</a>
          <a href="#" className="hover:underline">FAQ</a>
        </nav>
      </div>
      <div>
        <button 
          onClick={handleBuyTickets}
          className="bg-white hover:bg-opacity-90 text-[#0268da] font-semibold rounded-full px-5 py-2 transition border border-white"
        >
          Preview Access
        </button>
      </div>
    </header>
  );
} 