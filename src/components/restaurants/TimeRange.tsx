type TimeRangeProps = {
  timeStart: string | null;
  timeEnd: string | null;
  className?: string;
};

export function TimeRange({ timeStart, timeEnd, className }: TimeRangeProps) {
  if (!timeStart && !timeEnd) return null;

  return (
    <span className={className}>
      {timeStart && timeEnd && <>Dalle {timeStart} alle {timeEnd}</>}
      {timeStart && !timeEnd && <>Dalle {timeStart}</>}
      {!timeStart && timeEnd && <>Fino alle {timeEnd}</>}
    </span>
  );
}
