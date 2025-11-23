// Simple WebSocket connection test
const ws = new WebSocket("wss://wisp.mercurywork.shop", ["wisp-v1"]);

ws.onopen = () => {
  console.log("✓ WebSocket connected successfully!");
  console.log("  Protocol:", ws.protocol);
  console.log("  ReadyState:", ws.readyState);
  ws.close();
  Deno.exit(0);
};

ws.onerror = (err) => {
  console.error("✗ WebSocket error:", err);
};

ws.onclose = (ev) => {
  console.log("WebSocket closed:", ev.code, ev.reason);
  Deno.exit(1);
};

setTimeout(() => {
  console.log("Timeout - WebSocket didn't open");
  Deno.exit(1);
}, 5000);
