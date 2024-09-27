import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { BtnSidebar, BtnSidebarProps } from '@/modules/negociaciones/components';
import { GlobalFooter, GlobalHeader } from '@/core/components';
import { getDateString } from '@/core/utils/functions';
import { MenuType, NegociationInfo } from '@/modules/negociaciones';
import { ProposalsPage, SendInvitations, WizardCrear } from '..';
import { logisticsAnalystService } from '@/modules/logistics-analyst/services/logisticsAnalyst';
import styles from './styles.module.scss';

const menu: BtnSidebarProps[] = [
  { amount: null, label: 'Configuración de la necesidad', disabled: false, menuType: MenuType.CREATE },
  { amount: null, label: 'Enviar invitaciones', disabled: false, menuType: MenuType.INVITATIONS },
  { amount: null, label: 'Solicitudes recibidas', disabled: false, menuType: MenuType.PROPOSALS },
];

export const DetailSporadic = () => {
  const [contraer, setContraer] = useState(false);
  const [contract, setContract] = useState<boolean>(false);
  const [negociationInfo, setNegociationInfo] = useState<NegociationInfo>();
  const [current, setCurrent] = useState<MenuType>(MenuType.NONE);
  const [loadingSidebar, setLoadingSidebar] = useState(false);
  const [sidebarMenu] = useState<BtnSidebarProps[]>(menu);
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    id && getNegociation(id);
  }, [id]);

  const getNegociation = async (id: string) => {
    setLoadingSidebar(true);
    const { data: resp } = await logisticsAnalystService.getProposalSporadics(id);
    setLoadingSidebar(false);
    setNegociationInfo(resp.data);
    setCurrent(MenuType.CREATE);
  };

  const btnSidebarClick = (i: number) => {
    setCurrent(sidebarMenu[i].menuType!);
  };

  const setStepInvitation = () => {
    setCurrent(MenuType.INVITATIONS);
  };

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
                      navigate('/analista-logistica/siniestros/esporadicos', { replace: true });
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
                          <p>Área</p>
                          <p className='bold'>{negociationInfo.area}</p>

                          <p>Agrupador</p>
                          <p className='bold'>{negociationInfo.grouper.description}</p>
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
              {current === MenuType.INVITATIONS && <SendInvitations id={id} />}
              {current === MenuType.PROPOSALS && (
                <ProposalsPage negociationInfo={negociationInfo} id={id!} setContract={setContract} disableInvitations={() => {}} />
              )}
            </div>
          </div>
        </div>

        <GlobalFooter />
      </div>
    </>
  );
};
