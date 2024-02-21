import { useRef, useState } from 'react';

import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  styled,
  Tooltip,
  Typography
} from '@mui/material';
import internationalization from 'src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import { AE, CN, DE, ES, FR, US, TR } from 'country-flag-icons/react/3x2';

const SectionHeading = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
        padding: ${theme.spacing(2, 2, 0)};
`
);

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
        width: ${theme.spacing(6)};
        height: ${theme.spacing(6)};

        svg {
          width: 28px;
        }
`
);

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { t }: { t: any } = useTranslation();
  const getLanguage = i18n.language;

  const switchLanguage = ({ lng }: { lng: any }) => {
    internationalization.changeLanguage(lng);
  };
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip arrow title={t('Language Switcher')}>
        <IconButtonWrapper color="secondary" ref={ref} onClick={handleOpen}>
          {getLanguage === 'fr' && <FR title="French" />}
          {getLanguage === 'en' && <US title="English" />}
          {getLanguage === 'de' && <DE title="German" />}
          {getLanguage === 'en-US' && <US title="English" />}
          {getLanguage === 'en-GB' && <US title="English" />}
          {getLanguage === 'es' && <ES title="Spanish" />}
          {getLanguage === 'cn' && <CN title="Chinese" />}
          {getLanguage === 'ae' && <AE title="Arabic" />}
          {getLanguage === 'tr' && <TR title="Turkish" />}
        </IconButtonWrapper>
      </Tooltip>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Box
          sx={{
            maxWidth: 240
          }}
        >
          <SectionHeading variant="body2" color="text.primary">
            {t('Language Switcher')}
          </SectionHeading>
          <List
            sx={{
              p: 2,
              svg: {
                width: 26,
                mr: 1
              }
            }}
            component="nav"
          >
            <ListItem
              className={getLanguage === 'fr' ? 'active' : ''}
              button
              onClick={() => {
                switchLanguage({ lng: 'fr' });
                handleClose();
              }}
            >
              <FR title="French" />
              <ListItemText
                sx={{
                  pl: 1
                }}
                primary="French"
              />
            </ListItem>
            <ListItem
              className={
                getLanguage === 'en' || getLanguage === 'en-US' ? 'active' : ''
              }
              button
              onClick={() => {
                switchLanguage({ lng: 'en' });
                handleClose();
              }}
            >
              <US title="English" />
              <ListItemText
                sx={{
                  pl: 1
                }}
                primary="English"
              />
            </ListItem>
            <ListItem
              className={
                getLanguage === 'tr' || getLanguage === 'tr' ? 'active' : ''
              }
              button
              onClick={() => {
                switchLanguage({ lng: 'tr' });
                handleClose();
              }}
            >
              <TR title="Turkish" />
              <ListItemText
                sx={{
                  pl: 1
                }}
                primary="Turkish"
              />
            </ListItem>
            {/* <ListItem
              className={getLanguage === 'de' ? 'active' : ''}
              button
              onClick={() => {
                switchLanguage({ lng: 'de' });
                handleClose();
              }}
            >
              <DE title="German" />
              <ListItemText
                sx={{
                  pl: 1
                }}
                primary="German"
              />
            </ListItem>
            <ListItem
              className={getLanguage === 'es' ? 'active' : ''}
              button
              onClick={() => {
                switchLanguage({ lng: 'es' });
                handleClose();
              }}
            >
              <ES title="Spanish" />
              <ListItemText
                sx={{
                  pl: 1
                }}
                primary="Spanish"
              />
            </ListItem>
            <ListItem
              className={getLanguage === 'cn' ? 'active' : ''}
              button
              onClick={() => {
                switchLanguage({ lng: 'cn' });
                handleClose();
              }}
            >
              <CN title="Chinese" />
              <ListItemText
                sx={{
                  pl: 1
                }}
                primary="Chinese"
              />
            </ListItem>
            <ListItem
              className={getLanguage === 'ae' ? 'active' : ''}
              button
              onClick={() => {
                switchLanguage({ lng: 'ae' });
                handleClose();
              }}
            >
              <AE title="Arabic" />
              <ListItemText
                sx={{
                  pl: 1
                }}
                primary="Arabic"
              />
            </ListItem>*/}
          </List>
        </Box>
      </Popover>
    </>
  );
}

export default LanguageSwitcher;
