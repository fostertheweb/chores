export type Chore = {
  id: string;
  name: string;
  icon: string;
  interval: number;
  interval_unit: "days" | "weeks" | "months";
  last_completed_at?: DateTime;
};
