import type { Rectangle } from "@/utils/common";
import type { ImageCompressed } from "@/utils/imageData";
import type { BaseModel } from "./baseModel";

export type ObjectDetectionResult = {
  label: string;
  score: number;
  box: Rectangle;
}[];

export type ObjectDetectionModel = BaseModel & {
  detectObjects: {
    settings: Record<string, unknown>;
    execute: (
      image: ImageCompressed,
      onProgress: (value: number, message: string) => void
    ) => Promise<ObjectDetectionResult>;
  };
};
