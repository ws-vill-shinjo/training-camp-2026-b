export const Header = () => {
  const title = "Home";

  return (
    <header>
      <div className="text-center bg-red-500">
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
    </header>
  );
};
