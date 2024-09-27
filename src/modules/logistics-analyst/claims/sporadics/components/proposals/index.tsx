import { useEffect, useState } from 'react';
import { ApplicationsDashboard, Status } from './dashboard';
import { ApplicationDetail } from './detail';
import { SelectSupplier } from './select-supplier';
import { Approved } from './select-supplier/types';
import { NegociationInfo } from '@/modules/negociaciones';
import { proposalService } from '@/core/services/proposals';

export enum View {
  DASHBOARD = 'DASHBOARD',
  DETAIL = 'DETAIL',
  SELECTION = 'SELECTION',
}

type Props = {
  id: string;
  negociationInfo?: NegociationInfo;
  setContract: Function;
  disableInvitations: Function;
};

export const ProposalsPage = ({ id, negociationInfo, setContract, disableInvitations }: Props) => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [proposalId, setProposalId] = useState<string>();
  const [approveds, setApproveds] = useState<Approved[]>([]);
  const [canSelectSupplier, setCanSelectSupplier] = useState<boolean>(false);
  const { isContest, status } = negociationInfo ?? {};

  const onLoad = async () => {
    const { data: resp } = await proposalService.getApproveds(id);
    setApproveds(resp.data);
    const candidates = resp?.data?.length;
    setCanSelectSupplier(((isContest && candidates >= 3) || (!isContest && candidates > 0)) && status !== Status.CLOSED);
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <>
      {currentView === View.DASHBOARD && (
        <ApplicationsDashboard setCurrentView={setCurrentView} setProposalId={setProposalId} id={id} canSelectSupplier={canSelectSupplier} />
      )}
      {currentView === View.DETAIL && (
        <ApplicationDetail setCurrentView={setCurrentView} proposalId={proposalId!} refreshCandidates={onLoad} setContract={setContract} />
      )}
      {currentView === View.SELECTION && (
        <SelectSupplier
          negotiationId={id}
          approveds={approveds}
          setCurrentView={setCurrentView}
          setContract={setContract}
          isContest={isContest}
          disableInvitations={disableInvitations}
        />
      )}
    </>
  );
};
