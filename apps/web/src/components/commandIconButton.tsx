import { CommandId, commandById, executeCommandWithDefaults } from "@/commands";
import { KeyGesture, keyGestureToString } from "@/utils/keyGesture";
import { IconButton } from "./iconButton";

const createCommandTooltip = (name: string, keyGesture?: KeyGesture) => {
  if (keyGesture) {
    return `${name} (${keyGestureToString(keyGesture)})`;
  } else {
    return name;
  }
};

export const CommandIconButton = (props: { commandId: CommandId }) => {
  const { commandId } = props;
  const command = commandById.get(commandId)!;
  return (
    <IconButton
      title={createCommandTooltip(command.name, command.defaultKeyGesture)}
      type={command.icon}
      size="small"
      onClick={() => executeCommandWithDefaults(commandId)}
    />
  );
};

