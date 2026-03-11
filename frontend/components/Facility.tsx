import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const items = [
  {
    label: "じゃがいも",
    img: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Patates.jpg",
    progress: 40,
  },
  {
    label: "にんじん",
    img: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Vegetable-Carrot-Bundle-wStalks.jpg",
    progress: 70,
  },
  {
    label: "たまねぎ",
    img: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Onions.jpg",
    progress: 55,
  },
];

function ItemCard({ img, label, progress }) {
  return (
    <Card className="overflow-hidden w-80 rounded-xl border-none shadow-md p-0 gap-0">
      <div className="flex items-center gap-0 px-3 py-3" style={{ backgroundColor: "#d9a97a" }}>
        <img src={img} alt={label} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
        <span className="text-white text-lg font-bold tracking-wide ms-4">{label}</span>
      </div>
      <div className="px-3 py-2" style={{ backgroundColor: "#d9a97a" }}>
        <Progress value={progress}></Progress>
      </div>
    </Card>
  );
}

export const Facility = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-5 gap-4 p-0">
      {items.map((item) => (
        <ItemCard key={item.label} {...item} />
      ))}
    </div>
  );
};
