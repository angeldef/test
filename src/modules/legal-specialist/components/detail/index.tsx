import { useEffect, useRef, useState } from 'react';
import { GlobalFooter, GlobalHeader } from '../../../../core/components';
import { CircularProgress, Tab, Tabs } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { BankAccount, Header, Profile } from './types';
import { BtnSidebar, BtnSidebarProps } from '../../../negociaciones/components';
import { formatDate } from '../../../../core/utils/functions';
import { legalSpecialistService } from '../../services/legalSpecialist';
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
import { ContestAnswer, Contract, DetailResponse, Quotation } from '../types';
import { RF1 } from '../tabs/info/types';
import { ModalDone } from '../modal-done';
import { QuotationTab } from '../tabs/quotation';
import { Formalization } from '@/modules/negociaciones/components/applications/detail/tabs/info/types';
import { ContestTab } from '@/modules/negociaciones/components/applications/detail/tabs/contest';
import { ContractTab, NegotiatorFormalization } from '../tabs/contract';
import { legalPerson, naturalPerson } from '@/core/utils/constants';
import styles from './styles.module.scss';

const menu: BtnSidebarProps[] = [{ amount: null, label: 'Formalización', disabled: false }];
type FormIO = { components: FormComponentType[]; properties: { personType1: string; personType2: string }; title: string; tooltip: string };

export const DetailLegalSpecialist = () => {
  const [contraer, setContraer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSave, setOpenSave] = useState(false);
  const [openDone, setOpenDone] = useState(false);
  const [profile, setProfile] = useState<Profile>();
  const [header, setHeader] = useState<Header>();
  const [negotiationStatus, setNegotiationStatus] = useState<string>();
  const [proposalStatus, setProposalStatus] = useState<string>();
  const [documentation, setDocumentation] = useState<Documentation[]>();
  const [quotation, setQuotation] = useState<Quotation[]>();
  const [formalization, setFormalization] = useState<Formalization>();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>();
  const [supplierInfo, setSupplierInfo] = useState<DetailResponse>();
  const [catalogos, setCatalogos] = useState<Catalogos>();
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [formIO, setFormIO] = useState<FormIO[]>([]);
  const [tab, setTab] = useState<string>('preregister');
  const [contestAnswers, setContestAnswers] = useState<ContestAnswer[]>();
  const [negotiatorFormalization, setNegotiatorFormalization] = useState<NegotiatorFormalization>();
  const [answers, setAnswers] = useState<ContestAnswer[]>();
  const { components: generalData, properties: personTypes } = formIO[0] ?? {};
  const { components: contacts } = formIO[1] ?? {};
  let { id } = useParams();
  const form1 = useRef<any>();
  const form2 = useRef<any>();
  const navigate = useNavigate();
  const { preregister, register, supplier, rrNine } = supplierInfo ?? {};
  const { conflictsQuestions, considerations } = preregister ?? {};
  const defaultValues = { ...register, ...supplier?.infoSupplier };
  const { personType } = supplier?.infoSupplier ?? {};
  const { _id: supplierId } = supplier ?? {};
  const [contract, setContract] = useState<Contract>();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const getReasons = async () => {
    const { data: resp } = await proposalService.getReasons();
    setReasons(resp?.data ?? []);
  };

  const onSubmit = async (form: FieldValues) => {};

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
    const { data: resp } = await legalSpecialistService.updateSupplier({ ...form, addressString1, addressString2, countryDescription }, _id!);
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

  const getData = async (noSpinner?: boolean) => {
    if (!id) return;
    !noSpinner && setLoading(true);
    const { data: resp } = await legalSpecialistService.getProposalById(id);
    const {
      header,
      supplier,
      documents,
      documentation,
      register,
      quotation,
      formalization,
      contestAnswers,
      proposalContract,
      negotiatorFormalization,
      negotiationStatus,
    } = resp?.data ?? {};
    const { bankAccounts } = register ?? {};
    setSupplierInfo(resp?.data);
    setHeader(header);
    setProfile(supplier?.infoSupplier);
    setDocumentation([...(documents ?? []), ...(documentation ?? [])]);
    setQuotation(quotation);
    setBankAccounts(bankAccounts);
    setFormalization(formalization);
    setContestAnswers(contestAnswers);
    setContract(proposalContract);
    setNegotiatorFormalization(negotiatorFormalization);
    setLoading(false);
    setNegotiationStatus(negotiationStatus);
    setProposalStatus(header?.status);
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
                        navigate('/principal', { replace: true });
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
                        <div className={styles.row}>
                          <p>RFC</p>
                          <p className='bold'>{profile.rfcRepresentative ?? '-'}</p>
                        </div>
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
                  </div>
                </div>

                {!isEditing && (
                  <>
                    <Tabs value={tab} onChange={handleChange} className='mb-2'>
                      <Tab label={<div className={styles.tabTitle}>Información General</div>} value='preregister' />
                      {documentation && documentation.length > 0 && <Tab label={<div className={styles.tabTitle}>DOCUMENTACIÓN</div>} value='docs' />}
                      {quotation && quotation.length > 0 && <Tab label={<div className={styles.tabTitle}>COTIZACIÓN</div>} value='quotation' />}
                      {contestAnswers && contestAnswers.length > 0 && <Tab label={<div className={styles.tabTitle}>CONCURSO</div>} value='contest' />}
                      {contract && <Tab label={<div className={styles.tabTitle}>GESTIÓN DE CONTRATO</div>} value='contract' />}
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
                    {tab == 'quotation' && <QuotationTab quotation={quotation!} proposalId={id!} getDetail={() => {}} />}
                    {tab == 'contest' && (
                      <ContestTab answers={answers ?? []} contestAnswers={contestAnswers ?? []} proposalId={id!} getDetail={() => {}} readOnly />
                    )}
                    {tab == 'contract' && (
                      <ContractTab
                        contract={contract}
                        id={id!}
                        getData={getData}
                        negotiatorFormalization={negotiatorFormalization!}
                        rrNine={rrNine}
                        negotiationStatus={negotiationStatus}
                        proposalStatus={proposalStatus}
                      />
                    )}
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
    </>
  );
};
