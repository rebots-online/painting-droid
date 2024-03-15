import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import type { CanvasLayerId } from "../canvasState";

export const createCanvasAction = (
  context: CanvasActionContext,
  payload: { layerId: CanvasLayerId }
): CanvasAction => {
  const { layerId } = payload;
  const state = context.getState();

  const currentIndex = state.layers.findIndex((layer) => layer.id === layerId);

  if (currentIndex === 0) {
    throw new Error("Cannot move layer down");
  }

  const capturedData = { currentIndex };

  return {
    display: "Move Layer Up",
    icon: "arrow-up",
    execute: async (state) => {
      const targetIndex = capturedData.currentIndex - 1;
      const layers = [...state.layers];
      const layer = layers[capturedData.currentIndex];
      layers[capturedData.currentIndex] = layers[targetIndex];
      layers[targetIndex] = layer;
      return { ...state, layers, activeLayerIndex: targetIndex };
    },
    undo: async (state) => {
      const targetIndex = capturedData.currentIndex + 1;
      const layers = [...state.layers];
      const layer = layers[capturedData.currentIndex];
      layers[capturedData.currentIndex] = layers[targetIndex];
      layers[targetIndex] = layer;
      return { ...state, layers, activeLayerIndex: targetIndex };
    },
  };
};

