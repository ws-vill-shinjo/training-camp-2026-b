"use client";

import { useEffect } from "react";
import { initializeMasterRegistry } from "../../../master/registry/getMasterRegistry";

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    initializeMasterRegistry();
  }, []);

  return <>{children}</>;
};
