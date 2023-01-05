import { PlanFeature } from '../../../models/owns/subscriptionPlan';
import { PermissionEntity } from '../../../models/owns/role';
import useAuth from '../../../hooks/useAuth';
import PermissionErrorMessage from '../components/PermissionErrorMessage';
import FeatureErrorMessage from '../components/FeatureErrorMessage';

export default function AnalyticsLayout(props) {
  const { children } = props;
  const { hasViewPermission, hasFeature } = useAuth();

  if (hasFeature(PlanFeature.ANALYTICS)) {
    if (hasViewPermission(PermissionEntity.ANALYTICS)) {
      return children;
    } else
      return (
        <PermissionErrorMessage
          message={
            "You don't have access to Analytics. Please contact your administrator if you should have access"
          }
        />
      );
  } else return <FeatureErrorMessage message={'Upgrade to see Analytics...'} />;
}
