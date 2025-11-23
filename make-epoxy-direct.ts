import initEpoxy, {
  EpoxyClient,
  EpoxyClientOptions,
} from "@mercuryworkshop/epoxy-tls";
export default async (url: string) => {
  await initEpoxy();

  let options = new EpoxyClientOptions();
  options.user_agent = navigator.userAgent;

  return new EpoxyClient(url, options);
};
