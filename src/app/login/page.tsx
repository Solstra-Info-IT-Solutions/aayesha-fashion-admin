import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#171717]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-between bg-[#171717] p-14 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#efa7ae]">
              Aayesha Fashion
            </p>

            <h1 className="mt-8 max-w-lg font-serif text-6xl leading-[0.95]">
              The house
              <br />
              behind the
              <br />
              collection.
            </h1>
          </div>

          <p className="max-w-md text-sm leading-7 text-[#c8c4c0]">
            Manage your store,
            collections, orders and
            customer experience from
            one place.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-[#fcfbf9] px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-[0.22em] text-[#969696]">
                Admin Portal
              </p>

              <h2 className="mt-3 font-serif text-5xl leading-none text-[#171717]">
                Welcome back
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#6f706f]">
                Sign in to manage
                Aayesha Fashion.
              </p>
            </div>

            <LoginForm />

            <p className="mt-8 text-center text-xs text-[#969696]">
              Authorized administrators only.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}