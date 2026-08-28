import { TbArrowDownRight, TbArrowLeft, TbArrowUp, TbArrowUpRight } from "react-icons/tb";

const arrowIcons = {
  "down-right": TbArrowDownRight,
  left: TbArrowLeft,
  up: TbArrowUp,
  "up-right": TbArrowUpRight,
} as const;

type EtherealArrowProps = {
  direction?: keyof typeof arrowIcons;
  small?: boolean;
};

export function EtherealArrow({ direction = "up-right", small = false }: EtherealArrowProps) {
  const ArrowIcon = arrowIcons[direction];

  return (
    <span className={`ethereal-arrow${small ? " ethereal-arrow-small" : ""}`} aria-hidden="true">
      <ArrowIcon focusable="false" />
    </span>
  );
}
