import { GlobalFooter, GlobalHeader } from '../../../../core/components';
import { BtnSidebar, BtnSidebarProps, FormalizationPage, InviteNegociation, Wizard, WizardCrear } from '../../components';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getDateString } from '../../../../core/utils/functions';
import { CircularProgress } from '@mui/material';
import { apiService } from '../../../../core/services';
import { ApplicationsPage } from '../../components/applications';
import { ModalSupplierSelected } from './components';
import { NegotiationContext } from '../../context';
import { codeErrorApi } from '@/core/utils/enums';
import { ModalError } from '../../components/applications/detail/components';
import styles from './styles.module.scss';

export interface NegociationInfo {
  title: string;
  description: string;
  createdAt: string;
  grouper: Field;
  category: Field;
  amount: Field;
  state?: { wizard: Wizard; currentStep: number };
  _id?: string;
  status: string;
  signAgreement: string;
  isContest?: boolean;
  contract?: boolean;
  readyToFormalization?: boolean;
  supplierSelected?: boolean;
  effectiveDate?: string;
  supplierCritic?: string;
  supplierSox?: string;
  collaboratorsFacilities?: string;
  homeOverseas?: string;
  caseProvider?: { key: string; description: string };
  riskLevel?: { key: string; description: string };
  area?: string;
}

export interface Field {
  _id: string;
  key: string;
  description: string;
  ocupations?: Ocupation[];
  area?: string;
}

export interface Ocupation {
  key: string;
  description: string;
}

export enum MenuType {
  NONE = 'NONE',
  CREATE = 'CREATE',
  INVITATIONS = 'INVITATIONS',
  PROPOSALS = 'PROPOSALS',
  FORMALIZATION = 'FORMALIZATION',
}

const menu: BtnSidebarProps[] = [
  { amount: null, label: 'Configuración de la necesidad', disabled: true, menuType: MenuType.CREATE },
  { amount: null, label: 'Enviar invitaciones', disabled: true, menuType: MenuType.INVITATIONS },
  { amount: null, label: 'Solicitudes recibidas', disabled: true, menuType: MenuType.PROPOSALS },
  { amount: null, label: 'Formalización', disabled: true, menuType: MenuType.FORMALIZATION },
];

export const DetailNegociationPage = () => {
  const [contraer, setContraer] = useState(false);
  const [negociationInfo, setNegociationInfo] = useState<NegociationInfo>();
  const [current, setCurrent] = useState<MenuType>(MenuType.NONE);
  const [open, setOpen] = useState(false);
  const [loadingSidebar, setLoadingSidebar] = useState(false);
  const [sidebarMenu, setSidebarMenu] = useState<BtnSidebarProps[]>(menu);
  const { approvedProposal } = useContext(NegotiationContext);
  const [contract, setContract] = useState<boolean>(false);
  const [openError, setOpenError] = useState(false);
  const [isSupplierSelected, setIsSupplierSelected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  let { id } = useParams();

  useEffect(() => {
    if (!id) {
      if (!location.pathname.includes('crear')) navigate('/negociaciones', { replace: true });
      setCurrent(MenuType.CREATE);
      setMenu(MenuType.CREATE);
    } else {
      getNegociation(id);
    }
  }, [id]);

  const setMenu = (currentMenu: MenuType) => {
    switch (currentMenu) {
      case MenuType.CREATE:
        setSidebarMenu(
          menu.map((item, index) => ({
            ...item,
            disabled: index === 0 ? false : item.disabled,
          }))
        );
        break;

      case MenuType.INVITATIONS:
        setSidebarMenu(
          menu.map((item, index) => ({
            ...item,
            disabled: index === 1 || index === 2 ? false : item.disabled,
          }))
        );
        break;

      case MenuType.PROPOSALS:
        setSidebarMenu(
          menu.map((item, index) => ({
            ...item,
            disabled: index === 1 || index === 2 ? false : item.disabled,
          }))
        );
        break;

      case MenuType.FORMALIZATION:
        setSidebarMenu(
          menu.map((item, index) => ({
            ...item,
            disabled: index === 2 || index === 3 ? false : item.disabled,
          }))
        );
        break;

      default:
        break;
    }
  };

  const getNegociation = async (id: string) => {
    setLoadingSidebar(true);
    const { data: resp, error } = await apiService.getNegociation(id);

    if (error) {
      const { code } = error.errors[0];
      if (code === codeErrorApi.NEGOTIATOR_NOT_ALLOWED) setOpenError(true);
      return;
    }

    setLoadingSidebar(false);
    setNegociationInfo(resp.data);

    const { state } = resp.data;
    if (state) {
      setCurrent(MenuType.CREATE);
      setMenu(MenuType.CREATE);
    } else {
      const { pathname } = location;

      if (pathname.includes('solicitudes')) {
        setCurrent(MenuType.PROPOSALS);
        setMenu(MenuType.PROPOSALS);
      } else {
        setCurrent(MenuType.INVITATIONS);
        setMenu(MenuType.INVITATIONS);
      }
    }
  };

  // added contract validation
  useEffect(() => {
    if (approvedProposal) {
      const { isContest, contract } = negociationInfo ?? {};
      if (isContest || (!isContest && contract)) {
        setCurrent(MenuType.FORMALIZATION);
        setMenu(MenuType.FORMALIZATION);
      }
    }
  }, [approvedProposal, loadingSidebar, contract]);

  const btnSidebarClick = (i: number) => {
    if (sidebarMenu[i].disabled) return;
    setCurrent(sidebarMenu[i].menuType!);
  };

  const setStepInvitation = () => {
    setMenu(MenuType.INVITATIONS);
    setCurrent(MenuType.INVITATIONS);
  };

  const disableInvitations = () => {
    setSidebarMenu(sidebarMenu.map((e) => ({ ...e, disabled: e.menuType === MenuType.INVITATIONS ? true : e.disabled })));
    if (current === MenuType.INVITATIONS) setCurrent(MenuType.PROPOSALS);
  };

  useEffect(() => {
    const { supplierSelected } = negociationInfo ?? {};
    if (supplierSelected && !isSupplierSelected) {
      setIsSupplierSelected(supplierSelected);
      disableInvitations();
    }
  }, [sidebarMenu]);

  return (
    <>
      <div className='container'>
        <div className='header'>
          <GlobalHeader />
        </div>

        <div className='main'>
          <div className={`${styles.layout} ${contraer && styles.contraer}`}>
            <div className={`${styles.left} paper`}>
              <div className={styles.wrapper}>
                <div className={styles.top}>
                  <div
                    className={styles.back}
                    onClick={() => {
                      navigate('/negociaciones', { replace: true });
                    }}
                  >
                    <div className={styles.circle}>
                      <i className='fas fa-arrow-left'></i>
                    </div>
                    <h3>Detalle de Negociación</h3>
                  </div>
                </div>

                {loadingSidebar ? (
                  <div className='loading mt-4'>
                    <CircularProgress />
                  </div>
                ) : (
                  <>
                    {negociationInfo && (
                      <div className={styles.infoContainer}>
                        <div className={styles.amount}>{negociationInfo.amount.description}</div>

                        <div className={styles.row}>
                          <div className={styles.negociationInfo}>
                            <p title={negociationInfo.title} className='bold' style={{ cursor: 'pointer' }}>
                              {negociationInfo.title}
                            </p>
                            <span>Creada el {getDateString(negociationInfo?.createdAt ?? new Date().toISOString())}</span>
                            {negociationInfo?.effectiveDate && (
                              <div>
                                <span>Vigencia {getDateString(negociationInfo.effectiveDate)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className='btn-gray'>ESTADO: {negociationInfo.status ?? 'NUEVA'}</div>

                        <div className={styles.negociationInfo}>
                          <p>Agrupador</p>
                          <p className='bold'>{negociationInfo.grouper.description}</p>

                          <p>Categoría</p>
                          <p className='bold'>{negociationInfo.category.description}</p>
                        </div>
                      </div>
                    )}

                    <div className={styles.buttons}>
                      {sidebarMenu.map((btn, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            btnSidebarClick(i);
                          }}
                        >
                          <BtnSidebar {...btn} contraer={contraer} active={current === btn?.menuType} disabled={btn.disabled} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div
                className={styles.bottom}
                onClick={() => {
                  setContraer((prev) => !prev);
                }}
              >
                {!contraer && (
                  <>
                    <i className='fas fa-compress-arrows-alt'></i> <span>CONTRAER</span>
                  </>
                )}

                {contraer && (
                  <>
                    <i className='fas fa-expand-arrows-alt'></i> <span>EXPANDIR</span>
                  </>
                )}
              </div>
            </div>
            <div className={`${styles.right}`}>
              {current === MenuType.CREATE && (
                <WizardCrear negociationInfo={negociationInfo} setNegociationInfo={setNegociationInfo} setStepInvitation={setStepInvitation} />
              )}
              {current === MenuType.INVITATIONS && <InviteNegociation negociationInfo={negociationInfo} id={id!} />}
              {current === MenuType.PROPOSALS && (
                <ApplicationsPage negociationInfo={negociationInfo} id={id!} setContract={setContract} disableInvitations={disableInvitations} />
              )}
              {current === MenuType.FORMALIZATION && <FormalizationPage negociationInfo={negociationInfo} />}
            </div>
          </div>
        </div>

        <GlobalFooter />
      </div>

      <ModalSupplierSelected
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />
      <ModalError
        feedback='No tiene permisos para acceder a esta negociación'
        open={openError}
        onConfirm={() => {
          setOpenError(false);
          navigate('/negociaciones', { replace: true });
        }}
      />
    </>
  );
};
