import type { ImageCompressedData } from "@/utils/imageData";
import type { Viewport } from "@/utils/manipulation";
import { uuid } from "@/utils/uuid";
import { create, type StateCreator } from "zustand";

export type WorkspaceId = string;
export type LayerId = string;

export type Layer = {
  id: LayerId;
  name: string;
  visible: boolean;
  locked: boolean;
  compressedData: ImageCompressedData | null;
};

export type LayerChange =
  | {
      type: "add";
      id: LayerId;
      name: string;
      data: ImageCompressedData | null;
    }
  | {
      type: "updateLayer";
      id: LayerId;
      data: ImageCompressedData;
    };

type CanvasData = {
  activeLayerIndex: number;
  layers: Layer[];
  history: LayerChange[];
};

export type Workspace = {
  id: WorkspaceId;
  name: string;
  filePath: string | null;
  viewport: Viewport | null;
  canvasData: CanvasData;
};

export type AppWorkspacesState = {
  workspaces: Workspace[];
  selectedWorkspaceId: WorkspaceId;
};

const defaultLayer: Layer = {
  id: uuid(),
  name: "Background",
  visible: true,
  locked: false,
  compressedData: null,
};

const defaultWorkspace: Workspace = {
  id: uuid(),
  name: "Untitled",
  filePath: null,
  viewport: null,
  canvasData: {
    activeLayerIndex: 0,
    layers: [defaultLayer],
    history: [],
  },
};

const defaultState: AppWorkspacesState = {
  workspaces: [defaultWorkspace],
  selectedWorkspaceId: defaultWorkspace.id,
};

type AppWorkspacesSlice = AppWorkspacesState & {
  selectWorkspace: (workspaceId: WorkspaceId) => void;
  setWorkspaceViewport: (viewport: Viewport) => void;
  addNewActiveWorkspace: () => void;
  pushLayerChange: (change: LayerChange) => void;
  selectLayer: (layerId: LayerId) => void;
  addLayer: () => void;
  removeLayer: (layerId: LayerId) => void;
  duplicateLayer: (layerId: LayerId) => void;
  moveLayerUp: (layerId: LayerId) => void;
  moveLayerDown: (layerId: LayerId) => void;
  showLayer: (layerId: LayerId) => void;
  hideLayer: (layerId: LayerId) => void;
};

export const mapSelectedWorkspace = (
  state: AppWorkspacesState,
  map: (workspace: Workspace) => Workspace
) => {
  const selectedWorkspace = state.selectedWorkspaceId;
  return {
    ...state,
    workspaces: state.workspaces.map((workspace) =>
      workspace.id === selectedWorkspace ? map(workspace) : workspace
    ),
  };
};

export const mapCanvasData = (
  state: AppWorkspacesState,
  map: (canvasData: CanvasData) => CanvasData
) => {
  const selectedWorkspace = state.selectedWorkspaceId;
  return {
    ...state,
    workspaces: state.workspaces.map((workspace) =>
      workspace.id === selectedWorkspace
        ? { ...workspace, canvasData: map(workspace.canvasData) }
        : workspace
    ),
  };
};

export const workspacesStoreCreator: StateCreator<AppWorkspacesSlice> = (
  set
) => ({
  ...defaultState,
  selectWorkspace: (id) => set({ selectedWorkspaceId: id }),
  setWorkspaceViewport: (viewport) =>
    set((state) =>
      mapSelectedWorkspace(state, (workspace) => ({
        ...workspace,
        viewport,
      }))
    ),
  addNewActiveWorkspace: () => {
    const newId = uuid();
    return set((state) => ({
      ...state,
      workspaces: [
        ...state.workspaces,
        {
          ...defaultWorkspace,
          id: newId,
          name: `Untitled ${state.workspaces.length + 1}`,
        },
      ],
      selectedWorkspaceId: newId,
    }));
  },
  pushLayerChange: (change) => {
    return set((state) =>
      mapCanvasData(state, (canvasData) => {
        return {
          ...canvasData,
          layers: canvasData.layers.map((layer) => {
            if (layer.id === change.id) {
              return {
                ...layer,
                compressedData: change.data,
              };
            }
            return layer;
          }),
          history: [...canvasData.history, change],
        };
      })
    );
  },
  selectLayer: (layerId: LayerId) => {
    return set((state) =>
      mapCanvasData(state, (canvasData) => {
        return {
          ...canvasData,
          activeLayerIndex: canvasData.layers.findIndex(
            (layer) => layer.id === layerId
          ),
        };
      })
    );
  },
  addLayer: () => {
    const newLayerId = uuid();
    return set((state) =>
      mapCanvasData(state, (canvasData) => {
        return {
          ...canvasData,
          layers: [
            ...canvasData.layers,
            {
              ...defaultLayer,
              id: newLayerId,
              name: `Layer ${canvasData.layers.length + 1}`,
            },
          ],
          activeLayerIndex: canvasData.layers.length,
        };
      })
    );
  },
  removeLayer: (layerId: LayerId) => {
    return set((state) =>
      mapCanvasData(state, (canvasData) => {
        if (canvasData.layers.length === 1) {
          return canvasData;
        }
        const index = canvasData.layers.findIndex(
          (layer) => layer.id === layerId
        );
        return {
          ...canvasData,
          layers: canvasData.layers.filter((layer) => layer.id !== layerId),
          activeLayerIndex:
            index === canvasData.activeLayerIndex
              ? Math.max(index - 1, 0)
              : canvasData.activeLayerIndex,
        };
      })
    );
  },
  duplicateLayer: (layerId: LayerId) => {
    return set((state) =>
      mapCanvasData(state, (canvasData) => {
        const index = canvasData.layers.findIndex(
          (layer) => layer.id === layerId
        );
        return {
          ...canvasData,
          layers: [
            ...canvasData.layers.slice(0, index + 1),
            {
              ...canvasData.layers[index],
              id: uuid(),
              name: `${canvasData.layers[index].name} copy`,
            },
            ...canvasData.layers.slice(index + 1),
          ],
          activeLayerIndex: index + 1,
        };
      })
    );
  },
  moveLayerUp: (layerId: LayerId) => {
    return set((state) =>
      mapCanvasData(state, (canvasData) => {
        const currentIndex = canvasData.layers.findIndex(
          (layer) => layer.id === layerId
        );
        const targetIndex = currentIndex + 1;
        if (currentIndex === canvasData.layers.length - 1) {
          return canvasData;
        }
        const layers = [...canvasData.layers];
        const layer = layers[currentIndex];
        layers[currentIndex] = layers[targetIndex];
        layers[targetIndex] = layer;
        return { ...canvasData, layers, activeLayerIndex: targetIndex };
      })
    );
  },
  moveLayerDown: (layerId: LayerId) => {
    return set((state) =>
      mapCanvasData(state, (canvasData) => {
        const currentIndex = canvasData.layers.findIndex(
          (layer) => layer.id === layerId
        );
        const targetIndex = currentIndex - 1;
        if (currentIndex === 0) {
          return canvasData;
        }
        const layers = [...canvasData.layers];
        const layer = layers[currentIndex];
        layers[currentIndex] = layers[targetIndex];
        layers[targetIndex] = layer;
        return { ...canvasData, layers, activeLayerIndex: targetIndex };
      })
    );
  },
  showLayer: (layerId: LayerId) => {
    return set((state) =>
      mapCanvasData(state, (canvasData) => ({
        ...canvasData,
        layers: canvasData.layers.map((layer) =>
          layer.id === layerId ? { ...layer, visible: true } : layer
        ),
      }))
    );
  },
  hideLayer: (layerId: LayerId) => {
    return set((state) =>
      mapCanvasData(state, (canvasData) => ({
        ...canvasData,
        layers: canvasData.layers.map((layer) =>
          layer.id === layerId ? { ...layer, visible: false } : layer
        ),
      }))
    );
  },
});

export const useWorkspacesStore = create<AppWorkspacesSlice>(
  workspacesStoreCreator
);

export const selectedWorkspaceSelector = (state: AppWorkspacesState) => {
  return state.workspaces.find((w) => w.id === state.selectedWorkspaceId)!;
};

export const activeWorkspaceCanvasDataSelector = (
  state: AppWorkspacesState
) => {
  return state.workspaces.find((w) => w.id === state.selectedWorkspaceId)!
    .canvasData;
};
