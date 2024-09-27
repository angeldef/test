import suraLogo from '/src/assets/img/sura.svg';
import styles from './styles.module.scss';

export const GlobalFooter = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.row}>
        <img src={suraLogo} className={styles.logo} />

        <div className={styles.info}>
          <div className={styles.item}>
            <p>Correo electrónico</p>
            <p className='bold'>surateescucha@seguros.com.mx</p>
          </div>
          <div className={styles.item}>
            <p>Dudas sobre tus seguros</p>
            <p className='bold'>55 5733 7999</p>
          </div>
          <div className={styles.item}>
            <p>Política de</p>

            <p className='bold'>
              <a href='https://www.segurossura.com.mx/legales/aviso-de-privacidad' target='_blank'>
                Privacidad de los datos
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.social}>
        <div className={styles.copyRight}>2023 SEGUROS SURA SS DE CV TODOS LOS DERECHOS RESERVADOS</div>
        <div className={styles.nets}>
          <a href='https://twitter.com/SegurosSURA_MX' target='_blank'>
            <i className='fab fa-twitter'></i>
          </a>
          <a href='https://www.linkedin.com/company/aforesura' target='_blank'>
            <i className='fab fa-linkedin'></i>
          </a>
          <a href='https://www.youtube.com/channel/UCXm_a8qOYWL4oYnzHcoeWlw' target='_blank'>
            <i className='fab fa-youtube'></i>
          </a>
          <a href='https://www.instagram.com/segurossuramx' target='_blank'>
            <i className='fab fa-instagram'></i>
          </a>
          <a href='https://www.facebook.com/SegurosSURAMexico' target='_blank'>
            <i className='fab fa-facebook'></i>
          </a>
        </div>
      </div>

      <div className={`${styles.ellipsis} ${styles.left}`}>
        <i className='fas fa-ellipsis-v'></i>
        <i className='fas fa-ellipsis-v'></i>
      </div>

      <div className={`${styles.ellipsis} ${styles.right}`}>
        <i className='fas fa-ellipsis-v'></i>
        <i className='fas fa-ellipsis-v'></i>
      </div>
    </div>
  );
};
