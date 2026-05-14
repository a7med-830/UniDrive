"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else if (res?.ok) {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#111111] border border-[#222222] p-8 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl tracking-[0.2em] uppercase mb-2 font-serif text-white">
            UniDrive
          </h1>
          <p className="text-[#999999] text-xs tracking-[0.2em] uppercase">
            Admin Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-950/30 border border-red-900/50 text-red-400 px-4 py-3 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-[0.1em] text-[#999999] mb-3">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-[#2e2e2e] text-white px-4 py-3 focus:outline-none focus:border-white transition-colors text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.1em] text-[#999999] mb-3">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-[#2e2e2e] text-white px-4 py-3 focus:outline-none focus:border-white transition-colors text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-white bg-white text-black py-4 mt-8 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-transparent hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
