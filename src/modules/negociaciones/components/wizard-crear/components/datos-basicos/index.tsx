import { useRef, useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import styles from './styles.module.scss';
import { FormBuilder } from './form-builder';
import { childProps } from '../..';
import { apiService } from '../../../../../../core/services';
import { LoadingButton } from '@mui/lab';

export const DatosBasicos = ({ next, wizard, updateWizard, components, negociationInfo, setNegociationInfo, setCategories }: childProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<any>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (form: any) => {
    const { catalogos } = wizard;

    let body = {
      ...form,
      amount: catalogos['amounts'].find((e: any) => e.key == form.amount),
      category: catalogos['categories'].find((e: any) => e.key == form.category),
      grouper: catalogos['groupers'].find((e: any) => e.key == form.grouper),
    };

    const filtered = structuredClone(body);
    delete filtered?.grouper?.categories;
    body = { ...filtered };

    const state = {
      currentStep: 2,
      wizard: { datosBasicos: { form, amountExceeds: amountExceeds(form.amount) } },
    };

    if (wizard.datosBasicos?.idNegociation) {
      const { idNegociation } = wizard.datosBasicos;
      setLoading(true);
      const { data: resp, error } = await apiService.updateNegociation({ ...body, state }, idNegociation);
      setLoading(false);

      if (!error) {
        updateWizard({ datosBasicos: { form, amountExceeds: amountExceeds(form.amount), idNegociation } });
        setNegociationInfo(body);
        next();
      }
    } else {
      setLoading(true);
      const { data: resp, error } = await apiService.createNegociation({ ...body, state });
      setLoading(false);

      if (!error) {
        const { insertedId: idNegociation } = resp.data;
        updateWizard({ datosBasicos: { form, amountExceeds: amountExceeds(form.amount), idNegociation } });
        setNegociationInfo(body);
        next();
      }
    }
  };

  const handleClose = () => setOpen(false);

  const amountExceeds = (amount: any) => {
    const val = parseFloat(amount.split('_')[1] ? amount.split('_')[1] : amount.split('_')[0]);
    return val > 500000;
  };

  return (
    <>
      <div className={styles.container}>
        <h2 className='joey'>Datos básicos de la necesidad</h2>

        <FormBuilder
          ref={ref}
          layout='datosBasicos'
          setOpen={setOpen}
          onSubmit={onSubmit}
          components={components}
          setCategories={setCategories}
          catalogos={wizard.catalogos}
          defaultValues={wizard.datosBasicos?.form}
        />
        <div className='text-right'>
          <LoadingButton
            variant='contained'
            loading={loading}
            onClick={() => {
              ref?.current?.handleSubmit(onSubmit)();
            }}
          >
            GUARDAR
          </LoadingButton>
        </div>
      </div>

      <div className='modal'>
        <Dialog open={open} onClose={handleClose} className='modal-small'>
          <DialogTitle>Alerta</DialogTitle>
          <DialogContent>
            <div className={styles.modalBody}>
              <p>La necesidad se convierte en concurso porque la cuantía supera los 500,000 MXN</p>
              <div className={styles.buttons}>
                <Button
                  variant='contained'
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Aceptar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
