import type { Route } from "./+types/index";
import { Outlet, redirect } from "react-router";

export function loader({ request }: Route.LoaderArgs) {
  return { message: "Mobile First Response Weather App" };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="max-w-5xl mx-auto my-8">
      <h1 className="text-3xl">{loaderData.message}</h1>
      <div className="flex flex-col bg-gray-100 w-full items-center">
        Content
      </div>
    </div>
  );
}
