import { useEffect, useRef, useState } from 'react';
import { apiService } from '../../../../../../core/services';
import { StepBar } from '../../..';
import { FormComponentType } from '../../../../../../core/types/FormComponentType';
import { FormBuilder, ModalConfirm } from '../../components';
import { FieldValues } from 'react-hook-form';
import { Button, CircularProgress } from '@mui/material';
import { formalizationService } from '../../../../../../core/services/formalization';
import { LoadingButton } from '@mui/lab';
import { ModalWelcome } from '../modal-welcome';
import { NegociationInfo } from '../../../..';
import styles from './styles.module.scss';

type FormIO = { components: FormComponentType[]; properties: { next: string; prev: string }; title: string; tooltip: string };

interface Catalogo {
  _id?: string;
  key: string;
  description: string;
}

export interface Catalogos {
  [key: string]: Catalogo[];
}

type Props = {
  proposalId: string;
  getDetail: Function;
  negociationInfo?: NegociationInfo;
  supplierName: string | undefined;
  currency?: string;
};

const getFloatValue = (val: string) => parseFloat(val?.replace('$ ', '').replaceAll(',', ''));

export const CreateFormalization = ({ proposalId, getDetail, negociationInfo, supplierName, currency }: Props) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [openWelcome, setOpenWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [signAgreement, setSignAgreement] = useState<string>();
  const [formIO, setFormIO] = useState<FormIO[]>([]);
  const [catalogos, setCatalogos] = useState<Catalogos>();
  const ref = useRef<any>();
  const { title, components, tooltip: info } = formIO[currentStep] ?? {};

  const onLoad = async () => {
    // const { data: resp } = await apiService.getFormalizationFake();
    const { data: resp } = await apiService.formRF();
    const { data: periodicity } = await formalizationService.getPeriodicity();
    const currencies = [
      { key: 'MXN', description: 'MXN' },
      { key: 'USD', description: 'USD' },
    ];
    setCatalogos({ periodicity: periodicity?.data, currencies });
    setLoading(false);
    if (resp) {
      const { components } = resp.data;
      setFormIO(components);
    }

    const { signAgreement } = negociationInfo ?? {};
    setSignAgreement(signAgreement);
  };

  const onSubmit = async (form: FieldValues) => {
    next();

    if (currentStep === formIO?.length - 1) {
      const { quantity, quantityContract } = form;
      const { frequencyDescription } = getDescription(form);
      const body = {
        ...form,
        ...(quantity && { quantity: getFloatValue(quantity), quantityFormatted: quantity?.toString().replace('$ ', '') }),
        frequencyDescription,
      };

      if (!quantityContract) {
        delete body.quantity;
        delete body.frequency;
        delete body.frequencyDescription;
      }

      setSubmitting(true);
      const { data: resp } = await formalizationService.negotiatiorFormalization(body, proposalId);
      setSubmitting(false);

      if (resp) setOpen(true);
    }
  };

  const next = () => {
    const {
      properties: { next },
    } = formIO[currentStep] ?? {};
    const i = formIO.findIndex((e) => e.title === next);
    if (i >= 0 && i < formIO.length) setCurrentStep(i);
  };

  const back = () => {
    const {
      properties: { prev },
    } = formIO[currentStep] ?? {};
    const i = formIO.findIndex((e) => e.title === prev);
    if (i >= 0) setCurrentStep(i);
  };

  const getDescription = (form: FieldValues) => {
    const { frequency } = form;
    const { description: frequencyDescription } = catalogos?.periodicity?.find((e) => e.key === frequency) ?? {};
    return { frequencyDescription };
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <>
      {loading ? (
        <div className='loading mt-4'>
          <CircularProgress />
        </div>
      ) : (
        <>
          <StepBar total={formIO?.length} current={currentStep + 1} title='FORMALIZACIÓN' info={info} />

          <div className={styles.container}>
            <div className={styles.formContainer}>
              <FormBuilder
                ref={ref}
                onSubmit={onSubmit}
                title={title}
                components={components ?? []}
                catalogos={catalogos ?? {}}
                signAgreement={signAgreement}
                quotationCurrency={currency}
              />
            </div>

            <div className={styles.buttons}>
              <Button
                variant='outlined'
                className={currentStep < 1 ? styles.hidden : ''}
                onClick={() => {
                  back();
                }}
              >
                REGRESAR
              </Button>

              <LoadingButton
                variant='contained'
                loading={submitting}
                onClick={() => {
                  ref.current.handleSubmit(onSubmit)();
                }}
              >
                {currentStep !== formIO?.length - 1 ? 'CONTINUAR' : 'FINALIZAR'}
              </LoadingButton>
            </div>
          </div>
        </>
      )}

      <ModalConfirm
        open={open}
        onClose={() => {
          setOpen(false);
          getDetail();
        }}
      />

      <ModalWelcome
        open={openWelcome}
        negotiation={negociationInfo?.description ?? ''}
        supplier={supplierName ?? ''}
        onClose={() => {
          setOpenWelcome(false);
          getDetail();
        }}
      />
    </>
  );
};
