"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

const LoadingContext = createContext<{ setLoading: (v: boolean) => void }>({
  setLoading: () => {},
});

export const useNavigationLoading = () => useContext(LoadingContext);

export const NavigationLoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loadingPathname, setLoadingPathname] = useState<string | null>(null);
  const pathname = usePathname();

  const loading = loadingPathname === pathname;

  const setLoading = useCallback(
    (v: boolean) => {
      setLoadingPathname(v ? pathname : null);
    },
    [pathname]
  );

  return (
    <LoadingContext.Provider value={{ setLoading }}>
      {children}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="nav-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#F0F9EC]/80"
          >
            <div className="w-12 h-12 rounded-full border-4 border-[#B5D9A8] border-t-[#484234] animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
};
