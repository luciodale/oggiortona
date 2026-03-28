import { createContext, useContext } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { profileRouter } from "../../config/profileRoutes";

type ProfileUser = {
  id: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
};

type ProfileAppProps = {
  user: ProfileUser;
};

export default function ProfileApp({ user }: ProfileAppProps) {
  return (
    <ProfileUserContext.Provider value={user}>
      <RouterProvider router={profileRouter} />
    </ProfileUserContext.Provider>
  );
}

const ProfileUserContext = createContext<ProfileUser | null>(null);

export function useProfileUser() {
  const user = useContext(ProfileUserContext);
  if (!user) throw new Error("useProfileUser must be used within ProfileApp");
  return user;
}
