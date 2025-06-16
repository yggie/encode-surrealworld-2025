"use client";

import { FullPageLoader } from "@/ui/progress/Loader";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAccount } from "wagmi";

export const dynamic = "force-dynamic";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isConnected, isConnecting, isReconnecting, status } = useAccount();

  useEffect(() => {
    if (!isConnected && !isConnecting && !isReconnecting) {
      router.push("/");
    }
  }, [router, isConnected, isConnecting, isReconnecting]);

  if (isConnecting || isReconnecting) return <FullPageLoader />;

  if (!isConnected) return null;

  return children;
}
