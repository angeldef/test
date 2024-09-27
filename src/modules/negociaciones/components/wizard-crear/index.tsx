import { useEffect, useState } from 'react';
import { StepBar } from '..';
import { DatosBasicos } from './components/datos-basicos';
import { DatosComplementarios } from './components/datos-complementarios';
import { ConfigurarConcurso, CriterioData, Pct } from './components/configurar-concurso';
import { FormComponentType } from '../../../../core/types/FormComponentType';
import { apiService } from '../../../../core/services';
import { CircularProgress } from '@mui/material';
import { NegociationInfo } from '../..';

const steps = [{ info: 'Creación' }, { info: 'Info. complementaria' }, { info: 'Opciones de concurso' }];

type Props = {
  negociationInfo?: NegociationInfo;
  setNegociationInfo: Function;
  setStepInvitation: Function;
};

type Page = { components: FormComponentType[] };

export type Wizard = {
  datosBasicos: {
    form: object;
    amountExceeds: boolean;
    idNegociation: string;
  };
  datosComplementarios: {
    form: object;
    concurso: boolean;
  };
  configurarConcurso: {
    form: object;
    acumulado: number;
    porcentajes: Pct[];
    tooMuch: boolean;
    criterioData: CriterioData[];
  };
  catalogos: any;
};

export type childProps = {
  next: Function;
  back: Function;
  components: FormComponentType[];
  wizard: Wizard;
  updateWizard: Function;
  negociationInfo?: NegociationInfo;
  setNegociationInfo: Function;
  setCategories: Function;
  setStepInvitation: Function;
};

export const WizardCrear = ({ negociationInfo, setNegociationInfo, setStepInvitation }: Props) => {
  const [wizard, setWizard] = useState({} as Wizard);
  const [pages, setPages] = useState<Page[]>([]);
  const [current, setCurrent] = useState(1);
  const [total] = useState(4);
  const [loading, setLoading] = useState(false);
  const step = steps[current - 1];

  const next = () => {
    if (current < total) setCurrent((prev) => prev + 1);
  };

  const back = () => {
    if (current > 1) setCurrent((prev) => prev - 1);
  };

  const updateWizard = (state: Object) => {
    setWizard((prev) => ({ ...prev, ...state }));
  };

  const setCategories = (categories: any) => {
    let catalogos = { ...wizard?.catalogos };
    catalogos.categories = categories;
    updateWizard({ catalogos });
  };

  const wizardProps = {
    back,
    next,
    wizard,
    updateWizard,
    negociationInfo,
    setNegociationInfo,
    setCategories,
    setStepInvitation,
  };

  const onLoad = async () => {
    setLoading(true);
    // const { data: resp, error } = await apiService.fakeFormCrearNecesidad();
    // if (!error) setPages(resp.components);
    const { data: resp, error } = await apiService.formCrearNecesidad();
    if (!error) setPages(resp.data.components);
    await setCatalogos();
    setLoading(false);
  };

  const setCatalogos = async () => {
    try {
      const [amountsResponse, risksResponse, specialCasesResponse, groupersResponse, needsResponse] = await Promise.all([
        apiService.getAmounts(),
        apiService.getRisks(),
        apiService.getSpecialCases(),
        apiService.getGroupers(),
        apiService.getNeeds(),
      ]);

      const { data: amounts } = amountsResponse;
      const { data: risks } = risksResponse;
      const { data: specialCases } = specialCasesResponse;
      const { data: groupers } = groupersResponse;
      const { data: needs } = needsResponse;

      const catalogos = {
        groupers: groupers.data,
        amounts: amounts.data,
        frecuencias: needs.data,
        riskLevels: risks.data,
        casesProvider: specialCases.data,
      };
      updateWizard({ catalogos });
    } catch (error) {}
  };

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    if (negociationInfo && negociationInfo.state) {
      const { state } = negociationInfo;
      setCurrent(state.currentStep);

      // setear el id de la negociación
      let obj = { ...state.wizard };
      obj.datosBasicos.idNegociation = negociationInfo._id!;
      updateWizard(obj);
    }
  }, [negociationInfo]);

  return (
    <>
      <StepBar total={total} current={current} info={step.info} />

      {loading ? (
        <div className='loading mt-4'>
          <CircularProgress />
        </div>
      ) : (
        <>
          {current == 1 && pages.length >= 3 && <DatosBasicos {...wizardProps} components={pages[0].components} />}
          {current == 2 && pages.length >= 3 && <DatosComplementarios {...wizardProps} components={pages[1].components} />}
          {current == 3 && pages.length >= 3 && <ConfigurarConcurso {...wizardProps} components={pages[2].components} />}
        </>
      )}
    </>
  );
};
