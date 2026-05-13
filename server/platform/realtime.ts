import { randomUUID } from "crypto";
import type { Server as HttpServer } from "http";
import { WebSocketServer, type WebSocket } from "ws";

type EventChannel = "agent" | "workflow" | "notification" | "integration" | "system";

export type RealtimeEvent = {
  id: string;
  channel: EventChannel;
  type: string;
  payload: unknown;
  createdAt: string;
};

const sockets = new Set<WebSocket>();
let wss: WebSocketServer | null = null;

export function registerRealtime(server: HttpServer) {
  if (wss) return wss;

  wss = new WebSocketServer({ server, path: "/ws" });
  wss.on("connection", socket => {
    sockets.add(socket);

    socket.on("close", () => {
      sockets.delete(socket);
    });

    socket.send(
      JSON.stringify({
        id: randomUUID(),
        channel: "system",
        type: "connected",
        payload: { ok: true },
        createdAt: new Date().toISOString(),
      } satisfies RealtimeEvent)
    );
  });

  return wss;
}

export function publishRealtimeEvent(
  channel: EventChannel,
  type: string,
  payload: unknown
): RealtimeEvent {
  const event: RealtimeEvent = {
    id: randomUUID(),
    channel,
    type,
    payload,
    createdAt: new Date().toISOString(),
  };

  const encoded = JSON.stringify(event);
  sockets.forEach(socket => {
    if (socket.readyState === socket.OPEN) {
      socket.send(encoded);
    }
  });

  return event;
}
