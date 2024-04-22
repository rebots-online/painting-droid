import type { Size } from "@/utils/common";
import type { ImageCompressed } from "@/utils/imageData";
import type { BaseModel } from "./baseModel";

export type TextToImageModel = BaseModel & {
  textToImage: {
    sizes: Size[];
    execute: (
      modelId: string,
      text: string,
      size: Size
    ) => Promise<ImageCompressed>;
  };
};
