import { number, oneOf, shape } from "prop-types";

export const Margin = shape({
  top: number,
  right: number,
  bottom: number,
  left: number
});

export const LineTypes = oneOf([
  "cardinal",
  "linear",
  "step",
  "step-after",
  "step-before"
]);

// export default Margin;
