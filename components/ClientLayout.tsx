"use client";

import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import CustomCursor from "@/components/CustomCursor";
import InitialLoader from "@/components/InitialLoader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <InitialLoader />
      <ScrollProgressBar />
      <CustomCursor />
      {children}
    </SmoothScroll>
  );
}
