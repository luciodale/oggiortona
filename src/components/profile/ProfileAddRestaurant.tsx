import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "../../icons/ArrowLeftIcon";
import { RestaurantForm } from "../restaurants/RestaurantForm";

export function ProfileAddRestaurant() {
  return (
    <div>
      <Link
        to="/profile"
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-muted no-underline hover:text-primary"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Profilo
      </Link>

      <h1 className="font-family-display text-2xl font-medium tracking-tight text-primary">
        Aggiungi locale
      </h1>

      <div className="mt-6">
        <RestaurantForm />
      </div>
    </div>
  );
}
