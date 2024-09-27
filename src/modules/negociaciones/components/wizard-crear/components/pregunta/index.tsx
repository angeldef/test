import { FieldValues, useForm } from 'react-hook-form';
import styles from './styles.module.scss';
import { useEffect, useRef, useState } from 'react';

export type Pregunta = {
  pregunta: string;
};

type Props = {
  expanded: boolean;
  preguntas: Pregunta[];
  setPreguntas: Function;
};

export const Pregunta = ({ expanded, preguntas, setPreguntas }: Props) => {
  const ref = useRef<any>(null);

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    setValue,
  } = useForm({
    mode: 'all',
    defaultValues: {
      pregunta: '',
    },
  });

  const onSubmit = (form: FieldValues) => {
    setPreguntas([...preguntas, form as Pregunta]);
    ref.current.style.maxHeight = 'none';
    reset();
  };

  const remove = (i: number) => {
    let array = [...preguntas];
    array.splice(i, 1);
    setPreguntas(array);
  };

  useEffect(() => {
    if (expanded) ref.current.style.maxHeight = ref.current.scrollHeight + 'px';
    else ref.current.style.maxHeight = 0;
  }, [expanded]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div ref={ref} className={`${styles.questions} ${expanded && styles.expanded}`}>
          <div className={styles.wrapper}>
            <div className='form-group'>
              <label>
                PREGUNTA <span>*</span>
              </label>
              <input
                type='text'
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => setValue('pregunta', e.target.value.trimStart())}
                className='form-control'
                placeholder='Ingrese su pregunta'
                {...register('pregunta', {
                  required: 'Campo requerido',
                })}
              />
              {errors.pregunta && <small className='text-danger'>{errors.pregunta.message as string}</small>}
            </div>

            <div
              className={styles.link}
              onClick={() => {
                handleSubmit(onSubmit)();
              }}
            >
              Agregar pregunta
            </div>

            {preguntas.map((pregunta, i) => (
              <div className={`${styles.row} ${styles.items}`} key={i}>
                <p className={styles.item}>{pregunta.pregunta}</p>
                <p className={styles.item} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    <i
                      className='fas fa-trash-alt text-right mr-1'
                      title='Eliminar'
                      onClick={() => {
                        remove(i);
                      }}
                    ></i>
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </form>
    </>
  );
};
