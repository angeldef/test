import { useEffect, useState } from 'react';
import styles from './styles.module.scss';

type Props = {
  total: number;
  current: number;
  info?: string;
  title?: string;
};

type Step = {
  i: number;
  completed: boolean;
};

const setSteps = (total: number, current: number) => {
  let array = [];
  for (let i = 0; i < total - 1; i++) {
    array.push({ i, completed: i < current - 1 });
  }
  return array;
};

export const StepBar = ({ total, current, info, title }: Props) => {
  const [arraySteps, setArraySteps] = useState([] as Step[]);

  useEffect(() => {
    setArraySteps(setSteps(total, current));
  }, [current]);

  return (
    <>
      <div className={styles.stepBar}>
        <div className={styles.left}>
          <div className={styles.title}>{title ? title : 'ABIERTA'}</div>
          {info && (
            <>
              <div className={styles.dot}></div>
              <div className={styles.info}>{info}</div>
            </>
          )}
        </div>

        <div className={styles.right}>
          <div className={styles.steps}>
            {total && <div className={styles.dot}></div>}

            {arraySteps.map(({ i, completed }) => (
              <div key={i} className={`${styles.step} ${completed ? styles.completed : ''}`}>
                <div className={styles.line}></div>
                <div className={styles.dot}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
