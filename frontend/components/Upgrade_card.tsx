import { JSX } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

const item = [
  {
    label: "じゃがいも",
    lv: 1,
  },
];

export const Upgradecard = ({ label, lv }) => {
  return (
    <div className="justify-center items-center flex">
      <Button variant="ghost">
        <Card size="sm" className="flex items-start bg-[#E8A87C] h-20 w-80 max-w-sm">
          <span className="inline-flex text-3xl ml-3">
            <h1 className="bg-[#F2E4D8] h-15 w-15">LV.{lv}</h1>
            <p className="text-white ml-1">{label}</p>
          </span>
        </Card>
      </Button>
    </div>
  );
};
