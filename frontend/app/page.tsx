"use client";

import { Facility } from "@/components/Facility";
import { TapZone } from "@/components/TapZone";

export default function HOME() {
  return (
    <div className="bg-[#F6EBD9]">
      <Facility />
      <TapZone />
    </div>
  );
}
