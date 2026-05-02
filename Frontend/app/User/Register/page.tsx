"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { registerUser } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (
      !displayName ||
      !username ||
      !email ||
      !tel ||
      !password
    ) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await registerUser({
        Username: username.trim(),
        UName: displayName.trim(),
        UEmail: email.trim(),
        UPhoneNumber: tel.trim(),
        UPassword: password,
      });

      router.push("/User/Signin");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ไม่สามารถสมัครสมาชิกได้"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#668866] to-[#17261d] px-4">
      <section className="relative w-full max-w-[620px] rounded-[5px] bg-[#eeeeee] px-24 py-10 shadow-xl">

        {/* Back */}
        <a
          href="/User/Signin"
          className="absolute left-8 top-7 text-4xl font-bold text-[#26352b] hover:text-[#4fc263]"
        >
          ‹
        </a>

        {/* Title */}
        <h1 className="mb-8 text-center font-serif text-3xl font-bold text-[#26352b]">
          Emerald Cinema
        </h1>

        <form className="space-y-5">

          {/* Display Name */}
          <div>
            <label className="mb-2 block text-[16px] text-[#333]">
              Name
            </label>

            <input
              type="text"
              placeholder="MissDodo"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-[38px] w-full rounded-[4px] bg-[#d8d8d8] px-4 text-sm text-[#333] outline-none"
            />
          </div>

          {/* Username */}
          <div>
            <label className="mb-2 block text-[16px] text-[#333]">
              Username
            </label>

            <input
              type="text"
              placeholder="JaneDoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-[38px] w-full rounded-[4px] bg-[#d8d8d8] px-4 text-sm text-[#333] outline-none"
            />
          </div>

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
              className="h-[38px] w-full rounded-[4px] bg-[#d8d8d8] px-4 text-sm text-[#333] outline-none"
            />
          </div>

          {/* Tel */}
          <div>
            <label className="mb-2 block text-[16px] text-[#333]">
              Tel.
            </label>

            <input
              type="tel"
              placeholder="012-345-6789"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              className="h-[38px] w-full rounded-[4px] bg-[#d8d8d8] px-4 text-sm text-[#333] outline-none"
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
              className="h-[38px] w-full rounded-[4px] bg-[#d8d8d8] px-4 text-sm text-[#333] outline-none"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-600">{error}</p>
          )}

          {/* Button */}
          <div className="pt-5 text-center">
            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className={`h-[40px] w-[210px] rounded-[5px] text-white transition ${
                loading
                  ? "cursor-not-allowed bg-[#89a58f]"
                  : "bg-[#4fc263] hover:bg-[#63e86f] hover:text-[#06160a]"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
