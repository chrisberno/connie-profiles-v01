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
      // Use Twilio Functions SDK to make the request
      // This approach avoids CORS issues by using the Twilio backend
      const functionUrl = 'https://mariadb-7343-test-1234-dev.twil.io/fetch-profile';
      
      // Option 1: Using Twilio's built-in Functions.fetch if available
      if (typeof Twilio !== 'undefined' && Twilio.Functions && Twilio.Functions.fetch) {
        const response = await Twilio.Functions.fetch(
          functionUrl,
          { From: phoneNumber },
          { method: 'GET' }
        );
        
        console.log('Fetch profile response:', response);
        
        manager.store.dispatch({
          type: 'SET_CRM_CONTAINER_CONTENT',
          payload: {
            uri: response.url,
            shouldReload: true
          }
        });
      } 
      // Option 2: Using fetch with mode: 'cors' and credentials
      else {
        const response = await fetch(
          `${functionUrl}?From=${encodeURIComponent(phoneNumber)}`, 
          {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        const data = await response.json();
        console.log('Fetch profile response:', data);
        
        manager.store.dispatch({
          type: 'SET_CRM_CONTAINER_CONTENT',
          payload: {
            uri: data.url,
            shouldReload: true
          }
        });
      }
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
