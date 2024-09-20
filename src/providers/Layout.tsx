"use client";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/sonner";
import {
  useBackButton,
  useClosingBehavior,
  useViewport,
} from "@telegram-apps/sdk-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const bb = useBackButton();
  const close = useClosingBehavior(); // will be undefined or ClosingBehavior.
  const viewport = useViewport(); // will be undefined or InitData.
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    function goBack() {
      router.back();
    }
    if (close) {
      close.enableConfirmation();
    }
    if (viewport) {
      viewport.expand();
    }
    if (bb) {
      if (pathname === "/") {
        bb.hide();
        return;
      }
      bb.show();
      bb.on("click", goBack);
    }
  }, [bb, router, pathname]);

  return (
    <main className="bg-background">
      <Navbar />
      <main>{children}</main>
      {/* <BottomBar /> */}
      <Toaster richColors />
    </main>
  );
}

export default Layout;
