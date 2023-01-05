import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Form from '../components/form';
import * as Yup from 'yup';
import { IField } from '../type';
import { formatSelect } from '../../../utils/formatters';
import { useDispatch } from '../../../store';
import { createLabor } from '../../../slices/labor';
import useAuth from '../../../hooks/useAuth';
import FeatureErrorMessage from '../components/FeatureErrorMessage';
import { PlanFeature } from '../../../models/owns/subscriptionPlan';

interface AddTimeProps {
  open: boolean;
  onClose: () => void;
  workOrderId: number;
}
export default function AddTimeModal({
  open,
  onClose,
  workOrderId
}: AddTimeProps) {
  const { t }: { t: any } = useTranslation();
  const dispatch = useDispatch();
  const { hasFeature } = useAuth();
  const fields: Array<IField> = [
    {
      name: 'assignedTo',
      type: 'select',
      label: t('Assigned To'),
      type2: 'user',
      midWidth: true
    },
    {
      name: 'hourlyRate',
      type: 'number',
      label: t('Hourly Rate'),
      midWidth: true
    },
    {
      name: 'includeToTotalTime',
      type: 'switch',
      label: t('Include this time in the total time'),
      helperText: t(
        'This will add the duration to the total time spent on the Work Order'
      )
    },
    {
      name: 'startedAt',
      type: 'date',
      label: t('Work Started At')
    },
    {
      name: 'timeCategory',
      type: 'select',
      label: t('Category'),
      type2: 'category',
      category: 'time-categories'
    },
    {
      name: 'duration',
      type: 'titleGroupField',
      label: t('Duration')
    },
    {
      name: 'hours',
      type: 'number',
      label: t('Hours'),
      midWidth: true,
      required: true
    },
    {
      name: 'minutes',
      type: 'number',
      label: t('Minutes'),
      midWidth: true,
      required: true
    }
  ];
  const shape = {
    hours: Yup.number().required(t('Hours field is required')),
    minutes: Yup.number().required(t('Minutes field is required'))
  };
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          p: 3
        }}
      >
        <Typography variant="h4" gutterBottom>
          {t('Add Time')}
        </Typography>
        <Typography variant="subtitle2">
          {t('Fill in the fields below to create and add Time')}
        </Typography>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          p: 3
        }}
      >
        {hasFeature(PlanFeature.ADDITIONAL_TIME) ? (
          <Form
            fields={fields}
            validation={Yup.object().shape(shape)}
            submitText={t('Add')}
            values={{ includeToTotalTime: true }}
            onChange={({ field, e }) => {}}
            onSubmit={async (values) => {
              const formattedValues = { ...values };
              formattedValues.assignedTo = formatSelect(
                formattedValues.assignedTo
              );
              formattedValues.timeCategory = formatSelect(
                formattedValues.timeCategory
              );
              formattedValues.duration =
                values.hours * 3600 + values.minutes * 60;
              return dispatch(
                createLabor(workOrderId, formattedValues)
              ).finally(() => onClose());
            }}
          />
        ) : (
          <FeatureErrorMessage message="Upgrade to add Itemized time tracking to your Work Orders. " />
        )}
      </DialogContent>
    </Dialog>
  );
}
