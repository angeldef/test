import { useContext } from 'react';
import { MenuType } from '../..';
import styles from './styles.module.scss';
import { AuthContext } from '../../../auth';

export type BtnSidebarProps = {
  amount: string | null;
  label: string;
  active?: boolean;
  contraer?: boolean;
  disabled?: boolean;
  menuType?: MenuType;
};

export const BtnSidebar = ({ amount, label, active, contraer, disabled }: BtnSidebarProps) => {
  const { img } = useContext(AuthContext);

  return (
    <div className={`${styles.paperBtn} ${active && styles.active} ${disabled && styles.disabled} ${contraer && styles.contraer}`}>
      <div className={styles.btnInfo}>
        <span>{amount}</span>
        <p>{label}</p>
      </div>
      <img src={img?.house} className={styles.img} />
    </div>
  );
};
