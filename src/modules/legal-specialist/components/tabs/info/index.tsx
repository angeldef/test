import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { Question } from '../../types';
import { PreregisterDetail } from './preregister';
import { RF1Detail } from './rf1';
import { RF1 } from './types';
import { FormalizationDetail } from '@/modules/negociaciones/components/applications/detail/tabs/info/formalization';
import { Formalization } from '@/modules/negociaciones/components/applications/detail/tabs/info/types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from './styles.module.scss';

type Props = {
  conflictsQuestions: Question[];
  considerations: Question[];
  rf1: RF1 | undefined;
  personType?: string;
  formalization: Formalization | undefined;
};

export const InfoTab = (props: Props) => {
  const { rf1, personType, formalization } = props;

  return (
    <div className={styles.accordions}>
      <Accordion>
        <AccordionSummary
          sx={{
            backgroundColor: '#8B92B1',
            borderTopRightRadius: '9px',
            borderTopLeftRadius: '9px',
            padding: '25px 10px',
          }}
          expandIcon={<ExpandMoreIcon />}
        >
          <div className={styles.subtitle}>Pre registro</div>
        </AccordionSummary>
        <AccordionDetails>
          <PreregisterDetail {...props} />
        </AccordionDetails>
      </Accordion>

      {rf1 && (
        <Accordion>
          <AccordionSummary
            sx={{
              backgroundColor: '#8B92B1',
              borderTopRightRadius: '9px',
              borderTopLeftRadius: '9px',
              padding: '25px 10px',
            }}
            expandIcon={<ExpandMoreIcon />}
          >
            <div className={styles.subtitle}>Registro</div>
          </AccordionSummary>
          <AccordionDetails>
            <RF1Detail rf1={rf1} personType={personType} />
          </AccordionDetails>
        </Accordion>
      )}

      {formalization && (
        <Accordion>
          <AccordionSummary
            sx={{
              backgroundColor: '#8B92B1',
              borderTopRightRadius: '9px',
              borderTopLeftRadius: '9px',
              padding: '25px 10px',
            }}
            expandIcon={<ExpandMoreIcon />}
          >
            <div className={styles.subtitle}>Formalización</div>
          </AccordionSummary>
          <AccordionDetails>
            <FormalizationDetail formalization={formalization} />
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  );
};
