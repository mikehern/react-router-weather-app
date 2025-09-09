import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    route("/", "routes/index.tsx"),
    route("location", "routes/location.tsx"),
    route("compare", "routes/compare.tsx"),
  ]),
] satisfies RouteConfig;
