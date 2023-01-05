import { Helmet } from 'react-helmet-async';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';
import { TitleContext } from '../../../../../contexts/TitleContext';
import Overview from './Overview';
import WOByPrimaryUser from './WOByPrimaryUser';
import Costs from './Costs';
import { Filter } from '../WOModal';
import WOByPriority from './WOByPriority';
import WOByCompletedBy from './WOByCompletedBy';
import WOByCategory from './WOByCategory';
import TimeByWeek from './TimeByWeek';
import WOByWeek from './WOByWeek';

interface WOStatusStatsProps {
  handleOpenWOModal: (
    columns: string[],
    filters: Filter[],
    title: string
  ) => void;
}
function WOStatusStats({ handleOpenWOModal }: WOStatusStatsProps) {
  const { t }: { t: any } = useTranslation();
  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle(t('Work Order Analysis'));
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('Work Order Analysis')}</title>
      </Helmet>
      <Grid
        container
        justifyContent="center"
        alignItems="stretch"
        spacing={1}
        my={2}
        paddingX={1}
      >
        <Grid item xs={12} md={12}>
          <Overview handleOpenModal={handleOpenWOModal} />
        </Grid>
        <Grid item xs={12} md={6}>
          <WOByPrimaryUser handleOpenModal={handleOpenWOModal} />
        </Grid>
        <Grid item xs={12} md={6}>
          <WOByCompletedBy handleOpenModal={handleOpenWOModal} />
        </Grid>
        <Grid item xs={12} md={6}>
          <WOByPriority handleOpenModal={handleOpenWOModal} />
        </Grid>
        <Grid item xs={12} md={6}>
          <WOByCategory handleOpenModal={handleOpenWOModal} />
        </Grid>
        <Grid item xs={12} md={6}>
          <WOByWeek handleOpenModal={handleOpenWOModal} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TimeByWeek handleOpenModal={handleOpenWOModal} />
        </Grid>
        <Grid item xs={12} md={12}>
          <Costs handleOpenModal={handleOpenWOModal} />
        </Grid>
      </Grid>
    </>
  );
}

export default WOStatusStats;
