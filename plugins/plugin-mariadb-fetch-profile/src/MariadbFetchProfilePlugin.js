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
      // Use the new proxy endpoint
      const proxyUrl = 'https://mariadb-7343-test-1234-dev.twil.io/profile-proxy';
      
      // Use Twilio's built-in client if available
      if (typeof Twilio !== 'undefined' && Twilio.Functions && Twilio.Functions.fetch) {
        console.log('Using Twilio.Functions.fetch with phone number:', phoneNumber);
        
        const response = await Twilio.Functions.fetch(
          proxyUrl,
          { From: phoneNumber },
          { method: 'GET' }
        );
        
        console.log('Proxy response via Twilio.Functions:', response);
        
        if (response && response.url) {
          manager.store.dispatch({
            type: 'SET_CRM_CONTAINER_CONTENT',
            payload: {
              uri: response.url,
              shouldReload: true
            }
          });
        } else {
          throw new Error('Invalid response from proxy');
        }
      } 
      // Fallback to regular fetch
      else {
        console.log('Using fetch API with phone number:', phoneNumber);
        
        // Add a timestamp to prevent caching
        const timestamp = new Date().getTime();
        const url = `${proxyUrl}?From=${encodeURIComponent(phoneNumber)}&_=${timestamp}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Proxy response via fetch:', data);
        
        if (data && data.url) {
          manager.store.dispatch({
            type: 'SET_CRM_CONTAINER_CONTENT',
            payload: {
              uri: data.url,
              shouldReload: true
            }
          });
        } else {
          throw new Error('Invalid response from proxy');
        }
      }
    } catch (error) {
      console.error('Error fetching profile via proxy:', error);
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
