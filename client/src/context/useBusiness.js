import { useContext } from "react";
import { BusinessContext } from "./BusinessContext";

export function useBusiness() {
  return useContext(BusinessContext);
}