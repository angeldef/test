import { useEffect, useState } from 'react';
import { Question } from '../../components/question';
import { ContestAnswer } from '../../types';
import { LoadingButton } from '@mui/lab';
import { proposalService } from '../../../../../../../core/services/proposals';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import styles from './styles.module.scss';

type Props = {
  answers: ContestAnswer[];
  contestAnswers: ContestAnswer[];
  proposalId: string;
  getDetail: Function;
  readOnly?: boolean;
};

export const ContestTab = ({ contestAnswers, answers, proposalId, getDetail, readOnly }: Props) => {
  const [requestArray, setrequestArray] = useState<ContestAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>();
  const [completed, setCompleted] = useState(false);

  const setAnwswer = (index: number, value: string) => {
    setrequestArray((prev) => {
      let array = [...prev];
      array[index].value = value;
      return array;
    });
  };

  useEffect(() => {
    if (readOnly) setCompleted(true);
  }, [readOnly]);

  useEffect(() => {
    if (contestAnswers) setrequestArray(contestAnswers);
    // if (contestAnswers.some((e) => e.value)) setCompleted(true);
  }, [contestAnswers]);

  const save = async () => {
    const invalid = requestArray.some((item) => !item?.value);

    if (invalid) {
      setMessage('Debe evaluar todas las preguntas para continuar');
      setOpen(true);
      return;
    }

    setLoading(true);
    const contestAnswers = requestArray.map((e) => ({ ...e, value: parseFloat(e.value) }));
    const { data: resp } = await proposalService.saveEvaluation({ contestAnswers }, proposalId);
    setLoading(false);

    if (resp) {
      getDetail();
      setMessage('Se han enviado las evaluaciones correctamente');
      setOpen(true);
    }
  };

  return (
    <>
      <h2 className='joey mb-2' style={{ margin: 0 }}>
        Evaluación de Concurso
      </h2>
      <div className={styles.row}>
        <div className={styles.title}></div>
        <div className={styles.col}>Respuesta</div>
        <div className={styles.col}>No cumple</div>
        <div className={styles.col}>
          Cumple <br /> parcialmente
        </div>
        <div className={styles.col}>Cumple</div>
      </div>

      {answers.map((e, i) => (
        <Question key={i} contestAnswer={e} index={i} setAnwswer={setAnwswer} completed={completed} />
      ))}

      {!completed && (
        <div className={styles.buttons}>
          <LoadingButton
            variant='contained'
            loading={loading}
            onClick={() => {
              save();
            }}
          >
            CONTINUAR
          </LoadingButton>
        </div>
      )}

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
              <p>{message}</p>
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
