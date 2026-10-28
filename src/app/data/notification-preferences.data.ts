
import { NotificationPreferenceGroup } from '../models/notification-preference.model';

export const NOTIFICATION_PREFERENCE_GROUPS: NotificationPreferenceGroup[] = [
  {
    id: 'email',
    title: 'Email Updates',
    description: 'Choose which updates are sent by email.',
    preferences: [
      {
        id: 'newsletter',
        title: 'Product Updates',
        description: 'News, product updates and important changes.',
        icon: 'article',
        enabled: true
      },
      {
        id: 'daily-summary',
        title: 'Daily Inventory Summary',
        description: 'Daily stock levels and inventory activity.',
        icon: 'chart-bar',
        enabled: false
      }
    ]
  },
  {
    id: 'inventory',
    title: 'Inventory Alerts',
    description: 'Alerts about stock and inventory conditions.',
    preferences: [
      {
        id: 'low-stock',
        title: 'Low Stock Alerts',
        description: 'Inventory falls below its minimum threshold.',
        icon: 'package',
        enabled: true
      },
      {
        id: 'expiry-alerts',
        title: 'Expiry Alerts',
        description: 'Tracked lots or batches are approaching expiry.',
        icon: 'calendar-due',
        enabled: true
      }
    ]
  },
  {
    id: 'warehouse-operations',
    title: 'Warehouse Operations',
    description: 'Updates triggered by warehouse workflows.',
    preferences: [
      {
        id: 'receiving-updates',
        title: 'Receiving Updates',
        description: 'Inbound receipts are completed or have exceptions.',
        icon: 'package-import',
        enabled: true
      },
      {
        id: 'putaway-updates',
        title: 'Put-away Updates',
        description: 'Put-away tasks are completed or fail.',
        icon: 'package',
        enabled: true
      },
      {
        id: 'order-picking-updates',
        title: 'Picking & Packing Updates',
        description: 'Orders are picked, packed or ready to dispatch.',
        icon: 'clipboard-list',
        enabled: true
      },
      {
        id: 'stock-transfer-updates',
        title: 'Stock Transfer Updates',
        description: 'Transfers are dispatched, received or completed.',
        icon: 'arrows-exchange',
        enabled: true
      },
      {
        id: 'operational-exceptions',
        title: 'Operational Exceptions',
        description: 'Short picks, failed put-away or stock discrepancies.',
        icon: 'alert-triangle',
        enabled: true
      },
      {
        id: 'adjustment-approvals',
        title: 'Adjustment Approvals',
        description: 'Stock adjustment requests need review.',
        icon: 'clipboard-check',
        enabled: true
      }
    ]
  },
  {
    id: 'account',
    title: 'Account Security',
    description: 'Important notices about account access.',
    preferences: [
      {
        id: 'security-alerts',
        title: 'Security Alerts',
        description: 'Sign-in and account security notifications.',
        icon: 'shield-check',
        enabled: true
      }
    ]
  }
];
