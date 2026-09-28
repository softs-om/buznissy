import { createContext, useEffect, useState } from "react";
import { getMyBusinesses, getBusiness } from "../services/api";

const BusinessContext = createContext(null);

export function BusinessProvider({ children }) {
  const [businesses, setBusinesses] = useState([]);
  const [activeBusiness, setActiveBusiness] = useState(null);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const response = await getMyBusinesses();
        const list = response.data || [];

        setBusinesses(list);

        if (list.length > 0) {
          const savedId = localStorage.getItem("activeBusinessId");

          const savedBusiness =
            list.find((business) => business.id === savedId) || list[0];

          setActiveBusiness(savedBusiness);
          localStorage.setItem("activeBusinessId", savedBusiness.id);
        }
      } catch (error) {
        console.error("Could not load businesses:", error);
      } finally {
        setLoadingBusinesses(false);
      }
    };

    loadBusinesses();
  }, []);

  const switchBusiness = (business) => {
    setActiveBusiness(business);
    localStorage.setItem("activeBusinessId", business.id);
  };

  const refreshActiveBusiness = async () => {
    if (!activeBusiness?.id) return;

    try {
      const response = await getBusiness(activeBusiness.id);
      const updatedBusiness = response.data?.business || response.data;

      setActiveBusiness(updatedBusiness);

      setBusinesses((current) =>
        current.map((business) =>
          business.id === updatedBusiness.id ? updatedBusiness : business,
        ),
      );

      return updatedBusiness;
    } catch (error) {
      console.error("Could not refresh active business:", error);
    }
  };

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        activeBusiness,
        activeBusinessId: activeBusiness?.id || null,
        switchBusiness,
        refreshActiveBusiness,
        loadingBusinesses,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export { BusinessContext };
