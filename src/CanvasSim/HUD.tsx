const HeadsUpDisplay = ({
  mousePosX,
  mousePosY,
  totalParticles,
}: {
  mousePosX: number | null;
  mousePosY: number | null;
  totalParticles: number | null;
}) => {
  return (
    <div className="absolute top-0 grid items-end text-neutral-50 h-full w-full pointer-events-none">
      <div className="p-5">
        <p>MouseX: {mousePosX}</p>
        <p>MouseY: {mousePosY}</p>
        <p>Particles: {totalParticles}</p>
      </div>
    </div>
  );
};

export default HeadsUpDisplay;
