import { useForm } from 'react-hook-form';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { FormComponentType } from '@/core/types/FormComponentType';
import { DynamicTextField, DynamicTextArea, DynamicSelect, DynamicDatetime, DynamicFile, DynamicCheckbox, DynamicCurrency } from '@/core/components';

type Catalogos = {
  [key: string]: any;
};

type Props = {
  components: FormComponentType[];
  onSubmit: (values: unknown) => void;
  layout?: string;
  setOpen: Function;
  defaultValues: object;
  catalogos: Catalogos;
  setCategories: Function;
};

export const FormBuilder = forwardRef(({ components, onSubmit, layout, setOpen, defaultValues, catalogos, setCategories }: Props, ref) => {
  const {
    handleSubmit,
    formState: { errors, isDirty },
    control,
    register,
    watch,
    reset,
    trigger,
    setValue,
  } = useForm({
    mode: 'all',
  });

  const watchFields = watch();

  useEffect(() => {
    if (watchFields?.amount && isDirty) {
      const val = parseFloat(watchFields?.amount.split('_')[1] ? watchFields?.amount.split('_')[1] : watchFields?.amount.split('_')[0]);
      if (val > 500000) setOpen(true);
    }
  }, [watchFields?.amount]);

  useEffect(() => {
    const key = watchFields?.grouper;
    const { groupers } = catalogos ?? {};
    const { categories } = groupers?.find((e: any) => e.key == key) || {};
    setCategories(categories);

    if (!categories?.find((e: any) => e.key == watchFields?.category)) setValue('category', '');
  }, [watchFields?.grouper]);

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  useEffect(() => {
    reset(defaultValues, {
      keepDirty: false,
    });
  }, [defaultValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`mt-3 ${layout}`}>
      {components
        .filter((component) => !component.hidden)
        .map((component, i) => {
          switch (component.type) {
            case 'textfield':
              return (
                <div className={`form-group ${layout && 'div' + (i + 1)}`} key={i}>
                  <DynamicTextField component={component} register={register} setValue={setValue} errors={errors} disabled />
                </div>
              );

            case 'select':
              return (
                <div className={`form-group ${layout && 'div' + (i + 1)}`} key={i}>
                  <DynamicSelect component={component} control={control} setValue={setValue} catalogos={catalogos} errors={errors} disabled />
                </div>
              );

            case 'textarea':
              return (
                <div className={`form-group ${layout && 'div' + (i + 1)}`} key={i}>
                  <DynamicTextArea component={component} register={register} setValue={setValue} errors={errors} disabled />
                </div>
              );

            default:
              return;
          }
        })}
    </form>
  );
});
