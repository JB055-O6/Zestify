import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");

  const handleEmailLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert("✅ Check your email for the login link!");
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-6 p-6 bg-gradient-to-br from-indigo-100 to-pink-200 text-dark">
      <h1 className="text-3xl font-cartoon">🔐 Welcome to Zestify</h1>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="📧 Enter your email"
          className="p-2 rounded-xl shadow"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleEmailLogin}
          className="bg-blue-500 text-white font-bold p-2 rounded-xl hover:scale-105 transition"
        >
          Send Magic Link
        </button>

        <hr className="my-4" />
        <button
          onClick={handleGoogleLogin}
          className="bg-red-500 text-white font-bold p-2 rounded-xl hover:scale-105 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
