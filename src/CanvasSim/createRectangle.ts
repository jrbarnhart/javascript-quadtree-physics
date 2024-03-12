import { Rectangle } from "./defs";

const createRectangle = (
  x: number,
  y: number,
  height: number,
  width: number
) => {
  const rectangle: Rectangle = {
    x,
    y,
    height,
    width,
    top: y - height / 2,
    bottom: y + height / 2,
    left: x - width / 2,
    right: x + width / 2,
  };

  return rectangle;
};

export default createRectangle;
