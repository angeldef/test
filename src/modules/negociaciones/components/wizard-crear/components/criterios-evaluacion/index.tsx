import { useForm } from 'react-hook-form';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { CustomTooltip } from '../custom-tooltip';
import { Pregunta } from '../pregunta';
import { CriterioData } from '../configurar-concurso';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import styles from './styles.module.scss';

export interface Criterio {
  title: string;
  tooltip?: string;
  disableAction?: boolean;
}

interface Props extends Criterio {
  acumulado: number;
  onChangePorcentaje: Function;
  index: number;
  criterioData: CriterioData;
  setCriterioData: Function;
}

export const CriteriosEvaluacion = forwardRef(({ title, tooltip, disableAction, acumulado, onChangePorcentaje, index, criterioData }: Props, ref) => {
  const [expanded, setExpanded] = useState(false);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);

  useImperativeHandle(ref, () => ({
    handleSubmit,
    getValues,
    preguntas,
    expanded,
  }));

  const validatePCT = (val: string) => {
    if (parseInt(val) < 10) return 'El porcentaje debe ser mayor o igual a 10';
    if (parseInt(val) > acumulado) return '';
  };

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    register,
    watch,
    reset,
  } = useForm({
    mode: 'all',
    defaultValues: {
      porcentaje: '',
    },
  });

  const watchFields = watch();
  const { porcentaje } = watchFields;

  useEffect(() => {
    const val = parseInt(porcentaje || '0');
    onChangePorcentaje(index, val);
  }, [porcentaje]);

  useEffect(() => {
    reset(criterioData?.form, {
      keepDirty: false,
    });

    setExpanded(criterioData.expanded);

    if (criterioData.preguntas) {
      setPreguntas(criterioData.preguntas);
    }
  }, [criterioData]);

  const onSubmit = () => {};

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.criterio}>
          <div className={styles.left}>
            <p>{title}</p>

            {tooltip && <CustomTooltip content={tooltip} />}
          </div>
          <div className={styles.right}>
            <div className={`form-group ${styles.formGroup}`} style={{ width: '75px' }}>
              <input
                type='text'
                className='form-control'
                placeholder='/100'
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => setValue('porcentaje', e.target.value.trimStart())}
                {...register('porcentaje', {
                  required: 'Campo requerido',
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Sólo se permiten números',
                  },
                  validate: validatePCT,
                })}
              />
              {errors.porcentaje && <small className='text-danger'>{errors.porcentaje.message as string}</small>}
            </div>

            {
              <div className={disableAction ? styles.hide : ''}>
                <AddCircleOutlineIcon
                  sx={{ color: '#00aec7', cursor: 'pointer' }}
                  onClick={() => {
                    setExpanded((prev) => !prev);
                  }}
                />
              </div>
            }
          </div>
        </div>
      </form>

      <Pregunta preguntas={preguntas} setPreguntas={setPreguntas} expanded={expanded} />
    </>
  );
});
