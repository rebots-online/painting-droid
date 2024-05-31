import { isMobile, platform } from "./utils/platform";

export const features = {
  offscreenCanvas: false,
  // platform !== "e2e" && "oncontextlost" in new OffscreenCanvas(0, 0),
  nativeMenuBar: false, //waiting for tauri fix, platform === "darwin",
  nativeColorPicker: isMobile(),
  shareFiles: "share" in navigator,
};

