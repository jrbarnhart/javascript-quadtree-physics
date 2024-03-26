const HeadsUpDisplay = ({
  totalParticles,
  setDrawQuadtree,
}: {
  totalParticles: number | null;
  setDrawQuadtree: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleShowClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setDrawQuadtree((previous) => !previous);
  };

  return (
    <>
      <div className="absolute top-0 grid items-end text-neutral-50 h-full w-full pointer-events-none">
        <div className="p-5">
          <p>Particles: {totalParticles}</p>
        </div>
      </div>
      <button
        onClick={handleShowClick}
        className="absolute bottom-0 right-0 text-neutral-950 p-2 m-5 bg-neutral-50 rounded-md active:bg-neutral-400"
      >
        Show Quadtree
      </button>
    </>
  );
};

export default HeadsUpDisplay;
