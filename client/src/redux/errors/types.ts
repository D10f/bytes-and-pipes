export enum ActionTypes {
  SET_ERROR = 'SET_ERROR'
}

export interface SetErrorAction {
  type: ActionTypes.SET_ERROR,
  payload: string
}
