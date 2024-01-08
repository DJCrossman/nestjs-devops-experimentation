export interface ISuccessResponse {
  type?: string;
  code: number;
  message: string;
  param?: string;
  path: string;
  timestamp: string;
}

export class SuccessResponse implements ISuccessResponse {
  type?: string;
  code: number;
  message: string;
  param?: string;
  path: string;
  timestamp: string;
}
