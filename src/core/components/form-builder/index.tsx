import { FormComponentType } from '../../types/FormComponentType';
import { useForm } from 'react-hook-form';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { DynamicTextField, DynamicTextArea, DynamicSelect, DynamicDatetime, DynamicFile, DynamicCheckbox, DynamicCurrency } from '..';

type Props = {
  components: FormComponentType[];
  onSubmit: (values: unknown) => void;
  layout?: string;
  defaultValues: Object;
};

export const FormBuilder = forwardRef(({ components, onSubmit, layout, defaultValues }: Props, ref) => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    register,
    reset,
    getValues,
    setValue,
    trigger,
  } = useForm({
    mode: 'all',
  });

  useImperativeHandle(ref, () => ({
    handleSubmit,
    getValues,
    trigger,
    isValid,
  }));

  useEffect(() => {
    reset(defaultValues, {
      keepDirty: false,
    });
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`mt-3 ${layout}`}>
      {components
        .filter((component) => !component.hidden)
        .map((component, i) => {
          switch (component.type) {
            case 'textfield':
              return (
                <div className={`form-group ${layout && 'div' + (i + 1)}`} key={i}>
                  <DynamicTextField component={component} register={register} setValue={setValue} errors={errors} />
                </div>
              );

            case 'select':
              return (
                <div className={`form-group ${layout && 'div' + (i + 1)}`} key={i}>
                  <DynamicSelect component={component} control={control} setValue={setValue} catalogos={[]} errors={errors} />
                </div>
              );

            case 'textarea':
              return (
                <div className={`form-group ${layout && 'div' + (i + 1)}`} key={i}>
                  <DynamicTextArea component={component} register={register} setValue={setValue} errors={errors} />
                </div>
              );

            case 'file':
              return (
                <div className={`form-group file ${layout && 'div' + (i + 1)}`} key={i}>
                  <div style={{ paddingBottom: '5px' }}>
                    <DynamicFile component={component} control={control} />
                  </div>
                </div>
              );

            case 'checkbox':
              return (
                <div className={`form-group checkbox ${layout && 'div' + (i + 1)}`} key={i}>
                  <DynamicCheckbox component={component} control={control} />
                </div>
              );

            case 'currency':
              return (
                <div className={`form-group ${layout && 'div' + (i + 1)}`} key={i}>
                  <DynamicCurrency component={component} control={control} errors={errors} />
                </div>
              );

            case 'datetime':
              return (
                <div className={`form-group ${layout && 'div' + (i + 1)}`} key={i}>
                  <DynamicDatetime component={component} control={control} trigger={trigger} />
                </div>
              );

            default:
              return;
          }
        })}
    </form>
  );
});
