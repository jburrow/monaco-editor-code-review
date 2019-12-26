export type FileEditEvent = { type: "edit"; fullPath: string; text: string };
export type FileDeleteEvent = { type: "delete"; fullPath: string, };
export type FileRenameEvent = {
  type: "rename";
  fullPath: string;
  newFullPath: string;
  text: string;
};
type FileEvents = FileEditEvent | FileDeleteEvent | FileRenameEvent;

export type VersionControlEvent = {
  type: "commit";
  author: string;
  events: FileEvents[];
};

export enum FileStateStatus {
  active=1,
  deleted=2
}

export type FileState = {
  fullPath: string;
  text: string;
  status: FileStateStatus;
  history: VersionControlEvent[];
};

export interface VersionControlState {
  files: { [fullPath: string]: FileState };
}

function createFileState(
  event: VersionControlEvent,
  fullPath: string,
  text: string,
  history: VersionControlEvent[],
  status: FileStateStatus
):FileState {
  return {
    fullPath: fullPath,
    status:status,
    text: text,
    history: [...history, event]
  };
}

export function versionControlReducer(
  event: VersionControlEvent,
  state: VersionControlState
) {
  switch (event.type) {
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
          ...updates
        }
      };
  }
  return state;
}

export function reduceVersionControl(
  actions: VersionControlEvent[],
  state: VersionControlState = null
) {
  state = state || { files: {} };

  for (const a of actions) {
    state = versionControlReducer(a, state);
  }

  return state;
}
