import { useEffect, useRef, useState } from 'react';
import { GlobalFooter, GlobalHeader } from '../../../../core/components';
import { CircularProgress, Tab, Tabs } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { BankAccount, Header, Profile } from './types';
import { BtnSidebar, BtnSidebarProps } from '../../../negociaciones/components';
import { formatDate } from '../../../../core/utils/functions';
import { logisticsAnalystService } from '../../services/logisticsAnalyst';
import { Documentation, Reason } from '@/modules/negociaciones/components/applications/detail/types';
import { DocsTab } from '../tabs/documentation';
import { proposalService } from '@/core/services/proposals';
import { FormBuilder } from '../form-builder';
import { FieldValues } from 'react-hook-form';
import { FormComponentType } from '@/core/types/FormComponentType';
import { Catalogos } from '@/modules/negociaciones/components/formalization/components';
import { LoadingButton } from '@mui/lab';
import { ModalConfirmEdit } from '../modal-confirm-edit';
import { ModalConfirmSave } from '../modal-confirm-save';
import { apiService } from '@/core/services';
import { InfoTab } from '../tabs/info';
import { DetailResponse } from '../types';
import { RF1 } from '../tabs/info/types';
import { ModalDone } from '../modal-done';
import { BanksTab } from '../tabs/banks';
import { Formalization } from '@/modules/negociaciones/components/applications/detail/tabs/info/types';
import { ModalConfirmSaveSupplier } from '../modal-confirm-save-supplier';
import { ModalDoneSupplier } from '../modal-done-supplier';
import { legalPerson, naturalPerson } from '@/core/utils/constants';
import { codeErrorApi } from '@/core/utils/enums';
import { ModalError } from '../modal-error';
import styles from './styles.module.scss';

const menu: BtnSidebarProps[] = [{ amount: null, label: 'Invitaciones y Contrataciones', disabled: false }];
type FormIO = { components: FormComponentType[]; properties: { personType1: string; personType2: string }; title: string; tooltip: string };

export const DetailLogisticsAnalyst = () => {
  const [contraer, setContraer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSave, setOpenSave] = useState(false);
  const [openDone, setOpenDone] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [supplierRegistered, setSupplierRegistered] = useState(false);
  const [openConfirmSupplier, setOpenConfirmSupplier] = useState(false);
  const [openDoneSupplier, setOpenDoneSupplier] = useState(false);
  const [title, setTitle] = useState<string>();
  const [feedback, setFeedback] = useState<string>();
  const [profile, setProfile] = useState<Profile>();
  const [header, setHeader] = useState<Header>();
  const [documentation, setDocumentation] = useState<Documentation[]>();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>();
  const [supplierInfo, setSupplierInfo] = useState<DetailResponse>();
  const [formalization, setFormalization] = useState<Formalization>();
  const [catalogos, setCatalogos] = useState<Catalogos>();
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [formIO, setFormIO] = useState<FormIO[]>([]);
  const [tab, setTab] = useState<string>('preregister');
  const { components: generalData, properties: personTypes } = formIO[0] ?? {};
  const { components: contacts } = formIO[1] ?? {};
  let { id } = useParams();
  const form1 = useRef<any>();
  const form2 = useRef<any>();
  const navigate = useNavigate();
  const { preregister, register, supplier, highError, allowModifySupplierData } = supplierInfo ?? {};
  const { conflictsQuestions, considerations } = preregister ?? {};
  const defaultValues = { ...register, ...supplier?.infoSupplier };
  const { personType } = supplier?.infoSupplier ?? {};

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const getReasons = async () => {
    const { data: resp } = await proposalService.getReasons();
    setReasons(resp?.data ?? []);
  };

  const onSubmit = async (form: FieldValues) => {};

  const sendSupplier = async () => {
    const { data: resp, error } = await proposalService.sendSupplier(id!);

    if (resp) {
      setTitle('¡Genial!');
      setFeedback('Se ha dado de alta al proveedor correctamente');
      setSupplierRegistered(true);
    } else {
      const { errors } = error;
      const { code, description } = errors[0];
      switch (code) {
        case codeErrorApi.EDB_FUSION:
          setTitle('¡Ups!');
          setFeedback(description);
          break;
        case codeErrorApi.HIGH_ERROR:
          setTitle('¡Ups!');
          setFeedback('Falla en derivación de Datos');
          break;
        default:
          setTitle('Ups!');
          setFeedback('Ha ocurrido un error al dar de alta al proveedor');
          break;
      }
    }
    setOpenDoneSupplier(true);
  };

  const getFormIO = async () => {
    const { data: resp } = await apiService.formIoRegister();
    // const { data: resp } = await logisticsAnalystService.getFormIOFake();

    if (resp) {
      const { components } = resp.data;
      setFormIO(components);
    }
  };

  const submitForms = async () => {
    form1?.current?.trigger();
    form2?.current?.trigger();
    const { isValid: isValidForm1 } = form1?.current ?? {};
    const { isValid: isValidForm2 } = form2?.current ?? {};

    const { supplier } = supplierInfo ?? {};
    const { _id } = supplier ?? {};

    if (!isValidForm1 || !isValidForm2) return;
    let form = { ...form1?.current?.getValues(), ...form2?.current?.getValues() };
    const { personType, namePerson } = form;
    personType == '1' ? (form = { ...form, nameNaturalPerson: namePerson }) : (form = { ...form, nameLegalPerson: namePerson });

    const { street, internal_number, external_number, zip_code, city, municipality, colony, foreign_state, foreign_city, country } = form;
    const { countries } = catalogos ?? {};
    const { description: countryDescription } = countries?.find((e: any) => e.key === country) ?? {};
    const _city = country === '052' ? getCity(city) : foreign_city;
    const _municipality = country === '052' ? getMunicipality(municipality) : foreign_state;
    const _colony = country === '052' ? `, ${getColonies(colony)}` : '';

    const addressString1 = `${street}, No. Exterior: ${external_number}`;
    const addressString2 = `No. Interior: ${internal_number ? internal_number : 'N/A'}, CP ${zip_code}, ${_city}, ${_municipality} ${_colony}, ${
      countryDescription ?? ''
    }`;

    setSubmitting(true);
    const { data: resp } = await logisticsAnalystService.updateSupplier({ ...form, addressString1, addressString2, countryDescription }, _id!);
    if (resp) {
      setOpenDone(true);
      getData();
    }
    setSubmitting(false);
  };

  const getCatalogos = async () => {
    try {
      const [countries] = await Promise.all([apiService.getCountries()]);

      setCatalogos((prev) => ({
        ...prev,
        countries:
          countries?.data?.map((e: any) => ({
            key: e.clave,
            description: e.descripcion,
          })) ?? [],
      }));
    } catch (error) {}
  };

  const getZipCodeCatalogs = async (zipCode: string) => {
    if (zipCode.length === 5)
      try {
        const [colonies, cities, municipalities] = await Promise.all([
          apiService.getColonias(zipCode),
          apiService.getCiudades(zipCode),
          apiService.getMunicipios(zipCode),
        ]);
        setCatalogos((prev) => ({
          ...prev,
          colonies:
            colonies?.data?.map((e: any) => ({
              key: e.clave,
              description: e.descripcion,
            })) ?? [],
          cities:
            cities?.data?.map((e: any) => ({
              key: e.clave,
              description: e.descripcion,
            })) ?? [],
          municipalities:
            municipalities?.data?.map((e: any) => ({
              key: e.clave,
              description: e.descripcion,
            })) ?? [],
        }));
      } catch (error) {}
    else {
      setCatalogos((prev) => ({
        ...prev,
        colonies: [],
        cities: [],
        municipalities: [],
      }));
    }
  };

  const onLoad = async () => {
    getCatalogos();
    getReasons();
    getFormIO();
    await getData();
  };

  const getData = async () => {
    if (!id) return;
    setLoading(true);
    const { data: resp } = await logisticsAnalystService.getProposalById(id);
    const { header, supplier, documents, documentation, register, formalization, sentToAlea } = resp?.data ?? {};
    const { bankAccounts } = register ?? {};
    setSupplierInfo(resp?.data);
    setHeader(header);
    setProfile(supplier?.infoSupplier);
    setDocumentation([...documents, ...documentation]);
    setBankAccounts(bankAccounts);
    setFormalization(formalization);
    setSupplierRegistered(sentToAlea);
    setIsUpdating(supplier?.infoSupplier?.personCode);
    setLoading(false);
    return resp?.data;
  };

  const getCity = (key: string) => {
    const { description } = catalogos?.cities?.find((e: any) => e.key === key) ?? {};
    return description;
  };

  const getMunicipality = (key: string) => {
    const { description } = catalogos?.municipalities?.find((e: any) => e.key === key) ?? {};
    return description;
  };

  const getColonies = (key: string) => {
    const { description } = catalogos?.colonies?.find((e: any) => e.key === key) ?? {};
    return description;
  };

  useEffect(() => {
    const { personType1, personType2 } = personTypes ?? {};
    setCatalogos((prev) => ({
      ...prev,
      personTypes: [
        { key: '1', description: personType1 },
        { key: '2', description: personType2 },
      ],
    }));
  }, [personTypes]);

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    highError && setOpenError(true);
  }, [highError]);

  return (
    <>
      <div className='container'>
        <div className='header'>
          <GlobalHeader />
        </div>

        <div className='main'>
          {loading ? (
            <div className='loading mt-4'>
              <CircularProgress />
            </div>
          ) : (
            <div className={`${styles.layout} ${contraer && styles.contraer}`}>
              <div className={`${styles.left} paper`}>
                <div className={styles.wrapper}>
                  <div className={styles.top}>
                    <div
                      className={styles.back}
                      onClick={() => {
                        navigate('/analista-logistica', { replace: true });
                      }}
                    >
                      <div className={styles.circle}>
                        <i className='fas fa-arrow-left'></i>
                      </div>
                      <h3>Principal</h3>
                    </div>
                  </div>

                  <>
                    {profile?.personType == naturalPerson && (
                      <div className={styles.infoContainer}>
                        <div className={styles.name}>{`${profile?.nameNaturalPerson} ${profile?.surnameNaturalPerson}`}</div>
                        {/* <p className={styles.position}>Persona Física {profile.ocupationDescription ? `/ ${profile.ocupationDescription}` : null}</p> */}
                        <p className={styles.position}>Persona Física</p>

                        <div className={styles.rfcContainer}>
                          {!profile.idNumberNaturalPerson ? (
                            <div className={styles.cell}>
                              <p>RFC</p>
                              <p className='bold'>{profile.rfcNaturalPerson}</p>
                            </div>
                          ) : (
                            <div className={styles.cell}>
                              <p>Número de ID</p>
                              <p className='bold'>{profile.idNumberNaturalPerson}</p>
                            </div>
                          )}
                          {!profile.idNumberNaturalPerson && (
                            <div className={styles.cell}>
                              <p>CURP</p>
                              <p className='bold'>{profile.curpNaturalPerson}</p>
                            </div>
                          )}
                        </div>
                        <div className={styles.row}>
                          <p>País de residencia</p>
                          <p className='bold'>{profile.countryDescription}</p>
                        </div>
                        {profile.genre && (
                          <div className={styles.row}>
                            <p>Género</p>
                            <p className='bold'>{profile.genre}</p>
                          </div>
                        )}
                        {profile.personCode && (
                          <div className={styles.row}>
                            <p>Código de persona</p>
                            <p className='bold'>{profile.personCode}</p>
                          </div>
                        )}
                        {profile.supplierCode && (
                          <div className={styles.row}>
                            <p>Código de proveedor</p>
                            <p className='bold'>{profile.supplierCode}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {profile?.personType == legalPerson && (
                      <div className={styles.infoContainer}>
                        <div className={styles.name}>{`${profile?.nameLegalPerson}`}</div>
                        {/* <p className={styles.position}>Persona Moral {profile.ocupationDescription ? `/ ${profile.ocupationDescription}` : null}</p> */}
                        <p className={styles.position}>Persona Moral</p>

                        {!profile.taxIdLegalPerson ? (
                          <div className={styles.rfcContainer}>
                            <div className={styles.cell}>
                              <p>RFC</p>
                              <p className='bold'>{profile.rfcLegalPerson}</p>
                            </div>

                            <div className={styles.cell}>
                              <p>FECHA CONSTITUCIÓN</p>
                              <p className='bold'>{formatDate(profile.birthDateLegalPerson?.split(' ')[0], 'dd/MM/yyyy')}</p>
                            </div>

                            <div className={styles.cell}>
                              <p>PAÍS RESIDENCIA</p>
                              <p className='bold'>{profile.countryDescription}</p>
                            </div>
                          </div>
                        ) : (
                          <div className={styles.rfcContainer}>
                            <div className={styles.cell}>
                              <p>Número de ID</p>
                              <p className='bold'>{profile.taxIdLegalPerson}</p>
                            </div>
                            <div className={styles.cell}></div>
                          </div>
                        )}

                        <div className={styles.representative}>
                          <p>Representante Legal</p>
                        </div>

                        <div className={styles.row}>
                          <p>Nombres</p>
                          <p className='bold'>{`${profile.nameRepresentative ?? ''} ${profile.secondNameRepresentative ?? ''}`}</p>
                        </div>
                        <div className={styles.row}>
                          <p>Apellidos</p>
                          <p className='bold'>{`${profile.surnameRepresentative ?? ''} ${profile.secondSurnameRepresentative ?? ''}`}</p>
                        </div>
                        {profile?.rfcRepresentative && profile?.countryRepresentative === '052' && (
                          <div className={styles.row}>
                            <p>RFC</p>
                            <p className='bold'>{profile.rfcRepresentative}</p>
                          </div>
                        )}
                        {profile?.idNumberRepresentative && profile?.countryRepresentative !== '052' && (
                          <div className={styles.row}>
                            <p>Número de ID</p>
                            <p className='bold'>{profile.idNumberRepresentative}</p>
                          </div>
                        )}
                        <div className={styles.row}>
                          <p>País de residencia</p>
                          <p className='bold'>{profile.countryDescriptionRepresentative}</p>
                        </div>
                        {profile.personCode && (
                          <div className={styles.row}>
                            <p>Código de persona</p>
                            <p className='bold'>{profile.personCode}</p>
                          </div>
                        )}
                        {profile.supplierCode && (
                          <div className={styles.row}>
                            <p>Código de proveedor</p>
                            <p className='bold'>{profile.supplierCode}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className={styles.buttons}>
                      {menu.map((btn, i) => (
                        <div key={i}>
                          <BtnSidebar {...btn} contraer={contraer} active={true} disabled={btn.disabled} />
                        </div>
                      ))}
                    </div>
                  </>
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
                <div className={styles.topBar}>
                  <div className={styles.leftBar}>
                    <div className={styles.nameContainer}>
                      <div className={styles.quotation}>
                        Invitaciones y Contrataciones <span>| Detalle de Invitación y/o Contratación</span>
                      </div>
                      <div title={header?.description} className={styles.name}>
                        {header?.description}
                      </div>
                    </div>
                  </div>

                  <div className={styles.rightContainer}>
                    <div className={styles.rightBar}>
                      <div className={styles.status}>{header?.status}</div>
                      <p>Recibida el {formatDate(header?.createdAt, 'dd/MM/yyyy HH:mm:ss')}</p>
                    </div>

                    {highError && (
                      <LoadingButton
                        variant='contained'
                        loading={loading}
                        onClick={() => {
                          setOpenConfirmSupplier(true);
                        }}
                      >
                        {!isUpdating ? 'DAR DE ALTA' : 'ACTUALIZAR PROVEEDOR'}
                      </LoadingButton>
                    )}
                  </div>
                </div>

                {allowModifySupplierData && !supplierRegistered && (
                  <div
                    className={styles.editIcon}
                    onClick={() => {
                      !isEditing ? setIsEditing(true) : setOpenEdit(true);
                    }}
                  >
                    <i className={isEditing ? 'far fa-times-circle' : 'far fa-edit'}></i>
                  </div>
                )}

                {!isEditing && (
                  <>
                    <Tabs value={tab} onChange={handleChange} className='mb-2'>
                      <Tab label={<div className={styles.tabTitle}>Información General</div>} value='preregister' />
                      {documentation && documentation.length > 0 && <Tab label={<div className={styles.tabTitle}>DOCUMENTACIÓN</div>} value='docs' />}
                      {bankAccounts && bankAccounts?.length > 0 && (
                        <Tab label={<div className={styles.tabTitle}>DATOS BANCARIOS</div>} value='banks' />
                      )}
                    </Tabs>

                    {tab == 'preregister' && (
                      <InfoTab
                        personType={personType}
                        conflictsQuestions={conflictsQuestions ?? []}
                        considerations={considerations ?? []}
                        rf1={register as RF1}
                        formalization={formalization}
                      />
                    )}

                    {tab == 'docs' && <DocsTab documentation={[...(documentation ?? [])]} proposalId={id!} reasons={reasons} getData={getData} />}
                    {tab == 'banks' && <BanksTab bankAccounts={[...(bankAccounts ?? [])]} supplierId={id!} getData={getData} />}
                  </>
                )}

                {isEditing && (
                  <>
                    <h2 style={{ marginBottom: '20px' }}>Actualizar Información de Proveedor</h2>
                    <div className={styles.person}>{`Datos Generales - ${
                      profile?.personType == naturalPerson ? 'Persona Física' : 'Persona Moral'
                    }`}</div>
                    <FormBuilder
                      ref={form1}
                      onSubmit={onSubmit}
                      title='generalData'
                      components={generalData ?? []}
                      catalogos={catalogos ?? {}}
                      getZipCodeCatalogs={getZipCodeCatalogs}
                      defaultValues={defaultValues}
                      personType={personType}
                    />
                    <div style={{ marginTop: '-20px' }}>
                      <FormBuilder
                        ref={form2}
                        onSubmit={onSubmit}
                        title='contacts'
                        components={contacts ?? []}
                        catalogos={catalogos ?? {}}
                        getZipCodeCatalogs={getZipCodeCatalogs}
                        defaultValues={defaultValues}
                      />
                    </div>

                    <div className='text-right'>
                      <LoadingButton variant='contained' loading={submitting} onClick={() => setOpenSave(true)}>
                        ACTUALIZAR INFORMACIÓN
                      </LoadingButton>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <GlobalFooter />
      </div>

      <ModalConfirmEdit
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
        }}
        onConfirm={() => {
          setOpenEdit(false);
          setIsEditing(false);
        }}
      />

      <ModalConfirmSave
        open={openSave}
        onClose={() => {
          setOpenSave(false);
        }}
        onConfirm={() => {
          setOpenSave(false);
          submitForms();
        }}
      />

      <ModalConfirmSaveSupplier
        open={openConfirmSupplier}
        onClose={() => {
          setOpenConfirmSupplier(false);
        }}
        onConfirm={() => {
          setOpenConfirmSupplier(false);
          sendSupplier();
        }}
      />

      <ModalDoneSupplier
        title={title}
        feedback={feedback}
        open={openDoneSupplier}
        onClose={() => {
          setOpenDoneSupplier(false);
        }}
        onConfirm={() => {
          setOpenDoneSupplier(false);
        }}
      />

      <ModalDone
        open={openDone}
        onClose={() => {
          setOpenDone(false);
          setIsEditing(false);
        }}
        onConfirm={() => {
          setOpenDone(false);
          setIsEditing(false);
        }}
      />

      <ModalError
        open={openError}
        onClose={() => {
          setOpenError(false);
        }}
        onConfirm={() => {
          setOpenError(false);
        }}
      />
    </>
  );
};
