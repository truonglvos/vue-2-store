import type { MenuChildAddNew } from "../constants/menu-left.constant";
import type { IStyleCommon } from "./style-common.model";
import type { IStyleCustom } from "./style-custom.model";

export interface IWigetCommon {
  id: number;
  idText: string;
  idSection: number;
  elementType: MenuChildAddNew;
  top: number;
  left: number;
  width: number;
  height: number;
  draggable: boolean;
  scalable?: boolean;
  name?: string;
  style?: Partial<IStyleCommon>;
  customStyle?: Partial<IStyleCustom>;
  isResizingEdge: boolean;
  isEditting?: boolean;
  isHovering: boolean;
  // desktopCss: ICommonCss;
  // mobileCss: ICommonCss;
  applyCss?: Partial<ICommonCss>;
}

export interface ICommonCss {
  backgroundColor: string;
  color: string;
  fontSize: number;
  fontWeight: "bold";
  textAlign: "left" | "center" | "right" | "justify";
  lightHeight: number;
}
