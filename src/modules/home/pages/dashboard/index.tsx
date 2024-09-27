import { useContext, useEffect, useState } from 'react';
import { GlobalFooter, GlobalHeader } from '../../../../core/components';
import { useNavigate } from 'react-router-dom';
import { ModuleCard } from '../../components/module-card';
import { AuthContext } from '@/modules/auth';
import { Module, Submodule } from '@/modules/auth/context/types';
import styles from './styles.module.scss';

export const DashboardPage = () => {
  const navigate = useNavigate();

  const [currentMenu, setCurrentMenu] = useState<Module[] | Submodule[]>([]);
  const { user } = useContext(AuthContext);
  const { modules } = user ?? {};

  const onCardClick = (module: Module) => {
    const { url, submodules } = module;
    if (url) {
      navigate(url, { replace: true });
      return;
    }
    setCurrentMenu(submodules);
  };

  useEffect(() => {
    setCurrentMenu(modules ?? []);
  }, []);

  return (
    <div className='container'>
      <div className='header'>
        <GlobalHeader />
      </div>

      <div className='main'>
        <div className={styles.cards}>
          {currentMenu?.map((menu) => (
            <ModuleCard key={menu.key} module={menu} onCardClick={onCardClick} />
          ))}
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
};
