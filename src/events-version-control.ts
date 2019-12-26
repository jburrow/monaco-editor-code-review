export type FileEditEvent = { type: "edit"; fullPath: string; text: string };
export type FileDeleteEvent = { type: "delete"; fullPath: string };
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

export type FileState = {
  fullPath: string;
  text: string;
  history: VersionControlEvent[];
};

export interface VersionControlState {
  files: { [fullPath: string]: FileState };
}

export function versionControlReducer(
  event: VersionControlEvent,
  state: VersionControlState
) {
  switch (event.type) {
    case "commit":
      const updates: { [fullPath: string]: FileState } = {};
      for (const e of event.events) {
        switch (e.type) {
          case "edit":
            const prev = state[e.fullPath] || {
              fullPath: "",
              text: "",
              history: []
            };
            updates[e.fullPath] = {
              fullPath: e.fullPath,
              text: e.text,
              history: [...prev.history, e]
            };
            break;
          case "delete":
            break;
          case "rename":
            break;
        }
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
