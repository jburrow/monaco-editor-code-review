import {
  ReviewComment,
  ReviewCommentEvent,
  ReviewCommentType,
  reduceComments,
} from "./events-comments-reducers";

test("reduceComments - create|edit|delete", () => {
  const store = reduceComments([{ type: "create", id: "1", text: "t1", lineNumber: 1, createdAt: 1, createdBy: "a" }]);
  expect(Object.keys(store.comments)).toStrictEqual(["1"]);
  expect(store.comments["1"].comment).toStrictEqual<ReviewComment>({
    selection: undefined,
    status: 1,
    author: "a",
    dt: 1,
    id: "1",
    lineNumber: 1,
    text: "t1",
    parentId: undefined,
    type: ReviewCommentType.comment,
    typeState: undefined,
  });

  const store2 = reduceComments(
    [{ type: "edit", targetId: "1", text: "t2", id: "1", createdAt: 1, createdBy: "a" }],
    store,
  );
  expect(store2).not.toBe(store);
  expect(store2.comments["1"]).not.toBe(store.comments["1"]);
  expect(store2.comments["1"].history).not.toBe(store.comments["1"].history);
  expect(store2.comments["1"].history.length).toBe(2);
  expect(store.comments["1"].history.length).toBe(1);

  expect(Object.keys(store2.comments)).toStrictEqual(["1"]);
  const store3 = reduceComments([{ type: "delete", targetId: "1", id: "1", createdAt: 1, createdBy: "a" }], store2);
  expect(store3).not.toBe(store2);
  expect(Object.keys(store3.comments)).toStrictEqual([]);
});

test("reduceComments - double delete - create|delete|delete", () => {
  const actions: ReviewCommentEvent[] = [
    { type: "create", text: "t1", lineNumber: 1, id: "1", createdAt: 1, createdBy: "a" },
  ];

  const store = reduceComments(actions);
  expect(Object.keys(store.comments)).toStrictEqual(["1"]);
  expect(store.comments["1"].comment).toStrictEqual<ReviewComment>({
    selection: undefined,
    status: 1,
    author: "a",
    dt: 1,
    id: "1",
    lineNumber: 1,
    text: "t1",
    parentId: undefined,
    type: ReviewCommentType.comment,
    typeState: undefined,
  });

  const store2 = reduceComments([{ type: "delete", targetId: "1", id: "1", createdAt: 1, createdBy: "a" }], store);
  expect(store2).not.toBe(store);
  expect(Object.keys(store2.comments)).toStrictEqual([]);

  const store3 = reduceComments([{ type: "delete", targetId: "1", id: "1", createdAt: 1, createdBy: "a" }], store2);
  expect(store3).not.toBe(store);
  expect(Object.keys(store2.comments)).toStrictEqual([]);
  expect(store3.events.length).toBe(3);
});

test("reduceComments - edit missing", () => {
  const actions: ReviewCommentEvent[] = [
    { type: "edit", text: "t1", targetId: "1", id: "1", createdAt: 1, createdBy: "a" },
  ];

  const store = reduceComments(actions);
  expect(Object.keys(store.comments)).toStrictEqual([]);
  expect(store.events.length).toBe(1);
});
