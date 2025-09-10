import { useState, useRef } from "react";
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
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        onClick={handleOpenModal}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpenModal();
          }
        }}
        className="p-3 w-fit text-white bg-green-700 hover:bg-green-800
          focus:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500
            focus:ring-offset-2 font-bold rounded-full transition-colors"
        type="button"
        aria-label={`Compare weather for ${currentWeatherData.location} with other
            locations`}
        aria-describedby="compare-weather-description"
        aria-expanded={isModalOpen}
        aria-haspopup="dialog"
      >
        Compare Weather
        <span id="compare-weather-description" className="sr-only">
          Opens a dialog to select saved locations for weather comparison
        </span>
      </button>
      <SavedLocationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentWeatherData={currentWeatherData}
      />
    </>
  );
}
