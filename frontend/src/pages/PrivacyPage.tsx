import { ArrowLeft } from "lucide-react";

export function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#2D1B10] text-[#E8E6E1] pb-20 font-sans relative">
      <a href="/" className="absolute md:fixed top-6 left-6 flex items-center gap-2 text-[#C4A464] hover:text-white transition-colors z-[100] font-bold bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 shadow-lg">
        <ArrowLeft className="w-5 h-5" /> Back to Home
      </a>

      <div className="pt-24 md:pt-32 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif mb-8 text-white">Privacy Policy</h1>
        
        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-[#C4A464] mb-4">1. Information We Collect</h2>
            <p>We collect personal information that you provide to us, including your name, phone number, email address, and delivery location when you register an account, place an order, or book a table.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[#C4A464] mb-4">2. How We Use Your Information</h2>
            <p>Your information is used strictly to provide you with our services. This includes:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Processing and delivering your orders.</li>
              <li>Communicating with you regarding your order status or reservations.</li>
              <li>Improving our website, menu, and customer service based on your feedback.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[#C4A464] mb-4">3. Data Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to outside parties, except our trusted delivery partners who need your address and contact number to deliver your food successfully.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[#C4A464] mb-4">4. Security</h2>
            <p>We implement a variety of security measures to maintain the safety of your personal information. All sensitive payment information is transmitted securely and is not stored on our servers.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[#C4A464] mb-4">5. Your Rights</h2>
            <p>You have the right to access, update, or request the deletion of your personal data at any time by accessing your account settings or contacting our support team.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
