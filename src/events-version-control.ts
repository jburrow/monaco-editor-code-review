export type FileEditEvent = { type: "edit"; fullPath: string; text: string };
export type FileDeleteEvent = { type: "delete"; fullPath: string, };
export type FileRenameEvent = {
  type: "rename";
  fullPath: string;
  newFullPath: string;
  text: string;
};
export type FileEvents = FileEditEvent | FileDeleteEvent | FileRenameEvent;

export type VersionControlEvent = {
  type: "commit";
  id?: string,
  author: string;
  events: FileEvents[];
} | {
  type: "reset";
  id?: string;
}

export enum FileStateStatus {
  active = 1,
  deleted = 2
}

export type FileState = {
  fullPath: string;
  text: string;
  status: FileStateStatus;
  history: VersionControlEvent[];
};

export interface VersionControlState {
  files: Record<string, FileState>;
  version: number;
  events: VersionControlEvent[];
}

function createFileState(
  event: VersionControlEvent,
  fullPath: string,
  text: string,
  history: VersionControlEvent[],
  status: FileStateStatus
): FileState {
  return {
    fullPath: fullPath,
    status: status,
    text: text,
    history: [...history, event]
  };
}

export function initialVersionControlState(): VersionControlState {
  return { files: {}, version: -1, events: [] };
}

export function versionControlReducer(
  state: VersionControlState, event: VersionControlEvent,
) {

  switch (event.type) {
    case "reset":
      return initialVersionControlState();
      
    case "commit":
      const updates: { [fullPath: string]: FileState } = {};
      for (const e of event.events) {
        const prev = state.files[e.fullPath] || {
          fullPath: null,
          text: null,
          status: FileStateStatus.active,
          history: []
        };
        let status = FileStateStatus.active;
        let text = null;

        switch (e.type) {
          case "edit":
            text = e.text;
            break;
          case "delete":
            status = FileStateStatus.deleted;

            break;
          case "rename":
            status = FileStateStatus.deleted;

            updates[e.newFullPath] = createFileState(
              event,
              e.newFullPath,
              e.text || prev.text,
              prev.history,
              status
            );
            break;
        }

        updates[e.fullPath] = createFileState(
          event,
          e.fullPath,
          text,
          prev.history,
          status
        );
      }
      return {
        files: {
          ...state.files,
          ...updates,
        },
        events:[...state.events, event],
        version: state.version + 1
      };
  }
}

export function reduceVersionControl(
  actions: VersionControlEvent[],
  state: VersionControlState = null
) {
  state = state || initialVersionControlState();

  for (const a of actions) {
    state = versionControlReducer(state, a);
  }

  return state;
}
