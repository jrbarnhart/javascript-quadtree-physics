const HeadsUpDisplay = ({
  mousePosX,
  mousePosY,
}: {
  mousePosX: number | null;
  mousePosY: number | null;
}) => {
  return (
    <div className="absolute top-0 text-neutral-50 h-full w-full pointer-events-none">
      <div className="p-5">
        <p>MouseX: {mousePosX}</p>
        <p>MouseY: {mousePosY}</p>
      </div>
    </div>
  );
};

export default HeadsUpDisplay;
