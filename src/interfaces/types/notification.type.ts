import { ENotiType } from "../enums";

export type TPushNotiToSystem = {
  type: ENotiType;
  receiverId: number;
  senderId: number | string;
  options?: Object;
};
