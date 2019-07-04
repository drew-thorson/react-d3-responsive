import { number, shape } from "prop-types";

const Margin = shape({
  top: number,
  right: number,
  bottom: number,
  left: number
});

export default Margin;
