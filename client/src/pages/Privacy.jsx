import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24 flex-grow max-w-4xl">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-500 mb-6">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">1. Introduction</h2>
              <p>Welcome to FoodShare. We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our services. This Privacy Policy explains our practices regarding the collection, use and disclosure of your information.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">2. Information We Collect</h2>
              <p>We collect information to facilitate the donation and delivery process:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Personal Information:</strong> Name, email address, phone number and organization name (if applicable) when you register.</li>
                <li><strong>Location Data:</strong> Pickup and delivery addresses to coordinate logistics between donors, drivers and receivers.</li>
                <li><strong>Donation Details:</strong> Descriptions and photos of food items posted for donation.</li>
                <li><strong>Usage Data:</strong> Information on how you interact with our dashboard and services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">3. How We Use Your Information</h2>
              <p>We use your data to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Connect donors with receivers and volunteer drivers.</li>
                <li>Facilitate the pickup and delivery of food donations.</li>
                <li>Verify accounts and ensure the safety of our community.</li>
                <li>Send notifications regarding the status of donations and requests.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">4. Information Sharing</h2>
              <p>We do not sell your personal data. We share necessary information only to fulfill the service:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Drivers:</strong> Receive pickup and drop-off locations and contact numbers to complete deliveries.</li>
                <li><strong>Receivers/Donors:</strong> Contact information may be shared between matched parties to coordinate logistics.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">5. Data Security</h2>
              <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">6. Contact Us</h2>
              <p>If you have questions about this policy, please contact us at <a href="mailto:info@foodshare.ke" className="text-emerald-600 hover:underline">info@foodshare.ke</a>.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;