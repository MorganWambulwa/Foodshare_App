import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24 flex-grow max-w-4xl">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
          <p className="text-gray-500 mb-6">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">1. What Are Cookies?</h2>
              <p>Cookies are small text files that are stored on your device when you visit a website. They help us verify your identity and improve your experience.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">2. How We Use Cookies</h2>
              <p>We use cookies for the following purposes:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Essential Cookies:</strong> These are necessary for the website to function (e.g., keeping you logged in as you navigate between the Dashboard and Map).</li>
                <li><strong>Functionality Cookies:</strong> These remember your preferences, such as your last map location.</li>
                <li><strong>Analytical Cookies:</strong> We may use these to understand how many users are visiting our site to improve performance.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">3. Third-Party Cookies</h2>
              <p>Our platform integrates with third-party services like map providers (e.g., OpenStreetMap, Mapbox) which may set their own cookies to render maps and geolocation services correctly.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">4. Managing Cookies</h2>
              <p>You can choose to disable cookies through your browser settings. However, please note that disabling essential cookies may prevent you from logging in or using the core features of FoodShare.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cookies;