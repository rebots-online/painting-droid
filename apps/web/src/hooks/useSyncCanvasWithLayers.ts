import type { CanvasLayer, CanvasOverlayShape } from "@/canvas/canvasState";
import type { CanvasRasterContext } from "@/utils/common";
import { type RefObject, useEffect, useRef } from "react";
import { clearContext } from "@/utils/canvas";
import { features } from "@/constants";
import { useStableCallback } from ".";

const restoreLayers = async (
  contextStack: CanvasRasterContext[],
  layers: CanvasLayer[],
  overlayShape: CanvasOverlayShape | null
) => {
  //run all operations together to avoid flickering
  const canvasOperations: (() => void)[] = [];

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const context = contextStack[i];

    if (layer.visible && layer.data) {
      const image = await createImageBitmap(layer.data);
      const { width, height } = image;
      canvasOperations.push(() => {
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
      });
    } else {
      canvasOperations.push(() => clearContext(context));
    }
  }

  canvasOperations.forEach((operation) => operation());
};

export const useSyncCanvasWithLayers = (
  canvasStackRef: RefObject<HTMLCanvasElement[]>,
  layers: CanvasLayer[],
  activeLayerIndex: number,
  overlayShape: CanvasOverlayShape | null,
  onFinished: (activeLayerContext: CanvasRasterContext) => void
) => {
  const contextsMap = useRef(
    new WeakMap<HTMLCanvasElement, CanvasRasterContext>()
  );
  const onFinishedStable = useStableCallback(onFinished);

  useEffect(() => {
    if (!canvasStackRef.current) {
      return;
    }

    const stackContexts = canvasStackRef.current.map(
      (element: HTMLCanvasElement) => {
        if (!contextsMap.current.has(element)) {
          contextsMap.current.set(
            element,
            features.offscreenCanvas
              ? element.transferControlToOffscreen().getContext("2d")!
              : element.getContext("2d")!
          );
        }
        return contextsMap.current.get(element)!;
      }
    );

    restoreLayers(stackContexts, layers, overlayShape).then(() =>
      onFinishedStable(stackContexts[activeLayerIndex])
    );
  }, [
    layers,
    activeLayerIndex,
    overlayShape,
    canvasStackRef,
    onFinishedStable,
  ]);
};

