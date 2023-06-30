export type EventsType = {
  [key: string]: {
    category: string;
    action: string;
    getAttributes?: (payload: Record<string, any>) => Record<string, string>;
  };
};