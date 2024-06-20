import type { TypeHeading } from "../constants/heading.constant";
import type { IWigetCommon } from "./wiget-common.model";

export interface IWigetHeading extends IWigetCommon {
  typeHeading?: TypeHeading;
  innerHtml?: string;
}
