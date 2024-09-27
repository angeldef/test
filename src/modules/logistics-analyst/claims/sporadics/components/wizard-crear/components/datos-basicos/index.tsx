import { useEffect, useRef, useState } from 'react';
import { FormBuilder } from './form-builder';
import { childProps } from '../..';
import { LoadingButton } from '@mui/lab';
import styles from './styles.module.scss';

export const DatosBasicos = ({ next, wizard, updateWizard, components, negociationInfo, setNegociationInfo, setCategories }: childProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<any>();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (form: any) => next();
  const [form, setForm] = useState<object>();

  useEffect(() => {
    const { title, description, area } = negociationInfo ?? {};
    const grouper = negociationInfo?.grouper.key ?? {};
    const amount = negociationInfo?.amount.key ?? {};
    setForm({ title, description, grouper, amount, area });
  }, [negociationInfo]);

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
          defaultValues={form ?? {}}
        />
        <div className='text-right'>
          <LoadingButton
            variant='contained'
            loading={loading}
            onClick={() => {
              ref?.current?.handleSubmit(onSubmit)();
            }}
          >
            CONTINUAR
          </LoadingButton>
        </div>
      </div>
    </>
  );
};
