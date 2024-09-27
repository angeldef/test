import { useEffect, useState } from 'react';
import { Button, CircularProgress, Dialog, DialogContent, IconButton, Tab, Tabs } from '@mui/material';
import { ContestAnswer, DetailResponse, Documentation, Reason } from './types';
import { DocStatus, DocsTab } from './tabs/documentation';
import { QuotationTab } from './tabs/quotation';
import { LoadingButton } from '@mui/lab';
import { Close } from '@mui/icons-material';
import { BtnProcess, ModalError, ProcessType } from './components';
import { ContestTab } from './tabs/contest';
import { View } from '..';
import { InfoTab } from './tabs/info';
import { RF1 } from './tabs/info/types';
import { BanksTab } from './tabs/banks';
import { codeErrorApi } from '@/core/utils/enums';
import { useNavigate } from 'react-router-dom';
import { ContractTab } from './tabs/contract';
import styles from './styles.module.scss';
import { proposalService } from '@/core/services/proposals';
import { formatDate } from '@/core/utils/functions';

type Props = {
  setCurrentView: Function;
  proposalId: string;
  formalizationOption?: boolean;
  refreshCandidates?: Function;
  setContract?: Function;
};

const buttons: ProcessType[] = [
  { title: 'ACEPTAR PRE-REGISTRO', description: 'La cotización enviada por el proveedor podrá ser comparada con las demás recibidas.' },
  {
    title: 'ESCALAR A RIESGOS',
    description: 'Riesgos revisará el registro del proveedor, hasta que no tenga el visto bueno su cotización no podrá ser considerada.',
    severity: 'warning',
    hide: true,
  },
  {
    title: 'ESCALAR A LÍNEA ÉTICA',
    description: 'Linea Ética revisará el registro del proveedor, hasta que no tenga el visto bueno su cotización no podrá ser considerada.',
    severity: 'warning',
    hide: true,
  },
  {
    title: 'RECHAZAR PRE-REGISTRO',
    description: 'Una vez que rechaza una postulación el proveedor no podrá enviar más cotizaciones.',
    severity: 'danger',
  },
];

export const ApplicationDetail = ({ setCurrentView, proposalId, formalizationOption, refreshCandidates, setContract }: Props) => {
  const [loading, setLoading] = useState(true);
  const [supplierInfo, setSupplierInfo] = useState<DetailResponse>();
  const {
    supplier,
    documentation,
    quotation,
    negotiationSupplier,
    contestAnswers,
    negotiatorFormalization,
    proposalContract,
    register,
    documents,
    formalization,
  } = supplierInfo ?? {};
  const docs = documents?.map((e) => ({ ...e, title: e?.key })) as Array<Documentation>;
  const { conflictsQuestions, considerations } = supplierInfo?.preregister ?? {};
  const [processButtons, setProcessButtons] = useState<ProcessType[]>(buttons);
  const [tab, setTab] = useState<string>('preregister');
  const [open, setOpen] = useState(false);
  const [preregisterApproved, setPreregisterApproved] = useState<boolean>();
  const [registerFinalized, setRegisterFinalized] = useState<boolean>();
  const [proposalApproved, setProposalApproved] = useState<boolean>();
  const [canProcess, setCanProcess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [answers, setAnswers] = useState<ContestAnswer[]>();
  const [reasons, setReasons] = useState<Reason[]>([]);
  const navigate = useNavigate();
  const { approvedByEthic } = negotiationSupplier?.ethic ?? {};
  const { approvedByRisk } = negotiationSupplier?.risk ?? {};
  const { conflictOfInterest } = negotiationSupplier ?? {};
  const { bankAccounts } = register ?? {};

  const {
    rfc,
    birthDateLegal,
    email,
    risksDetected,
    country,
    countryDescription,
    name,
    numId,
    tradeName,
    nameRepresentative,
    countryRepresentative,
    countryDescriptionRepresentative,
    rfcRepresentative,
    numIdRepresentative,
    personCode,
    supplierCode,
  } = supplier ?? {};

  const rfcPerson = rfc?.split(' ')[0];
  const type = rfc?.split(' ')[1];
  const personType = type == '1' ? 'Persona Física' : type == '2' ? 'Persona Moral' : '';

  const getDetail = async () => {
    setProcessButtons(buttons);
    const { data: resp, error } = await proposalService.getProposal(proposalId);
    setLoading(false);

    if (error) {
      const { code } = error.errors[0];
      if (code === codeErrorApi.NEGOTIATOR_NOT_ALLOWED) setOpenError(true);
    }

    if (!resp) return;
    setSupplierInfo(resp.data);

    const { negotiationSupplier, registerFinalized } = resp.data ?? {};
    const { preregisterApproved, status, contract } = negotiationSupplier ?? {};
    setProposalApproved(status.toLowerCase() === 'aprobada');
    setPreregisterApproved(preregisterApproved);
    setRegisterFinalized(registerFinalized);
    setContract && setContract(contract);

    if (refreshCandidates) refreshCandidates();
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const process = async () => {
    const risks = !!processButtons.find((e) => e.title === 'ESCALAR A RIESGOS' && e.selected);
    const ethic = !!processButtons.find((e) => e.title === 'ESCALAR A LÍNEA ÉTICA' && e.selected);
    const accept = !!processButtons.find((e) => e.title === 'ACEPTAR PRE-REGISTRO' && e.selected);
    const reject = !!processButtons.find((e) => e.title === 'RECHAZAR PRE-REGISTRO' && e.selected);
    setProcessing(true);

    if (risks || ethic) {
      const body = {
        risks,
        ethic,
      };
      const { data } = await proposalService.sendEmailApprovalRequest(body, proposalId);
      setProcessing(false);
      setOpen(false);
    }

    if (accept || reject) {
      const { data } = await proposalService.approvePreregister(
        {
          approved: accept,
        },
        proposalId
      );
      setProcessing(false);
      setOpen(false);

      if (accept && data) setPreregisterApproved(true);
      if (data && refreshCandidates) refreshCandidates();
    }
  };

  const onSelect = (index: number) => {
    let array = [...processButtons];
    const { selected } = array[index];
    if (!selected) {
      if (index == 0 || index == 3) {
        array = array.map((item) => ({ ...item, selected: false }));
      } else {
        array = array.map((item, i) => {
          return i == 1 || i == 2 ? item : { ...item, selected: false };
        });
      }
    }
    array[index] = { ...array[index], selected: !selected };
    setProcessButtons(array);
  };

  const getReasons = async () => {
    const { data: resp } = await proposalService.getReasons();
    setReasons(resp?.data ?? []);
  };

  useEffect(() => {
    getDetail();
    getReasons();
  }, []);

  useEffect(() => {
    setCanProcess(processButtons.some((item) => item.selected === true));
  }, [processButtons]);

  useEffect(() => {
    if (formalizationOption) setTab('contract');
  }, [formalizationOption]);

  useEffect(() => {
    if (contestAnswers) {
      const areas = new Set();
      const filtered = contestAnswers.map((item) => {
        if (areas.has(item.area)) {
          return { ...item, area: null };
        }
        areas.add(item.area);
        return item;
      });
      setAnswers(filtered as ContestAnswer[]);
    }
  }, [contestAnswers]);

  useEffect(() => {
    if (supplierInfo) {
      const {
        documentation,
        quotation,
        supplier: { risksDetected, conflictOfInterest },
        negotiationSupplier: { ethic: { approvedByEthic } = {}, risk: { approvedByRisk } = {} },
      } = supplierInfo;
      let array = [...processButtons];

      // mostrar escalar a riesgo
      if (risksDetected && approvedByRisk === undefined) {
        array[0] = { ...array[0], hide: true };
        array[1] = { ...array[1], hide: false };
      }

      // mostrar escalar a ética
      if (conflictOfInterest && approvedByEthic === undefined) {
        array[0] = { ...array[0], hide: true };
        array[2] = { ...array[2], hide: false };
      }

      // si ha sido rechazado, oculto aceptar preregistro
      if (approvedByRisk === false || approvedByEthic === false) {
        array[0] = { ...array[0], hide: true };
      }

      let disabled = false;
      if (documentation?.length > 0) {
        disabled = !documentation?.every((item: any) => item?.status === DocStatus.ACCEPTED);
      }
      if (quotation?.length > 0) {
        if (!disabled) disabled = quotation[0]!.status !== DocStatus.ACCEPTED;
      }

      // si no ha aceptado todos los documentos, oculto aceptar preregistro
      if (disabled) {
        array[0] = { ...array[0], hide: true };
      }

      setProcessButtons(array);
    }
  }, [supplierInfo]);

  return (
    <>
      {loading ? (
        <div className='loading mt-4'>
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className={styles.topBar}>
            <div className={styles.left}>
              <div className={styles.nameContainer}>
                <div className={styles.quotation}>
                  Cotizaciones <span>| Detalle de Cotización</span>
                </div>
                <div className={styles.name}>{name}</div>
                <p>{tradeName}</p>
              </div>
              <div className={styles.infoContainer}>
                {country === '052' && (
                  <p>
                    RFC {rfcPerson} - {personType}
                  </p>
                )}
                {country && country != '052' && <p>Número de Id: {numId}</p>}
                <p>
                  {countryDescription}
                  {birthDateLegal && <span>- Constituida el {formatDate(birthDateLegal.split(' ')[0], 'dd/MM/yyyy')} </span>}
                </p>
                <p>{nameRepresentative}</p>
                <p>{countryDescriptionRepresentative}</p>
                {countryRepresentative == '052' && <p>RFC {rfcRepresentative}</p>}
                {countryRepresentative && countryRepresentative != '052' && <p>Número de Id: {numIdRepresentative}</p>}
                {personCode && <p>Código de persona - {personCode}</p>}
                {supplierCode && <p>Código de proveedor - {supplierCode}</p>}
              </div>
            </div>
            <div className={styles.right}>
              <a href={`mailto: ${email}`} className={styles.sendEmail}>
                <span>{email}</span>
                <i className='far fa-envelope'></i>
              </a>

              {preregisterApproved === undefined && !proposalApproved && (
                <Button
                  variant='contained'
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  PROCESAR
                </Button>
              )}
            </div>
          </div>

          <div className={styles.tags}>
            {conflictOfInterest && !approvedByEthic && (
              <div className={`${styles.tag} ${styles.errorTag}`}>
                <i className='fas fa-exclamation-circle'></i>
                CONFLICTO DE INTERÉS
              </div>
            )}

            {risksDetected && !approvedByRisk && (
              <div className={`${styles.tag} ${styles.errorTag}`}>
                <i className='fas fa-exclamation-circle'></i>
                RIESGOS DETECTADOS
              </div>
            )}

            {approvedByEthic && (
              <div className={`${styles.tag} ${styles.successTag}`}>
                <i className='fas fa-exclamation-circle'></i>
                Aprobado conflicto de interés
              </div>
            )}

            {approvedByRisk && (
              <div className={`${styles.tag} ${styles.successTag}`}>
                <i className='fas fa-exclamation-circle'></i>
                Aprobado riesgo detectado
              </div>
            )}
          </div>

          <Tabs value={tab} onChange={handleChange} className='mb-2'>
            <Tab label={<div className={styles.tabTitle}>Información General</div>} value='preregister' />
            {((documentation && documentation.length > 0) || (docs && docs.length > 0)) && (
              <Tab label={<div className={styles.tabTitle}>DOCUMENTACIÓN</div>} value='docs' />
            )}
            {quotation && quotation.length > 0 && <Tab label={<div className={styles.tabTitle}>COTIZACIÓN</div>} value='quotation' />}
            {contestAnswers && contestAnswers.length > 0 && <Tab label={<div className={styles.tabTitle}>CONCURSO</div>} value='contest' />}
            {bankAccounts?.length > 0 && <Tab label={<div className={styles.tabTitle}>DATOS BANCARIOS</div>} value='banks' />}
            {negotiatorFormalization && Object.keys(negotiatorFormalization).length && (
              <Tab label={<div className={styles.tabTitle}>GESTIÓN DE CONTRATO</div>} value='contract' />
            )}
          </Tabs>

          {tab == 'preregister' && (
            <InfoTab
              personType={type}
              conflictsQuestions={conflictsQuestions ?? []}
              considerations={considerations ?? []}
              rf1={registerFinalized ? (register as RF1) : undefined}
              formalization={formalization}
            />
          )}
          {tab == 'docs' && (
            <DocsTab documentation={[...(documentation ?? []), ...(docs ?? [])]} proposalId={proposalId} getDetail={getDetail} reasons={reasons} />
          )}
          {tab == 'quotation' && <QuotationTab quotation={quotation!} proposalId={proposalId} getDetail={getDetail} />}
          {tab == 'contest' && (
            <ContestTab answers={answers ?? []} contestAnswers={contestAnswers ?? []} proposalId={proposalId} getDetail={getDetail} />
          )}
          {tab == 'banks' && <BanksTab bankAccounts={[...(bankAccounts ?? [])]} />}

          {tab == 'contract' && (
            <ContractTab
              contract={proposalContract}
              id={proposalId}
              getData={() => {}}
              negotiatorFormalization={negotiatorFormalization!}
              supplier={supplier?.name}
              negotiationSupplier={negotiationSupplier}
            />
          )}

          {!formalizationOption && (
            <Button
              className='mt-2'
              variant='outlined'
              onClick={() => {
                setCurrentView(View.DASHBOARD);
              }}
            >
              REGRESAR
            </Button>
          )}
        </>
      )}

      <div className='modal'>
        <Dialog
          open={open}
          onClose={() => {
            if (!processing) setOpen(false);
          }}
          className='modal-small'
        >
          <div className='btn-closeModal'>
            <IconButton
              onClick={() => {
                if (!processing) setOpen(false);
              }}
            >
              <Close />
            </IconButton>
          </div>

          <DialogContent>
            <div className={styles.modalBody}>
              <h2 className={styles.modalTitle}>Procesar Postulación</h2>
              <p className='mt-1'>¿Qué desea hacer con esta postulación?</p>

              <div className={styles.buttons}>
                {processButtons.map((btn, i) => (
                  <BtnProcess {...btn} key={i} index={i} onSelect={onSelect} />
                ))}
              </div>

              <LoadingButton disabled={!canProcess} variant='contained' onClick={process} loading={processing}>
                ACEPTAR
              </LoadingButton>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ModalError
        open={openError}
        feedback='No tiene permisos para acceder a esta propuesta'
        onConfirm={() => {
          setOpenError(false);
          navigate('/negociaciones', { replace: true });
        }}
      />
    </>
  );
};
