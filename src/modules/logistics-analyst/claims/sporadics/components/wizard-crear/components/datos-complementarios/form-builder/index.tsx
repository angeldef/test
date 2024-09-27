import { useForm } from 'react-hook-form';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FormComponentType } from '@/core/types/FormComponentType';
import { DynamicTextField, DynamicTextArea, DynamicSelect, DynamicRadio, DynamicFile, DynamicCheckbox, DynamicCurrency } from '@/core/components';
import styles from './styles.module.scss';

type Catalogos = {
  [key: string]: any;
};

type Props = {
  components: FormComponentType[];
  onSubmit: (values: unknown) => void;
  layout?: string;
  defaultValues: Object;
  catalogos: Catalogos;
  setHasCase: Function;
  setHasRisk: Function;
};

export const FormBuilder = forwardRef(({ components, onSubmit, layout, defaultValues, catalogos, setHasCase, setHasRisk }: Props, ref) => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    register,
    watch,
    reset,
    setValue,
    getValues,
    trigger,
  } = useForm({
    mode: 'all',
  });

  const [open, setOpen] = useState(false);
  const watchFields = watch();

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
    setValue('file', null);
  }, [defaultValues]);

  useEffect(() => {
    if (watchFields.caseProvider && watchFields.caseProvider != 'none') setHasCase(true);
    if (watchFields.caseProvider && watchFields.caseProvider == 'none') setHasCase(false);
  }, [watchFields.caseProvider]);

  useEffect(() => {
    if (watchFields.riskLevel && watchFields.riskLevel != 'none') setHasRisk(true);
    if (watchFields.riskLevel && watchFields.riskLevel == 'none') setHasRisk(false);
  }, [watchFields.riskLevel]);

  useEffect(() => {
    const { file } = watchFields;

    if (file) {
      const fileSizeInBytes = file.size;
      const fileSizeInKB = fileSizeInBytes / 1024; // Convert to KB
      const fileSizeInMB = fileSizeInKB / 1024; // Convert to MB

      if (fileSizeInMB > 2) {
        setValue('file', null);
        setOpen(true);
      }
    }
  }, [watchFields.file]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={`mt-3 ${layout}`}>
        {components
          .filter((component) => !component.hidden)
          .map((component, i) => {
            if (i > 1) return;

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
                    <DynamicSelect component={component} control={control} setValue={setValue} catalogos={catalogos} errors={errors} disabled />
                  </div>
                );

              case 'textarea':
                if (component.key == 'justification' && (!watchFields?.caseProvider || watchFields?.caseProvider == 'none'))
                  return <div className={`form-group ${layout && 'div' + (i + 1)}`} key={i}></div>;

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

              case 'radio':
                return (
                  <div className={` ${layout && 'div' + (i + 1)}`} key={i}>
                    <DynamicRadio component={component} control={control} errors={errors} disabled />
                  </div>
                );

              default:
                return;
            }
          })}

        <div className={styles.row}>
          <div className={styles.left}>
            CONSIDERACIONES DEL PROVEEDOR <span style={{ color: 'red' }}>*</span>
          </div>

          <div className={styles.yesNo}>
            <span>SI</span>
            <span>NO</span>
          </div>
        </div>

        {components
          .filter((component) => !component.hidden)
          .map((component, i) => {
            if (i <= 1) return;

            switch (component.type) {
              case 'radio':
                return (
                  <div className={` ${layout && 'div' + (i + 1)}`} key={i} style={{ gap: '10px' }}>
                    <DynamicRadio component={component} control={control} errors={errors} defaultValue='no' disabled />
                  </div>
                );

              default:
                return;
            }
          })}
      </form>

      <div className='modal'>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          className='modal-small'
        >
          <DialogTitle>Alerta</DialogTitle>
          <DialogContent>
            <div className={styles.modalBody}>
              <p>El tamaño del archivo debe ser menor a 2 MB</p>
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
});
