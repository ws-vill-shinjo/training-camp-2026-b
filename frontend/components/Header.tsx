import { JSX, ReactNode } from "react";

type HeaderProps = {
  children?: ReactNode;
};

export const Header = ({ children }: HeaderProps): JSX.Element => {
  return (
    <header>
      <div className="bg-green-500 h-20 w-screen flex items-center justify-center">{children}</div>
    </header>
  );
};
