"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

const LoadingContext = createContext<{ setLoading: (v: boolean) => void }>({
  setLoading: () => {},
});

export const useNavigationLoading = () => useContext(LoadingContext);

export const NavigationLoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      setLoading(false);
    }
  }, [pathname]);

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
