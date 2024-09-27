import { useLocation } from 'react-router-dom';
import styles from './styles.module.scss';
import { useContext } from 'react';
import { AuthContext } from '../../auth';

export const ErrorPage = () => {
  const { state } = useLocation();
  const { img } = useContext(AuthContext);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.centered}>
          <div className={styles.col}>
            <div className={styles.title}>Algo salió mal...</div>
            <p>{state}</p>
          </div>
          <div className={styles.col}>
            <img src={img?.clouds} className={styles.img} />
          </div>
        </div>
      </div>
    </>
  );
};
