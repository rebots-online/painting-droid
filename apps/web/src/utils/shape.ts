import type { CanvasShape } from "@/canvas/canvasState";
import type { BoundingBox, Position, Shape2d } from "@/utils/common";
import {
  distanceBetweenPoints,
  isPositionInRectangle,
  normalizeBoundingBox,
} from "./geometry";
import { domNames } from "@/constants";

export const gripSize = 12;

export type TransformGripId =
  | "grip-top-left"
  | "grip-top-right"
  | "grip-bottom-left"
  | "grip-bottom-right";
export type TransformHandle = TransformGripId | "body";

const generateGrips = (
  boundingBox: BoundingBox
): { gripId: TransformGripId; position: Position }[] => {
  const { x, y, width, height } = boundingBox;
  return [
    { gripId: "grip-top-left", position: { x, y } },
    { gripId: "grip-top-right", position: { x: x + width, y } },
    { gripId: "grip-bottom-left", position: { x, y: y + height } },
    { gripId: "grip-bottom-right", position: { x: x + width, y: y + height } },
  ];
};

export const transformBoundingBox = (
  handle: TransformHandle,
  boundingBox: BoundingBox,
  startPosition: Position,
  endPosition: Position
): BoundingBox => {
  const distance = {
    x: endPosition.x - startPosition.x,
    y: endPosition.y - startPosition.y,
  };

  if (handle === "body") {
    return {
      x: boundingBox.x + distance.x,
      y: boundingBox.y + distance.y,
      width: boundingBox.width,
      height: boundingBox.height,
    };
  }

  if (handle === "grip-top-left") {
    return {
      x: endPosition.x,
      y: endPosition.y,
      width: boundingBox.x + boundingBox.width - endPosition.x,
      height: boundingBox.y + boundingBox.height - endPosition.y,
    };
  }
  if (handle === "grip-top-right") {
    return {
      x: boundingBox.x,
      y: endPosition.y,
      width: endPosition.x - boundingBox.x,
      height: boundingBox.y + boundingBox.height - endPosition.y,
    };
  }
  if (handle === "grip-bottom-left") {
    return {
      x: endPosition.x,
      y: boundingBox.y,
      width: boundingBox.x + boundingBox.width - endPosition.x,
      height: endPosition.y - boundingBox.y,
    };
  }
  if (handle === "grip-bottom-right") {
    return {
      x: boundingBox.x,
      y: boundingBox.y,
      width: endPosition.x - boundingBox.x,
      height: endPosition.y - boundingBox.y,
    };
  }

  return boundingBox;
};

export const getTransformHandle = (
  canvasPosition: Position,
  screenPosition: Position,
  boundingBox: BoundingBox
): TransformHandle | null => {
  const svgHostBox = document
    .getElementById(domNames.svgHostId)!
    .getBoundingClientRect();

  const gripElements = document.getElementsByClassName(domNames.svgGripClass);
  const relativeScreenPosition = {
    x: screenPosition.x + svgHostBox.x,
    y: screenPosition.y + svgHostBox.y,
  };

  for (const grip of gripElements) {
    const gripBox = grip.getBoundingClientRect();

    if (isPositionInRectangle(relativeScreenPosition, gripBox)) {
      return grip.getAttribute("data-grip-id") as TransformGripId;
    }
  }

  if (
    isPositionInRectangle(canvasPosition, normalizeBoundingBox(boundingBox))
  ) {
    return "body";
  }

  return null;
};

export const canvasShapeToShapes2d = (shape: CanvasShape): Shape2d[] => {
  const result: Shape2d[] = [];

  if (shape.capturedArea) {
    result.push({
      type: "image-rectangle",
      boundingBox: shape.boundingBox,
      blob: shape.capturedArea.data,
    });
  }

  if (shape.type === "captured-rectangle") {
    result.push({
      type: "selection-rectangle",
      rectangle: normalizeBoundingBox(shape.boundingBox),
    });

    result.push(
      ...generateGrips(shape.boundingBox).map(
        (grip) =>
          ({
            type: "selection-grip",
            gripId: grip.gripId,
            position: grip.position,
          } as const)
      )
    );
  }
  if (shape.type === "drawn-rectangle") {
    result.push({
      type: "rectangle",
      rectangle: normalizeBoundingBox(shape.boundingBox),
      fillColor: shape.fill,
      stroke: {
        color: shape.stroke.color,
        width: shape.stroke.width,
      },
    });
    result.push({
      type: "selection-rectangle",
      rectangle: normalizeBoundingBox(shape.boundingBox),
    });
    result.push(
      ...generateGrips(shape.boundingBox).map(
        (grip) =>
          ({
            type: "selection-grip",
            gripId: grip.gripId,
            position: grip.position,
          } as const)
      )
    );
  }

  return result;
};

const minShapeSize = 1;
const minScreenDistanceToDraw = 5;

export const validateShape = (
  boundingBox: BoundingBox,
  startScreenPosition: Position,
  endScreenPosition: Position
) => {
  const hasValidSize =
    boundingBox.width >= minShapeSize && boundingBox.height >= minShapeSize;

  const hasValidScreenDistance =
    distanceBetweenPoints(startScreenPosition, endScreenPosition) >
    minScreenDistanceToDraw;

  return hasValidSize && hasValidScreenDistance;
};

