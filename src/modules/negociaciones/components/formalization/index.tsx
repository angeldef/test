import { useContext, useEffect, useState } from 'react';
import { CreateFormalization } from './components';
import { ApplicationDetail } from '../applications/detail';
import { NegotiationContext } from '../../context';
import { proposalService } from '../../../../core/services/proposals';
import { CircularProgress } from '@mui/material';
import { NegociationInfo } from '../..';

export enum View {
  CREATE = 'CREATE',
  DETAIL = 'DETAIL',
}

type Props = {
  negociationInfo?: NegociationInfo;
};

export const FormalizationPage = ({ negociationInfo }: Props) => {
  const { approvedProposal } = useContext(NegotiationContext);
  const [currentView, setCurrentView] = useState<View>(View.CREATE);
  const [loading, setLoading] = useState(true);
  const [supplierName, setSupplierName] = useState<string>();
  const [currency, setCurrency] = useState<string>();

  const getDetail = async () => {
    const { data: resp } = await proposalService.getProposal(approvedProposal!);
    setLoading(false);
    const { negotiatorFormalization, supplier, quotation } = resp.data ?? {};
    const { currency } = (quotation && quotation?.[0]) ?? {};
    setSupplierName(supplier?.name);
    setCurrency(currency);
    if (Object.keys(negotiatorFormalization ?? {}).length > 0) setCurrentView(View.DETAIL);
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <>
      {loading ? (
        <div className='loading mt-4'>
          <CircularProgress />
        </div>
      ) : (
        <>
          {currentView === View.CREATE && (
            <CreateFormalization
              proposalId={approvedProposal!}
              getDetail={getDetail}
              negociationInfo={negociationInfo}
              supplierName={supplierName}
              currency={currency}
            />
          )}
          {currentView === View.DETAIL && <ApplicationDetail setCurrentView={setCurrentView} proposalId={approvedProposal!} formalizationOption />}
        </>
      )}
    </>
  );
};
