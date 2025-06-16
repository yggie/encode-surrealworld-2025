"use client";

import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useAccount } from "wagmi";

export const SiteNavbar = () => {
  const { isConnected, connector } = useAccount();

  return (
    <header className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <Link className="btn btn-ghost uppercase" href="/">
          Replicon
        </Link>

        <Link className="btn btn-ghost" href="/people/discover">
          Discover
        </Link>
      </div>

      <div className="navbar-end">
        <ul className="menu menu-horizontal">
          <li>
            <Link href="/my/profile/setup" className="btn btn-ghost">
              Get started
            </Link>
          </li>

          <li>
            <ConnectKitButton />
          </li>
        </ul>
      </div>
    </header>
  );
};
