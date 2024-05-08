import { createCanvasAction as removeLayer } from "./removeLayer";
import { createCanvasAction as addLayer } from "./addLayer";
import { createCanvasAction as updateLayerData } from "./updateLayerData";
import { createCanvasAction as selectLayer } from "./selectLayer";
import { createCanvasAction as duplicateLayer } from "./duplicateLayer";
import { createCanvasAction as moveLayerUp } from "./moveLayerUp";
import { createCanvasAction as moveLayerDown } from "./moveLayerDown";
import { createCanvasAction as hideLayer } from "./hideLayer";
import { createCanvasAction as showLayer } from "./showLayer";
import { createCanvasAction as drawCapturedArea } from "./drawCapturedArea";
import { createCanvasAction as transformCapturedArea } from "./transformCapturedArea";
import { createCanvasAction as clearCapturedArea } from "./clearCapturedArea";
import { createCanvasAction as applyCapturedArea } from "./applyCapturedArea";
import { createCanvasAction as cutCapturedArea } from "./cutCapturedArea";
import { createCanvasAction as cropCanvas } from "./cropCanvas";
import { createCanvasAction as resizeCanvas } from "./resizeCanvas";
import { createCanvasAction as mergeLayerDown } from "./mergeLayerDown";

export const canvasActions = {
  removeLayer,
  addLayer,
  updateLayerData,
  selectLayer,
  duplicateLayer,
  moveLayerUp,
  moveLayerDown,
  hideLayer,
  showLayer,
  drawCapturedArea,
  transformCapturedArea,
  clearCapturedArea,
  applyCapturedArea,
  cutCapturedArea,
  cropCanvas,
  resizeCanvas,
  mergeLayerDown,
};

