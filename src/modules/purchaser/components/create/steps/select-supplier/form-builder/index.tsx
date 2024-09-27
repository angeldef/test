import { FieldValues, useForm } from 'react-hook-form';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FormComponentType } from '@/core/types/FormComponentType';
import { DynamicTextField } from '@/core/components';
import { LoadingButton } from '@mui/lab';
import { DataGrid, GridColDef, GridRowId, GridRowSelectionModel, esES } from '@mui/x-data-grid';
import { purchaserService } from '@/modules/purchaser/services/purchaser';
import { DataTableSuppliers, SuppliersResponse } from './types';
import { Button } from '@mui/material';
import { Wizard } from '../../../types';
import { ModalInfo } from '../../../modal-info';
import styles from './styles.module.scss';

type Props = {
  components: FormComponentType[];
  defaultValues?: object;
  back: Function;
  next: Function;
  wizard: Wizard;
  setSupplierInfo: Function;
  updateWizard: Function;
};

export const FormBuilder = forwardRef(({ components, back, next, setSupplierInfo, wizard, updateWizard }: Props, ref) => {
  const { selectSupplier } = wizard;
  const [searching, setSearching] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [searched, setSearched] = useState(selectSupplier?.searched || false);
  const [rows, setRows] = useState<DataTableSuppliers[]>(selectSupplier?.rows || []);
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>(wizard.selectSupplier?.selectionModel || []);
  const columns: GridColDef[] = [
    { field: 'rfc', headerName: 'RFC', flex: 1 },
    { field: 'name', headerName: 'PROVEDOR', flex: 1 },
    { field: 'type', headerName: 'TIPO', flex: 1 },
    { field: 'ocupation', headerName: 'OCUPACIÓN', flex: 1 },
    { field: 'email', headerName: 'CORREO', flex: 1 },
  ];
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    reset,
    setValue,
  } = useForm({
    mode: 'all',
  });

  const onSelect = (selectedRows: GridRowSelectionModel) => {
    const selectionSet = new Set(selectionModel);
    const result = selectedRows.filter((s) => !selectionSet.has(s));
    setSelectionModel(result);

    const selected = rows.find((e) => e.id === result[0])?.supplierData;
    setSupplierInfo(selected);
  };

  const onSubmit = async (values: FieldValues) => {
    const { rfc, name } = values;
    if (!rfc && !name) {
      setOpenInfo(true);
      return;
    }

    setSearching(true);
    const { data: resp } = await purchaserService.getPurchaseSuppliers(values);
    if (resp) fillTable(resp.data);
    setSearching(false);
    setSearched(true);
    updateWizard({ selectSupplier: { form: { ...values }, searched: true } });
  };

  const fillTable = (data: SuppliersResponse[]) => {
    setSelectionModel([]);
    setRows(
      data?.map((e, i) => {
        return {
          id: i,
          rfc: e.infoSupplier?.savedRfc ? e.infoSupplier?.savedRfc : 'N/A',
          name: e.infoSupplier?.fullName,
          type: e.infoSupplier?.personType == '1' ? 'Persona Física' : 'Persona Moral',
          email: e.email,
          ocupation: e.infoSupplier?.ocupationDescription ?? 'N/A',
          supplierData: e,
        };
      })
    );
  };

  const getSupplierId = () => {
    const id = selectionModel[0];
    return rows.find((e) => e.id === id)?.supplierData?._id;
  };

  const nextStep = () => {
    const id = selectionModel[0];
    const supplierInfo = rows.find((e) => e.id === id)?.supplierData;
    setSupplierInfo(supplierInfo);

    const { selectSupplier } = wizard;
    updateWizard({ selectSupplier: { ...selectSupplier, rows, supplierInfo, selectionModel, supplierId: getSupplierId() } });
    next();
  };

  useImperativeHandle(ref, () => ({
    handleSubmit,
    isValid,
  }));

  useEffect(() => {
    if (wizard.selectSupplier?.form)
      reset(wizard.selectSupplier.form, {
        keepDirty: false,
      });
  }, [wizard.selectSupplier?.form]);

  return (
    <>
      <h2 className='joey mb-2'>Selección del proveedor</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {components.map((component, i) => {
          switch (component.type) {
            case 'textfield':
              return (
                <div className={`form-group ${styles['div' + (i + 1)]}`} key={i}>
                  <DynamicTextField component={component} register={register} setValue={setValue} errors={errors} />
                </div>
              );
          }
        })}

        <div>
          <LoadingButton className='btn-icon-outlined' variant='contained' type='submit' loading={searching}>
            BUSCAR
          </LoadingButton>
        </div>
      </form>

      {searched && (
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
            rowSelectionModel={selectionModel}
            sx={{
              '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
                display: 'none',
              },
            }}
          />
        </div>
      )}

      <div className={styles.buttons}>
        <Button
          variant='outlined'
          onClick={() => {
            back();
          }}
        >
          REGRESAR
        </Button>

        <LoadingButton
          variant='contained'
          disabled={selectionModel.length === 0}
          onClick={() => {
            nextStep();
          }}
        >
          CONTINUAR
        </LoadingButton>
      </div>

      <ModalInfo
        open={openInfo}
        title='¡Ups!'
        feedback='Debe ingresar uno de los campos para continar'
        onClose={() => {
          setOpenInfo(false);
        }}
        onConfirm={() => {
          setOpenInfo(false);
        }}
      />
    </>
  );
});
