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

        ws.onopen = () => {
          const readable = new ReadableStream({
            start(controller) {
              ws.onmessage = (event) => {
                let data = event.data;

                controller.enqueue(data);
              };
              ws.onclose = () => controller.close();
            },
            cancel() {
              ws.close();
            },
          });

          const writable = new WritableStream({
            write(chunk) {
              ws.send(chunk);
            },
            close() {
              ws.close();
            },
          });

          resolve({ read: readable, write: writable });
        };

        ws.onclose = (ev) => {
          console.error("WebSocket close:", ev);
          reject(ev);
        };
      }),
    options,
  );
};
