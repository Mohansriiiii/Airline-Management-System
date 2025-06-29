import { useState, useEffect } from 'react';

export const useCountryCodes = () => {
  const [countryCodes, setCountryCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://restcountries.com/v2/all?fields=name,callingCodes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const codes = data.map(country => {
          if (country.callingCodes && country.callingCodes.length > 0) {
            return { name: country.name, code: `+${country.callingCodes[0]}` };
          }
          return null;
        }).filter(item => item !== null);

        codes.sort((a, b) => a.name.localeCompare(b.name));
        
        setCountryCodes(codes);
      } catch (error) {
        console.error("Error fetching country codes:", error);
        setError("Failed to load country codes. Please check your internet connection or try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCountryCodes();
  }, []);

  return { countryCodes, loading, error };
}; 