import { useState, useEffect, useRef } from 'react';

export const useSearchableCountryCodeInput = (initialCode, allCountryCodes) => {
  const [countryCode, setCountryCode] = useState(initialCode);
  const [searchTerm, setSearchTerm] = useState(initialCode);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCountryCodes, setFilteredCountryCodes] = useState([]);
  const dropdownRef = useRef(null);

  // Filter countries based on search term
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = allCountryCodes.filter(country =>
      country.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      country.code.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredCountryCodes(filtered);
  }, [searchTerm, allCountryCodes]);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
    if (e.target.value === '') {
        setCountryCode('+91'); // Default to +91 if input is cleared
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
    setSearchTerm(countryCode);
  };

  const handleOptionClick = (code) => {
    setCountryCode(code);
    setSearchTerm(code); // Display only the code when selected
    setShowDropdown(false);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      const foundCountry = allCountryCodes.find(c => c.code === searchTerm);
      if (!foundCountry && countryCode) {
        setSearchTerm(countryCode);
      } else if (!foundCountry && !countryCode && allCountryCodes.length > 0) {
        setCountryCode(allCountryCodes[0].code);
        setSearchTerm(allCountryCodes[0].code);
      }
      setShowDropdown(false);
    }, 100);
  };

  return {
    countryCode, // This is the final selected country code
    searchTerm,
    showDropdown,
    filteredCountryCodes,
    dropdownRef,
    handleInputChange,
    handleInputFocus,
    handleOptionClick,
    handleInputBlur,
    setCountryCode // Expose setCountryCode for external initialization if needed
  };
}; 