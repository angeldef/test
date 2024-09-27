export interface DataTable extends ProposalsResponse {
  id: number;
}
export interface ProposalsResponse {
  categoryGrouper: CategoryGrouper;
  createdAt: string;
  negotiationSupplierId: string;
  negotiatorName: string;
  status: string;
  supplierName: string;
  supplierRfc: string;
  grouper: string;
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
