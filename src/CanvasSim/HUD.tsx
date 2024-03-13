const HeadsUpDisplay = ({
  mousePosX,
  mousePosY,
  fps,
}: {
  mousePosX: number | null;
  mousePosY: number | null;
  fps: number | null;
}) => {
  return (
    <div className="absolute top-0 text-neutral-50 h-full w-full pointer-events-none">
      <div className="p-5">
        <p>FPS: {fps}</p>
        <p>MouseX: {mousePosX}</p>
        <p>MouseY: {mousePosY}</p>
      </div>
    </div>
  );
};

export default HeadsUpDisplay;
