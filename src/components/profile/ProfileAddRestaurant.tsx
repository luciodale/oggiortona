import { Link } from "@tanstack/react-router";
import { RestaurantForm } from "../restaurants/RestaurantForm";
import { ArrowLeftIcon } from "../../icons/ArrowLeftIcon";

export function ProfileAddRestaurant() {
  return (
    <div>
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-muted no-underline hover:text-primary"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Profilo
      </Link>

      <h1 className="font-[family-name:var(--font-family-display)] text-2xl font-medium tracking-tight text-primary">
        Aggiungi locale
      </h1>

      <div className="mt-6">
        <RestaurantForm />
      </div>
    </div>
  );
}
