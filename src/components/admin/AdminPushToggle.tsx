import { PushToggle } from "../shared/PushToggle";

export function AdminPushToggle() {
  return (
    <PushToggle
      scope="admin"
      labelOn="Notifiche attive"
      labelOff="Attiva notifiche"
      labelDenied="Notifiche bloccate"
      labelActivating="Attivando..."
      labelDeactivating="Disattivando..."
    />
  );
}
