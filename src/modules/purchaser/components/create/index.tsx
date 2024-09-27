import { CircularProgress } from '@mui/material';
import { StepBar } from '@/modules/negociaciones/components';
import { useEffect, useState } from 'react';
import { FormComponentType } from '@/core/types/FormComponentType';
import { purchaserService } from '../../services/purchaser';
import { GlobalFooter, GlobalHeader } from '@/core/components';
import { AddSupplies, Generate, SelectNegotiation, SelectSupplier, Taxes } from './steps';
import { SuppliersResponse } from './steps/select-supplier/form-builder/types';
import { Wizard } from './types';
import { useParams } from 'react-router-dom';
import styles from './styles.module.scss';

type FormIO = {
  components: FormComponentType[];
  properties: { CONTRACT_REQUIRED: string; SHOW_WARNING: string; REQUIRE_APPROVAL: string; INVALID_TOTAL: string };
  title: string;
  tooltip: string;
};

enum STATUS {
  DRAFT = 'BORRADOR',
  GENERATED = 'GENERADA',
  APPROVED = 'APROBADA',
  APPROVING = 'EN FLUJO DE APROBACIONES',
}

export const CreatePurchaseOrder = () => {
  const [loading, setLoading] = useState(true);
  const [formIO, setFormIO] = useState<FormIO[]>([]);
  const [index, setindex] = useState(0);
  const [supplierInfo, setSupplierInfo] = useState<SuppliersResponse>();
  const [wizard, setWizard] = useState<Wizard>({} as Wizard);
  let { id } = useParams();
  const form = formIO[index] ?? {};
  const { title: formTitle } = form ?? {};

  const onLoad = async () => {
    // const { data: resp } = await purchaserService.getFormIOFake();
    const { data: resp } = await purchaserService.formIoPurchaseOrder();
    !id && setLoading(false);

    if (resp) {
      const { components } = resp.data;
      setFormIO(components);

      if (id) getPurchaseOrder(components);
    }
  };

  const next = () => {
    if (index < formIO?.length - 1) setindex((prev) => prev + 1);
  };

  const back = () => {
    if (index > 0) setindex((prev) => prev - 1);
  };

  const updateWizard = (state: Object) => {
    setWizard((prev) => ({ ...prev, ...state }));
  };

  const wizardProps = {
    back,
    next,
    wizard,
    updateWizard,
  };

  const renderStep = () => {
    const { components, properties } = form;
    switch (formTitle) {
      case 'select-supplier':
        return <SelectSupplier components={components} setSupplierInfo={setSupplierInfo} {...wizardProps} />;
      case 'select-negotiation':
        return <SelectNegotiation supplierInfo={supplierInfo!} {...wizardProps} />;
      case 'supplies':
        return <AddSupplies components={components} supplierInfo={supplierInfo!} {...wizardProps} />;
      case 'taxes':
        return <Taxes components={components} properties={properties} supplierInfo={supplierInfo!} {...wizardProps} />;
      case 'generate':
        return <Generate properties={properties} supplierInfo={supplierInfo!} {...wizardProps} />;
    }
  };

  const getPurchaseOrder = async (formIO: FormIO[]) => {
    const { data: resp } = await purchaserService.getPurchaseOrder(id!);

    if (resp) {
      setLoading(false);
      const { purchaseOrder } = resp.data;
      const { status } = purchaseOrder ?? {};

      if (status == STATUS.GENERATED || status == STATUS.APPROVED || status == STATUS.APPROVING) {
        const { wizard, folio, folioDate } = purchaseOrder;
        updateWizard({ ...wizard, purchaseId: id, generated: true, folio, folioDate });
        const i = formIO.findIndex((e) => e.title === 'generate');
        setindex(i);
      } else {
        const {
          state: { wizard },
        } = purchaseOrder;
        updateWizard({ ...wizard, purchaseId: id });
      }
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <div className='container'>
      <div className='header'>
        <GlobalHeader />
      </div>

      <div className='main'>
        {loading ? (
          <div className='loading mt-4'>
            <CircularProgress />
          </div>
        ) : (
          <>
            <StepBar total={formIO?.length} current={index + 1} title='NUEVA ORDEN DE COMPRA' />
            <div className={styles.stepContainer}>{renderStep()}</div>
          </>
        )}
      </div>

      <GlobalFooter />
    </div>
  );
};
