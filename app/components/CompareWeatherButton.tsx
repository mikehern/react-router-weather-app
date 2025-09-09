import { useState } from "react";
import { SavedLocationModal } from "~/components/SavedLocationModal";

interface CompareWeatherButtonProps {
  currentWeatherData: {
    forecast: any[];
    location: string;
    coordinates: { latitude: number; longitude: number };
  };
}

export function CompareWeatherButton({
  currentWeatherData,
}: CompareWeatherButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 w-fit text-green-700"
      >
        Compare Weather
      </button>
      <SavedLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentWeatherData={currentWeatherData}
      />
    </>
  );
}
