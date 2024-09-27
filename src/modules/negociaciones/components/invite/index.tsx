import { Controller, FieldValues, useForm } from 'react-hook-form';
import { Button, Checkbox, Dialog, DialogContent, DialogTitle, IconButton, ListItemText, MenuItem, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomSnackbar } from '../../../../core/components';
import { Close, Search } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { DataGrid, GridColDef, GridRowSelectionModel, esES } from '@mui/x-data-grid';
import { DataTable } from './types';
import { apiService } from '../../../../core/services';
import { urlEmailInvitation } from '../../../../core/utils/constants';
import { NegociationInfo, Ocupation } from '../..';
import styles from './styles.module.scss';

type QueryParams = {
  name: string;
  ocupations: string;
  rfc: string;
};

type Props = {
  id: string;
  negociationInfo?: NegociationInfo;
};

export const InviteNegociation = ({ id, negociationInfo }: Props) => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openNoResult, setOpenNoResult] = useState(false);
  const [searching, setSearching] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [sending, setSending] = useState(false);
  const [successInvitation, setSuccessInvitation] = useState(false);
  const [ocupations, setOcupations] = useState<Ocupation[]>([]);
  const [selectedRows, setSelectedRows] = useState<DataTable[]>([]);
  const [tableResp, setTableResp] = useState<DataTable[]>([]);
  const [rows, setRows] = useState<DataTable[]>([]);

  const columns: GridColDef[] = [
    { field: 'rfc', headerName: 'RFC', flex: 1 },
    { field: 'name', headerName: 'NOMBRE PROVEDOR', flex: 1 },
    { field: 'type', headerName: 'TIPO', flex: 1 },
    { field: 'ocupation', headerName: 'OCUPACIÓN', flex: 1 },
    { field: 'email', headerName: 'CORREO', flex: 1 },
  ];

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
    setValue,
    getValues,
    watch,
  } = useForm({
    mode: 'all',
  });

  const watchFields = watch();
  const { rfc, name, ocupations: ocupationsValue } = watchFields;

  const onSubmit = (form: FieldValues) => {};

  const validateEmails = (val: string) => {
    if (!val) return;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const emails = val.split(',');

    if (val == '') return;

    let invalid = false;
    emails.forEach((e, i) => {
      if (!e.match(emailRegex)) {
        invalid = true;
      }
    });

    if (invalid) return 'Deben ser correos separados por comas y sin espacios';
  };

  const onSelect = (selectedRows: GridRowSelectionModel) => {
    setSelectedRows(rows.filter((row) => selectedRows.some((e) => e == row.id)));
  };

  const filterTable = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const searchString = value.toLowerCase();
    setRows(
      tableResp?.filter((item) =>
        !value
          ? true
          : item.rfc?.toLowerCase().includes(searchString) ||
            item.name?.toLowerCase().includes(searchString) ||
            item.type?.toLowerCase().includes(searchString) ||
            item.email?.toLowerCase().includes(searchString)
      )
    );
  };

  const sendInvitations = async () => {
    const { emails } = getValues();
    if (errors.emails || !emails) return;

    const arrayEmails = emails.split(',');
    setInviting(true);
    const { data, error } = await apiService.sendInvitation(
      {
        emails: arrayEmails,
      },
      id!
    );
    setInviting(false);
    setOpenModal(false);

    if (!error) setSuccessInvitation(true);
  };

  const sendInvitationsTable = async () => {
    const emails = selectedRows.map((e) => e.email);
    setInviting(true);
    const { data, error } = await apiService.sendInvitation(
      {
        emails,
      },
      id!
    );
    setInviting(false);
    if (!error) setSuccessInvitation(true);
  };

  const copyToClipboard = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  };

  useEffect(() => {
    setOcupations(negociationInfo?.category?.ocupations ?? []);
  }, []);

  const fillTable = async (queryParams?: QueryParams) => {
    const { data: resp, error } = await apiService.getSuppliers(queryParams);

    if (queryParams && resp?.data?.length === 0) setOpenNoResult(true);

    const dataTable = resp?.data.map((e: any, i: number) => {
      const { personType } = e.infoSupplier;

      return personType == 1
        ? {
            id: i,
            rfc: e.infoSupplier?.rfcNaturalPerson,
            name: `${e.infoSupplier?.nameNaturalPerson ?? ''} ${e.infoSupplier?.surnameNaturalPerson ?? ''}`,
            type: 'Persona Física',
            ocupation: e.infoSupplier?.ocupationInfo?.description,
            email: e.email,
          }
        : {
            id: i,
            rfc: e.infoSupplier?.rfcLegalPerson,
            name: `${e.infoSupplier?.nameLegalPerson ?? ''} ${e.infoSupplier?.surnameLegalPerson ?? ''}`,
            type: 'Persona Moral',
            ocupation: e.infoSupplier?.ocupationInfo?.description,
            email: e.email,
          };
    });

    setTableResp(dataTable);
    setRows(dataTable);
  };

  const onSearch = async () => {
    const { rfc, name, ocupations } = watchFields;
    if (errors.rfc || errors.ocupations) return;
    setSearching(true);
    await fillTable({ rfc, name, ocupations: ocupations?.length > 0 ? ocupations.join(',') : null });
    setSearching(false);
  };

  return (
    <>
      <div className={styles.row}>
        <h2>
          Enviar Invitaciones <br /> a proveedores
        </h2>

        <div className={styles.buttons}>
          <div
            className={styles.btn}
            onClick={() => {
              setOpen(true);
              copyToClipboard(`${urlEmailInvitation}/${id}`);
            }}
          >
            <span>Enlace Público</span>
            <i className='fas fa-link'></i>
          </div>
          <div
            className={styles.btn}
            onClick={() => {
              setValue('emails', null);
              setOpenModal(true);
            }}
          >
            <span>Invitar por correo</span>
            <i className='far fa-envelope'></i>
          </div>
        </div>
      </div>

      <div className={styles.searchProviders}>Buscar Proveedores</div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.item}>
          <div className='form-group'>
            <label>RFC</label>
            <input
              type='text'
              className='form-control'
              placeholder='Ingrese el RFC'
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => setValue('rfc', e.target.value.toUpperCase().trimStart())}
              {...register('rfc', {
                minLength: {
                  value: 12,
                  message: 'Mínimo 12 caracteres',
                },
                maxLength: {
                  value: 13,
                  message: 'Máximo 13 caracteres',
                },
              })}
            />
            {errors.rfc && <small className='text-danger'>{errors.rfc.message as string}</small>}
          </div>
        </div>

        <div className={styles.item}>
          <div className='form-group'>
            <label>NOMBRE DEL PROVEEDOR</label>
            <input
              type='text'
              placeholder='Nombre del Proveedor'
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => setValue('name', e.target.value.trimStart())}
              className='form-control'
              {...register('name')}
            />
          </div>
        </div>

        <div className={styles.item}>
          <div className='form-group'>
            <label>OCUPACIÓN</label>
            <div className='form-control'>
              <Controller
                control={control}
                name='ocupations'
                defaultValue={[]}
                render={({ field }) => (
                  <Select
                    {...field}
                    fullWidth
                    multiple
                    defaultValue={[]}
                    displayEmpty
                    renderValue={(value) =>
                      value.length > 0 ? (
                        value.map((key: string) => ocupations.find((obj) => obj.key === key)?.description).join(', ')
                      ) : (
                        <span className='placeholder'>Seleccione la ocupación</span>
                      )
                    }
                  >
                    {ocupations?.map((item: Ocupation, i: number) => (
                      <MenuItem value={item.key} key={item.key + i}>
                        <Checkbox checked={!!watchFields?.ocupations?.find((e: string) => e == item.key)} />
                        <ListItemText primary={item.description} />
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </div>
            {/* {errors.ocupations && <small className='text-danger'>{errors?.ocupations?.message as string}</small>} */}
          </div>
        </div>

        <div>
          <LoadingButton
            className='btn-icon-outlined'
            variant='contained'
            type='submit'
            loading={searching}
            disabled={!rfc && !name && !!!ocupationsValue?.length}
            onClick={() => {
              handleSubmit(onSubmit)();
              onSearch();
            }}
          >
            BUSCAR
          </LoadingButton>
        </div>
      </form>

      {tableResp.length > 0 && (
        <>
          <div className={styles.searchRow}>
            <div></div>
            <div></div>
            <div className='form-group search' style={{ margin: 0, marginTop: '12px', width: '280px' }}>
              <Search />
              <input type='text' className='form-control' placeholder='Buscar' onChange={filterTable} />
            </div>
          </div>

          <div
            className='table'
            style={{
              margin: '0 auto',
            }}
          >
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
              checkboxSelection
              onRowSelectionModelChange={onSelect}
            />
          </div>

          <div className='text-right mt-2'>
            <LoadingButton
              variant='contained'
              loading={sending}
              disabled={selectedRows.length < 1}
              onClick={() => {
                setOpenConfirm(true);
              }}
            >
              ENVIAR INVITACIONES
            </LoadingButton>
          </div>
        </>
      )}

      <CustomSnackbar open={open} setOpen={setOpen}>
        <div className={styles.alertBody}>
          <i className='far fa-check-circle'></i>
          <div className={styles.wrapper}>
            <div className={styles.title}>EL ENLACE HA SIDO COPIADO</div>
            <p>Utiliza el enlace copiado para invitar a los proveedores que desees</p>
          </div>
        </div>
      </CustomSnackbar>

      <CustomSnackbar open={successInvitation} setOpen={setSuccessInvitation} duration={4000}>
        <div className={styles.alertBody}>
          <i className='far fa-check-circle'></i>
          <div className={styles.wrapper}>
            <div className={styles.title}>CORREOS ENVIADOS</div>
            <p>Los correos han sido enviados satisfactoriamente</p>
          </div>
        </div>
      </CustomSnackbar>

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
              <h2 className={`${styles.modalTitle} joey`}>Invitar por correo electrónico</h2>
              <p className='mt-1'>
                Indique las direcciones de correo de los proveedores que desea <br /> invitar, separadas por coma.
              </p>

              <div className='form-group'>
                <TextField
                  placeholder='Separar correos por comas y sin espacios. Ejemplo: soynegociadormexico@segurosura.com.mx, mxproveedores@segurossura.com.mx'
                  multiline
                  rows={5}
                  {...register('emails', {
                    validate: validateEmails,
                  })}
                />
                {errors.emails && <small className='text-danger'>{errors.emails?.message as string}</small>}
              </div>

              <div className={styles.buttons}>
                <LoadingButton
                  variant='outlined'
                  loading={inviting}
                  onClick={() => {
                    sendInvitations();
                  }}
                >
                  INVITAR PROVEEDORES
                </LoadingButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
            <div className={`${styles.modalBody} text-center`}>
              <h2 className={`${styles.titleBlue} joey`}>Confirmación de Envío</h2>
              <p className={styles.bold}>Ha seleccionado {selectedRows.length} proveedor(es)</p>
              <p className='mb-3'>
                ¿Está seguro que desea invitarlos para ofertar <br /> para este requerimiento?
              </p>

              <div className={styles.buttons}>
                <LoadingButton
                  variant='outlined'
                  loading={inviting}
                  onClick={() => {
                    setOpenConfirm(false);
                    sendInvitationsTable();
                  }}
                >
                  ACEPTAR
                </LoadingButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className='modal'>
        <Dialog
          open={openNoResult}
          onClose={() => {
            setOpenNoResult(false);
          }}
          className='modal-small'
        >
          <DialogTitle>Ups!</DialogTitle>
          <DialogContent>
            <div className={styles.modalBody} style={{ padding: 0 }}>
              <p className='mb-3 text-center'>No se encontraron resultados.</p>
              <div className={styles.buttons}>
                <Button
                  variant='contained'
                  onClick={() => {
                    setOpenNoResult(false);
                  }}
                >
                  Aceptar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
