import {
  reduceVersionControl,
  VersionControlEvent
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
  console.log(store,store.files['/script1.py'].history);

  actions = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "edit", fullPath: "/script1.py", text: "t2" }]
    }
  ];
  store = reduceVersionControl(actions, store);
  console.log(store,store.files['/script1.py'].history);

  actions = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "edit", fullPath: "/script1.py", text: "t3" }]
    }
  ];
  store = reduceVersionControl(actions, store);
  console.log(store,store.files['/script1.py'].history);
  //expect(Object.keys(store.comments)).toStrictEqual(['1']);
});
