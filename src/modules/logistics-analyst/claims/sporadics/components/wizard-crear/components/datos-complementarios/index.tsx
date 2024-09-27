import { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';
import { FormBuilder } from './form-builder';
import { childProps } from '../..';
import { apiService } from '@/core/services';
import styles from './styles.module.scss';

export const DatosComplementarios = ({ next, back, components, wizard, updateWizard, negociationInfo }: childProps) => {
  const ref = useRef<any>();
  const [concurso, setConcurso] = useState(false);
  const [disabledConcurso, setDisabledConcurso] = useState(false);
  const [hasRisk, setHasRisk] = useState<boolean>();
  const [hasCase, setHasCase] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<object>();

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

  useEffect(() => {
    const { supplierCritic, supplierSox, collaboratorsFacilities, homeOverseas, signAgreement } = negociationInfo ?? {};
    const riskLevel = negociationInfo?.riskLevel?.key;
    const caseProvider = negociationInfo?.caseProvider?.key;
    setForm({ supplierCritic, supplierSox, collaboratorsFacilities, homeOverseas, signAgreement, riskLevel, caseProvider });
  }, [negociationInfo]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.row}>
          <h2 className='joey'>Datos complementarios de la necesidad</h2>
        </div>

        <FormBuilder
          ref={ref}
          onSubmit={onSubmit}
          components={components}
          catalogos={wizard.catalogos}
          layout='datosComplementariosEsporadicos'
          defaultValues={form ?? {}}
          setHasRisk={setHasRisk}
          setHasCase={setHasCase}
        />

        <div className={styles.buttons}>
          <Button variant='outlined' onClick={getBack}>
            REGRESAR
          </Button>
        </div>
      </div>
    </>
  );
};
