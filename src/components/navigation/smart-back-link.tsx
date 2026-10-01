"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

import { goBackTo } from "@/lib/nav-history";

type SmartBackLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/**
 * A normal link (right-click, open in new tab and crawlers still work) that,
 * on a plain click, goes back in history when the visitor came from `href`
 * and otherwise replaces the current entry rather than pushing a new one.
 */
export function SmartBackLink({ href, onClick, ...props }: SmartBackLinkProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    goBackTo(router, href);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
