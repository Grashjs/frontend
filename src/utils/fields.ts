import { WorkOrderBase } from 'src/models/owns/workOrderBase';
import { getPriorityLabel } from './formatters';
import { isUser } from '../models/owns/worker';

export const getWOBaseFields = (t: any) => {
  return [
    {
      name: 'title',
      type: 'text',
      label: t('Title'),
      placeholder: t('Enter Request Title'),
      required: true
    },
    {
      name: 'description',
      type: 'text',
      label: t('Description'),
      placeholder: t('Description'),
      multiple: true
    },
    {
      name: 'priority',
      type: 'select',
      type2: 'priority',
      label: t('Priority'),
      placeholder: t('Priority')
    },
    {
      name: 'dueDate',
      type: 'date',
      label: t('Due Date')
    },
    {
      name: 'category',
      type: 'select',
      label: t('Category'),
      type2: 'category',
      category: 'work-order-categories'
    },
    {
      name: 'location',
      type: 'select',
      type2: 'location',
      label: 'Location',
      placeholder: 'Select location'
    },
    {
      name: 'asset',
      type: 'select',
      type2: 'asset',
      label: t('Asset'),
      placeholder: 'Select Asset',
      required: true
    },
    {
      name: 'primaryUser',
      type: 'select',
      label: t('Primary Worker'),
      type2: 'user'
    },
    {
      name: 'team',
      type: 'select',
      type2: 'team',
      label: 'Team',
      placeholder: 'Select team'
    },
    {
      name: 'image',
      type: 'file',
      fileType: 'image',
      label: t('Image')
    },
    {
      name: 'files',
      type: 'file',
      multiple: true,
      label: t('Files'),
      fileType: 'file'
    }
  ] as const;
};

export const getWOBaseValues = <T extends WorkOrderBase>(t: any, entity: T) => {
  return {
    priority: entity?.priority
      ? {
          label: getPriorityLabel(entity?.priority, t),
          value: entity?.priority
        }
      : null,
    category: entity?.category
      ? {
          label: entity?.category?.name,
          value: entity?.category?.id
        }
      : null,
    primaryUser: entity?.primaryUser
      ? {
          label: isUser(entity.primaryUser)
            ? `${entity.primaryUser.firstName} ${entity.primaryUser.lastName}`
            : entity.primaryUser.name,
          value: entity.primaryUser.id.toString()
        }
      : null,
    assignedTo: entity?.assignedTo.map((worker) => {
      return {
        label: isUser(worker)
          ? `${worker.firstName} ${worker.lastName}`
          : worker.name,
        value: worker.id.toString()
      };
    }),
    team: entity?.team
      ? {
          label: entity.team?.name,
          value: entity.team?.id.toString()
        }
      : null,
    location: entity?.location
      ? {
          label: entity.location.name,
          value: entity.location.id.toString()
        }
      : null,
    asset: entity?.asset
      ? {
          label: entity.asset?.name,
          value: entity.asset?.id.toString()
        }
      : null
  };
};
