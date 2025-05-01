//This is the original version of the Connie profiles plugin & is meant to stand alone as it does not integrate with the Enhanced CRMcontainer.
// see line 41 below ..
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
          this.fetchAndUpdateCrm(flex, manager, task, normalizedPhoneNumber);
        } else {
          console.warn('No phone number found in task attributes:', task.attributes);
          manager.store.dispatch({
            type: 'SET_CRM_CONTAINER_CONTENT',
            payload: {
              uri: 'https://connie-profiles-v01.vercel.app/search',
              shouldReload: true
            }
          });
        }
      }
    });
  }

  async fetchAndUpdateCrm(flex, manager, task, phoneNumber) {
    try {
      const functionUrl = 'https://mariadb-7343.twil.io/fetch-profile'; // Updated URL
      const response = await fetch(`${functionUrl}?From=${encodeURIComponent(phoneNumber)}`);
      const data = await response.json();

      console.log('Fetch profile response:', data);

// Here the plugin overrides the CRM Container with task related URL ..
      manager.store.dispatch({
        type: 'SET_CRM_CONTAINER_CONTENT',
        payload: {
          uri: data.url,
          shouldReload: true
        }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      manager.store.dispatch({
        type: 'SET_CRM_CONTAINER_CONTENT',
        payload: {
          uri: 'https://connie-profiles-v01.vercel.app/search',
          shouldReload: true
        }
      });
    }
  }
}