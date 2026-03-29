import { createContext, useContext } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { profileRouter } from "../../config/profileRoutes";
import { LocaleProvider } from "../../i18n/useLocale";
import type { Locale } from "../../types/domain";

type ProfileUser = {
  id: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
};

type ProfileAppProps = {
  user: ProfileUser;
  locale: Locale;
};

export default function ProfileApp({ user, locale }: ProfileAppProps) {
  return (
    <LocaleProvider locale={locale}>
      <ProfileUserContext.Provider value={user}>
        <RouterProvider router={profileRouter} />
      </ProfileUserContext.Provider>
    </LocaleProvider>
  );
}

const ProfileUserContext = createContext<ProfileUser | null>(null);

export function useProfileUser() {
  const user = useContext(ProfileUserContext);
  if (!user) throw new Error("useProfileUser must be used within ProfileApp");
  return user;
}
