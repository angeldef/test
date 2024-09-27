import { Controller, FieldValues, useForm } from 'react-hook-form';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { FormComponentType } from '@/core/types/FormComponentType';
import { FormControlLabel, Switch } from '@mui/material';
import { Catalogos } from '@/modules/negociaciones/components/formalization/components';
import { DynamicCurrency, DynamicDatetime, DynamicFile, DynamicSelect, DynamicTextArea, DynamicTextField } from '@/core/components';
import styles from './styles.module.scss';

type Props = {
  title: string;
  components: FormComponentType[];
  onSubmit: (values: FieldValues) => void;
  defaultValues?: any;
  catalogos: Catalogos;
  getZipCodeCatalogs: Function;
  personType?: string;
};

export const FormBuilder = forwardRef(({ title, components, onSubmit, defaultValues, catalogos, getZipCodeCatalogs, personType }: Props, ref) => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    register,
    reset,
    setValue,
    watch,
    trigger,
    getValues,
  } = useForm({
    mode: 'all',
  });

  const watchFields = watch();
  const { country, zip_code, nameOperativeContact, emailOperativeContact, phoneOperativeContact } = watchFields;

  useImperativeHandle(ref, () => ({
    handleSubmit,
    trigger,
    getValues,
    isValid,
  }));

  useEffect(() => {
    if (!defaultValues) return;
    const keys = components.map((e) => e.key);
    let obj = {};
    keys.forEach((key) => {
      obj = { ...obj, [key]: defaultValues[key] };
    });
    reset(obj, {
      keepDirty: false,
    });
  }, []);

  useEffect(() => {
    if (zip_code && country === '052') {
      getZipCodeCatalogs(zip_code);
    }
  }, [zip_code]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`mt-3 ${styles[title]}`} style={{ display: 'grid' }}>
      {components
        .filter((component) => !component.hidden)
        .map((component, i) => {
          const disabled = component.key === 'rfc';
          const required =
            (component.key == 'nameOperativeContact' || component.key == 'phoneOperativeContact' || component.key == 'emailOperativeContact') &&
            (nameOperativeContact || phoneOperativeContact || emailOperativeContact);

          switch (component.type) {
            case 'textfield':
              if (country === '052' && (component.key == 'foreign_state' || component.key == 'foreign_city')) return;

              if (
                personType != '1' &&
                (component.key === 'nameNaturalPerson' ||
                  component.key === 'secondNameNaturalPerson' ||
                  component.key === 'surnameNaturalPerson' ||
                  component.key === 'secondSurnameNaturalPerson')
              )
                return;

              if (personType != '2' && component.key === 'nameLegalPerson') return;

              return (
                <div className={`form-group ${styles['div' + (i + 1)]}`} key={i}>
                  <DynamicTextField
                    component={component}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    disabled={disabled}
                    setRequired={required}
                  />
                </div>
              );

            case 'textarea':
              return (
                <div className={`form-group ${styles['div' + (i + 1)]}`} key={i}>
                  <DynamicTextArea component={component} register={register} setValue={setValue} errors={errors} />
                </div>
              );
            case 'currency':
              return (
                <div className={`form-group ${styles['div' + (i + 1)]}`} key={i}>
                  <DynamicCurrency component={component} control={control} errors={errors} />
                </div>
              );
            case 'datetime':
              return (
                <div className={`form-group ${styles['div' + (i + 1)]}`} key={i}>
                  <DynamicDatetime component={component} control={control} watchFields={watchFields} trigger={trigger} />
                </div>
              );
            case 'select':
              if (component.key === 'supplierType') return;

              if (country !== '052' && (component.key == 'city' || component.key == 'municipality' || component.key == 'colony')) {
                return;
              }

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
              return (
                <div className={`form-group file ${styles['div' + (i + 1)]}`} key={i}>
                  <div style={{ paddingBottom: '5px' }}>
                    <DynamicFile component={component} control={control} />
                  </div>
                </div>
              );

            case 'htmlelement':
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
