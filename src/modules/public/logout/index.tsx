import { useContext } from 'react';
import styles from './styles.module.scss';
import { AuthContext } from '../../auth';

export const LogoutPage = () => {
  const { img } = useContext(AuthContext);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.centered}>
          <div className={styles.col}>
            <div className={styles.title}>Cierre de sesión</div>
            <p> Su sesión ha cerrado exitosamente. Puede cerrar la ventana. </p>
          </div>
          <div className={styles.col}>
            <img src={img?.logout} className={styles.img} />
          </div>
        </div>
      </div>
    </>
  );
};
