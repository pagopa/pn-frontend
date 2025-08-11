import { AppRouteParams } from "../utility";

export interface RapidAccess {
  param: AppRouteParams;
  value: string;
  origin?: string; // eg: "io"
}