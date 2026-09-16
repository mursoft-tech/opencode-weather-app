export type Unit = "celsius" | "fahrenheit";

export type City = {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
};

export type Config = {
  defaultCity?: string;
  cities: City[];
  unit: Unit;
};
