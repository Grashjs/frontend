import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  styled,
  Typography
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Logo from 'src/components/LogoSign';
import LanguageSwitcher from 'src/layouts/BoxedSidebarLayout/Header/Buttons/LanguageSwitcher';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
    width: 100%;
    display: flex;
    align-items: center;
    height: ${theme.spacing(10)};
`
);

function Overview() {
  const { t }: { t: any } = useTranslation();

  return (
    <Box>
      <Helmet>
        <title>{t('privacy_policy')}</title>
      </Helmet>
      <HeaderWrapper>
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center">
            <Logo />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flex={1}
            >
              <Box />
              <Stack direction="row" spacing={{ xs: 1, md: 2 }}>
                <Box
                  sx={{
                    display: {
                      xs: 'none',
                      sm: 'block'
                    }
                  }}
                >
                  <LanguageSwitcher />
                </Box>
                <Button
                  component={RouterLink}
                  to="/app/work-orders"
                  variant="outlined"
                  sx={{
                    ml: 2,
                    size: { xs: 'small', md: 'medium' }
                  }}
                >
                  {t('login')}
                </Button>
                <Button
                  component={RouterLink}
                  to="/account/register"
                  variant="contained"
                  sx={{
                    ml: 2,
                    size: { xs: 'small', md: 'medium' }
                  }}
                >
                  {t('start_trial')}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </HeaderWrapper>
      <Box sx={{ mx: 10, padding: 2 }}>
        <Typography variant={'h1'}>{t('privacy_policy')}</Typography>
      </Box>
      <Card sx={{ mx: 10, padding: 2 }}>
        <Typography>
          In order to provide you and your employer with personalized workflow
          software solutions (the “Atlas Service”), Atlas Inc. and its
          subsidiaries and affiliates (collectively, “Atlas”) need you to
          provide us with certain Personal Information (defined below) about
          yourself. We take the privacy of this Personal Information very
          seriously. We provide this policy (“Privacy Policy”) so that you can
          understand how we collect Personal Information from you, what Personal
          Information we collect, and how we use the Personal Information you
          provide.
        </Typography>

        <Typography variant="h2" sx={{ my: 2 }}>
          Atlas Privacy principles
        </Typography>
        <Typography>
          Atlas follows these principles in order to protect your privacy:
          <Typography>
            We do not collect any more Personal Information about you than is
            necessary
          </Typography>
          <Typography>
            Unless you agree otherwise, we only use your Personal Information
            for the purposes we specify in this Privacy Policy
          </Typography>
          <Typography>
            We do not keep your Personal Information if it is no longer needed
          </Typography>
          <Typography>
            and Other than as we specify in this Privacy Policy, we do not share
            your Personal Information with third parties.
          </Typography>
        </Typography>
        <Typography variant="h2" sx={{ my: 2 }}>
          What is the Personal Information that we collect and how is it
          collected?
        </Typography>
        <Typography>
          <Typography fontWeight={'bold'}>
            (a) Personal Information provided by you.
          </Typography>{' '}
          We collect Personal Information by asking you questions about yourself
          as an employee, service repair person, or contractor, as well as your
          contact information. We will use this information to create your Atlas
          profile (“Atlas Profile”). You may also provide us with Personal
          Information through any website mobile application provided to you by
          Atlas. In addition to this information, we also collect certain
          Personal Information for administration of the Atlas Service,
          including account credentials and payment information, although please
          note that payment card information is stored and maintained by our
          third-party payment processors.{' '}
          <Typography fontWeight={'bold'}>
            (b) Personal Information automatically collected.
          </Typography>{' '}
          While you use the Atlas Service, we automatically record information
          that your browser sends whenever you visit our website or mobile
          software application. For example, we may receive: the name of the
          domain and host from which you access the Internet, the Internet
          Protocol (IP) address of the computer you are using, the date and time
          you access our Service, and certain device information (e.g., type of
          device, operating system). We use this information to measure the
          usage of our Service, to understand how to serve you better, and to
          assist with our analytics, security, and error handling. For more
          information about the technology we use as part of this automatic
          collection of personal information, please see our Cookie Policy. Most
          web browsers and some mobile operating systems and mobile applications
          include a Do-Not-Track (“DNT”) feature or setting you can activate to
          signal your privacy preference not to have data about your online
          browsing activities monitored and collected. No uniform technology
          standard for recognizing and implementing DNT signals has been
          finalized. As such, we do not currently respond to DNT browser signals
          or any other mechanism that automatically communicates your choice not
          to be tracked online. If a standard for online tracking is adopted
          that we must follow in the future, we will inform you about that
          practice in a revised version of this Privacy Policy.{' '}
          <Typography fontWeight={'bold'}>(c) Outside sources.</Typography> We
          may periodically collect Personal Information about you from business
          partners, contractors, and other third parties. This includes, but is
          not limited to, instances in which you affirmatively authorize those
          third parties to provide us with Personal Information.
        </Typography>
        <Typography variant="h2" sx={{ my: 2 }}>
          With whom do we share Personal Information?
        </Typography>
        <Typography>
          Protecting the privacy and security of your Personal Information is a
          priority at Atlas. EXCEPT AS OTHERWISE DESCRIBED IN THIS PRIVACY
          POLICY, GRASH DOES NOT SELL OR RENT YOUR PERSONAL INFORMATION TO THIRD
          PARTIES.
        </Typography>
        <Typography variant="h2" sx={{ my: 2 }}>
          How do we secure your Personal Information?
        </Typography>
        <Typography>
          We take appropriate security measures, including physical,
          technological, and procedural measures, to help to safeguard your
          Personal Information and to prevent unauthorized access and
          disclosure. In addition, we use industry-standard technology, such as
          edge-protection devices and encryption in the transmission of certain
          sensitive Personal Information, designed to prevent unauthorized
          persons from gaining access to your Personal Information and Atlas
          Profile, and, as technology develops, we intend to take additional
          measures to improve security. No method of transmission over the
          Internet, or method of electronic storage, however, is 100% secure.
          Therefore, we cannot guarantee its absolute security.
        </Typography>
        <Typography variant="h2" sx={{ my: 2 }}>
          What are your rights regarding your Personal Information?
        </Typography>
        <Typography>
          Review, correct, and delete your personal information
        </Typography>
        <Typography>Revoke consent</Typography>
        <Typography>Complain to your local supervisory authority</Typography>
      </Card>
    </Box>
  );
}

export default Overview;
