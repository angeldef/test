export interface DataTable extends ProposalsResponse {
  id: string;
  grouperDesc: string;
  amountDesc: string;
}
export interface ProposalsResponse {
  _id: string;
  createdAt: string;
  status: string;
  grouper: Grouper;
  title: string;
  amount: Amount;
}

export interface Grouper {
  key: string;
  description: string;
}

export interface Amount {
  key: number;
  description: string;
}
