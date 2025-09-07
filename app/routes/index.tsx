import type { Route } from "./+types/index";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";

export function loader({ request }: LoaderFunctionArgs) {
  return { message: "Mobile First Response Weather App" };
}

export async function clientLoader({
  params,
  serverLoader,
}: Route.ClientLoaderArgs) {
  const serverData = await serverLoader();
  const position = await new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );
  const { latitude, longitude } = position.coords;
  return { ...serverData, coords: { latitude, longitude } };
}

// react-router boilerplate for client-side data fetching during hydration
clientLoader.hydrate = true;

export default function Home({ loaderData }: Route.ComponentProps) {
  const { message, coords } = useLoaderData();
  return (
    <div className="max-w-5xl mx-auto my-8">
      <h1 className="text-3xl">{message}</h1>
      <h2 className="text-xl text-wrap">{JSON.stringify(coords)}</h2>
      <div className="flex flex-col bg-gray-100 w-full items-center">
        Content
      </div>
    </div>
  );
}
