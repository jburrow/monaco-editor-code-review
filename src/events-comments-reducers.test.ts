import { ReviewCommentEvent, reduceComments } from "./events-comments-reducers";

test("reduceComments - create|edit|delete", () => {
  const store = reduceComments([
    { type: "create", id: "1", text: "t1", lineNumber: 1 }
  ]);
  expect(Object.keys(store.comments)).toStrictEqual(["1"]);
  expect(store.comments["1"].comment).toStrictEqual({
    selection: undefined,
    status: 1,
    author: undefined,
    dt: undefined,
    id: "1",
    lineNumber: 1,
    text: "t1",
    parentId: undefined
  });

  const store2 = reduceComments(
    [{ type: "edit", id: "2", targetId: "1", text: "t2" }],
    store
  );
  expect(store2).not.toBe(store);
  expect(store2.comments["1"]).not.toBe(store.comments["1"]);
  expect(store2.comments["1"].history).not.toBe(store.comments["1"].history);
  expect(store2.comments["1"].history.length).toBe(2);
  expect(store.comments["1"].history.length).toBe(1);

  expect(Object.keys(store2.comments)).toStrictEqual(["1"]);
  expect(store2.comments["1"].comment).toStrictEqual({
    selection: undefined,
    status: 1,
    author: undefined,
    dt: undefined,
    id: "1",
    lineNumber: 1,
    text: "t2",
    parentId: undefined
  });

  const store3 = reduceComments(
    [{ type: "delete", id: "3", targetId: "1" }],
    store2
  );
  expect(store3).not.toBe(store2);
  expect(Object.keys(store3.comments)).toStrictEqual([]);
});

test("reduceComments - double delete - create|delete|delete", () => {
  const actions: ReviewCommentEvent[] = [
    { type: "create", id: "1", text: "t1", lineNumber: 1 }
  ];

  const store = reduceComments(actions);
  expect(Object.keys(store.comments)).toStrictEqual(["1"]);
  expect(store.comments["1"].comment).toStrictEqual({
    selection: undefined,
    status: 1,
    author: undefined,
    dt: undefined,
    id: "1",
    lineNumber: 1,
    text: "t1",
    parentId: undefined
  });

  const store2 = reduceComments([{ type: "delete", targetId: "1" }], store);
  expect(store2).not.toBe(store);
  expect(Object.keys(store2.comments)).toStrictEqual([]);

  const store3 = reduceComments([{ type: "delete", targetId: "1" }], store2);
  expect(store3).not.toBe(store);
  expect(Object.keys(store2.comments)).toStrictEqual([]);
});

test("reduceComments - edit missing", () => {
  const actions: ReviewCommentEvent[] = [
    { type: "edit", id: "1", text: "t1", targetId: "1" }
  ];

  const store = reduceComments(actions);
  expect(Object.keys(store.comments)).toStrictEqual([]);
});
