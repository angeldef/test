export interface DataTable extends PurchasesResponse {
  id: number;
}
export interface PurchasesResponse {
  _id?: string;
  proposalId?: string;
  supplierId?: string;
  items?: Item[];
  createdBy?: string;
  status?: string;
  total?: number;
  totalToPay?: number;
  totalLabel?: string;
  createdAt?: string;
  supplierName?: string;
  folio?: string;
  rfc?: string;
  url?: string;
  currency?: string;
}

export interface Item {
  quantity?: number;
  price?: number;
  total?: number;
  udm?: string;
  description?: string;
}
