import { redirect } from "react-router";
import { addLocation } from "~/utils/localStorage";

export async function handleLocationAction(request: Request) {
  const formData = await request.formData();
  const location = (formData.get("location") as string) ?? "";
  const intent = formData.get("intent");
  const latitude = formData.get("latitude") as string | "0";
  const longitude = formData.get("longitude") as string | "0";

  if (intent === "search") {
    const searchParams = new URLSearchParams();
    if (location?.trim()) searchParams.set("search", location.trim());
    return redirect(`/location?${searchParams.toString()}`);
  }

  const result = addLocation(
    location,
    parseFloat(latitude),
    parseFloat(longitude)
  );
  if (!result.success) {
    return { saved: false, error: result.error };
  }
  return { saved: true, location, timestamp: new Date().toISOString() };
}
