import { Card, Stack, Tooltip as TooltipMUI, Typography } from '@mui/material';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';

interface AnalyticsCardProps {
  children: ReactNode;
  title: string;
  description?: string;
  height?: number;
}
export default function AnalyticsCard({
  children,
  title,
  description,
  height
}: AnalyticsCardProps) {
  const { t }: { t: any } = useTranslation();

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
        height
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="h4" textAlign="center">
          {t(title)}
        </Typography>
        {description && (
          <TooltipMUI title={t(description)}>
            <InfoTwoToneIcon />
          </TooltipMUI>
        )}
      </Stack>
      {children}
    </Card>
  );
}
