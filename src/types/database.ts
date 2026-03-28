// Derived from src/db/schema.sql — keep in sync.

export type RestaurantType =
  | "ristorante"
  | "pizzeria"
  | "trattoria"
  | "bar"
  | "gelateria"
  | "pasticceria"
  | "pescheria"
  | "altro";

export type EventCategory =
  | "sagra"
  | "musica"
  | "mercato"
  | "cultura"
  | "sport"
  | "altro";


export type DaySchedule = {
  open: string;
  close: string;
  open2: string | null;
  close2: string | null;
};

export type OpeningHours = {
  lunedi: DaySchedule | null;
  martedi: DaySchedule | null;
  mercoledi: DaySchedule | null;
  giovedi: DaySchedule | null;
  venerdi: DaySchedule | null;
  sabato: DaySchedule | null;
  domenica: DaySchedule | null;
};

export type ItalianDay = keyof OpeningHours;

export type RestaurantRow = {
  id: number;
  name: string;
  description: string | null;
  type: string; // comma-separated RestaurantType values, e.g. "bar,gelateria"
  price_range: number;
  phone: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  opening_hours: string; // JSON string of OpeningHours
  image_url: string | null;
  active: number;
  created_at: string;
  updated_at: string;
};

export type DailySpecialRow = {
  id: number;
  restaurant_id: number;
  description: string;
  price: number | null;
  image_url: string | null;
  date: string;
  created_at: string;
};

export type EventRow = {
  id: number;
  title: string;
  description: string | null;
  date_start: string;
  date_end: string | null;
  time_start: string | null;
  time_end: string | null;
  location: string;
  category: EventCategory;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type DealRow = {
  id: number;
  restaurant_id: number;
  title: string;
  description: string | null;
  valid_from: string;
  valid_until: string;
  created_at: string;
};

