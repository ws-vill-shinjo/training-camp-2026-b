"use client";

import { useEffect, useState } from "react";
import { initializeMasterRegistry } from "../../../master/registry/getMasterRegistry";

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeMasterRegistry().then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return <>{children}</>;
};
