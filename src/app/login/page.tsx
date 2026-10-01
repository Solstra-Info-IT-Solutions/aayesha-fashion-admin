import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f7f2e7]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        <section className="relative hidden flex-col justify-between overflow-hidden border-r border-[#e6dfcf] bg-[linear-gradient(160deg,#f1ead9_0%,#e8dcc0_100%)] p-14 text-[#2a2520] lg:flex">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-[#b08d57]/30"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-20 h-[480px] w-[480px] rounded-full border border-[#b08d57]/30"
          />

          <p className="relative text-xs font-semibold uppercase tracking-[0.3em] text-[#6f542f]">
            Aayesha Fashion
          </p>

          <div className="relative">
            <h1 className="max-w-lg font-serif !text-[clamp(3rem,4.6vw,4.5rem)] !leading-[0.98] text-[#2a2520]">
              The house
              <br />
              behind the
              <br />
              collection.
            </h1>

            <div className="mt-8 h-px w-16 bg-[#b08d57]" />
          </div>

          <p className="relative max-w-md text-sm leading-7 text-[#5f584d]">
            Manage your store, collections, orders and customer experience
            from one place.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6f542f] lg:hidden">
                Aayesha Fashion
              </p>

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a6a3b]">
                Admin Portal
              </p>

              <h2 className="display mt-3 text-5xl font-semibold leading-none text-[#2a2520]">
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
