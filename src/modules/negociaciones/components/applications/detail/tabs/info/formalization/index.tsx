import { Formalization } from '../types';
import { formatDate } from '@/core/utils/functions';
import styles from './styles.module.scss';

type Props = {
  formalization: Formalization;
};

export const FormalizationDetail = ({ formalization }: Props) => {
  return (
    <div className={styles.layout}>
      <div className={styles.section}>
        <div className={styles.title}>Representante Legal</div>
        <div className={styles.row}>
          <div className={styles.desc}>Nombres</div>
          <p className='bold'>{`${formalization.nameRepresentative} ${formalization.secondNameRepresentative ?? ''}`}</p>
        </div>

        <div className={styles.row}>
          <div className={styles.desc}>Apellidos</div>
          <p className='bold'>{`${formalization.surnameRepresentative} ${formalization.secondSurnameRepresentative ?? ''}`}</p>
        </div>

        <div className={styles.row}>
          <div className={styles.desc}>Teléfono</div>
          <p className='bold'>{formalization.phoneRepresentative}</p>
        </div>

        <div className={styles.row}>
          <div className={styles.desc}>Correo</div>
          <p className='bold'>{formalization.emailRepresentative}</p>
        </div>
      </div>

      {formalization.charterDeedNumber && (
        <div className={styles.section}>
          <div className={styles.title}>Datos para Acta Constitutiva</div>
          <div className={styles.row}>
            <div className={styles.desc}>No. de Escritura</div>
            <p className='bold'>{formalization.charterDeedNumber}</p>
          </div>

          <div className={styles.row}>
            <div className={styles.desc}>Fecha de la Escritura</div>
            <p className='bold'>{formatDate(formalization.charterDeedDate, 'dd/MM/yyyy')}</p>
          </div>

          <div className={styles.row}>
            <div className={styles.desc}>No. de Notario</div>
            <p className='bold'>{formalization.charterNotaryNumber}</p>
          </div>

          <div className={styles.row}>
            <div className={styles.desc}>Ciudad del Notario</div>
            <p className='bold'>{formalization.charterNotaryCity}</p>
          </div>
        </div>
      )}

      {formalization.nacionalityDescription && (
        <div className={styles.section}>
          <div className={styles.title}>Nacionalidad del Proveedor</div>
          <div className={styles.desc}>{formalization.nacionalityDescription}</div>
        </div>
      )}

      {formalization.representativeDeedNumber && (
        <div className={styles.section}>
          <div className={styles.title}>Datos del Poder del Representante Legal</div>
          <div className={styles.row}>
            <div className={styles.desc}>No. de Escritura</div>
            <p className='bold'>{formalization.representativeDeedNumber}</p>
          </div>

          <div className={styles.row}>
            <div className={styles.desc}>Fecha de la Escritura</div>
            <p className='bold'>{formatDate(formalization.representativeDeedDate, 'dd/MM/yyyy')}</p>
          </div>

          <div className={styles.row}>
            <div className={styles.desc}>No. de Notario</div>
            <p className='bold'>{formalization.representativeNotaryNumber}</p>
          </div>

          <div className={styles.row}>
            <div className={styles.desc}>Ciudad del Notario</div>
            <p className='bold'>{formalization.representativeNotaryCity}</p>
          </div>
        </div>
      )}
    </div>
  );
};
