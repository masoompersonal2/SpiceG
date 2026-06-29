import { motion, AnimatePresence } from "framer-motion";

// Animated spoon/fork icon using SVG
const CraveIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" stroke="#C4A464" strokeWidth="1.5" strokeDasharray="4 3" className="opacity-40"/>
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fontFamily="serif" fill="#C4A464" fontWeight="bold">C</text>
  </svg>
);

const LoadingDot = ({ delay }: { delay: number }) => (
  <motion.div
    className="w-1.5 h-1.5 rounded-full bg-[#C4A464]"
    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
    transition={{ duration: 1.4, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

export function SplashScreen({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#160e08] overflow-hidden select-none"
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] rounded-full bg-[#C4A464]/5 blur-[120px]" />
          </div>

          {/* Subtle grain texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-8 relative z-10"
          >
            {/* Logo icon */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <CraveIcon />
            </motion.div>

            {/* Brand name */}
            <div className="text-center">
              <motion.h1
                className="text-[64px] md:text-[80px] font-serif font-bold text-[#E8E6E1] tracking-[0.12em] leading-none"
                animate={{ opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                CRAVE
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-[#C4A464]/70 text-xs tracking-[0.3em] uppercase mt-2 font-medium"
              >
                Taste the Extraordinary
              </motion.p>
            </div>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2"
            >
              <LoadingDot delay={0} />
              <LoadingDot delay={0.2} />
              <LoadingDot delay={0.4} />
            </motion.div>
          </motion.div>

          {/* Bottom tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 text-[#C4A464] text-[10px] tracking-[0.2em] uppercase"
          >
            Waking up the kitchen for you...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
