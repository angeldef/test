import { Controller, FieldValues, useForm } from 'react-hook-form';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FormComponentType } from '../../../../../../core/types/FormComponentType';
import { DynamicCurrency, DynamicDatetime, DynamicFile, DynamicSelect, DynamicTextArea } from '../../../../../../core/components';
import { FormControlLabel, Switch } from '@mui/material';
import styles from './styles.module.scss';
import { Catalogos } from '..';

type Props = {
  title: string;
  components: FormComponentType[];
  onSubmit: (values: FieldValues) => void;
  defaultValues?: object;
  catalogos: Catalogos;
  signAgreement: string | undefined;
  quotationCurrency?: string;
};

const currency: FormComponentType = {
  type: 'select',
  key: 'currency',
  label: 'MONEDA',
  properties: {
    catalogo: 'currencies',
  },
};

export const FormBuilder = forwardRef(({ title, components, onSubmit, defaultValues, catalogos, signAgreement, quotationCurrency }: Props, ref) => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    register,
    reset,
    setValue,
    watch,
    trigger,
  } = useForm({
    mode: 'all',
  });

  const watchFields = watch();
  const { quantityContract } = watchFields;

  useImperativeHandle(ref, () => ({
    handleSubmit,
    isValid,
  }));

  useEffect(() => {
    reset(defaultValues, {
      keepDirty: false,
    });
    setValue('confidentialityAgreement', null);
    setValue('quantityContract', true);
    setValue('currency', quotationCurrency);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`mt-3 ${styles[title]}`} style={{ display: 'grid' }}>
      {components
        .filter((component) => !component.hidden)
        .map((component, i) => {
          const { contractDateStart, contractDateEnd } = watchFields;
          let beforeThanCustom, afterThanCustom;
          if (component.key === 'annexDateStart') {
            afterThanCustom = contractDateStart;
          }
          if (component.key === 'annexDateEnd') {
            beforeThanCustom = contractDateEnd;
            afterThanCustom = contractDateStart;
          }

          switch (component.type) {
            case 'textarea':
              return (
                <div className={`form-group ${styles['div' + (i + 1)]}`} key={i}>
                  <DynamicTextArea component={component} register={register} setValue={setValue} errors={errors} />
                </div>
              );
            case 'currency':
              if (!quantityContract) return;

              return (
                <div className={`form-group ${styles['div' + (i + 1)]}`} key={i}>
                  <div className={styles.currency}>
                    <div>
                      <DynamicCurrency component={component} control={control} errors={errors} />
                    </div>
                    <div>
                      <DynamicSelect
                        component={currency}
                        control={control}
                        setValue={setValue}
                        catalogos={catalogos}
                        errors={errors}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
              );
            case 'datetime':
              return (
                <div className={`form-group ${styles['div' + (i + 1)]}`} key={i}>
                  <DynamicDatetime
                    component={component}
                    control={control}
                    watchFields={watchFields}
                    trigger={trigger}
                    beforeThanCustom={beforeThanCustom}
                    afterThanCustom={afterThanCustom}
                  />
                </div>
              );
            case 'select':
              if (!quantityContract) return;

              return (
                <div className={`form-group ${styles['div' + (i + 1)]}`} key={i}>
                  <DynamicSelect component={component} control={control} setValue={setValue} catalogos={catalogos} errors={errors} />
                </div>
              );

            case 'checkbox':
              return (
                <div className={`form-group ${styles['div' + (i + 1)]}`} key={i} style={{ marginTop: '-10px' }}>
                  <Controller
                    name={component.key}
                    defaultValue={false}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FormControlLabel sx={{ marginRight: 0 }} control={<Switch checked={value} onChange={onChange} />} label='' />
                    )}
                  />
                  <span>{component.label}</span>
                </div>
              );

            case 'file':
              if (signAgreement !== 'si') return;

              return (
                <div className={`form-group file ${styles['div' + (i + 1)]}`} key={i}>
                  <div style={{ paddingBottom: '5px' }}>
                    <DynamicFile component={component} control={control} formats='.zip, .pdf' />
                  </div>
                </div>
              );

            case 'htmlelement':
              if (signAgreement !== 'si' && component.key === 'confidentialityAgreementLabel') return;

              return (
                <h3 className={`form-group ${styles['div' + (i + 1)]} ${styles.htmlelement}`} key={i}>
                  {component.label}
                </h3>
              );
            default:
              return;
          }
        })}
    </form>
  );
});
