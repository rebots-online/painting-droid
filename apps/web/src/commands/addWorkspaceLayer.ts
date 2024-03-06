import { CommandContext } from "./context";

export const command = {
  name: "addWorkspaceLayer",
  description: "Add a new layer to the workspace",
  execute: async (
    context: CommandContext,
    payload: {
      workspaceId: string;
      layerName: string;
    }
  ) => {
    console.log("Adding a new layer to the workspace", context, payload);
  },
} as const;

