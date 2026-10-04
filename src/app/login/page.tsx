import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#111111]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        <section className="relative hidden flex-col justify-between overflow-hidden border-r border-[#2e2a26] bg-[linear-gradient(160deg,#1c1a17_0%,#0f0f0f_100%)] p-14 text-[#f8f3f1] lg:flex">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-[#b79a6a]/30"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-20 h-[480px] w-[480px] rounded-full border border-[#b79a6a]/30"
          />

          <p className="relative text-xs font-semibold uppercase tracking-[0.3em] text-[#d9c7a3]">
            Aayesha Fashion
          </p>

          <div className="relative">
            <h1 className="max-w-lg font-serif !text-[clamp(3rem,4.6vw,4.5rem)] !leading-[0.98] text-[#f8f3f1]">
              The house
              <br />
              behind the
              <br />
              collection.
            </h1>

            <div className="mt-8 h-px w-16 bg-[#b79a6a]" />
          </div>

          <p className="relative max-w-md text-sm leading-7 text-[#cfc7bb]">
            Manage your store, collections, orders and customer experience
            from one place.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d9c7a3] lg:hidden">
                Aayesha Fashion
              </p>

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d9c7a3]">
                Admin Portal
              </p>

              <h2 className="display mt-3 text-5xl font-semibold leading-none text-[#f8f3f1]">
                Welcome back
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#cfc7bb]">
                Sign in to manage Aayesha Fashion.
              </p>
            </div>

            <LoginForm />

            <p className="mt-8 text-center text-xs text-[#9a9185]">
              Authorized administrators only.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
