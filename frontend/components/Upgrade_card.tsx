import { JSX } from "react";

type upgrade_cardprops = {
  name: string;
  level: number;
};

export const Upgrade_card = ({ name, level }: upgrade_cardprops): JSX.Element => {
  return (
    <div className="bg-[#E8A87C] w-313px h-80px items-center justify-center z--1">
      <h2 className="bg=[#F2E4D8] w-84px h-67px">{name}</h2>
      <h4>{level}</h4>
    </div>
  );
};
