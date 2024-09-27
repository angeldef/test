import { useEffect, useRef, useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, FormControlLabel, FormGroup, Switch } from '@mui/material';
import { FormBuilder } from './form-builder';
import { childProps } from '../..';
import { apiService } from '../../../../../../core/services';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { ModalConfirm } from '../modal-confirm';
import styles from './styles.module.scss';

export const DatosComplementarios = ({ next, back, components, wizard, updateWizard, setStepInvitation }: childProps) => {
  const ref = useRef<any>();
  const [concurso, setConcurso] = useState(false);
  const [disabledConcurso, setDisabledConcurso] = useState(false);
  const [hasRisk, setHasRisk] = useState<boolean>();
  const [hasCase, setHasCase] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (form: any) => {
    const { catalogos } = wizard;

    let body = {
      ...form,
      frequency: catalogos['frecuencias'].find((e: any) => e.key == form.frequency),
      riskLevel: catalogos['riskLevels'].find((e: any) => e.key == form.riskLevel),
      caseProvider: catalogos['casesProvider'].find((e: any) => e.key == form.caseProvider),
      isContest: concurso,
      state: concurso
        ? {
            currentStep: 3,
            wizard: { ...wizard, datosComplementarios: { form, concurso } },
          }
        : null,
    };

    if (body.file) {
      const reader = new FileReader();
      reader.readAsDataURL(form.file);
      reader.onload = async function (event) {
        const base64String = event?.target?.result?.toString().split(',')[1];
        const fileName = form.file.name;
        const fileExtension = fileName.split('.').pop();
        body.file = {
          type: fileExtension,
          base64: base64String,
          fileName: fileName,
        };
        setLoading(true);
        const { data, error } = await apiService.updateNegociation(body, wizard.datosBasicos.idNegociation);
        setLoading(false);
        if (!error) {
          if (concurso) {
            updateWizard({ datosComplementarios: { form, concurso } });
            next();
          } else {
            setOpen(true);
          }
        }
      };
    } else {
      setLoading(true);
      const { data, error } = await apiService.updateNegociation(body, wizard.datosBasicos.idNegociation);
      setLoading(false);
      if (!error) {
        if (concurso) {
          updateWizard({ datosComplementarios: { form, concurso } });
          next();
        } else {
          setOpen(true);
        }
      }
    }
  };

  const getBack = () => {
    const form = ref?.current?.getValues();
    updateWizard({ datosComplementarios: { form, concurso } });
    back();
  };

  const handleSwitch = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = target;
    setConcurso(checked);
  };

  const validateConfirm = () => {
    ref?.current?.trigger();
    const { isValid } = ref?.current ?? {};
    setOpenConfirm(isValid);
  };

  useEffect(() => {
    if (wizard.datosBasicos?.amountExceeds) {
      setConcurso(true);
      setDisabledConcurso(true);
    }
    if (wizard.datosComplementarios?.concurso != undefined) setConcurso(wizard.datosComplementarios?.concurso);
  }, []);

  useEffect(() => {
    if (hasRisk || hasCase) {
      setDisabledConcurso(true);
      if (hasRisk) setConcurso(true);
      if (hasCase) setConcurso(false);
    } else {
      if (hasRisk == false && hasCase === false) {
        const { amountExceeds } = wizard.datosBasicos;
        setDisabledConcurso(amountExceeds);
        if (amountExceeds) setConcurso(true);
      }
    }
  }, [hasRisk, hasCase]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.row}>
          <h2 className='joey'>Datos complementarios de la necesidad</h2>
          <FormGroup sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', marginRight: '-26px' }}>
            <span>Gestionar como concurso</span>
            <FormControlLabel control={<Switch checked={concurso} onChange={handleSwitch} disabled={disabledConcurso} />} label='' />
          </FormGroup>
        </div>

        <FormBuilder
          ref={ref}
          onSubmit={onSubmit}
          components={components}
          catalogos={wizard.catalogos}
          layout='datosComplementarios'
          defaultValues={wizard.datosComplementarios?.form}
          setHasRisk={setHasRisk}
          setHasCase={setHasCase}
        />

        <div className={styles.buttons}>
          <Button variant='outlined' onClick={getBack}>
            REGRESAR
          </Button>

          <LoadingButton
            variant='contained'
            loading={loading}
            onClick={() => {
              if (concurso) ref?.current?.handleSubmit(onSubmit)();
              else validateConfirm();
            }}
          >
            GUARDAR
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
          ref?.current?.handleSubmit(onSubmit)();
        }}
      />
    </>
  );
};
