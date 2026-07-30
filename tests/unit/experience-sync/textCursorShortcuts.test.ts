import {
  isTextCursorShortcut,
  lineEnd,
  lineStart,
  nextWordBoundary,
  prevWordBoundary,
} from "experience-sync/ui/src/lib/textCursorShortcuts"
import { describe, expect, it } from "vitest"

describe("lineStart", () => {
  it("returns 0 for the first line", () => {
    expect(lineStart("hello world", 3)).toBe(0)
  })

  it("returns index after the previous newline", () => {
    expect(lineStart("line one\nline two", 10)).toBe(9)
  })
})

describe("lineEnd", () => {
  it("returns text length when there is no trailing newline", () => {
    expect(lineEnd("hello world", 3)).toBe(11)
  })

  it("stops at the next newline", () => {
    expect(lineEnd("line one\nline two", 3)).toBe(8)
  })
})

describe("prevWordBoundary", () => {
  it("jumps to the start of the previous word", () => {
    expect(prevWordBoundary("hello world", 11)).toBe(6)
    expect(prevWordBoundary("hello world", 6)).toBe(0)
  })

  it("skips whitespace", () => {
    expect(prevWordBoundary("foo   bar", 9)).toBe(6)
    expect(prevWordBoundary("foo   bar", 6)).toBe(0)
  })
})

describe("nextWordBoundary", () => {
  it("jumps to the end of the next word", () => {
    expect(nextWordBoundary("hello world", 0)).toBe(5)
    expect(nextWordBoundary("hello world", 6)).toBe(11)
  })

  it("skips whitespace", () => {
    expect(nextWordBoundary("foo   bar", 0)).toBe(3)
    expect(nextWordBoundary("foo   bar", 3)).toBe(9)
  })
})

describe("isTextCursorShortcut", () => {
  it("matches Option+arrow without meta/ctrl", () => {
    expect(isTextCursorShortcut({ key: "ArrowRight", altKey: true, shiftKey: false, ctrlKey: false, metaKey: false })).toBe(true)
    expect(isTextCursorShortcut({ key: "ArrowLeft", altKey: true, shiftKey: false, ctrlKey: false, metaKey: false })).toBe(true)
  })

  it("matches Home and End", () => {
    expect(isTextCursorShortcut({ key: "Home", altKey: false, shiftKey: false, ctrlKey: false, metaKey: false })).toBe(true)
    expect(isTextCursorShortcut({ key: "End", altKey: false, shiftKey: false, ctrlKey: false, metaKey: false })).toBe(true)
  })

  it("ignores Cmd/Ctrl combinations", () => {
    expect(isTextCursorShortcut({ key: "ArrowRight", altKey: false, shiftKey: false, ctrlKey: false, metaKey: true })).toBe(false)
    expect(isTextCursorShortcut({ key: "Home", altKey: false, shiftKey: false, ctrlKey: true, metaKey: false })).toBe(false)
  })

  it("ignores plain arrow keys", () => {
    expect(isTextCursorShortcut({ key: "ArrowRight", altKey: false, shiftKey: false, ctrlKey: false, metaKey: false })).toBe(false)
  })
})
