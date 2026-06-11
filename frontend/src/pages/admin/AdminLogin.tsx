import { useState } from "react";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Required to set HTTP-Only cookies
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        // Success: Token is now stored securely in an HTTP-Only cookie by the browser
        window.location.href = "/admin/dashboard";
      } else {
        setErrorMsg(data.error || "Login failed");
      }
    } catch (error) {
      setErrorMsg("Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen bg-[#3b2314] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] p-8 sm:p-12 w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#E04D2D]"></div>
        <img src="/logo.jpg" alt="Spice Garden" className="h-16 mx-auto mb-8 mix-blend-multiply" />
        
        <h2 className="text-3xl font-bold text-gray-800 mb-8 font-serif">Admin Access</h2>
        
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E04D2D] focus:ring-1 focus:ring-[#E04D2D] transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E04D2D] focus:ring-1 focus:ring-[#E04D2D] transition-colors"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-[#E04D2D] hover:bg-[#c64024] text-white font-bold py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mt-2"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
