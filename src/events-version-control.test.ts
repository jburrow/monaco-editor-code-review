import {
  reduceVersionControl,
  VersionControlEvent,
  FileStateStatus
} from "./events-version-control";
test("reduceComments", () => {
  let actions: VersionControlEvent[] = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "edit", fullPath: "/script1.py", text: "t1" }]
    }
  ];
  let store = reduceVersionControl(actions);
  expect(store.files["/script1.py"].text).toBe("t1");

  actions = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "edit", fullPath: "/script1.py", text: "t2" }]
    }
  ];
  store = reduceVersionControl(actions, store);
  expect(store.files["/script1.py"].text).toBe("t2");

  actions = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "edit", fullPath: "/script1.py", text: "t3" }]
    }
  ];
  store = reduceVersionControl(actions, store);
  expect(store.files["/script1.py"].text).toBe("t3");
  expect(store.files["/script1.py"].history.length).toBe(3);
});

test("reduceComments", () => {
  let actions: VersionControlEvent[] = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "edit", fullPath: "/script1.py", text: "t1" }]
    }
  ];
  let store = reduceVersionControl(actions);
  expect(store.files["/script1.py"].text).toBe("t1");

  actions = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "delete", fullPath: "/script1.py" }]
    }
  ];
  store = reduceVersionControl(actions, store);
  expect(store.files["/script1.py"].text).toBe(null);
  expect(store.files["/script1.py"].status).toBe(FileStateStatus.deleted);
  expect(store.files["/script1.py"].history.length).toBe(2);

  actions = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "edit", fullPath: "/script1.py", text: "t1" }]
    }
  ];
  store = reduceVersionControl(actions, store);
  expect(store.files["/script1.py"].text).toBe("t1");
  expect(store.files["/script1.py"].status).toBe(FileStateStatus.active);
});
