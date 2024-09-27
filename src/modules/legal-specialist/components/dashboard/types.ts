export interface DataTable {
  id: number;
  title: string;
  grouper: string;
  category: string;
  type: string;
  amount: string;
  fecha: string;
  status: string;
  _id: string;
  proposalData?: any;
  negotiatorName?: string;
  negotiationArea?: string;
  area?: string;
}

export interface CategoryGrouper {
  key: string;
  description: string;
  ocupations: Ocupation[];
}

export interface Ocupation {
  key: number;
  description: string;
}
