import { RevisionHistory } from '..';
import { useStateColor } from '@/core/hooks';
import { format } from 'date-fns';
import styles from './styles.module.scss';

export const BtnHistory = ({ status, createdAt, reasonReturned }: RevisionHistory) => {
  const formattedDate = createdAt.includes(' ') ? createdAt : format(new Date(createdAt), 'dd/MM/yyyy HH:mm:ss');
  const { getColor } = useStateColor();

  return (
    <div className={styles.btn}>
      <div className={styles.status} style={{ color: getColor(status) }}>
        {status}
      </div>
      <div className={styles.right}>
        <div className={styles.createdAt}>{formattedDate}</div>
        <div>{reasonReturned}</div>
      </div>
    </div>
  );
};
