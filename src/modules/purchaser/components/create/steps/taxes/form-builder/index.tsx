import { FieldValues, useForm } from 'react-hook-form';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FormComponentType } from '@/core/types/FormComponentType';
import { DynamicCurrency, DynamicSelect, DynamicTextArea, DynamicTextField } from '@/core/components';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { Wizard } from '../../../types';
import { purchaserService } from '@/modules/purchaser/services/purchaser';
import { DataTableSupplies } from '../../add-supplies/form-builder/types';
import { ModalInfo } from '../../../modal-info';
import { useNavigate } from 'react-router-dom';
import { ModalConfirmCancel } from '../../../modal-confirm-cancel';
import { codeErrorPurchase } from '@/core/utils/enums';
import { ModalNotification } from '../../../modal-notification';
import styles from './styles.module.scss';
import { defaulErrorSavingOrder } from '../..';

type Props = {
  properties: { CONTRACT_REQUIRED: string; SHOW_WARNING: string; REQUIRE_APPROVAL: string; INVALID_TOTAL: string };
  components: FormComponentType[];
  defaultValues?: object;
  back: Function;
  next: Function;
  wizard: Wizard;
  updateWizard: Function;
};

export const FormBuilder = forwardRef(({ components, defaultValues, back, next, wizard, updateWizard, properties }: Props, ref) => {
  const { taxes } = wizard;
  const [loading, setLoading] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [feedback, setFeedback] = useState<string>();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [triggerSaveDraft, setTriggerSaveDraft] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    reset,
    setValue,
    watch,
    control,
  } = useForm({
    mode: 'all',
  });

  const watchFields = watch();

  const getPctValue = (val: string) => {
    if (!val) return null;
    return parseFloat(val.replace('%', '').replaceAll(',', ''));
  };

  useEffect(() => {
    if (taxes?.form)
      reset(taxes.form, {
        keepDirty: false,
      });
  }, [taxes?.form]);

  const onSubmit = async (values: FieldValues) => {
    const { comment, discount, isrRet, iva, ivaRet, ret } = values;
    const { supplies } = wizard;
    const { rows } = supplies;
    updateWizard({ taxes: { form: { ...values } } });

    const items = rows.map((e: DataTableSupplies) => ({
      quantity: e.quantityVal,
      price: e.priceVal,
      total: e.totalVal,
      udm: e.udm,
      description: e.description,
    }));

    const { selectSupplier, selectNegotiation } = wizard;
    const { proposalId } = selectNegotiation;
    const { supplierId } = selectSupplier;

    const body = {
      proposalId,
      supplierId,
      items,
      comment,
      discount: getPctValue(discount),
      isrRet: getPctValue(isrRet),
      iva: getPctValue(iva),
      ivaRet: getPctValue(ivaRet),
      ret: getPctValue(ret),
      previsualize: true,
    };

    setLoading(true);
    const { data: resp, error } = await purchaserService.savePurchase(body);
    setLoading(false);
    if (resp) {
      updateWizard({ taxes: { form: { ...values } }, generate: { ...resp.data }, request: body });
      setTriggerSaveDraft(true);
    }

    if (error) {
      const { code } = error.errors[0];
      const codeErrorPurchase = code as codeErrorPurchase;
      setOpenNotification(true);
      setFeedback(properties[codeErrorPurchase] ?? defaulErrorSavingOrder);
    }
  };

  useEffect(() => {
    if (triggerSaveDraft) {
      saveDraft(true);
      next();
    }
  }, [triggerSaveDraft]);

  const saveDraft = async (silentMode?: boolean) => {
    const { supplies } = wizard;
    const { rows } = supplies;

    const items = rows.map((e) => ({
      quantity: e.quantityVal,
      price: e.priceVal,
      total: e.totalVal,
      udm: e.udm,
      description: e.description,
    }));

    const { selectSupplier, selectNegotiation, purchaseId, taxes } = wizard;
    const { proposalId } = selectNegotiation;
    const { supplierId } = selectSupplier;
    const state = { wizard };

    const { comment, discount, isrRet, iva, ivaRet, ret } = taxes?.form ?? {};

    const body = {
      ...(purchaseId && { id: purchaseId }),
      state,
      proposalId,
      supplierId,
      items,
      comment,
      ...(discount && { discount: getPctValue(discount) }),
      ...(isrRet && { isrRet: getPctValue(isrRet) }),
      ...(iva && { iva: getPctValue(iva) }),
      ...(ivaRet && { ivaRet: getPctValue(ivaRet) }),
      ...(ret && { ret: getPctValue(ret) }),
    };

    const { data: resp } = await purchaserService.savePurchase(body);

    if (resp) {
      const { id } = resp.data;
      updateWizard({ purchaseId: id });
      if (silentMode) return;
      setOpenInfo(true);
    }
  };

  const deleteOrder = async () => {
    const { purchaseId: id } = wizard ?? {};
    setLoading(true);
    const { data } = await purchaserService.savePurchase({ delete: true, id });
    setLoading(false);
    if (data) navigate('/orden-compra', { replace: true });
  };

  useImperativeHandle(ref, () => ({
    handleSubmit,
    saveDraft,
    isValid,
  }));

  useEffect(() => {
    reset(defaultValues, {
      keepDirty: false,
    });
  }, []);

  return (
    <>
      <h2 className='joey mb-2'>Impuestos de la orden de compra</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {components.map((component, i) => {
          const { key } = component;

          switch (component.type) {
            case 'textfield':
              return (
                <div className={`form-group ${styles['div' + (i + 1)]}`} key={i}>
                  <DynamicTextField component={component} register={register} setValue={setValue} errors={errors} />
                </div>
              );
            case 'currency':
              return (
                <div className={`form-group ${styles['div' + (i + 1)]}`} style={{ gridColumn: key === 'description' ? '1/3' : 'auto' }} key={i}>
                  <DynamicCurrency component={component} control={control} errors={errors} removePrefix={key === 'quantity'} />
                </div>
              );
            case 'select':
              return (
                <div className={`form-group ${styles['div' + (i + 1)]}`} key={i}>
                  <DynamicSelect component={component} control={control} setValue={setValue} catalogos={[]} errors={errors} />
                </div>
              );
            case 'textarea':
              return (
                <div className={`form-group ${styles['div' + (i + 1)]}`} style={{ gridColumn: '1/4' }} key={i}>
                  <DynamicTextArea component={component} register={register} setValue={setValue} errors={errors} />
                </div>
              );
          }
        })}
      </form>

      <div className={styles.buttons}>
        <Button
          variant='outlined'
          onClick={() => {
            updateWizard({ taxes: { form: { ...watchFields } } });
            saveDraft(true);
            back();
          }}
        >
          REGRESAR
        </Button>

        <LoadingButton
          variant='contained'
          type='submit'
          loading={loading}
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
        >
          PREVISUALIZAR
        </LoadingButton>
      </div>

      <div
        className={styles.link}
        onClick={() => {
          setOpenConfirm(true);
        }}
      >
        Cancelar
      </div>

      <ModalInfo
        open={openInfo}
        title='Borrador de Orden de Compra'
        feedback='Se ha guardado el borrador de la orden de compra correctamente'
        onClose={() => {
          setOpenInfo(false);
        }}
        onConfirm={() => {
          setOpenInfo(false);
        }}
      />

      <ModalConfirmCancel
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
        }}
        onConfirm={() => {
          setOpenConfirm(false);
          deleteOrder();
        }}
      />

      <ModalNotification
        open={openNotification}
        feedback={feedback!}
        onClose={() => {
          setOpenNotification(false);
        }}
        onConfirm={() => {
          setOpenNotification(false);
        }}
      />
    </>
  );
});
