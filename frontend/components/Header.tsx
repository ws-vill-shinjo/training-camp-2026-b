import { JSX } from "react";

type HeaderProps = {
  title: string;
};

export const Header = ({ title }: HeaderProps): JSX.Element => {
  return (
    <header>
      <div className="bg-[#2ECC71] h-30 w-screen flex items-center justify-center">
        <h1 className="text-6xl text-white">{title}</h1>
      </div>
    </header>
  );
};
