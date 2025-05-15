import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKeylessAccounts } from "../core/useKeylessAccounts";
import { collapseAddress } from "../core/utils";
import passService from "../services/PassService";
import ApiHealthStatus from "../components/ApiHealthStatus";

function HomePage() {
  const navigate = useNavigate();
  const { activeAccount, disconnectKeylessAccount } = useKeylessAccounts();
  const [userName, setUserName] = useState("Guest");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!activeAccount) navigate("/");
    // Simulate fetching user data
    setUserName("Tom Rowbotham");
  }, [activeAccount, navigate]);

  const handleAddToWallet = async () => {
    if (!activeAccount) {
      alert("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    try {
      const walletAddress = activeAccount.accountAddress.toString();
      
      // First try to get an existing pass
      let passResult = await passService.getWalletPass(walletAddress);
      
      // If no pass exists (null download URL or other issue), create a new one
      if (!passResult.passUrl) {
        console.log("No existing pass found, creating a new one");
        passResult = await passService.createWalletPass(walletAddress);
      }
      
      if (passResult.passUrl) {
        // Open the pass URL in a new tab/window
        window.open(passResult.passUrl, '_blank');
      } else {
        throw new Error("Failed to get pass download URL");
      }
    } catch (error) {
      console.error("Error getting or creating wallet pass:", error);
      alert("Failed to add pass to Apple Wallet. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-[#0268da] w-full py-3 px-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://ext.same-assets.com/229193237/3499826306.png"
              alt="Universal Orlando Logo"
              className="h-8"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center text-white">
              <span className="mr-3 font-medium">Welcome, {userName}</span>
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                {userName.charAt(0)}
              </div>
            </div>
            <button
              onClick={disconnectKeylessAccount}
              className="text-white hover:bg-white/10 px-3 py-1 rounded-md text-sm transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Epic Universe Preview Access</h1>
          <p className="text-gray-500">Manage your tickets, preview passes, and exclusive experiences</p>
        </div>

        {/* Tickets & Passes Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">My Epic Universe Passes</h2>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">Preview Access</span>
          </div>

          <div className="border-b pb-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 aspect-[4/3] bg-gradient-to-br from-[#5C0E8B] to-[#0268da] rounded-xl flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 opacity-10">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FFFFFF" d="M47.1,-51.8C60.9,-39.2,72,-23.1,74.4,-5.5C76.8,12.1,70.5,31.2,57.5,43.9C44.5,56.5,24.8,62.8,5.2,63.1C-14.4,63.4,-28.7,57.8,-43.5,47.6C-58.2,37.5,-73.3,22.8,-77.1,5.1C-80.9,-12.7,-73.4,-33.4,-59.5,-46.3C-45.5,-59.2,-25.1,-64.2,-5.5,-62.8C14.1,-61.4,33.3,-64.5,47.1,-51.8Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <div className="z-10 text-center">
                  <h3 className="font-bold text-lg mb-1">Epic Universe Preview</h3>
                  <p className="text-white/80 text-sm mb-3">Valid: Aug 1 - Aug 3, 2025</p>
                  <div className="bg-white/20 rounded-lg py-1 px-3 inline-block">
                    <span className="font-mono text-sm">#{activeAccount ? collapseAddress(activeAccount.accountAddress.toString().substring(0, 8)) : "XXXXX"}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Epic Universe Exclusive Preview Pass</h3>
                  <p className="text-gray-500 mb-3">Experience the magic of Epic Universe before it opens to the general public. Explore new worlds including Super Nintendo World, How to Train Your Dragon, Dark Universe, and The Wizarding World.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-xs text-gray-500 block">VALID FROM</span>
                      <span className="font-medium">Aug 1, 2025</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-xs text-gray-500 block">VALID UNTIL</span>
                      <span className="font-medium">Aug 3, 2025</span>
                    </div>
                  </div>
                </div>
                
                {/* Primary CTA - Apple Wallet Button */}
                <div className="flex justify-center">
                  <button 
                    onClick={handleAddToWallet}
                    disabled={isLoading}
                    className="flex items-center justify-center relative"
                  >
                    {isLoading ? (
                      <div className="bg-black text-white px-6 py-2 rounded-lg flex items-center justify-center">
                        <span className="animate-pulse">Processing...</span>
                      </div>
                    ) : (
                      <img 
                        src="/addtoapple.svg" 
                        alt="Add to Apple Wallet" 
                        className="h-10 w-auto"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3">
              <h4 className="font-medium text-gray-800 mb-1">Epic Express</h4>
              <p className="text-gray-500 text-sm">Priority access to new Epic Universe attractions</p>
            </div>
            <div className="p-3">
              <h4 className="font-medium text-gray-800 mb-1">Celestial Dining</h4>
              <p className="text-gray-500 text-sm">Exclusive dining options at the new themed restaurants</p>
            </div>
            <div className="p-3">
              <h4 className="font-medium text-gray-800 mb-1">Stellar Photopasses</h4>
              <p className="text-gray-500 text-sm">Be among the first to capture memories at Epic Universe</p>
            </div>
          </div>
        </div>

        {/* Upcoming Reservations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800">My Preview Reservations</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex flex-col mb-3">
                <span className="text-xs text-gray-500">CONFIRMED EXPERIENCE</span>
                <span className="font-medium text-gray-800">Super Nintendo World - Mario Kart Preview</span>
                <span className="text-sm text-gray-600">Aug 2, 2025 | 10:00 AM</span>
              </div>
              <button className="text-[#0268da] font-medium hover:underline text-sm">Add More Experiences</button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800">Preview Merchandise</h2>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-500">Exclusive merchandise reservations will be available soon.</p>
              <button className="mt-3 text-[#0268da] font-medium hover:underline">Get Notified</button>
            </div>
          </div>
        </div>

        {/* Epic Universe Worlds */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Epic Universe Worlds</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg overflow-hidden shadow-sm">
              <img src="https://ext.same-assets.com/229193237/116176169.jpeg" alt="Epic Universe world" className="w-full h-32 object-cover" />
              <div className="p-3">
                <h3 className="font-medium text-gray-800">Super Nintendo World</h3>
                <p className="text-gray-500 text-sm">Step into the adventures of Mario, Luigi, and friends</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-sm">
              <img src="https://ext.same-assets.com/229193237/116176169.jpeg" alt="Epic Universe world" className="w-full h-32 object-cover" />
              <div className="p-3">
                <h3 className="font-medium text-gray-800">How to Train Your Dragon</h3>
                <p className="text-gray-500 text-sm">Soar with dragons in this immersive world</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-sm">
              <img src="https://ext.same-assets.com/229193237/116176169.jpeg" alt="Epic Universe world" className="w-full h-32 object-cover" />
              <div className="p-3">
                <h3 className="font-medium text-gray-800">Dark Universe</h3>
                <p className="text-gray-500 text-sm">Encounter classic monsters in a new realm</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-sm">
              <img src="https://ext.same-assets.com/229193237/116176169.jpeg" alt="Epic Universe world" className="w-full h-32 object-cover" />
              <div className="p-3">
                <h3 className="font-medium text-gray-800">The Wizarding World</h3>
                <p className="text-gray-500 text-sm">A new chapter in the magical universe</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0268da] py-6 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <img
              src="https://ext.same-assets.com/229193237/3499826306.png"
              alt="Universal Orlando Logo"
              className="h-8 mb-4 md:mb-0"
            />
            <div className="flex gap-4">
              <a href="#" className="hover:underline">Help</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Use</a>
              <a href="#" className="hover:underline">Contact Us</a>
            </div>
          </div>
          <div className="text-center md:text-left text-sm text-white/80">
            <p>© 2025 Universal Epic Universe. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
