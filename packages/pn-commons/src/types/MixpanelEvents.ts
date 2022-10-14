export type EventsType = {
  [key: string]: {
    category: string;
    action: string;
    getAttributes?: (payload: { [key: string]: string }) => { [key: string]: string };
  };
};