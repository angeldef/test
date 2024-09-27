import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { ContestAnswer } from '../../types';
import { useEffect } from 'react';
import styles from './styles.module.scss';

type Props = {
  contestAnswer: ContestAnswer;
  index: number;
  setAnwswer: (index: number, value: string) => void;
  completed?: boolean;
};

export const Question = ({ contestAnswer, index, setAnwswer, completed }: Props) => {
  const { handleSubmit, control, watch, setValue } = useForm({
    mode: 'all',
  });

  const watchFields = watch();

  const onSubmit = (form: FieldValues) => {};

  useEffect(() => {
    if (watchFields?.value) {
      const { value } = watchFields;
      setAnwswer(index, value);
    }
  }, [watchFields?.value]);

  useEffect(() => {
    const { value } = contestAnswer;
    setValue('value', value);
  }, []);

  const { area } = contestAnswer;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        rules={{ required: true }}
        control={control}
        name='value'
        defaultValue=''
        render={({ field }) => (
          <RadioGroup {...field}>
            {area && <div className={styles.title}>{area === 'proposal' ? 'ECONÓMICOS' : area}</div>}

            <div className={styles.row}>
              <div className={styles.text}>
                <p className='bold'>{contestAnswer.question}</p>
                <p className='text-secondary'>{contestAnswer.comment}</p>
              </div>
              <div className={`${styles.col} ${styles.answer}`}>{contestAnswer.answer}</div>
              <div className={styles.col}>
                <FormControlLabel value='1' control={<Radio disabled={completed} />} label='' sx={{ margin: 0 }} />
              </div>
              <div className={styles.col}>
                <FormControlLabel value='2' control={<Radio disabled={completed} />} label='' sx={{ margin: 0 }} />
              </div>
              <div className={styles.col}>
                <FormControlLabel value='3' control={<Radio disabled={completed} />} label='' sx={{ margin: 0 }} />
              </div>
            </div>
          </RadioGroup>
        )}
      />
    </form>
  );
};
