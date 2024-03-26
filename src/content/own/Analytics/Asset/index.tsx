import AnalyticsLayout from '../AnalyticsLayout';
import WOModal, { Filter } from './WOModal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Reliability from './Reliability';
import AssetCost from './Cost';
import UsefulLife from './UsefulLife';

export default function Index() {
  const { t }: { t: any } = useTranslation();
  const [woModalTitle, setWoModalTitle] = useState<string>(t('work_orders'));
  const [openWOModal, setOpenWOModal] = useState<boolean>(false);
  const [columns, setColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const handleOpenWOModal = (
    columns: string[],
    filters: Filter[],
    title: string
  ) => {
    return;// TODO
    setColumns(columns);
    setFilters(filters);
    setWoModalTitle(title);
    setOpenWOModal(true);
  };
  const renderComponent = () => {
    const arr = location.pathname.split('/');
    switch (arr[arr.length - 1]) {
      case 'reliability':
        return <Reliability handleOpenWOModal={handleOpenWOModal} />;
      case 'cost':
        return <AssetCost handleOpenWOModal={handleOpenWOModal} />;
      case 'useful-life':
        return <UsefulLife handleOpenWOModal={handleOpenWOModal} />;
      default:
        return null;
    }
  };
  return (
    <AnalyticsLayout>
      {renderComponent()}
      <WOModal
        title={woModalTitle}
        open={openWOModal}
        onClose={() => setOpenWOModal(false)}
        columns={columns}
        filters={filters}
      />
    </AnalyticsLayout>
  );
}
