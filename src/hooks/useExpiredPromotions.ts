import { useState, useEffect } from "react";

export type ExpiredNotification = {
  kind: "special" | "deal" | "news";
  id: number;
  restaurantId: number;
  restaurantName: string;
  label: string;
  expiredAt: string;
};

export function useExpiredPromotions() {
  const [notifications, setNotifications] = useState<Array<ExpiredNotification>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/my-restaurants/expired-promotions")
      .then((r) => r.json() as Promise<{ notifications: Array<ExpiredNotification> }>)
      .then((data) => setNotifications(data.notifications))
      .finally(() => setLoading(false));
  }, []);

  return { notifications, loading };
}
