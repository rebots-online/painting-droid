import { useCanvasActionDispatcher } from "@/hooks";
import { useWorkspacesStore } from "@/store";
import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import {
  getImageDataFromCompressed,
  compressedFromImageData,
} from "@/utils/imageData";
import { coreClient } from "@/wasm/core/coreClient";
import { memo, useState } from "react";
import { Button } from "../ui/button";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const EffectsPanel = memo(() => {
  const [result, setResult] = useState<string>("");
  const canvasDispatcher = useCanvasActionDispatcher();
  const { layers, activeLayerIndex } = useWorkspacesStore((s) =>
    activeWorkspaceCanvasDataSelector(s)
  );

  const applyEffect = async (effect: "grayscale" | "sepia") => {
    const now = performance.now();
    const activeLayer = layers[activeLayerIndex];
    const data = activeLayer.data;
    if (!data) {
      setResult("No data to send");
      return;
    }
    const input = await getImageDataFromCompressed(data!);
    const output = await coreClient[effect](input);
    const compressedData = await compressedFromImageData(
      new ImageData(output.data, output.width, output.height)
    );
    const time = performance.now() - now;
    setResult(`Took: ${time}ms`);
    await canvasDispatcher.execute("updateLayerData", {
      layerId: activeLayer.id,
      source: translations.effects[effect],
      icon: "brain",
      data: compressedData,
    });
  };
  return (
    <div className="flex flex-col gap-medium">
      <div className="flex flex-wrap flex-col gap-small p-small">
        <Button
          className="w-full max-w-[200px]"
          variant="secondary"
          onClick={() => applyEffect("grayscale")}
        >
          Apply Grayscale
        </Button>
        <Button
          className="w-full max-w-[200px]"
          variant="secondary"
          onClick={() => applyEffect("sepia")}
        >
          Apply Sepia
        </Button>
        {result}
      </div>
    </div>
  );
});