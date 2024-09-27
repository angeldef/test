import { GridRowId } from '@mui/x-data-grid';
import { DataTableSuppliers, SuppliersResponse } from './steps/select-supplier/form-builder/types';
import { DataTableNegotiations } from './steps/select-negotiation/types';
import { DataTableSupplies } from './steps/add-supplies/form-builder/types';

export interface Wizard {
  selectSupplier: {
    form: object;
    selectionModel: GridRowId[];
    rows: DataTableSuppliers[];
    supplierInfo: SuppliersResponse;
    searched: boolean;
    supplierId: string;
  };
  selectNegotiation: {
    selectionModel: GridRowId[];
    rows: DataTableNegotiations[];
    proposalId: string;
  };
  supplies: {
    rows: DataTableSupplies[];
  };
  taxes: {
    form: { comment: string; discount: string; isrRet: string; iva: string; ivaRet: string; ret: string };
  };
  purchaseId: string;
  currency: string;
  request: any;
  generate: {
    discount: number;
    iva: number;
    ivaRet: number;
    otherRet: number;
    isrRet: number;
    total: number;
    subTotal: number;
    totalToPay: number;
  };
  generated: boolean;
  folio: string;
  folioDate: string;
}
