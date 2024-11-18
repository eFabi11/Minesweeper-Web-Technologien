import { WebSocket, Server } from "mock-socket";

let mockServer;

beforeEach(() => {
  mockServer = new Server("ws://localhost:1234");

  mockServer.on("connection", (socket) => {
    socket.send(JSON.stringify({ action: "test", data: "connected" }));
  });
});

afterEach(() => {
  mockServer.stop();
});

test("WebSocket connects and receives messages", () => {
  const socket = new WebSocket("ws://localhost:1234");

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    expect(data.action).toBe("test");
    expect(data.data).toBe("connected");
  };
});
