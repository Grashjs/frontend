import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MultipleTabsLayout from '../components/MultipleTabsLayout';
import { TitleContext } from '../../../contexts/TitleContext';
import { useLocation } from 'react-router-dom';
import People from './People';
import Teams from './Teams';
import useAuth from '../../../hooks/useAuth';
import { PermissionEntity } from '../../../models/owns/role';
import PermissionErrorMessage from '../components/PermissionErrorMessage';

interface PropsType {}

const PeopleAndTeams = ({}: PropsType) => {
  const { t }: { t: any } = useTranslation();

  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const { setTitle } = useContext(TitleContext);
  const location = useLocation();
  const { hasViewPermission } = useAuth();

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  useEffect(() => {
    setTitle(t('People & Teams'));
  }, []);

  let regex = /(\/app\/people-teams\/teams)(\/.*)?$/;
  const tabIndex = regex.test(location.pathname) ? 1 : 0;

  const tabs = [
    { value: '', label: t('People') },
    { value: 'teams', label: t('Teams') }
  ];

  if (hasViewPermission(PermissionEntity.PEOPLE_AND_TEAMS))
    return (
      <MultipleTabsLayout
        basePath="/app/people-teams"
        tabs={tabs}
        tabIndex={tabIndex}
        title={'People & Teams'}
        action={handleOpenAddModal}
        actionTitle={t(`${tabs[tabIndex].label}`)}
      >
        {tabIndex === 0 ? (
          <People
            openModal={openAddModal}
            handleCloseModal={handleCloseAddModal}
          />
        ) : (
          <Teams
            openModal={openAddModal}
            handleCloseModal={handleCloseAddModal}
          />
        )}
      </MultipleTabsLayout>
    );
  else
    return (
      <PermissionErrorMessage
        message={
          "You don't have access to People And Teams. Please contact your administrator if you should have access"
        }
      />
    );
};

export default PeopleAndTeams;
