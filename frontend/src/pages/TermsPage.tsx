import { ArrowLeft } from "lucide-react";

export function TermsPage() {
  return (
    <main className="min-h-screen bg-[#2D1B10] text-[#E8E6E1] pb-20 font-sans relative">
      <a href="/" className="absolute md:fixed top-6 left-6 flex items-center gap-2 text-[#C4A464] hover:text-white transition-colors z-[100] font-bold bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 shadow-lg">
        <ArrowLeft className="w-5 h-5" /> Back to Home
      </a>

      <div className="pt-24 md:pt-32 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif mb-8 text-white">Terms and Conditions</h1>
        
        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-[#C4A464] mb-4">1. Introduction</h2>
            <p>Welcome to Crave. By accessing our website, placing an order, or booking a reservation, you agree to be bound by these Terms and Conditions. Please read them carefully before proceeding with any transaction.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[#C4A464] mb-4">2. Ordering & Payments</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All orders are subject to availability and confirmation of the order price.</li>
              <li>We accept Cash on Delivery and online payments (where available). All online payments are securely processed.</li>
              <li>Prices are subject to change without notice. The price charged will be the price at the time of your order.</li>
              <li>Cancellations are only permitted before the kitchen has started preparing your order.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[#C4A464] mb-4">3. Delivery Services</h2>
            <p>Delivery times are estimates and may vary based on traffic, weather conditions, and order volume. Crave is not liable for minor delays. You must ensure someone is available at the delivery address to receive the order.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[#C4A464] mb-4">4. Reservations</h2>
            <p>Table reservations are subject to availability. We reserve the right to cancel a reservation if you arrive more than 15 minutes late without prior notice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[#C4A464] mb-4">5. Modifications</h2>
            <p>We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to this website.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
