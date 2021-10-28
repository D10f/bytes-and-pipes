// export const SET_URL = 'SET_URL';
// export const SET_ERROR = 'SET_ERROR';

export enum UrlActions {
  SET_URL = 'SET_URL',
}

export enum ErrorActions {
  SET_ERROR = 'SET_ERROR',
}

export interface IUrlAction {
  type: UrlActions;
  payload: string;
}

export interface IErrorAction {
  type: ErrorActions,
  payload: string
}
