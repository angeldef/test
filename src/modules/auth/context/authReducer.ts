import { types } from '../types/types';

export const authReducer = (state = {}, action: { type: string; payload?: object }) => {
  switch (action.type) {
    case types.login:
      return { ...state, logged: true, user: action.payload };

    case types.logout:
      return { ...state, logged: false, user: null };

    case types.logout:
      return { ...state, logged: false, user: null };

    case types.colors:
      return { ...state, statusColors: action.payload };

    case types.img:
      return { ...state, img: action.payload };

    default:
      return state;
  }
};
