import styles from './styles.module.scss';

export interface ProcessType {
  title: string;
  description: string;
  severity?: string;
  selected?: boolean;
  hide?: boolean;
}

interface Props extends ProcessType {
  index: number;
  onSelect: Function;
}

export const BtnProcess = ({ title, description, severity, selected, hide, index, onSelect }: Props) => {
  return (
    <div
      className={`${styles.btn} ${selected && styles.selected} ${hide ? styles.hide : ''}`}
      onClick={() => {
        onSelect(index);
      }}
    >
      <div className={`${styles.title} ${severity ? styles[severity] : ''}`}>{title}</div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};
