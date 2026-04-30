"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
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

    alert("สมัครสมาชิกสำเร็จ");
    router.push("/User/Signin");
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
              Display name
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

          {/* Button */}
          <div className="pt-5 text-center">
            <button
              type="button"
              onClick={handleRegister}
              className="h-[40px] w-[210px] rounded-[5px] bg-[#4fc263] text-white transition hover:bg-[#63e86f] hover:text-[#06160a]"
            >
              Register
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}