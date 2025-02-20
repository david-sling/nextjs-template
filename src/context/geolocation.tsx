// GeolocationContext.tsx
import { phoneCodes } from "@/data/countries";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { fetchGeoLocation } from "@/services/geo_info";
import { Geo } from "@vercel/edge";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface GeolocationContextState {
  geolocation: (Geo & { country_calling_code?: string }) | null;
  isLoading: boolean;
}

const defaultState: GeolocationContextState = {
  geolocation: null,
  isLoading: false,
};

const GeolocationContext = createContext<GeolocationContextState>(defaultState);

export const useGeolocation = () => useContext(GeolocationContext);

export const GeolocationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [geolocation, setGeolocation] = useSessionStorage<
    (Geo & { country_calling_code?: string }) | null
  >("geolocation", null);

  useEffect(() => {
    const fetchAndSetGeoLocation = async () => {
      try {
        setIsLoading(true);
        const res = await fetchGeoLocation();
        const countryCallingCode = phoneCodes.find(
          (c) => c.country_code === res.country
        );

        // Proceed only if countryCallingCode is found to prevent setting undefined values
        if (countryCallingCode) {
          const newGeolocation = {
            ...res,
            country_calling_code: `+${countryCallingCode.phone_code}`,
          };

          // Update geolocation only if country has changed or it's not yet set
          if (!geolocation || geolocation.country !== res.country) {
            setGeolocation(newGeolocation);
          }
        } else {
          console.error(
            "Country calling code not found for country:",
            res.country
          );
        }
      } catch (error) {
        console.error("Failed to fetch or set geolocation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetGeoLocation();
  }, []); // Ensures this runs only once on mount

  return (
    <GeolocationContext.Provider value={{ geolocation, isLoading }}>
      {children}
    </GeolocationContext.Provider>
  );
};
