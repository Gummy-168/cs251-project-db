'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setError('');
    router.push('/Admin/editMovie');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07110c] px-6 py-16 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.12),_transparent_22%)]" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-emerald-900/60 bg-[#0d1711]/95 shadow-[0_35px_90px_rgba(0,0,0,0.45)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-between border-b border-emerald-950/70 bg-[linear-gradient(135deg,_rgba(13,23,17,0.98),_rgba(18,33,24,0.9))] p-8 lg:border-b-0 lg:border-r">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-400/80">
              Emerald Cinema
            </p>
            <h1 className="mt-5 max-w-md text-4xl font-semibold leading-tight text-white">
              Admin sign in for the projection booth.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-gray-400">
              หน้า login นี้ถูกย้ายมาอยู่ใน Next/React แล้ว เพื่อให้เชื่อม route และการนำทางกับหน้าแอดมินได้ตรงกันทั้งระบบ
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Sessions', value: '24' },
              { label: 'Movies Live', value: '58' },
              { label: 'Staff Online', value: '07' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-[#1e3025] bg-[#132019] px-4 py-5">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-500">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold text-emerald-300">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="p-8 lg:p-10">
          <div className="mx-auto w-full max-w-md">
            <p className="text-sm font-medium text-emerald-400">Welcome back</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Sign in</h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Use any email and password to continue into the admin movie editor.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block space-y-2 text-sm text-gray-300">
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full rounded-2xl border border-[#23352a] bg-[#121c16] px-4 py-3 text-white outline-none transition focus:border-emerald-500"
                  required
                />
              </label>

              <label className="block space-y-2 text-sm text-gray-300">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-[#23352a] bg-[#121c16] px-4 py-3 text-white outline-none transition focus:border-emerald-500"
                  required
                />
              </label>

              {error ? <p className="text-sm text-rose-400">{error}</p> : null}

              <button
                type="submit"
                className="w-full rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#09120c] transition hover:bg-emerald-400"
              >
                Sign In
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
