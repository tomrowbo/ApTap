import Header from "./components/Header";
import HeroSection from "./components/HeroSection";

function App() {
  return (
    <div className="bg-[#fbfbfb] min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      
      {/* Feature Worlds Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-[#5C0E8B]">Discover Epic Worlds</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Epic Universe will transport you to vibrant new lands where your favorite stories and characters come to life.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img src="/universal.jpg" alt="Super Nintendo World" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">Super Nintendo World</h3>
              <p className="text-gray-600 text-sm">Step into the adventures of Mario, Luigi, and friends in a colorful, interactive world.</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img src="/universal.jpg" alt="How to Train Your Dragon" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">How to Train Your Dragon</h3>
              <p className="text-gray-600 text-sm">Soar with dragons in the Isle of Berk, a land filled with Viking adventures.</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img src="/universal.jpg" alt="Dark Universe" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">Dark Universe</h3>
              <p className="text-gray-600 text-sm">Encounter classic monsters in a mysterious realm of suspense and thrills.</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img src="/universal.jpg" alt="The Wizarding World" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">The Wizarding World</h3>
              <p className="text-gray-600 text-sm">Experience a new chapter in the magical universe of Harry Potter.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Preview Access CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#5C0E8B] to-[#0268da] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Be Among the First to Experience Epic Universe</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Preview passes will be available for a limited time, giving you exclusive access to Universal's most immersive park yet before it opens to the general public.
          </p>
          <a 
            href="/login" 
            className="inline-block bg-white text-[#0268da] hover:bg-opacity-90 font-bold rounded-full px-8 py-3 transition"
          >
            Get Preview Access
          </a>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#171717] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-6 md:mb-0">
              <img
                src="https://ext.same-assets.com/229193237/3499826306.png"
                alt="Universal Logo"
                className="h-8 mb-4"
              />
              <p className="text-gray-400 max-w-xs">
                Universal Epic Universe - Opening 2025 in Orlando, Florida.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold mb-4 text-lg">Explore</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Worlds</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Attractions</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Dining</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Shopping</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-4 text-lg">Plan</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Preview Access</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Hotels</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Transportation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">FAQ</a></li>
                </ul>
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <h3 className="font-bold mb-4 text-lg">Connect</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Press</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Universal Orlando Resort</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2025 Universal Epic Universe. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Accessibility</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 