import { useEffect, useState } from 'react';
import { StepBar } from '..';
import { DatosBasicos } from './components/datos-basicos';
import { DatosComplementarios } from './components/datos-complementarios';
import { CircularProgress } from '@mui/material';
import { FormComponentType } from '@/core/types/FormComponentType';
import { apiService } from '@/core/services';
import { NegociationInfo } from '@/modules/negociaciones';
import { logisticsAnalystService } from '@/modules/logistics-analyst/services/logisticsAnalyst';

const steps = [{ info: 'Configuración de la necesidad' }, { info: 'Configuración de la necesidad' }, { info: 'Configuración de la necesidad' }];

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
  const [total] = useState(3);
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

    const { data: resp, error } = await apiService.formConfiguracionNecesidad();
    if (!error) setPages(resp.data.components);
    await setCatalogos();
    setLoading(false);
  };

  const setCatalogos = async () => {
    try {
      const [amountsResponse, risksResponse, specialCasesResponse, groupersResponse, areasResponse] = await Promise.all([
        apiService.getAmounts(),
        apiService.getRisks(),
        apiService.getSpecialCases(),
        logisticsAnalystService.getGroupers(),
        logisticsAnalystService.getAreas(),
      ]);

      const { data: areas } = areasResponse;
      const { data: amounts } = amountsResponse;
      const { data: risks } = risksResponse;
      const { data: specialCases } = specialCasesResponse;
      const { data: groupers } = groupersResponse;

      const catalogos = {
        areas: areas.data,
        groupers: groupers.data,
        amounts: amounts.data,
        riskLevels: risks.data,
        casesProvider: specialCases.data,
      };
      updateWizard({ catalogos });
    } catch (error) {}
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <>
      <StepBar total={total} current={current + 1} info={step.info} />

      {loading ? (
        <div className='loading mt-4'>
          <CircularProgress />
        </div>
      ) : (
        <>
          {current == 1 && pages.length > 0 && <DatosBasicos {...wizardProps} components={pages[0].components} />}
          {current == 2 && pages.length > 0 && <DatosComplementarios {...wizardProps} components={pages[1].components} />}
        </>
      )}
    </>
  );
};
