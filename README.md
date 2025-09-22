# React Router 7 Weather Application - Technical Assessment

A weather forecasting application demonstrating mastery of React Router 7's Framework Mode, showcasing advanced patterns for client-side data loading rendering a loading UI skeleton. This project serves as a comprehensive example of transitioning from traditional React patterns to React Router 7's declarative data loading paradigms.

Deployed at
[https://react-router-weather-app.vercel.app/](https://react-router-weather-app.vercel.app/)

## Technical Challenge Overview

This application addresses several complex technical challenges that demonstrate proficiency in modern React development:

1. **Browser API Integration**: Implementing geolocation with permission handling and graceful fallbacks
2. **Data Loading Paradigms**: Migrating from imperative `useEffect` patterns to declarative loaders
3. **Progressive Enhancement**: Building forms that work with and without JavaScript
4. **Type Safety**: Leveraging React Router 7's auto-generated route types
5. **Performance Optimization**: Implementing SSR with client-side enhancement
6. **Data Visualization**: Integrating AG Charts for weather comparison features

## React Router 7 Paradigm Shift: Architecture Deep Dive

### Problem: Traditional React Data Loading Limitations

Traditional React applications rely on imperative data loading patterns that create several issues:

```tsx
// ❌ Traditional React Pattern - Problems:
// 1. Loading states visible to users
// 2. Not SEO-friendly (no server-side data)
// 3. Race conditions with multiple useEffect calls
// 4. Manual error state management
function WeatherComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchWeatherData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>; // Poor UX
  if (error) return <div>Error: {error.message}</div>; // Manual error handling
  return <div>{data?.forecast}</div>;
}
```

### Solution: React Router 7 Declarative Data Loading

React Router 7 introduces **data loading primitives** that solve these problems through declarative patterns:

```tsx
// ✅ React Router 7 Pattern - Benefits:
// 1. No loading states for server-rendered content
// 2. SEO-friendly with SSR
// 3. Built-in error boundaries
// 4. Type-safe data flow
export async function loader({ request }: Route.LoaderArgs) {
  // Runs on SERVER during SSR, providing immediate content
  const url = new URL(request.url);
  const search = url.searchParams.get("search");

  try {
    const locationData = await searchLocation(search);
    const weatherData = await fetchWeatherForecast(
      locationData.latitude,
      locationData.longitude
    );

    return {
      success: true,
      locationName: locationData.locationName,
      forecast: weatherData.forecast.slice(0, 7),
      hourlyForecast: weatherData.hourlyForecast,
    };
  } catch (error) {
    // Error handling is built into the framework
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch weather data",
      forecast: [],
      hourlyForecast: [],
    };
  }
}

export default function Location({ loaderData }: Route.ComponentProps) {
  // Data is ALWAYS available - no loading states needed
  const { forecast, locationName, success } = loaderData;

  return (
    <div>
      <h1>Weather for {locationName}</h1>
      {success ? (
        <DailyForecastList forecast={forecast} />
      ) : (
        <ErrorMessage error={loaderData.error} />
      )}
    </div>
  );
}
```

## Key Technical Implementation: Data Flow Architecture

### 1. Server-Side Data Loading (`loader`)

**Technical Challenge**: Provide immediate content without loading states while maintaining SEO benefits.

**Implementation Strategy**:
```tsx
// app/routes/location.tsx - Server-side weather search
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");

  if (!search) {
    // Framework-level error handling
    throw new Response("Search query is required", { status: 400 });
  }

  // Parallel data fetching for performance
  const [locationData, weatherData] = await Promise.all([
    searchLocation(search),
    fetchWeatherForecast(locationData.latitude, locationData.longitude)
  ]);

  return {
    locationName: locationData.locationName,
    latitude: locationData.latitude,
    longitude: locationData.longitude,
    forecast: weatherData.forecast.slice(0, 7),
    hourlyForecast: weatherData.hourlyForecast,
  };
}
```

### 2. Client-Side Browser API Integration (`clientLoader`)

**Technical Challenge**: Handle browser-only APIs (geolocation) that cannot run on the server.

**Implementation Strategy**:
```tsx
// app/routes/index.tsx - Geolocation-based weather detection
export async function clientLoader() {
  try {
    // Browser-only geolocation API
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000, // 10 second timeout
      });
    });

    const { latitude, longitude } = position.coords;

    // Parallel API calls for performance
    const [locationName, weatherData] = await Promise.all([
      getReverseGeocodedName(latitude, longitude).catch(() => "Unknown Location"),
      fetchWeatherForecast(latitude, longitude),
    ]);

    return {
      locationName,
      latitude,
      longitude,
      forecast: weatherData.forecast.slice(0, 7),
      hourlyForecast: weatherData.hourlyForecast,
      hasGeolocation: true,
    };
  } catch (error) {
    // Comprehensive error handling for different geolocation failures
    let errorMessage = "Unable to get your location";

    if (error instanceof GeolocationPositionError) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location access denied. Please search for a city instead.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable. Please search for a city.";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out. Please search for a city.";
          break;
      }
    }

    return {
      hasGeolocation: false,
      error: errorMessage,
      forecast: [],
      hourlyForecast: [],
    };
  }
}

// Enable hydration for immediate user feedback
clientLoader.hydrate = true;

// Fallback UI during geolocation permission prompt
export function HydrateFallback() {
  return <FullPageSkeleton />;
}
```

**Advanced Data Flow**:
1. **Server**: Renders `HydrateFallback` component
2. **Client Hydration**: `clientLoader` executes immediately
3. **Permission Prompt**: Browser shows geolocation permission dialog
4. **User Decision**: Grant/deny permission or timeout
5. **Data Resolution**: Weather data fetched or graceful error handling
6. **Component Update**: Renders with actual data or error state

### 3. Progressive Enhancement with Form Actions

**Technical Challenge**: Build forms that enhance progressively from basic HTML to dynamic JavaScript interactions.

**Implementation Strategy**:
```tsx
// app/utils/locationActions.ts - Unified form handler
export async function handleLocationAction(request: Request) {
  const formData = await request.formData();
  const location = (formData.get("location") as string) ?? "";
  const intent = formData.get("intent");
  const latitude = formData.get("latitude") as string;
  const longitude = formData.get("longitude") as string;

  if (intent === "search") {
    // Navigation-based search
    const searchParams = new URLSearchParams();
    if (location?.trim()) searchParams.set("search", location.trim());
    return redirect(`/location?${searchParams.toString()}`);
  }

  if (intent === "save") {
    // Local storage integration
    const result = addLocation(
      location,
      parseFloat(latitude),
      parseFloat(longitude)
    );

    if (!result.success) {
      return { saved: false, error: result.error };
    }

    return {
      saved: true,
      location,
      timestamp: new Date().toISOString()
    };
  }
}

// Route-level action integration
export async function clientAction({ request }: ActionFunctionArgs) {
  return handleLocationAction(request);
}
```

**Progressive Enhancement Flow**:
```tsx
// Component integration with navigation states
export default function WeatherRoute({ loaderData, actionData }: Route.ComponentProps) {
  const navigation = useNavigation();

  // Built-in navigation state management
  const isSubmitting = navigation.state === "submitting";
  const isLoadingWeatherData =
    navigation.state === "loading" &&
    navigation.formData?.get("intent") === "search";

  return (
    <Form method="post">
      <input name="location" placeholder="Enter city name" />
      <input name="intent" value="search" type="hidden" />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Searching..." : "Search Weather"}
      </button>
    </Form>
  );
}
```

**Without JavaScript**: Form submits traditionally, page refreshes, server processes action
**With JavaScript**: Enhanced UX with loading states, no page refresh, optimistic updates

## Advanced Technical Features

### 1. Type-Safe Route System

React Router 7 auto-generates TypeScript types based on route exports:

```tsx
// Types are automatically generated in .react-router/types/
import type { Route } from "./+types/location";

// ComponentProps includes properly typed loaderData and actionData
export default function Location({ loaderData, actionData }: Route.ComponentProps) {
  // loaderData is fully typed based on loader return type
  // actionData is fully typed based on action return type
  // TypeScript catches mismatches at compile time
}

// Loader return type automatically inferred
export async function loader(): Promise<{
  locationName: string;
  forecast: Forecast[];
  success: boolean;
}> {
  return { locationName: "Seattle", forecast: [], success: true };
}
```

### 2. Navigation State Management

Built-in React Router navigation states eliminate need for custom loading state management:

```tsx
export default function WeatherComponent({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();

  // Navigation states: "idle" | "loading" | "submitting"
  const isNavigating = navigation.state !== "idle";
  const isSearching = navigation.state === "loading" &&
    navigation.location?.pathname === "/location";
  const isSubmittingForm = navigation.state === "submitting";

  // Conditional rendering based on navigation state
  if (isSearching) return <WeatherSkeleton />;

  return (
    <LocationSearchForm
      isSubmitting={isSubmittingForm}
      disabled={isNavigating}
    />
  );
}
```

### 3. Error Boundary Integration

Framework-level error handling with custom error boundaries:

```tsx
// Route-level error boundary
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const errorMessage = isRouteErrorResponse(error)
    ? error.data  // Server errors (thrown Response objects)
    : (error as Error).message; // Client errors

  return (
    <SharedErrorBoundary
      message={errorMessage}
      title="Weather Data Error"
    />
  );
}

// Errors automatically bubble up to nearest error boundary
// No need for try/catch in components
```


## Development Notes and Decisions
1. Focused on golden/happy path for data
2. Selected a WCAG-friendly visualization library
3. Mobile-responsive using Tailwind CSS
4. Testing (incomplete) - experimented with 2 LLM-assisted strategies:
   - 1-shot test generation
   - BDD incremental test writing
5. Uses localStorage as simple persistence layer

### Setup and Commands

```bash
# Development server with HMR
npm run dev                    # → http://localhost:5173

# Type generation and checking (run after route changes)
npm run typecheck

# Testing - Experimented with LLM-assisted strategies
# by checking out the following branches
#
# experiment/1-shot-tests
# experiment/bdd-incremental-tests
npm run test                   # Watch mode
npm run test:ui                # Visual interface
npm run coverage               # Coverage reports

# Production build
npm run build
npm run start
```
