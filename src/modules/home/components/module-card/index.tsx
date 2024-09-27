import { Module, Submodule } from '@/modules/auth/context/types';
import styles from './styles.module.scss';

type Props = {
  module: Module | Submodule;
  onCardClick: Function;
};

export const ModuleCard = ({ module, onCardClick }: Props) => {
  return (
    <div
      className={styles.card}
      onClick={() => {
        onCardClick(module);
      }}
    >
      <img src={module.img} className={styles.img} />
      <div className={styles.title}>{module.title}</div>
      <div className={styles.info}>{module.text}</div>
    </div>
  );
};
