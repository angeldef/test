import { Question } from '../../../types';
import styles from './styles.module.scss';

const removeTags = (text: string) => text.replaceAll('<p>', '').replaceAll('</p>', '').replaceAll('<span>', '').replaceAll('</span>', '');

type Props = {
  conflictsQuestions: Question[];
  considerations: Question[];
};

export const PreregisterDetail = ({ conflictsQuestions, considerations }: Props) => {
  return (
    <>
      {conflictsQuestions?.map((e, key) => {
        return (
          <div className={styles.row} key={key}>
            <div className={styles.question}>
              <div className={styles.title}>{removeTags(e.title)}</div>
              <div className={styles.value}>{e.value}</div>
            </div>
            {e.person?.name && (
              <div className={styles.person}>
                <div className={styles.name}>
                  <i className='far fa-user'></i>
                  <span>{`${e.person?.name ?? ''} ${e.person?.surname ?? ''}`}</span>
                </div>
                <div className={styles.cell}>{e.person?.position}</div>
                <div className={styles.cell}>{e.person?.relationship}</div>
                <div className={styles.cell}>{e.person?.department}</div>
              </div>
            )}
          </div>
        );
      })}

      {considerations?.map((e, key) => {
        return (
          <div key={key} className={styles.row}>
            <div className={styles.question}>
              <div className={styles.title}>{removeTags(e.title)}</div>
              <div className={styles.value}>{e.value}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};
