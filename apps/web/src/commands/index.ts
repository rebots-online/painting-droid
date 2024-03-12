import { command as saveCurrentWorkspaceAsFile } from "./saveCurrentWorkspaceAsFile";
import { command as addNewActiveWorkspace } from "./addNewActiveWorkspace";
import { command as openCommandPalette } from "./openCommandPalette";
import { command as resetLayout } from "./resetLayout";
import { createContext } from "./context";

export const commands = [
  saveCurrentWorkspaceAsFile,
  addNewActiveWorkspace,
  openCommandPalette,
  resetLayout,
] as const;

export const commandById = new Map(
  commands.map((command) => [command.id, command])
);

export type Command = (typeof commands)[number];
export type CommandId = Command["id"];

type MapToExecuteCommand<U> = U extends Command
  ? Parameters<U["execute"]>[1] extends undefined
    ? [id: U["id"]]
    : [id: U["id"], params: Parameters<U["execute"]>[1]]
  : never;

export const executeCommandWithDefaults = async (id: CommandId) =>
  executeCommand(id as never);

export const executeCommand = async (
  ...[id, params]: MapToExecuteCommand<Command>
) => {
  const context = createContext();
  const command = commandById.get(id);

  if (!command) {
    throw new Error(`Command not found: ${id}`);
  }

  return command.execute(context, params as never);
};
