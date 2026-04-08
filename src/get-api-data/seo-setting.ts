import { staticSeoSettings } from "@/data/staticData";

export const getSeoSettings = async () => {
  return staticSeoSettings;
};

export const getSiteName = async () => {
  return staticSeoSettings.siteName;
};

export const getLogo = async () => {
  return null;
};

export const getEmailLogo = async () => {
  return null;
};
