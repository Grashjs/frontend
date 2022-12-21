import { Box, Button, Card, Container, styled } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Logo from 'src/components/LogoSign';
import Hero from './Hero';
import Highlights from './Highlights';
import LanguageSwitcher from 'src/layouts/BoxedSidebarLayout/Header/Buttons/LanguageSwitcher';
import { wso2AuthUrl } from '../../config';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
    width: 100%;
    display: flex;
    align-items: center;
    height: ${theme.spacing(10)};
    margin-bottom: ${theme.spacing(10)};
`
);

const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`
);

function Overview() {
  const { t }: { t: any } = useTranslation();
  const navigate = useNavigate();

  return (
    <OverviewWrapper>
      <Helmet>
        <title>Grash</title>
      </Helmet>
      <HeaderWrapper>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center">
            <Logo />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flex={1}
            >
              <Box />
              <Box>
                <LanguageSwitcher />
                <Button
                  component={RouterLink}
                  to="/extended-sidebar/dashboards"
                  variant="outlined"
                  sx={{
                    ml: 2
                  }}
                >
                  {t('Log In')}
                </Button>
                <Button
                  onClick={() => {
                    window.location.href = wso2AuthUrl;
                  }}
                  variant="contained"
                  sx={{
                    ml: 2
                  }}
                >
                  {t('Start a Free Trial')}
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </HeaderWrapper>
      <Hero />
      <Highlights />
    </OverviewWrapper>
  );
}

export default Overview;
