const { JSDOM } = require('jsdom');
const $ = require('jquery');

beforeAll(() => {
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    global.$ = $(dom.window);

    $.fx = { off: true };
});

beforeEach(() => {
  // Load an HTML fixture
  const html = `
    <div id="gameBoard"></div>
    <button id="loadGamePage"></button>
    <div id="logo"></div>
    <div id="difficulty"></div>
    <div id="controls"></div>
    <button id="singleMode"></button>
    <button id="coopMode"></button>
    <button id="vsMode"></button>
    <button id="easy"></button>
    <button id="medium"></button>
    <button id="hard"></button>
    <button id="undo"></button>
    <button id="restart"></button>
    <button id="saveGame"></button>
    <div id="modeSelection"></div>
  `;
  const dom = new JSDOM(html);
  global.document = dom.window.document;
  global.window = dom.window;
  $.fx.off = true; // Disable jQuery animations for test performance
});

test("Load game button triggers AJAX", () => {
  const ajaxSpy = jest.spyOn($, "ajax");

  $("#loadGamePage").trigger("click");

  expect(ajaxSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "POST",
      url: "http://localhost:9000/game/load",
    })
  );
});

test("Logo click navigates to homepage", () => {
  const locationSpy = jest.spyOn(window, "location", "set");

  $("#logo").trigger("click");

  expect(locationSpy).toHaveBeenCalledWith("http://localhost:9000");
});

test("Single mode hides mode selection and shows difficulty and controls", () => {
  $("#singleMode").trigger("click");

  expect($("#modeSelection").is(":visible")).toBe(false);
  expect($("#difficulty").is(":visible")).toBe(true);
  expect($("#controls").is(":visible")).toBe(true);
});

test("Coop mode connects WebSocket and sets Game ID", () => {
  const promptSpy = jest.spyOn(window, "prompt").mockReturnValue("test_game_id");
  const mockSocket = new WebSocket("ws://mock");

  global.WebSocket = jest.fn(() => mockSocket);

  $("#coopMode").trigger("click");

  expect(promptSpy).toHaveBeenCalled();
  expect(mockSocket.url).toContain("test_game_id");
});

test("Difficulty buttons trigger correct AJAX call", () => {
  const ajaxSpy = jest.spyOn($, "ajax");

  $("#easy").trigger("click");
  expect(ajaxSpy).toHaveBeenCalledWith(expect.objectContaining({ data: { level: "E" } }));

  $("#medium").trigger("click");
  expect(ajaxSpy).toHaveBeenCalledWith(expect.objectContaining({ data: { level: "M" } }));

  $("#hard").trigger("click");
  expect(ajaxSpy).toHaveBeenCalledWith(expect.objectContaining({ data: { level: "H" } }));
});
