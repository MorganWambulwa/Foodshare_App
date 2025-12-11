import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24 flex-grow max-w-4xl">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-gray-500 mb-6">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">1. Acceptance of Terms</h2>
              <p>By accessing or using the FoodShare platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">2. Description of Service</h2>
              <p>FoodShare is a platform that connects food donors with individuals or organizations in need ("Receivers") and volunteer drivers. We act solely as a facilitator and do not prepare, handle, or store food items directly.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">3. Food Safety & Liability Disclaimer</h2>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Donors:</strong> You warrant that all food donated is safe for consumption, handled in accordance with food safety regulations and has not expired.</li>
                <li><strong>Receivers:</strong> You acknowledge that you accept food donations at your own risk. FoodShare conducts basic vetting but cannot guarantee the condition or safety of every donation.</li>
                <li><strong>Limitation of Liability:</strong> FoodShare shall not be liable for any illness, injury or damages resulting from the consumption of donated food or the use of our platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">4. User Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Post false or misleading information.</li>
                <li>Use the platform for any illegal purpose.</li>
                <li>Harass or harm other users.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">5. Termination</h2>
              <p>We reserve the right to suspend or terminate your account if you violate these terms or engage in behavior that endangers our community.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">6. Governing Law</h2>
              <p>These terms shall be governed by the laws of Kenya.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;