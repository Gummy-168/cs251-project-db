"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { updateUserProfile } from "@/services/api";
import type { UserAuth } from "@/types/user";

export default function ProfileEditPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserAuth | null>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("emerald_user");

    if (!storedUser) {
      router.push("/User/Signin");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as UserAuth;
      setUser(parsedUser);
      setName(parsedUser.UName);
      setUsername(parsedUser.Username);
      setPhone(parsedUser.UPhoneNumber);
      setEmail(parsedUser.UEmail);
    } catch {
      localStorage.removeItem("emerald_user");
      router.push("/User/Signin");
    }
  }, [router]);

  async function handleSave() {
    if (!user) {
      return;
    }

    if (!name || !username || !phone || !email) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updatedUser = await updateUserProfile(user.UID, {
        UName: name.trim(),
        Username: username.trim(),
        UPhoneNumber: phone.trim(),
        UEmail: email.trim(),
      });

      localStorage.setItem("emerald_user", JSON.stringify(updatedUser));
      router.push("/User/Profile");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ไม่สามารถอัปเดตข้อมูลได้"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#1d2b22] text-white">
      <nav className="flex h-[60px] items-center bg-[#06160a] px-6">
        <h1 className="mr-16 font-serif text-2xl text-[#63e86f]">
          Emerald Cinema
        </h1>

        <div className="flex gap-10 text-xs text-gray-200">
          <Link href="/User/Home" className="hover:text-[#63e86f]">
            หน้าหลัก
          </Link>
          <Link href="/User/Movies" className="hover:text-[#63e86f]">
            ภาพยนตร์
          </Link>
          <Link href="/User/Promotion" className="hover:text-[#63e86f]">
            โปรโมชั่น
          </Link>
          <Link href="/User/Ticket" className="hover:text-[#63e86f]">
            ตั๋วของฉัน
          </Link>
        </div>

        <Link href="/User/Profile" className="ml-auto text-[#63e86f]">
          ◎
        </Link>
      </nav>

      <section className="flex min-h-[calc(100vh-60px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-[620px] rounded-[36px] bg-[#3b4f3f] px-12 py-10 shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="flex h-[110px] w-[110px] items-center justify-center rounded-full border-4 border-[#63e86f] bg-[#243327] text-6xl">
              👨🏻‍💼
            </div>

            <h2 className="mt-6 text-3xl font-bold">ข้อมูลส่วนตัว</h2>
            <p className="mt-1 text-sm text-gray-300">
              จัดการข้อมูลส่วนตัวและการติดต่อของคุณ
            </p>
          </div>

          <form className="mt-10 space-y-6">
            <div>
              <label className="mb-2 block text-sm text-gray-200">
                ชื่อที่แสดง
              </label>
              <input
                type="text"
                placeholder="กรอกชื่อของคุณ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-[48px] w-full rounded-full bg-[#243327] px-5 text-sm text-white outline-none placeholder:text-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="birthday"
                className="mb-2 block text-sm text-gray-200"
              >
                วันเกิด
              </label>

              <input
                id="birthday"
                type="date"
                title="วันเกิด"
                disabled
                className="h-[48px] w-full cursor-not-allowed rounded-full bg-[#243327] px-5 text-sm text-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-200">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-[48px] w-full rounded-full bg-[#243327] px-5 text-sm text-white outline-none placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-200">
                เบอร์มือถือ
              </label>
              <input
                type="tel"
                placeholder="0xx-xxx-xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-[48px] w-full rounded-full bg-[#243327] px-5 text-sm text-white outline-none placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-200">
                อีเมล
              </label>
              <input
                type="email"
                placeholder="example@emerald.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[48px] w-full rounded-full bg-[#243327] px-5 text-sm text-white outline-none placeholder:text-gray-500"
              />
            </div>

            {error && <p className="text-sm font-medium text-red-300">{error}</p>}

            <button
              type="button"
              disabled={loading}
              onClick={handleSave}
              className={`h-[54px] w-full rounded-full text-base font-bold shadow-lg shadow-green-900/40 transition ${
                loading
                  ? "cursor-not-allowed bg-[#89a58f] text-[#06160a]"
                  : "bg-[#50c463] text-[#06160a] hover:bg-[#63e86f]"
              }`}
            >
              {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
