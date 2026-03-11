import { JSX } from "react";
import Image from "next/image";

type iconprops = { image: string };

export const Footer_icon = ({ image }: iconprops): JSX.Element => {
  return (
    <div className="rounded-full w=80 h=80">
      <Image src={image} alt="アイコン" width={78} height={78} />
    </div>
  );
};
