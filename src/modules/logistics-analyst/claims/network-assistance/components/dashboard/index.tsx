import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const DashboardNetworkAssistance = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/principal', { replace: true });
  }, []);

  return <div>DashboardNetworkAssistance</div>;
};
