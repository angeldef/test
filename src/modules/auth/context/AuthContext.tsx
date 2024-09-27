import { createContext } from 'react';
import { Img, Module, StatusColors } from './types';

export type User = {
  token: string;
  userToken: string;
  email?: string;
  displayName?: string;
  roles?: [string];
  modules?: Module[];
};

type ContextType = {
  logged?: boolean;
  user?: User;
  login: Function;
  logout: Function;
  statusColors?: StatusColors[];
  img?: Img;
};

export const AuthContext = createContext({} as ContextType);
