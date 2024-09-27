import { createRef, useEffect, useRef, useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { FormBuilder } from '../../../../../../core/components';
import { childProps } from '../../..';
import { Criterio, CriteriosEvaluacion } from '../criterios-evaluacion';
import { Pregunta } from '../pregunta';
import { apiService } from '../../../../../../core/services';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { ModalConfirm } from '../modal-confirm';
import styles from './styles.module.scss';

export type Pct = {
  i: number;
  pct: number;
};

export type CriterioData = {
  form: Object;
  preguntas: Pregunta[];
  expanded: boolean;
};

type CriteriaRequest = {
  name: string;
  percentage: string;
  questions: Pregunta[];
};

const criterios: Criterio[] = [
  { title: 'ASG (AMBIENTALES, SOCIALES Y GOBIERNO CORPORATIVO)' },
  { title: 'ECONÓMICOS', disableAction: true },
  { title: 'TÉCNICOS O DE SERVICIO', tooltip: '¿Qué necesitamos mínimamente que cubra el proveedor en aspectos técnicos?' },
];

export const ConfigurarConcurso = ({ back, components, wizard, updateWizard, setStepInvitation }: childProps) => {
  const ref = useRef<any>();
  const navigate = useNavigate();
  const formsRef = useRef<any>(criterios.map(() => createRef()));
  const [criterioData, setCriterioData] = useState<CriterioData[]>(
    criterios.map(() => {
      return {} as CriterioData;
    })
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [tooMuch, setTooMuch] = useState(wizard.configurarConcurso?.tooMuch);
  const [totalInvalid, setTotalInvalid] = useState(false);
  const [acumulado, setAcumulado] = useState(wizard.configurarConcurso?.acumulado == undefined ? 100 : wizard.configurarConcurso?.acumulado);
  const [porcentajes, setPorcentajes] = useState<Pct[]>(
    wizard.configurarConcurso?.porcentajes == undefined ? [] : wizard.configurarConcurso?.porcentajes
  );

  const onSubmit = () => {};

  const submit = () => {
    setTotalInvalid(false);

    let total = 0;
    let criteriosValidos: any = [];
    formsRef.current.map((e: any) => {
      const form = e.current.getValues();
      const { porcentaje } = form;
      total += parseInt(porcentaje) || 0;
      if (porcentaje) criteriosValidos.push(form);
    });

    if (total != 100) {
      setTotalInvalid(true);
      return;
    }

    if (tooMuch || !ref.current.isValid || criteriosValidos.length != criterios.length) return;

    let body = {};
    const form = ref?.current?.getValues();
    body = { ...form };

    let criterias: CriteriaRequest[] = [];
    formsRef.current.map((e: any, i: number) => {
      const form = e.current.getValues();
      const { porcentaje: percentage } = form;
      const { preguntas } = e.current;
      criterias.push({ name: criterios[i].title, percentage, questions: preguntas.map((e: Pregunta) => e.pregunta) });
    });

    body = { ...body, criterias };
    finish(body);
  };

  const finish = async (body: any) => {
    setLoading(true);
    const { data, error } = await apiService.patchNegociation({ contest: body, state: null }, wizard.datosBasicos.idNegociation);
    setLoading(false);

    if (!error) setOpen(true);
  };

  const getBack = () => {
    let criterioData: CriterioData[] = [];
    formsRef.current.map((e: any) => {
      const form = e.current.getValues();
      criterioData.push({ form, preguntas: e.current.preguntas, expanded: e.current.expanded });
    });
    setCriterioData(criterioData);

    const form = ref?.current?.getValues();
    updateWizard({ configurarConcurso: { form, acumulado, porcentajes, tooMuch, criterioData } });
    back();
  };

  const isValidatePCT = () => {
    if (porcentajes.some((e) => e?.pct < 10)) return false;

    let total = 0;
    porcentajes.forEach((e) => {
      total += e?.pct ?? 0;
    });

    return total === 100;
  };

  const onChangePorcentaje = (i: number, pct: number) => {
    let temp = [...porcentajes];
    temp[i] = { i, pct };
    setPorcentajes(temp);
  };

  const getTotal = () => {
    let total = 0;
    porcentajes.forEach((e) => {
      total += e?.pct || 0;
    });

    setAcumulado(100 - total);
    if (100 - total >= 0) {
      setTooMuch(false);
    } else setTooMuch(true);
    return total;
  };

  const validateConfirm = () => {
    ref?.current?.trigger();
    const { isValid } = ref?.current ?? {};
    setOpenConfirm(isValid);
  };

  useEffect(() => {
    setTotalInvalid(false);
    getTotal();
  }, [porcentajes]);

  useEffect(() => {
    if (wizard.configurarConcurso?.criterioData != undefined) setCriterioData(wizard.configurarConcurso?.criterioData);
  }, [wizard.configurarConcurso?.criterioData]);

  return (
    <>
      <div className={styles.container}>
        <h2 className='joey'>Configuración de concurso</h2>

        <FormBuilder
          ref={ref}
          onSubmit={onSubmit}
          components={components}
          layout='configurarConcurso'
          defaultValues={wizard.configurarConcurso?.form}
        />

        <div className={styles.row}>
          <div className={styles.title}>Criterios de Evaluación</div>
          <div className={styles.total}>
            <p>Total {100 - acumulado} %</p>
            {tooMuch && !totalInvalid && <small className='text-error'>La suma debe ser igual a 100</small>}
            {totalInvalid && <small className='text-error'>El total debe ser 100</small>}
          </div>
        </div>

        {criterios.map((criterio, i) => (
          <div className='mb-2' key={i}>
            <CriteriosEvaluacion
              {...criterio}
              ref={formsRef.current[i]}
              acumulado={acumulado}
              index={i}
              onChangePorcentaje={onChangePorcentaje}
              criterioData={criterioData[i]}
              setCriterioData={setCriterioData}
            />
          </div>
        ))}

        <div className={styles.buttons}>
          <Button variant='outlined' onClick={getBack}>
            REGRESAR
          </Button>

          <LoadingButton
            variant='contained'
            loading={loading}
            disabled={!isValidatePCT()}
            onClick={() => {
              ref?.current?.handleSubmit(onSubmit)();
              formsRef.current.map((e: any) => {
                const form = e.current;
                form.handleSubmit(onSubmit)();
              });
              validateConfirm();
            }}
          >
            FINALIZAR
          </LoadingButton>
        </div>
      </div>

      <div className='modal'>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
            setStepInvitation();
            navigate(`/negociaciones/detalle/${wizard.datosBasicos.idNegociation}`, { replace: true });
          }}
          className='modal-small'
        >
          <DialogTitle>Alerta</DialogTitle>
          <DialogContent>
            <div className={styles.modalBody}>
              <p>La necesidad ha sido creada exitosamente</p>
              <div className={styles.buttons}>
                <Button
                  variant='contained'
                  onClick={() => {
                    setOpen(false);
                    setStepInvitation();
                    navigate(`/negociaciones/detalle/${wizard.datosBasicos.idNegociation}`, { replace: true });
                  }}
                >
                  Aceptar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ModalConfirm
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
        }}
        onConfirm={() => {
          setOpenConfirm(false);
          submit();
        }}
      />
    </>
  );
};
