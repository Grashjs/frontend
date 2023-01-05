import { Helmet } from 'react-helmet-async';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';
import { TitleContext } from '../../../../../contexts/TitleContext';
import Overview from './Overview';
import WOStatusPie from './WOStatusPie';
import IncompleteWO from './IncompleteWO';
import HoursWorked from './HoursWorked';
import { Filter } from '../WOModal';

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
    setTitle(t('Status Report'));
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('Status Report')}</title>
      </Helmet>
      <Grid
        container
        justifyContent="center"
        alignItems="stretch"
        spacing={1}
        my={2}
        paddingX={1}
      >
        <Grid item xs={12} md={6}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12}>
              <Overview handleOpenModal={handleOpenWOModal} />
            </Grid>
            <Grid item xs={12} md={12}>
              <WOStatusPie handleOpenModal={handleOpenWOModal} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <IncompleteWO handleOpenModal={handleOpenWOModal} />
        </Grid>
        <Grid item xs={12} md={12}>
          <HoursWorked handleOpenModal={handleOpenWOModal} />
        </Grid>
      </Grid>
    </>
  );
}

export default WOStatusStats;
