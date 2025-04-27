import { FlexPlugin } from '@twilio/flex-plugin';

const PLUGIN_NAME = 'MariadbFetchProfilePlugin';

export default class MariadbFetchProfilePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(flex, manager) {
    manager.workerClient.on('reservationCreated', (reservation) => {
      const task = reservation.task;
      if (task.taskChannelUniqueName === 'voice') {
        const phoneNumber = task.attributes.from || '';
        const normalizedPhoneNumber = phoneNumber.replace(/[^+\d]/g, '');
        if (normalizedPhoneNumber) {
          this.fetchAndUpdateCrm(flex, task, normalizedPhoneNumber);
        } else {
          console.warn('No phone number found in task attributes:', task.attributes);
          flex.CRMContainer.setContent('crm-container', {
            uri: 'https://connie-profiles-v01.vercel.app/search',
            shouldReload: true
          });
        }
      }
    });
  }

  async fetchAndUpdateCrm(flex, task, phoneNumber) {
    try {
      const functionUrl = 'https://mariadb-7343-test-1234-dev.twil.io/fetch-profile'; // Update with your actual Function URL
      const response = await fetch(`${functionUrl}?From=${encodeURIComponent(phoneNumber)}`);
      const data = await response.json();

      console.log('Fetch profile response:', data);

      // Update the CRM container (right sidebar) with the URL
      flex.CRMContainer.setContent('crm-container', {
        uri: data.url,
        shouldReload: true
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      flex.CRMContainer.setContent('crm-container', {
        uri: 'https://connie-profiles-v01.vercel.app/search',
        shouldReload: true
      });
    }
  }
}

