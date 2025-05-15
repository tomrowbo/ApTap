import { GOOGLE_CLIENT_ID } from "../core/constants";
import useEphemeralKeyPair from "../core/useEphemeralKeyPair";
import GoogleLogo from "../components/GoogleLogo";

function LoginPage() {
  const ephemeralKeyPair = useEphemeralKeyPair();

  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  const searchParams = new URLSearchParams({
    /**
     * Replace with your own client ID
     */
    client_id: GOOGLE_CLIENT_ID,
    /**
     * The redirect_uri must be registered in the Google Developer Console. This callback page
     * parses the id_token from the URL fragment and combines it with the ephemeral key pair to
     * derive the keyless account.
     *
     * window.location.origin == http://localhost:5173
     */
    redirect_uri: `${window.location.origin}/callback`,
    /**
     * This uses the OpenID Connect implicit flow to return an id_token. This is recommended
     * for SPAs as it does not require a backend server.
     */
    response_type: "id_token",
    scope: "openid email profile",
    nonce: ephemeralKeyPair.nonce,
  });
  redirectUrl.search = searchParams.toString();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0268da] to-[#004d9e]">
      {/* Header */}
      <header className="bg-[#0268da] w-full py-2 px-4 flex items-center">
        <div className="flex items-center gap-3">
          <img
            src="https://ext.same-assets.com/229193237/3499826306.png"
            alt="Universal Orlando Logo"
            className="h-8"
          />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="flex flex-col items-center text-center mb-8">
            <img
              src="https://ext.same-assets.com/229193237/2432258757.png"
              alt="Universal Studios Logo"
              className="h-14 mb-6"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-[#0268da] mb-2">Welcome Back!</h1>
            <p className="text-gray-600 mb-2">
              Sign in to access your Universal Orlando account
            </p>
            <div className="w-16 h-1 bg-[#0268da] rounded-full my-3"></div>
          </div>

          <div className="space-y-4">
            <a
              href={redirectUrl.toString()}
              className="flex justify-center items-center border-2 border-[#0268da] rounded-full font-semibold py-3 px-4 w-full hover:bg-gray-50 transition duration-200 text-[#0268da]"
            >
              <GoogleLogo />
              <span>Sign in with Google</span>
            </a>

            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gray-200"></div>
              <span className="px-3 text-sm text-gray-500">or continue with</span>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>

            <div className="space-y-4">
              <button className="bg-[#0268da] hover:bg-[#0258ba] text-white w-full py-3 px-4 rounded-full font-semibold transition duration-200">
                Buy Single Day Tickets
              </button>
              <button className="bg-white text-[#0268da] border-2 border-[#0268da] w-full py-3 px-4 rounded-full font-semibold hover:bg-gray-50 transition duration-200">
                Explore Annual Passes
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>By continuing, you agree to our <a href="#" className="text-[#0268da] hover:underline">Terms of Service</a> and <a href="#" className="text-[#0268da] hover:underline">Privacy Policy</a>.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0268da]/90 text-white text-center py-4 text-sm">
        <p>© 2025 Universal Orlando. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default LoginPage;
