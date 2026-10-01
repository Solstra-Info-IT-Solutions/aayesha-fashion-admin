import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f7f2e7]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#2a2520] p-14 text-white lg:flex">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-20 h-[480px] w-[480px] rounded-full border border-white/10"
          />

          <p className="relative text-xs uppercase tracking-[0.3em] text-[#e4d8bd]">
            Aayesha Fashion
          </p>

          <div className="relative">
            <h1 className="max-w-lg font-serif text-6xl leading-[0.98] text-white">
              The house
              <br />
              behind the
              <br />
              collection.
            </h1>

            <div className="mt-8 h-px w-16 bg-[#b08d57]" />
          </div>

          <p className="relative max-w-md text-sm leading-7 text-[#d6ccb6]">
            Manage your store, collections, orders and customer experience
            from one place.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <p className="mb-8 text-[11px] uppercase tracking-[0.3em] text-[#26221d] lg:hidden">
                Aayesha Fashion
              </p>

              <p className="text-xs uppercase tracking-[0.22em] text-[#756d62]">
                Admin Portal
              </p>

              <h2 className="mt-3 font-serif text-5xl leading-none text-[#2a2520]">
                Welcome back
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#5f584d]">
                Sign in to manage Aayesha Fashion.
              </p>
            </div>

            <LoginForm />

            <p className="mt-8 text-center text-xs text-[#756d62]">
              Authorized administrators only.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
