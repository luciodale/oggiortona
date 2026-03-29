import { CircleAlertIcon } from "../../icons/CircleAlertIcon";

type FormErrorProps = {
  id?: string;
  message: string;
};

export function FormError({ id, message }: FormErrorProps) {
  return (
    <p
      id={id}
      className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-danger"
      role="alert"
    >
      <CircleAlertIcon className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

export function SummaryFormError({ message }: FormErrorProps) {
  return (
    <p
      className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-[13px] font-medium text-danger"
      role="alert"
    >
      {message}
    </p>
  );
}
