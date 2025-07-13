export enum AlertType {
  MESSAGE = 'message',
  ERROR = 'error'
}

export interface Alert {
  id: string;
  type: AlertType;
  content: string;
}
