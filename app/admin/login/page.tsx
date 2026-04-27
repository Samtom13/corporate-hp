"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F4F2] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Image src="/logo.svg" alt="Bond" width={56} height={56} className="mx-auto mb-4" />
          <p className="text-xs tracking-widest uppercase text-stone-400">Admin</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 space-y-6">
          <div>
            <label className="block text-xs tracking-widest uppercase text-stone-400 mb-3">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full border-b border-stone-200 bg-transparent py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#016812] transition-colors"
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#016812] text-white text-xs tracking-widest uppercase hover:bg-[#014010] transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-xs text-stone-400 mt-6">
          Default password: <code className="bg-stone-100 px-1 py-0.5">bond-admin-2025</code>
          <br/>
          Set <code className="bg-stone-100 px-1 py-0.5">ADMIN_TOKEN</code> in .env.local to change.
        </p>
      </div>
    </div>
  );
}
