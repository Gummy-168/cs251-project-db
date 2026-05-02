"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { signInUser } from "@/services/api";
import {
  AUTH_COOKIE_NAME,
  DEFAULT_AUTH_REDIRECT,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email || !password) {
      alert("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await signInUser({
        UEmail: email.trim(),
        UPassword: password,
      });

      localStorage.setItem("emerald_user", JSON.stringify(response.user));
      document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;

      const requestedCallbackUrl = searchParams.get("callbackUrl");
      const callbackUrl =
        requestedCallbackUrl && requestedCallbackUrl.startsWith("/")
          ? requestedCallbackUrl
          : DEFAULT_AUTH_REDIRECT;

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ไม่สามารถเข้าสู่ระบบได้"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#668866] to-[#17261d] px-4">
      <section className="w-full max-w-[620px] rounded-[5px] bg-[#eeeeee] px-24 py-10 shadow-xl">
        <h1 className="mb-6 text-center font-serif text-3xl font-bold text-[#26352b]">
          Emerald Cinema
        </h1>

        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="mb-2 block text-[16px] text-[#333]">
              Email
            </label>

            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[38px] w-full rounded-[4px] bg-[#d8d8d8] px-4 text-sm text-[#333] outline-none placeholder:text-gray-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-[16px] text-[#333]">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-[38px] w-full rounded-[4px] bg-[#d8d8d8] px-4 text-sm text-[#333] outline-none placeholder:text-gray-500"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-600">{error}</p>
          )}

          {/* Button */}
          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={handleSignIn}
              disabled={loading}
              className={`h-[40px] w-[210px] rounded-[5px] text-white transition ${
                loading
                  ? "cursor-not-allowed bg-[#89a58f]"
                  : "bg-[#4fc263] hover:bg-[#63e86f] hover:text-[#06160a]"
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <a
              href="/User/Register"
              className="mt-2 block text-sm text-[#555] underline hover:text-[#4fc263]"
            >
              Register
            </a>
          </div>
        </form>
      </section>
    </main>
  );
}
