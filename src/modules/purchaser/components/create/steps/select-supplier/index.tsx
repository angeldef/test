import { FormComponentType } from '@/core/types/FormComponentType';
import { useRef } from 'react';
import { FormBuilder } from './form-builder';
import { useNavigate } from 'react-router-dom';
import { Wizard } from '../../types';
import styles from './styles.module.scss';

type Props = {
  components: FormComponentType[];
  next: Function;
  setSupplierInfo: Function;
  wizard: Wizard;
  updateWizard: Function;
};

export const SelectSupplier = ({ components, next, setSupplierInfo, wizard, updateWizard }: Props) => {
  const ref = useRef<any>();
  const navigate = useNavigate();

  const back = () => {
    navigate('/orden-compra', { replace: true });
  };

  const wizardProps = {
    next,
    back,
    wizard,
    updateWizard,
  };

  return (
    <>
      <FormBuilder ref={ref} components={components ?? []} setSupplierInfo={setSupplierInfo} {...wizardProps} />
    </>
  );
};
