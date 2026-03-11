import { JSX, ReactNode } from "react";

type HeaderProps = {
  children?: ReactNode;
};

export const Header = ({ children }: HeaderProps): JSX.Element => {
  return (
    <header>
      <div className="bg-[#B5D9A8] text-white h-24 w-screen flex items-center justify-center">
        {children}
      </div>
    </header>
  );
};
