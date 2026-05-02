"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  AUTH_COOKIE_NAME,
  DEFAULT_AUTH_REDIRECT,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (!email || !password) {
      alert("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;

    const requestedCallbackUrl = searchParams.get("callbackUrl");
    const callbackUrl =
      requestedCallbackUrl && requestedCallbackUrl.startsWith("/")
        ? requestedCallbackUrl
        : DEFAULT_AUTH_REDIRECT;

    alert("เข้าสู่ระบบสำเร็จ");
    router.push(callbackUrl);
    router.refresh();
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

          {/* Button */}
          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={handleSignIn}
              className="h-[40px] w-[210px] rounded-[5px] bg-[#4fc263] text-white transition hover:bg-[#63e86f] hover:text-[#06160a]"
            >
              Sign In
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
