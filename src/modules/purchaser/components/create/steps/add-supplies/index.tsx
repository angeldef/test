import { FormComponentType } from '@/core/types/FormComponentType';
import { useRef } from 'react';
import { FormBuilder } from './form-builder';
import { SideBar } from '../../side-bar';
import { SuppliersResponse } from '../select-supplier/form-builder/types';
import { Wizard } from '../../types';
import styles from './styles.module.scss';

type Props = {
  components: FormComponentType[];
  next: Function;
  back: Function;
  supplierInfo: SuppliersResponse;
  wizard: Wizard;
  updateWizard: Function;
};

export const AddSupplies = ({ components, next, supplierInfo, back, wizard, updateWizard }: Props) => {
  const ref = useRef<any>();

  const wizardProps = {
    next,
    back,
    wizard,
    updateWizard,
  };

  return (
    <>
      <div className={styles.layout}>
        <div className={styles.left}>
          <SideBar supplierInfo={supplierInfo} wizard={wizard} />
        </div>
        <div className={styles.right}>
          <FormBuilder ref={ref} components={components ?? []} {...wizardProps} />
          <div
            className={styles.draft}
            onClick={() => {
              ref.current.saveDraft();
            }}
          >
            <i className='far fa-save'></i>
          </div>
        </div>
      </div>
    </>
  );
};
