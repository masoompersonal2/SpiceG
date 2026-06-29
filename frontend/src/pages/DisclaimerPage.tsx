import { ArrowLeft, AlertTriangle } from "lucide-react";

export function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#2D1B10] text-[#E8E6E1] pb-20 font-sans relative">
      <a href="/" className="absolute md:fixed top-6 left-6 flex items-center gap-2 text-[#C4A464] hover:text-white transition-colors z-[100] font-bold bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 shadow-lg">
        <ArrowLeft className="w-5 h-5" /> Back to Home
      </a>

      <div className="pt-24 md:pt-32 px-6 max-w-4xl mx-auto">
        <div className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-8 mb-12 text-center animate-pulse">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-black text-red-500 uppercase tracking-wider leading-tight">
            THIS IS A STUDENT PROJECT, NOT A REAL PLATFORM.
          </h1>
          <p className="mt-4 text-red-400 font-bold md:text-lg">
            No real orders will be processed, no real food will be delivered, and any payments made via test gateways are for demonstration purposes only.
          </p>
        </div>

        <h2 className="text-4xl md:text-5xl font-serif mb-8 text-white">Project Disclaimer</h2>
        
        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-[#C4A464] mb-4">1. Purpose of the Website</h2>
            <p>This website ("Crave") is an academic and portfolio project developed to demonstrate full-stack software engineering capabilities, UI/UX design, and database management. It does not represent an actual restaurant business.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[#C4A464] mb-4">2. Orders and Transactions</h2>
            <p>All items, prices, and menus listed on this site are fictitious. Any interaction that simulates a purchase, booking, or financial transaction is strictly simulated. Please do not enter real credit card or highly sensitive information into this system.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[#C4A464] mb-4">3. Data Privacy</h2>
            <p>While the database functions normally and stores registered user data, this platform is hosted in a public demonstration environment. Do not use passwords that you use for other sensitive real-world accounts.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[#C4A464] mb-4">4. Media and Copyright</h2>
            <p>The images, videos, and branding used on this site are placeholders sourced for educational purposes. All copyrights belong to their respective original owners.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
