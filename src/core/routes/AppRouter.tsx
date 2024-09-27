import { Routes, Route } from 'react-router-dom';
import { HomeRoutes } from '../../modules/home';
import { PrivateRoute } from './PrivateRoute';
import { AuthPage } from '../../modules/auth';
import {
  ApprovalPurchaseCommittee,
  ApprovalPurchaseOrder,
  ApprovalRequestEthic,
  ApprovalRequestRisk,
  ErrorPage,
  LogoutPage,
} from '../../modules/public';

export const AppRouter = () => {
  return (
    <Routes>
      <Route
        path='/*'
        element={
          <PrivateRoute>
            <HomeRoutes />
          </PrivateRoute>
        }
      />

      <Route path='auth' element={<AuthPage />} />
      <Route path='error' element={<ErrorPage />} />
      <Route path='logout' element={<LogoutPage />} />
      <Route path='approval-request-risk/:id' element={<ApprovalRequestRisk />} />
      <Route path='approval-request-ethic/:id' element={<ApprovalRequestEthic />} />
      <Route path='approval-purchase-committee/:id' element={<ApprovalPurchaseCommittee />} />
      <Route path='approval-purchase-order/:id' element={<ApprovalPurchaseOrder />} />
      <Route path='approvals/:id' element={<ApprovalPurchaseCommittee />} />
    </Routes>
  );
};
