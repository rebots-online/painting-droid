import { IconButton } from "../icons/iconButton";
import { useToolStore } from "@/store";
import { memo } from "react";
import { type ToolId, defaultToolsSettings, toolsMetadata } from "@/tools";
import type { IconType } from "../icons/icon";
import { useCommandService } from "@/contexts/commandService";
import { CommandIconButton } from "../commandIconButton";
import { Separator } from "../ui/separator";
import { testIds } from "@/utils/testIds";

const tools: { id: ToolId; icon: IconType; name: string }[] = (
  Object.keys(defaultToolsSettings) as ToolId[]
).map((id) => {
  const metadata = toolsMetadata[id];
  return {
    id,
    icon: metadata.icon,
    name: metadata.name,
  };
});

export const ToolsPanel = memo(() => {
  const { selectedToolId } = useToolStore((state) => state);
  const { executeCommand } = useCommandService();

  return (
    <div className="flex flex-col gap-medium">
      <div className="flex flex-wrap flex-row gap-small p-small">
        {tools.map(({ id, icon, name }) => (
          <IconButton
            data-testid={testIds.toolButton(id)}
            aria-label={name}
            title={name}
            className={
              selectedToolId === id
                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                : ""
            }
            key={id}
            type={icon}
            size="medium"
            onClick={() => executeCommand("selectTool", { toolId: id })}
          />
        ))}
        <Separator orientation="horizontal" className="my-1" />
        <CommandIconButton size="medium" commandId="openTextToImageDialog" />
        <CommandIconButton
          size="medium"
          commandId="openObjectDetectionDialog"
        />
      </div>
    </div>
  );
});

