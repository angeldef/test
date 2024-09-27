import { useContext, useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { AuthContext } from '../../../modules/auth';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import suraLogo from '/src/assets/img/sura-blanco.svg';
import styles from './styles.module.scss';

type Props = {
  hideUser?: boolean;
};

export const GlobalHeader = ({ hideUser }: Props) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogOut = () => {
    setAnchorEl(null);
    logout();
    navigate('/logout', { replace: true });
  };

  return (
    <header className={styles.header}>
      <img
        src={suraLogo}
        className={styles.logo}
        onClick={() => {
          navigate('/principal', { replace: true });
        }}
      />

      {!hideUser && (
        <div className={styles.user}>
          <div className={styles.info}>
            <div className='bold'>Hola!</div>
            <div>{user?.displayName}</div>
          </div>
          <Button onClick={handleClick} endIcon={<KeyboardArrowDownIcon />}>
            <div className={styles.box}>
              <i className='far fa-user text-secondary'></i>
            </div>
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={onLogOut}>Cerrar sesión</MenuItem>
          </Menu>
        </div>
      )}
    </header>
  );
};
