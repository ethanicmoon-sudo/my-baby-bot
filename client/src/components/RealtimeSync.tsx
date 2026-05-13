import { useEffect } from "react";
import { trpc } from "@/lib/trpc";

type RealtimeEvent = {
  channel: "agent" | "workflow" | "notification" | "integration" | "system";
  type: string;
};

function buildWsUrl() {
  if (typeof window === "undefined") return "";
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws`;
}

export default function RealtimeSync() {
  const utils = trpc.useUtils();

  useEffect(() => {
    const wsUrl = buildWsUrl();
    if (!wsUrl) return;

    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      ws = new WebSocket(wsUrl);

      ws.onmessage = async event => {
        let parsed: RealtimeEvent | null = null;
        try {
          parsed = JSON.parse(event.data) as RealtimeEvent;
        } catch {
          return;
        }

        if (!parsed) return;

        if (parsed.type.startsWith("agent.") || parsed.type === "activity.created") {
          await Promise.all([utils.agents.list.invalidate(), utils.activityFeed.list.invalidate()]);
          return;
        }

        if (parsed.type.startsWith("video.")) {
          await utils.videos.list.invalidate();
          return;
        }

        if (parsed.type.startsWith("note.")) {
          await utils.notes.list.invalidate();
          return;
        }

        if (parsed.type.startsWith("research.")) {
          await Promise.all([utils.research.list.invalidate(), utils.research.analyze.invalidate()]);
          return;
        }

        if (parsed.type.startsWith("designReview.")) {
          await utils.designReviews.list.invalidate();
          return;
        }

        if (parsed.type.startsWith("withdrawal.")) {
          await Promise.all([utils.wallet.withdrawalHistory.invalidate(), utils.wallet.binanceStatus.invalidate()]);
        }
      };

      ws.onclose = () => {
        reconnectTimer = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [utils]);

  return null;
}
