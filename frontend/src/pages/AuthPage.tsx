import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Mail, Sparkles, ArrowLeft } from "lucide-react";

interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

const Pupil = ({ size = 12, maxDistance = 5, pupilColor = "black", forceLookX, forceLookY }: PupilProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    const pupil = pupilRef.current.getBoundingClientRect();
    const pupilCenterX = pupil.left + pupil.width / 2;
    const pupilCenterY = pupil.top + pupil.height / 2;
    const deltaX = mouseX - pupilCenterX;
    const deltaY = mouseY - pupilCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};

interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

const EyeBall = ({ size = 48, pupilSize = 16, maxDistance = 10, eyeColor = "white", pupilColor = "black", isBlinking = false, forceLookX, forceLookY }: EyeBallProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;
    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? '2px' : `${size}px`,
        backgroundColor: eyeColor,
        overflow: 'hidden',
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  );
};

export function AuthPage() {
  const [view, setView] = useState<'login' | 'signup' | 'setup'>('login');

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [liveLocation, setLiveLocation] = useState("");
  const [profileImage] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);
  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;
    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsPurpleBlinking(true);
        setTimeout(() => {
          setIsPurpleBlinking(false);
          scheduleBlink();
        }, 150);
      }, getRandomBlinkInterval());
      return blinkTimeout;
    };
    const timeout = scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;
    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsBlackBlinking(true);
        setTimeout(() => {
          setIsBlackBlinking(false);
          scheduleBlink();
        }, 150);
      }, getRandomBlinkInterval());
      return blinkTimeout;
    };
    const timeout = scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(timer);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [isTyping]);

  useEffect(() => {
    if (password.length > 0 && showPassword) {
      const schedulePeek = () => {
        const peekInterval = setTimeout(() => {
          setIsPurplePeeking(true);
          setTimeout(() => setIsPurplePeeking(false), 800);
        }, Math.random() * 3000 + 2000);
        return peekInterval;
      };
      const firstPeek = schedulePeek();
      return () => clearTimeout(firstPeek);
    } else {
      setIsPurplePeeking(false);
    }
  }, [password, showPassword, isPurplePeeking]);

  const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const faceX = Math.max(-15, Math.min(15, deltaX / 20));
    const faceY = Math.max(-10, Math.min(10, deltaY / 30));
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));
    return { faceX, faceY, bodySkew };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);

  const fetchLiveLocation = () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            setLiveLocation(data.display_name);
          } else {
            setLiveLocation(`${latitude}, ${longitude}`);
          }
        } catch (e) {
          setLiveLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
        }
      },
      () => {
        console.warn("Unable to retrieve location");
      }
    );
  };

  useEffect(() => {
    if (view === 'setup') {
      fetchLiveLocation();
    }
  }, [view]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/customer/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      
      if (!data.customer.isSetupComplete) {
        setView("setup");
      } else {
        const pending = localStorage.getItem("pendingReservation");
        if (pending) {
          window.location.replace("/dashboard?tab=Reservations");
        } else {
          sessionStorage.setItem("customerSession", "active");
          window.location.replace("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/customer/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      
      setView("setup");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !mobile) return;

    setError("");
    setIsLoading(true);

    try {
      let imageUrl = profileImage;

      if (profileImageFile) {
        const formData = new FormData();
        formData.append("image", profileImageFile);
        const uploadRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/customer/auth/upload`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || "Image upload failed");
        imageUrl = uploadData.imageUrl;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/customer/auth/setup`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ fullName, mobile, liveLocation, profileImage: imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Setup failed");
      
      const pending = localStorage.getItem("pendingReservation");
      if (pending) {
        window.location.replace("/dashboard?tab=Reservations");
      } else {
        sessionStorage.setItem("customerSession", "active");
        window.location.replace("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSetup = async () => {
    setIsLoading(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/customer/auth/cancel-setup`, {
        method: "POST",
        credentials: "include",
      });
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setView("login");
    } catch (error) {
      console.error("Cancel failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSetupComplete = fullName.trim() !== "" && mobile.trim() !== "";

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black text-white">
      {/* Left Content Section */}
      <div className="relative hidden lg:flex flex-col justify-between bg-zinc-900/50 p-12">
        <div className="relative z-20">
          <div className="flex items-center gap-2 text-lg font-semibold cursor-pointer" onClick={() => window.location.href="/"}>
            <div className="size-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="size-4" />
            </div>
            <span>Spice Garden</span>
          </div>
        </div>

        <div className="relative z-20 flex items-end justify-center h-[500px]">
          <div className="relative" style={{ width: '550px', height: '400px' }}>
            {/* Purple character */}
            <div 
              ref={purpleRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '70px',
                width: '180px',
                height: (isTyping || (password.length > 0 && !showPassword)) ? '440px' : '400px',
                backgroundColor: '#6C3FF5',
                borderRadius: '10px 10px 0 0',
                zIndex: 1,
                transform: (password.length > 0 && showPassword)
                  ? `skewX(0deg)`
                  : (isTyping || (password.length > 0 && !showPassword))
                    ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)` 
                    : `skewX(${purplePos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div 
                className="absolute flex gap-8 transition-all duration-700 ease-in-out"
                style={{
                  left: (password.length > 0 && showPassword) ? `${20}px` : isLookingAtEachOther ? `${55}px` : `${45 + purplePos.faceX}px`,
                  top: (password.length > 0 && showPassword) ? `${35}px` : isLookingAtEachOther ? `${65}px` : `${40 + purplePos.faceY}px`,
                }}
              >
                <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isPurpleBlinking} forceLookX={(password.length > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined} forceLookY={(password.length > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
                <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isPurpleBlinking} forceLookX={(password.length > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined} forceLookY={(password.length > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
              </div>
            </div>

            {/* Black character */}
            <div 
              ref={blackRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '240px',
                width: '120px',
                height: '310px',
                backgroundColor: '#2D2D2D',
                borderRadius: '8px 8px 0 0',
                zIndex: 2,
                transform: (password.length > 0 && showPassword)
                  ? `skewX(0deg)`
                  : isLookingAtEachOther
                    ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                    : (isTyping || (password.length > 0 && !showPassword))
                      ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)` 
                      : `skewX(${blackPos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div 
                className="absolute flex gap-6 transition-all duration-700 ease-in-out"
                style={{
                  left: (password.length > 0 && showPassword) ? `${10}px` : isLookingAtEachOther ? `${32}px` : `${26 + blackPos.faceX}px`,
                  top: (password.length > 0 && showPassword) ? `${28}px` : isLookingAtEachOther ? `${12}px` : `${32 + blackPos.faceY}px`,
                }}
              >
                <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isBlackBlinking} forceLookX={(password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined} forceLookY={(password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined} />
                <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isBlackBlinking} forceLookX={(password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined} forceLookY={(password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined} />
              </div>
            </div>

            {/* Orange character */}
            <div 
              ref={orangeRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '0px',
                width: '240px',
                height: '200px',
                zIndex: 3,
                backgroundColor: '#FF9B6B',
                borderRadius: '120px 120px 0 0',
                transform: (password.length > 0 && showPassword) ? `skewX(0deg)` : `skewX(${orangePos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div 
                className="absolute flex gap-8 transition-all duration-200 ease-out"
                style={{
                  left: (password.length > 0 && showPassword) ? `${50}px` : `${82 + (orangePos.faceX || 0)}px`,
                  top: (password.length > 0 && showPassword) ? `${85}px` : `${90 + (orangePos.faceY || 0)}px`,
                }}
              >
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(password.length > 0 && showPassword) ? -5 : undefined} forceLookY={(password.length > 0 && showPassword) ? -4 : undefined} />
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(password.length > 0 && showPassword) ? -5 : undefined} forceLookY={(password.length > 0 && showPassword) ? -4 : undefined} />
              </div>
            </div>

            {/* Yellow character */}
            <div 
              ref={yellowRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '310px',
                width: '140px',
                height: '230px',
                backgroundColor: '#E8D754',
                borderRadius: '70px 70px 0 0',
                zIndex: 4,
                transform: (password.length > 0 && showPassword) ? `skewX(0deg)` : `skewX(${yellowPos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div 
                className="absolute flex gap-6 transition-all duration-200 ease-out"
                style={{
                  left: (password.length > 0 && showPassword) ? `${20}px` : `${52 + (yellowPos.faceX || 0)}px`,
                  top: (password.length > 0 && showPassword) ? `${35}px` : `${40 + (yellowPos.faceY || 0)}px`,
                }}
              >
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(password.length > 0 && showPassword) ? -5 : undefined} forceLookY={(password.length > 0 && showPassword) ? -4 : undefined} />
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(password.length > 0 && showPassword) ? -5 : undefined} forceLookY={(password.length > 0 && showPassword) ? -4 : undefined} />
              </div>
              <div 
                className="absolute w-20 h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
                style={{
                  left: (password.length > 0 && showPassword) ? `${10}px` : `${40 + (yellowPos.faceX || 0)}px`,
                  top: (password.length > 0 && showPassword) ? `${88}px` : `${88 + (yellowPos.faceY || 0)}px`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-20 flex items-center gap-8 text-sm text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>

      {/* Right Login/Signup/Setup Section */}
      <div className="flex items-center justify-center p-8 bg-black">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-12 cursor-pointer" onClick={() => window.location.href="/"}>
            <div className="size-8 rounded-lg bg-zinc-800 flex items-center justify-center">
              <Sparkles className="size-4 text-white" />
            </div>
            <span>Spice Garden</span>
          </div>

          {view === 'setup' ? (
            <>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Almost there!</h1>
                <p className="text-zinc-400 text-sm">Please complete your profile</p>
              </div>

              <form onSubmit={handleSetupSubmit} className="space-y-5">
                <div className="space-y-2 text-left">
                  <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-black border-2 border-[#1A1A1A] text-white px-5 py-4 rounded-xl focus:outline-none focus:border-[#B2E624] transition-colors"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label htmlFor="mobile" className="text-sm font-medium">Mobile Number</label>
                  <input 
                    type="tel" 
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-black border-2 border-[#1A1A1A] text-white px-5 py-4 rounded-xl focus:outline-none focus:border-[#B2E624] transition-colors"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label htmlFor="profileImage" className="text-sm font-medium">Profile Image (Optional)</label>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setProfileImageFile(e.target.files[0]);
                      }
                    }}
                    className="flex h-12 w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                  />
                  {profileImageFile && (
                    <div className="text-xs text-zinc-500 mt-2">Selected: {profileImageFile.name}</div>
                  )}
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg text-left">
                    {error}
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  <button 
                    type="button" 
                    onClick={handleCancelSetup}
                    className="w-1/3 h-12 rounded-md border border-zinc-800 text-white hover:bg-zinc-900 transition-colors text-base font-medium flex items-center justify-center" 
                    disabled={isLoading}
                  >
                    <ArrowLeft className="size-4 mr-2" /> Back
                  </button>
                  <button 
                    type="submit" 
                    className="w-2/3 h-12 rounded-md bg-white text-black hover:bg-zinc-200 transition-colors text-base font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={isLoading || !isSetupComplete}
                  >
                    {isLoading ? "Saving..." : "Get Started"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  {view === 'login' ? 'Welcome back!' : 'Create an account'}
                </h1>
                <p className="text-zinc-400 text-sm">
                  {view === 'login' ? 'Please enter your details' : 'Enter your details to register'}
                </p>
              </div>

              <form onSubmit={view === 'login' ? handleLoginSubmit : handleSignupSubmit} className="space-y-5">
                <div className="space-y-2 text-left">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Your Gmail"
                    value={email}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    required
                    className="flex h-12 w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="flex h-12 w-full rounded-md border border-zinc-800 bg-black px-3 py-2 pr-10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                </div>

                {view === 'signup' && (
                  <div className="space-y-2 text-left">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="flex h-12 w-full rounded-md border border-zinc-800 bg-black px-3 py-2 pr-10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
                      />
                    </div>
                  </div>
                )}

                {view === 'login' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="remember" className="h-4 w-4 rounded border-zinc-800 bg-black accent-white cursor-pointer" />
                      <label htmlFor="remember" className="text-sm font-normal cursor-pointer text-zinc-300">
                        Remember for 30 days
                      </label>
                    </div>
                    <a href="#" className="text-sm text-zinc-300 hover:text-white hover:underline font-medium">
                      Forgot password?
                    </a>
                  </div>
                )}

                {error && (
                  <div className="p-3 text-sm text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg text-left">
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full h-12 rounded-md bg-white text-black hover:bg-zinc-200 transition-colors text-base font-medium flex items-center justify-center" 
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : view === 'login' ? "Log in" : "Sign up"}
                </button>
              </form>

              {/* Social Login */}
              {view === 'login' ? (
                <div className="mt-6">
                  <button 
                    className="w-full h-12 flex items-center justify-center rounded-md border border-zinc-800 bg-black hover:bg-zinc-900 transition-colors font-medium text-sm text-white"
                    type="button"
                  >
                    <Mail className="mr-2 size-5" />
                    Log in with Google
                  </button>
                </div>
              ) : (
                <div className="mt-6">
                  <button 
                    className="w-full h-12 flex items-center justify-center rounded-md border border-zinc-800 bg-black hover:bg-zinc-900 transition-colors font-medium text-sm text-white"
                    type="button"
                  >
                    <Mail className="mr-2 size-5" />
                    Sign up with Google
                  </button>
                </div>
              )}

              {/* Toggle View Link */}
              <div className="text-center text-sm text-zinc-400 mt-8">
                {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => setView(view === 'login' ? 'signup' : 'login')} 
                  className="text-white font-medium hover:underline"
                >
                  {view === 'login' ? "Sign Up" : "Login"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
