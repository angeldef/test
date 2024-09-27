import { useEffect, useState } from 'react';
import { Profile } from './types';
import { SuppliersResponse } from '../steps/select-supplier/form-builder/types';
import { Wizard } from '../types';
import { legalPerson, naturalPerson } from '@/core/utils/constants';
import styles from './styles.module.scss';

type Props = {
  supplierInfo: SuppliersResponse;
  wizard: Wizard;
};

export const SideBar = ({ supplierInfo, wizard }: Props) => {
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    const { infoSupplier, register } = supplierInfo ?? {};
    const obj = { ...infoSupplier, register } as Profile;
    setProfile(obj as Profile);
  }, [supplierInfo]);

  return (
    <>
      <div className={styles.sidebar}>
        <div className={`${styles.wrapper}`}>
          <>
            <div className={styles.pusher}>
              {profile?.personType == naturalPerson && (
                <div className={styles.infoContainer}>
                  <div className={styles.name}>{profile?.fullName}</div>
                  {/* <p className={styles.position}>Persona Física {profile.ocupationDescription ? `/ ${profile.ocupationDescription}` : null}</p> */}
                  <p className={styles.position}>Persona Física</p>

                  <div className={styles.rfcContainer}>
                    {!profile.numId ? (
                      <div className={styles.cell}>
                        <p>RFC</p>
                        <p className='bold'>{profile.savedRfc}</p>
                      </div>
                    ) : (
                      <div className={styles.cell}>
                        <p>Número de ID</p>
                        <p className='bold'>{profile.numId}</p>
                      </div>
                    )}
                  </div>
                  <div className={styles.row}>
                    <p>Domicilio</p>
                    <p className='bold'>
                      {profile.register?.addressString1} <br />
                      {profile.register?.addressString2}
                    </p>
                  </div>

                  <div className={styles.row}>
                    <p>Moneda</p>
                    <p className='bold'>{wizard?.currency}</p>
                  </div>

                  <div className={styles.businessContactContainer}>
                    <p className={styles.title}>Contacto Comercial</p>
                  </div>

                  <div className={styles.row}>
                    <p>Teléfono</p>
                    <p className='bold'>{profile.register?.phoneBusinessContact}</p>
                  </div>

                  <div className={styles.row}>
                    <p>Correo</p>
                    <p className='bold'>{profile.register?.emailBusinessContact}</p>
                  </div>
                </div>
              )}

              {profile?.personType == legalPerson && (
                <div className={styles.infoContainer}>
                  <div className={styles.name}>{profile?.fullName}</div>
                  {/* <p className={styles.position}>Persona Moral {profile.ocupationDescription ? `/ ${profile.ocupationDescription}` : null}</p> */}
                  <p className={styles.position}>Persona Moral</p>

                  {!profile.numId ? (
                    <div className={styles.rfcContainer}>
                      <div className={styles.cell}>
                        <p>RFC</p>
                        <p className='bold'>{profile.savedRfc}</p>
                      </div>
                      <div className={styles.cell}></div>
                    </div>
                  ) : (
                    <div className={styles.rfcContainer}>
                      <div className={styles.cell}>
                        <p>Número de ID</p>
                        <p className='bold'>{profile.numId}</p>
                      </div>
                      <div className={styles.cell}></div>
                    </div>
                  )}

                  <div className={styles.row}>
                    <p>Domicilio</p>
                    <p className='bold'>
                      {profile.register?.addressString1} <br />
                      {profile.register?.addressString2}
                    </p>
                  </div>

                  <div className={styles.row}>
                    <p>Moneda</p>
                    <p className='bold'>{wizard?.currency}</p>
                  </div>

                  <div className={styles.businessContactContainer}>
                    <p className={styles.title}>Contacto Comercial</p>
                  </div>

                  <div className={styles.row}>
                    <p>Teléfono</p>
                    <p className='bold'>{profile.register?.phoneBusinessContact}</p>
                  </div>

                  <div className={styles.row}>
                    <p>Correo</p>
                    <p className='bold'>{profile.register?.emailBusinessContact}</p>
                  </div>
                </div>
              )}
            </div>
          </>
        </div>
      </div>
    </>
  );
};
