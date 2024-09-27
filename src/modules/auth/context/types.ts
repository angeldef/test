export interface StatusColors {
  _id: string;
  key: string;
  description: string;
  color: Color;
  step: string;
}

export interface Img {
  [key: string]: string;
}

export enum Color {
  E3E829 = '#E3E829',
  Ef6910 = '#EF6910',
  Ff4D4F = '#FF4D4F',
  The00Aec7 = '#00AEC7',
  The52C41A = '#52C41A',
}

export interface Module {
  key: string;
  img: string;
  title: string;
  text: string;
  url?: string;
  submodules: Submodule[];
}

export interface Submodule {
  key: string;
  img: string;
  title: string;
  text: string;
  url: string;
}
