import { useState } from 'react';
import { SuppliersResponse } from '../select-supplier/form-builder/types';
import { Wizard } from '../../types';
import { DataGrid, GridColDef, esES } from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { DataTableSupplies } from '../add-supplies/form-builder/types';
import { formatDate } from '@/core/utils/functions';
import { currencyPipe } from '@/core/utils/pipes';
import { purchaserService } from '@/modules/purchaser/services/purchaser';
import { ModalInfo } from '../../modal-info';
import { useNavigate } from 'react-router-dom';
import { ModalConfirmCancel } from '../../modal-confirm-cancel';
import { ModalNotification } from '../../modal-notification';
import { codeErrorPurchase } from '@/core/utils/enums';
import styles from './styles.module.scss';

type Props = {
  properties: { CONTRACT_REQUIRED: string; SHOW_WARNING: string; REQUIRE_APPROVAL: string; INVALID_TOTAL: string };
  next: Function;
  back: Function;
  supplierInfo: SuppliersResponse;
  wizard: Wizard;
  updateWizard: Function;
};

export const defaulErrorSavingOrder = 'Ha ocurrido un error generando la orden de compra, por favor intente más tarde';

export const Generate = ({ back, wizard, properties }: Props) => {
  const navigate = useNavigate();
  const { supplies, generated } = wizard;
  const [rows, setRows] = useState<DataTableSupplies[]>(supplies?.rows ?? []);
  const [codeError, setCodeError] = useState<codeErrorPurchase | null>();
  const [feedback, setFeedback] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const columns: GridColDef[] = [
    { field: 'quantity', headerName: 'CANTIDAD', flex: 1 },
    { field: 'udm', headerName: 'UDM', flex: 1 },
    { field: 'description', headerName: 'DESCRIPCIÓN', flex: 1 },
    { field: 'price', headerName: 'PRECIO UNITARIO', flex: 1 },
    { field: 'total', headerName: 'PRECIO TOTAL', flex: 1 },
  ];

  const { generate, taxes, selectSupplier } = wizard;
  const { form: formTaxes } = taxes;
  const {
    supplierInfo: { infoSupplier, register },
  } = selectSupplier;

  const cleanPCT = (pct: string) => pct.replace('%', '');

  const save = async (skipWarning?: boolean, sendToApprovers?: boolean) => {
    const { request, purchaseId: id } = wizard;
    let body = { ...request, generated: true, skipWarning, sendToApprovers, wizard, id };
    delete body.previsualize;
    setLoading(true);
    const { data: resp, error } = await purchaserService.savePurchase(body);
    setLoading(false);
    setCodeError(null);

    if (resp) setOpenInfo(true);

    if (error) {
      const { code } = error.errors[0];
      const codeErrorPurchase = code as codeErrorPurchase;
      setCodeError(codeErrorPurchase);

      setOpenNotification(true);
      setFeedback(properties[codeErrorPurchase] ?? defaulErrorSavingOrder);
    }
  };

  const deleteOrder = async () => {
    const { purchaseId: id } = wizard ?? {};
    setLoading(true);
    const { data } = await purchaserService.savePurchase({ delete: true, id });
    setLoading(false);
    if (data) navigate('/orden-compra', { replace: true });
  };

  const folioDate = wizard.folioDate ? formatDate(wizard.folioDate, 'dd/MM/yyyy') : formatDate(new Date(), 'dd/MM/yyyy');
  const { folio } = wizard;

  return (
    <>
      <div className={styles.row}>
        <h2 className='joey mb-2'>Orden de Compra y/o Servicio</h2>
        <div>
          {folio && <div className={styles.folio}> {`N° ${folio}`} </div>}
          <div className={styles.date}> {folioDate} </div>
        </div>
      </div>

      <div className={styles.sections}>
        <div className={styles.section}>
          <div className={styles.title}>Datos del Proveedor</div>
          <div className={styles.row}>
            <div className={styles.key}>Razón Social/Nombre:</div>
            <div className={styles.desc}>{infoSupplier?.fullName}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.key}>RFC:</div>
            <div className={styles.desc}>{infoSupplier?.savedRfc}</div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.title}>Contacto Comercial</div>
          <div className={styles.row}>
            <div className={styles.key}>Nombre:</div>
            <div className={styles.desc}>{register?.nameBusinessContact}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.key}>Correo:</div>
            <div className={styles.desc}>{register?.emailBusinessContact}</div>
          </div>
        </div>
      </div>
      <div className={styles.address}>
        <div className={styles.key}>Domicilio:</div>
        <div className={styles.desc}>{register?.addressString1}</div>
      </div>
      <div className={styles.address}>
        <div className={styles.key}></div>
        <div className={styles.desc}>{register?.addressString2}</div>
      </div>

      <br />

      <div className='table' style={{ margin: '0 auto' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          disableColumnMenu
          disableRowSelectionOnClick
          columnHeaderHeight={40}
          localeText={{ ...esES.components.MuiDataGrid.defaultProps.localeText, noRowsLabel: 'Sin resultados' }}
        />
      </div>

      <div className='paper' style={{ padding: '20px', marginTop: '20px' }}>
        <div className={styles.desglose}>
          <div className={styles.left}>
            <div className={styles.info}>
              <div className={styles.title}>FACTURADO A:</div>
              <p>Seguros SURA</p>
              <p>Av. Insurgentes Sur No. 2475, Pisos 22 y 23, Col. Loreto, </p>
              <p>Alc. Alvaro Obregón, CDMX., C.P. 01090</p>
              <br />
              <p>
                RFC: <span>R&S811221KR6</span>
              </p>
            </div>

            <p className='bold mt-2'>{`Esta orden de compra está en: ${wizard.currency}`}</p>
          </div>
          <div className={styles.right}>
            <div className={styles.item}>
              <div className={styles.left}></div>
              <div className={styles.center}>Base $</div>
              <div className={styles.amount}>{currencyPipe(generate?.total)}</div>
            </div>
            <div className={styles.item}>
              <div className={styles.left}>Descuento</div>
              <div className={styles.center}>{cleanPCT(formTaxes.discount)}% $</div>
              <div className={styles.amount}>{currencyPipe(generate?.discount)}</div>
            </div>
            <div className={styles.item}>
              <div className={styles.left}></div>
              <div className={styles.center}>Subtotal $</div>
              <div className={styles.amount}>{currencyPipe(generate?.subTotal)}</div>
            </div>

            <br />

            <div className={styles.item}>
              <div className={styles.left}>IVA</div>
              <div className={styles.center}>{cleanPCT(formTaxes.iva)}% $</div>
              <div className={styles.amount}>{currencyPipe(generate?.iva)}</div>
            </div>
            <div className={styles.item}>
              <div className={styles.left}>Retención IVA</div>
              <div className={styles.center}>{cleanPCT(formTaxes.ivaRet ?? '0')}% $</div>
              <div className={styles.amount}>{currencyPipe(generate?.ivaRet)}</div>
            </div>
            <div className={styles.item}>
              <div className={styles.left}>Retención ISR</div>
              <div className={styles.center}>{cleanPCT(formTaxes.isrRet ?? '0')}% $</div>
              <div className={styles.amount}>{currencyPipe(generate?.isrRet)}</div>
            </div>
            <div className={styles.item}>
              <div className={styles.left}>Otras retenciones</div>
              <div className={styles.center}>{cleanPCT(formTaxes.ret ?? '0')}% $</div>
              <div className={styles.amount}>{currencyPipe(generate?.otherRet)}</div>
            </div>

            <br />

            <div className={`${styles.item} ${styles.total}`}>
              <div className={styles.left}>TOTAL A PAGAR</div>
              <div className={styles.center}>$</div>
              <div className={styles.amount}>{currencyPipe(generate?.totalToPay)}</div>
            </div>
          </div>
        </div>

        <div className={styles.comments}>
          <p className='bold'>Comentarios: {formTaxes.comment} </p>
        </div>
      </div>

      <div className={styles.buttons}>
        <Button
          variant='outlined'
          onClick={() => {
            generated ? navigate(`/orden-compra`, { replace: true }) : back();
          }}
        >
          REGRESAR
        </Button>

        <LoadingButton
          style={{ visibility: !generated ? 'visible' : 'hidden' }}
          variant='contained'
          loading={loading}
          onClick={() => {
            save();
          }}
        >
          GENERAR ORDEN
        </LoadingButton>
      </div>

      <div
        style={{ visibility: !generated ? 'visible' : 'hidden' }}
        className={styles.link}
        onClick={() => {
          setOpenConfirm(true);
        }}
      >
        Cancelar
      </div>

      <ModalInfo
        open={openInfo}
        title='¡Genial!'
        feedback='La orden de compra se ha generado exitosamente'
        onClose={() => {
          setOpenInfo(false);
          navigate(`/orden-compra`, { replace: true });
        }}
        onConfirm={() => {
          setOpenInfo(false);
          navigate(`/orden-compra`, { replace: true });
        }}
      />

      <ModalConfirmCancel
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
        }}
        onConfirm={() => {
          setOpenConfirm(false);
          deleteOrder();
        }}
      />

      <ModalNotification
        open={openNotification}
        feedback={feedback!}
        onClose={() => {
          setOpenNotification(false);
        }}
        onConfirm={() => {
          setOpenNotification(false);

          if (codeError === codeErrorPurchase.SHOW_WARNING) {
            save(true);
            return;
          }

          if (codeError === codeErrorPurchase.REQUIRE_APPROVAL) {
            save(true, true);
            return;
          }

          navigate('/orden-compra', { replace: true });
        }}
      />
    </>
  );
};
