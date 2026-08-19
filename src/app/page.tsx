"use client";

import { SpatialProvider } from "@/lib/spatial-store";
import { SpatialViewport } from "@/components/spatial/SpatialViewport";

export default function HomePage() {
  return (
    <SpatialProvider>
      <SpatialViewport />
    </SpatialProvider>
  );
}
