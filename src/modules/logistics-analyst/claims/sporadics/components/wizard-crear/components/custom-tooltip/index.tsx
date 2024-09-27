import { useState } from 'react';
import styles from './styles.module.scss';

type Props = {
  content?: string;
};

export const CustomTooltip = ({ content }: Props) => {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.wrapper}>
      <i
        className='fas fa-question-circle'
        style={{ color: '#8b92b1', marginLeft: '4px', cursor: 'pointer', fontSize: '14px' }}
        onMouseEnter={() => {
          setShow(true);
        }}
        onMouseLeave={() => {
          setShow(false);
        }}
      ></i>

      <div className={`${styles.tooltip} ${show && styles.show}`}>
        <div dangerouslySetInnerHTML={{ __html: content! }} />
      </div>
    </div>
  );
};
