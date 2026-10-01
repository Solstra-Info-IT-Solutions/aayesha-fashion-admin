import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function ChartCard({
  eyebrow,
  title,
  href,
  hrefLabel = "View all",
  actions,
  children,
  className = "",
}: {
  eyebrow: string;
  title: string;
  href?: string;
  hrefLabel?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`surface min-w-0 p-5 sm:p-6 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#756d62]">
            {eyebrow}
          </p>

          <h2 className="display mt-1 text-[26px] font-semibold leading-none text-[#2a2520]">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          {actions}

          {href ? (
            <Link
              href={href}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#8a6a3b] hover:underline"
            >
              {hrefLabel}
              <ArrowUpRight size={13} />
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}
