import { GlobalFooter, GlobalHeader } from '../../../../core/components';
import { Button, CircularProgress, Dialog, DialogContent, IconButton, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { FieldValues, useForm } from 'react-hook-form';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { proposalService } from '../../../../core/services/proposals';
import { Negotiation, Negotiator, Quotation, RespGetNegociationInfoByTokenType, Supplier } from '../types';
import { getDateString } from '../../../../core/utils/functions';
import { currencyPipe } from '../../../../core/utils/pipes';
import styles from './styles.module.scss';
import { SuppliersTable } from './components';
import { AuthContext } from '../../../auth';
import { useFileDownloader } from '@/core/hooks';

export const ApprovalPurchaseCommittee = () => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [negotiation, setNegotiation] = useState<Negotiation>();
  const [supplier, setSupplier] = useState<Supplier>();
  const [quotation, setQuotation] = useState<Quotation>();
  const [negotiator, setNegotiator] = useState<Negotiator>();
  const [message, setMessage] = useState<string>();
  let [searchParams] = useSearchParams();
  let { id } = useParams();
  const token = searchParams.get('token');
  const location = useLocation();
  const { pathname } = location;
  const { img } = useContext(AuthContext);
  const { downloadFileGlobal } = useFileDownloader();

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    mode: 'all',
  });

  const onSubmit = async (form: FieldValues) => {
    setOpenModal(false);
    const { reason } = form;
    const body = { approved: false, reasonRejection: reason };
    const { data: resp } = await proposalService.approveSupplierApprovals(body, id!, token!);
    if (resp) setMessage('TU RESPUESTA YA FUE ENVIADA AL NEGOCIADOR.');
  };

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    if (id && token) {
      const { data: resp } = await proposalService.getNegociationInfoByToken(id, token);
      setLoading(false);

      if (resp) {
        const { negotiation, supplier, quotation, negotiator, userAlreadyApproved } = resp.data as RespGetNegociationInfoByTokenType;
        setNegotiation(negotiation);
        setSupplier(supplier);
        setQuotation(quotation ? quotation[0] : undefined);
        setNegotiator(negotiator);
        if (userAlreadyApproved) setMessage('TU RESPUESTA YA FUE ENVIADA AL NEGOCIADOR.');
      }
    }
  };

  const approve = async () => {
    setOpenModal(false);
    const body = { approved: true };
    const { data: resp } = await proposalService.approveSupplierApprovals(body, id!, token!);
    if (resp) setMessage('TU RESPUESTA YA FUE ENVIADA AL NEGOCIADOR.');
  };

  const { infoSupplier } = supplier ?? {};
  const { personType, idNumberNaturalPerson, taxIdLegalPerson } = infoSupplier ?? {};
  const { url } = quotation ?? {};
  const urlDecoded = decodeURI(url as string);

  const name = personType == '1' ? `${infoSupplier?.nameNaturalPerson} ${infoSupplier?.surnameNaturalPerson}` : `${infoSupplier?.nameLegalPerson}`;
  const rfc = personType == '1' ? infoSupplier?.rfcNaturalPerson : infoSupplier?.rfcLegalPerson;
  const personTypeString = personType == '1' ? 'Persona Física' : 'Persona Moral';
  const country = infoSupplier?.countryDescription;
  const parts = urlDecoded?.split('/');
  const fileName = parts?.[parts?.length - 1];
  const idNum = personType == '1' ? idNumberNaturalPerson : taxIdLegalPerson;
  const foreign = country !== 'MEXICO';

  return (
    <>
      <div className='container'>
        <div className='header'>
          <GlobalHeader hideUser={true} />
        </div>

        {loading ? (
          <div className='loading mt-4'>
            <CircularProgress />
          </div>
        ) : (
          <div className='main'>
            <div className={styles.row}>
              <div className={styles.left}>
                <h1>Solicitud aprobación {pathname.includes('purchase-committee') && <>comité de compras</>} </h1>
                {negotiation?.isContest && <h3>Negociación tipo CONCURSO</h3>}
              </div>
              <div className={styles.right}>
                <div className={styles.email}>
                  {negotiator?.name} - {negotiator?.email}
                </div>
                <div className={styles.role}>NEGOCIADOR</div>
              </div>
            </div>

            <div className={styles.wrapper}>
              <div className={styles.cards}>
                <div className={styles.card}>
                  <div className={styles.top}>
                    <div>
                      <div className={`text-primary ${styles.amount}`}>{negotiation?.amount.description}</div>
                      <div className={styles.label}>CUANTÍA</div>
                    </div>

                    <div className={`${styles.tag} ${styles.secondary}`}>Negociación</div>
                  </div>

                  <div className={styles.title}>{negotiation?.title}</div>
                  <div className={styles.label}>TÍTULO</div>

                  <div className={styles.info}>{negotiation?.description}</div>
                  <div className={styles.description}>DESCRIPCIÓN</div>

                  <div className={styles.info}>{getDateString(negotiation?.createdAt!)}</div>
                  <div className={styles.description}>FECHA DE CREACIÓN</div>
                </div>

                <div className={styles.card}>
                  <div className={styles.top}>
                    {quotation?.price && (
                      <div>
                        <div className={`text-secondary ${styles.amount}`}>{`${currencyPipe(quotation?.price)} ${quotation?.currency}`}</div>
                        <div className={styles.label}>MONTO DE LA COTIZACIÓN</div>
                      </div>
                    )}

                    <div className={`${styles.tag} ${styles.primary}`}>Proveedor</div>
                  </div>

                  <div className={styles.title}>{name}</div>
                  <div className={styles.label}>NOMBRE/RAZÓN SOCIAL</div>

                  {!foreign ? (
                    <div className={styles.info}>
                      RFC {rfc} - {personTypeString}
                    </div>
                  ) : (
                    <div className={styles.info}>
                      Número de ID {idNum} - {personTypeString}
                    </div>
                  )}
                  <div className={styles.description}>{country}</div>

                  <div className={styles.bottom}>
                    {quotation && (
                      <div>
                        <div className={styles.info}>{getDateString(quotation?.createdAt!)}</div>
                        <div className={styles.description}>FECHA ENVÍO COTIZACIÓN</div>
                      </div>
                    )}

                    {url && (
                      <div className={styles.download}>
                        <div>
                          <div className={styles.name}>{fileName}</div>
                          <div style={{ textAlign: 'right' }} className={styles.label}>
                            COTIZACIÓN
                          </div>
                        </div>
                        <i
                          className='fas fa-cloud-download-alt'
                          onClick={() => {
                            downloadFileGlobal(url);
                          }}
                        ></i>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.right}>
                <img src={img?.risk} width={250} className={styles.img} />
              </div>
            </div>

            <div className='mt-2 mb-2'>
              <SuppliersTable id={id} />
            </div>

            {message ? (
              <div className={styles.message}>
                <i className='far fa-check-circle'></i>
                <span>{message}</span>
              </div>
            ) : (
              <div className={styles.buttons}>
                <Button
                  variant='outlined'
                  onClick={() => {
                    setAction('reject');
                    setOpenConfirm(true);
                  }}
                >
                  RECHAZAR
                </Button>
                <Button
                  variant='contained'
                  onClick={() => {
                    setAction('accept');
                    setOpenConfirm(true);
                  }}
                >
                  APROBAR
                </Button>
              </div>
            )}
          </div>
        )}

        <GlobalFooter />
      </div>

      <div className='modal'>
        <Dialog
          open={openConfirm}
          onClose={() => {
            setOpenConfirm(false);
          }}
          className='modal-small'
        >
          <div className='btn-closeModal'>
            <IconButton
              onClick={() => {
                setOpenConfirm(false);
              }}
            >
              <Close />
            </IconButton>
          </div>

          <DialogContent>
            {action == 'accept' && (
              <div className={`${styles.modalBody} text-center`}>
                <div className={`${styles.titleSecondary} joey`}>Confirmación</div>

                <p className={styles.bold}>La solicitud está a punto de ser aceptada.</p>
                <p>¿Deseas continuar con el proceso de aprobación?</p>
              </div>
            )}

            {action == 'reject' && (
              <div className={`${styles.modalBody} text-center`}>
                <div className={`${styles.titleSecondary} joey`}>Confirmación de Rechazo</div>

                <p className={styles.bold}>La solicitud está a punto de ser rechazada.</p>
                <p>¿Deseas continuar con el proceso de rechazo?</p>
              </div>
            )}

            <div className={`${styles.buttons} ${styles.centered}`}>
              <Button
                variant='outlined'
                onClick={() => {
                  setOpenConfirm(false);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant='contained'
                onClick={() => {
                  setOpenConfirm(false);
                  if (action == 'reject') setOpenModal(true);
                  else approve();
                }}
              >
                Aceptar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className='modal'>
        <Dialog
          open={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
          className='modal-small'
        >
          <div className='btn-closeModal'>
            <IconButton
              onClick={() => {
                setOpenModal(false);
              }}
            >
              <Close />
            </IconButton>
          </div>

          <DialogContent>
            <div className={styles.modalBody}>
              <h2 className={`${styles.modalTitle} joey`}>Rechazo de Proveedor</h2>
              <p className='mt-1'>Indique el motivo de rechazo</p>

              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className='form-group'>
                  <TextField placeholder='Motivo de rechazo' multiline rows={5} {...register('reason', { required: 'Campo obligatorio' })} />
                  {errors.reason && (
                    <small className='text-danger' style={{ bottom: 0 }}>
                      {errors.reason?.message as string}
                    </small>
                  )}
                </div>

                <div className={`${styles.buttons} ${styles.centered}`}>
                  <LoadingButton type='submit' variant='outlined' loading={loading}>
                    RECHAZAR PROVEEDOR
                  </LoadingButton>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
