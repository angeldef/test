import { formatDate } from '../../../../../../../../core/utils/functions';
import { RF1 } from '../types';
import styles from './styles.module.scss';

type Props = {
  rf1: any;
  personType?: string;
};

export const RF1Detail = ({ rf1, personType }: Props) => {
  const branches = rf1.branches ?? [];
  const [employees1, employees2] = rf1?.direct_employees?.split('_') ?? [];
  const employees = employees1 ? (employees2 ? `${employees1 ?? '-'} a ${employees2 ?? '-'}` : `Mayor a ${employees1}`) : '';
  const transactionType = rf1.swift || rf1.aba || rf1.iban ? 'Internacional' : 'Nacional';

  return (
    <>
      <div className={styles.layout}>
        <div className={styles.left}>
          <div className={styles.row}>
            <div className={styles.title}>Dirección Fiscal</div>
            <div className={styles.subtitle}>{rf1.addressString1}</div>
            <p>{rf1.addressString2}</p>
          </div>
          <div className={styles.row}>
            <div className={styles.title}>Póliza Vigente, {rf1.rcPolicy ? 'SI' : 'NO'}</div>
            <p>{`${formatDate(rf1.effectiveDateStart, 'dd/MM/yyyy')}  - ${formatDate(rf1.effectiveDateEnd, 'dd/MM/yyyy')}`}</p>
          </div>
          {employees && (
            <div className={styles.row}>
              <div className={styles.title}>Núm. de empleados</div>
              <p>{employees}</p>
            </div>
          )}
          {rf1.tradeName && personType === '1' && (
            <div className={styles.row}>
              <div className={styles.title}>Nombre comercial</div>
              <p>{rf1.tradeName}</p>
            </div>
          )}
          {rf1.genre && (
            <div className={styles.row}>
              <div className={styles.title}>Género</div>
              <p>{rf1.genre}</p>
            </div>
          )}
          {rf1.birhdate && (
            <div className={styles.row}>
              <div className={styles.title}>Fecha de nacimiento</div>
              <p>{formatDate(rf1.birhdate, 'dd/MM/yyyy')}</p>
            </div>
          )}
          {rf1.phone_natural_person && personType === '1' && (
            <div className={styles.row}>
              <div className={styles.title}>Teléfono</div>
              <p>{rf1.phone_natural_person}</p>
            </div>
          )}
          {rf1.phone_legal_person && (
            <div className={styles.row}>
              <div className={styles.title}>Teléfono</div>
              <p>{rf1.phone_legal_person}</p>
            </div>
          )}
          {rf1.employees_quantity && (
            <div className={styles.row}>
              <div className={styles.title}>Empleados indirectos</div>
              <p>{rf1.employees_quantity}</p>
            </div>
          )}
          {rf1.annual_income_label && (
            <div className={styles.row}>
              <div className={styles.title}>Ingresos Anuales</div>
              <p>{rf1.annual_income_label}</p>
            </div>
          )}

          {branches.length > 0 && (
            <div className={styles.row}>
              <div className={styles.title}>Sucursales</div>

              {branches.map((e: any, i: number) => (
                <div className={styles.branch} key={i}>
                  <div className={styles.subtitle}>{e.addressString1}</div>
                  <p>{e.addressString2}</p>
                  {e.phone_branch && <p>{`Teléfono: ${e.phone_branch}`}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.right}>
          <div className={styles.row}>
            <div className='bold'>Contacto Comercial</div>
            <p>{rf1.nameBusinessContact}</p>
            <p>{rf1.phoneBusinessContact}</p>
            <p>{rf1.emailBusinessContact}</p>
          </div>

          {rf1.nameOperativeContact && (
            <div className={styles.row}>
              <div className='bold'>Contacto Operativo</div>
              <p>{rf1.nameOperativeContact}</p>
              <p>{rf1.phoneOperativeContact}</p>
              <p>{rf1.emailOperativeContact}</p>
            </div>
          )}

          <div className={styles.row}>
            <div className='bold'>Contacto Financiero</div>
            <p>{rf1.nameFinancialContact}</p>
            <p>{rf1.phoneFinancialContact}</p>
            <p>{rf1.emailFinancialContact}</p>
          </div>
        </div>
      </div>
    </>
  );
};
