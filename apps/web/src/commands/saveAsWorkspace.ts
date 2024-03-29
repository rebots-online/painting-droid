import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { activeWorkspaceSelector } from "@/store/workspacesStore";
import { workspace } from "@/contants";
import { getTranslations } from "@/translations";
import { fileSystem } from "@/utils/file-system";

const translations = getTranslations();

export const command = createCommand({
  id: "saveAsWorkspace",
  display: translations.commands.saveAsWorkspace,
  icon: "save",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const { canvasData, name, size } = activeWorkspaceSelector(
      context.stores.workspaces()
    );
    const text = JSON.stringify({
      version: workspace.version,
      size,
      data: canvasData,
    });
    fileSystem.saveTextToFile(text, name, workspace.format);
  },
});
