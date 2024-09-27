import { formatDate } from '@/core/utils/functions';
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

          {rf1.tradeName && personType === '1' && (
            <div className={styles.row}>
              <div className={styles.title}>Nombre comercial</div>
              <p>{rf1.tradeName}</p>
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
