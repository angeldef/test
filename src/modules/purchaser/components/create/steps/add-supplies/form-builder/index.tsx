import { FieldValues, useForm } from 'react-hook-form';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FormComponentType } from '@/core/types/FormComponentType';
import { DynamicCurrency, DynamicSelect, DynamicTextField } from '@/core/components';
import { LoadingButton } from '@mui/lab';
import { DataGrid, GridColDef, esES } from '@mui/x-data-grid';
import { DataTableSupplies } from './types';
import { Button } from '@mui/material';
import { currencyPipe } from '@/core/utils/pipes';
import { Wizard } from '../../../types';
import { purchaserService } from '@/modules/purchaser/services/purchaser';
import { ModalInfo } from '../../../modal-info';
import styles from './styles.module.scss';
import { ModalConfirmDelete } from '../../../modal-confirm-delete';

type Props = {
  components: FormComponentType[];
  defaultValues?: object;
  back: Function;
  next: Function;
  wizard: Wizard;
  updateWizard: Function;
};

export const FormBuilder = forwardRef(({ components, defaultValues, back, next, wizard, updateWizard }: Props, ref) => {
  const { supplies } = wizard;
  const [id, setId] = useState(new Date().valueOf());
  const [rows, setRows] = useState<DataTableSupplies[]>(supplies?.rows ?? []);
  const [selected, setSelected] = useState<DataTableSupplies>();
  const [title, setTitle] = useState<string>();
  const [feedback, setFeedback] = useState<string>();
  const [openInfo, setOpenInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const columns: GridColDef[] = [
    { field: 'quantity', headerName: 'CANTIDAD', flex: 1 },
    { field: 'udm', headerName: 'UDM', flex: 1 },
    { field: 'description', headerName: 'DESCRIPCIÓN', flex: 1 },
    { field: 'price', headerName: 'PRECIO UNITARIO', flex: 1 },
    { field: 'total', headerName: 'PRECIO TOTAL', flex: 1 },
    {
      field: 'actions',
      headerName: '',
      sortable: false,
      width: 50,
      renderCell: (params) => {
        return (
          <div
            className={styles.delete}
            onClick={() => {
              handleAction(params);
            }}
          >
            <i className='fas fa-trash-alt'></i>
          </div>
        );
      },
    },
  ];
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    reset,
    setValue,
    control,
  } = useForm({
    mode: 'all',
  });

  const getCurrencyValue = (val: string) => {
    return parseFloat(val.replace('$ ', '').replaceAll(',', ''));
  };

  const onSubmit = async (values: FieldValues) => {
    const { quantity, price, udm, description } = values;
    const priceVal = getCurrencyValue(price);
    const quantityVal = getCurrencyValue(quantity);
    const totalVal = priceVal * quantityVal;
    const total = `$ ${currencyPipe(totalVal)}`;
    const row = { quantity, price, udm, description, priceVal, quantityVal, totalVal, total, id };
    setId(new Date().valueOf());

    let arr = [...rows];
    arr.push(row);
    setRows(arr);
  };

  const handleAction = (params: { row: DataTableSupplies }) => {
    const { row } = params;

    setSelected(row);
    setOpenConfirm(true);
  };

  const saveDraft = async (silentMode?: boolean) => {
    const items = rows.map((e) => ({
      quantity: e.quantityVal,
      price: e.priceVal,
      total: e.totalVal,
      udm: e.udm,
      description: e.description,
    }));

    const { selectSupplier, selectNegotiation, purchaseId } = wizard;
    const { proposalId } = selectNegotiation;
    const { supplierId } = selectSupplier;
    const state = { wizard: { ...wizard, supplies: { rows } } };

    const body = {
      ...(purchaseId && { id: purchaseId }),
      state,
      proposalId,
      supplierId,
      items,
      saveDraft: true,
    };

    setLoading(true);
    const { data: resp } = await purchaserService.savePurchase(body);
    setLoading(false);

    if (resp) {
      const { id } = resp.data;
      updateWizard({ purchaseId: id });

      if (silentMode) return;

      setTitle('Borrador de Orden de Compra');
      setFeedback('Se ha guardado el borrador de la orden de compra correctamente');
      setOpenInfo(true);
    }

    return resp;
  };

  useImperativeHandle(ref, () => ({
    handleSubmit,
    saveDraft,
    isValid,
  }));

  useEffect(() => {
    reset(defaultValues, {
      keepDirty: false,
    });
  }, []);

  return (
    <>
      <h2 className='joey mb-2'>Ingresar insumos de la orden de compra</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {components.map((component, i) => {
          const { key } = component;

          switch (component.type) {
            case 'textfield':
              return (
                <div className={`form-group ${styles['div' + (i + 1)]}`} key={i}>
                  <DynamicTextField component={component} register={register} setValue={setValue} errors={errors} />
                </div>
              );

            case 'currency':
              return (
                <div className={`form-group ${styles['div' + (i + 1)]}`} style={{ gridColumn: key === 'description' ? '1/3' : 'auto' }} key={i}>
                  <DynamicCurrency component={component} control={control} errors={errors} removePrefix={key === 'quantity'} />
                </div>
              );

            case 'select':
              return (
                <div className={`form-group ${styles['div' + (i + 1)]}`} key={i}>
                  <DynamicSelect component={component} control={control} setValue={setValue} catalogos={[]} errors={errors} />
                </div>
              );
          }
        })}

        <div>
          <LoadingButton className='btn-outlined' variant='outlined' type='submit'>
            AGREGAR
          </LoadingButton>
        </div>
      </form>

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

      <div className={styles.buttons}>
        <Button
          variant='outlined'
          onClick={() => {
            updateWizard({ supplies: { rows } });
            saveDraft(true);
            back();
          }}
        >
          REGRESAR
        </Button>

        <LoadingButton
          variant='contained'
          loading={loading}
          onClick={async () => {
            if (rows.length < 1) {
              setTitle('Error');
              setFeedback('Debe agregar insumos para poder continuar');
              setOpenInfo(true);
              return;
            }
            updateWizard({ supplies: { rows } });
            await saveDraft(true);
            next();
          }}
        >
          CONTINUAR
        </LoadingButton>
      </div>

      <ModalInfo
        open={openInfo}
        title={title!}
        feedback={feedback!}
        onClose={() => {
          setOpenInfo(false);
        }}
        onConfirm={() => {
          setOpenInfo(false);
        }}
      />

      <ModalConfirmDelete
        open={openConfirm}
        suppyName={selected?.description!}
        onClose={() => {
          setOpenConfirm(false);
        }}
        onConfirm={() => {
          setOpenConfirm(false);
          const { id } = selected!;
          const arr = rows.filter((e) => e.id !== id);
          setRows(arr);
        }}
      />
    </>
  );
});
