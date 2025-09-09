import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="max-w-5xl mx-auto my-8">
      <Outlet />
    </div>
  );
}
