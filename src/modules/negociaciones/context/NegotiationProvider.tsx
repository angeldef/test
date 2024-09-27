import { createContext, useState } from 'react';

type ContextType = {
  approvedProposal?: string | null;
  setApprovedProposal: (val: string | null) => void;
};

export const NegotiationContext = createContext({} as ContextType);

export const NegotiationProvider = ({ children }: { children: JSX.Element }) => {
  const [approvedProposal, setApprovedProposal] = useState<string | null>();

  return (
    <NegotiationContext.Provider
      value={{
        approvedProposal,
        setApprovedProposal,
      }}
    >
      {children}
    </NegotiationContext.Provider>
  );
};
