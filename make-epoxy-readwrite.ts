import initEpoxy, {
  EpoxyClient,
  EpoxyClientOptions,
} from "@mercuryworkshop/epoxy-tls";
export default async (url: string) => {
  await initEpoxy();

  let options = new EpoxyClientOptions();
  options.user_agent = navigator.userAgent;

  return new EpoxyClient(
    () =>
      new Promise((resolve, reject) => {
        const protocols = ["wisp-v1"];
        const ws = new WebSocket(url, protocols);

        ws.binaryType = "arraybuffer";

        // These handlers are only for the initial connection
        // They will be replaced once the connection is established
        const onError = (err: Event) => {
          reject(new Error(`WebSocket connection failed: ${err}`));
        };

        const onClose = (ev: CloseEvent) => {
          reject(new Error(`WebSocket closed before connection: ${ev.code} ${ev.reason}`));
        };

        ws.onerror = onError;
        ws.onclose = onClose;

        ws.onopen = () => {
          // Clear the initial error handlers now that we're connected
          ws.onerror = null;
          ws.onclose = null;
          const readable = new ReadableStream({
            start(controller) {
              ws.onmessage = (event) => {
                controller.enqueue(event.data);
              };
              ws.onerror = (err) => {
                controller.error(err);
              };
              ws.onclose = () => {
                controller.close();
              };
            },
            cancel() {
              ws.close();
            },
          });

          const writable = new WritableStream({
            write(chunk) {
              // WritableStream write() can return a Promise for backpressure
              // We need to handle the case where WebSocket might not be ready
              if (ws.readyState !== WebSocket.OPEN) {
                throw new Error(`WebSocket not open (state: ${ws.readyState})`);
              }

              try {
                ws.send(chunk);
              } catch (err) {
                throw new Error(`WebSocket send failed: ${err}`);
              }
            },
            close() {
              ws.close();
            },
          });

          resolve({ read: readable, write: writable });
        };
      }),
    options,
  );
};
