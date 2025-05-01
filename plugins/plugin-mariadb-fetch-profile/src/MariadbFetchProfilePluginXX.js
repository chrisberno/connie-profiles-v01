const MariadbFetchProfilePlugin = {
  setup(flex, manager) {
    manager.events.addListener('taskAccepted', async (task) => {
      console.log('Task accepted:', task);
      const phoneNumber = task.attributes.from || '';
      console.log('Phone number from task:', phoneNumber);

      const normalizedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber.replace(/[^+\d]/g, '') : `+${phoneNumber.replace(/[^\d]/g, '')}`;
      console.log('Normalized phone number:', normalizedPhoneNumber);

      const fetchUrl = `https://mariadb-7343.twil.io/fetch-profile?From=${encodeURIComponent(normalizedPhoneNumber)}`;
      console.log('Fetching profile from:', fetchUrl);

      try {
        const response = await fetch(fetchUrl);
        const data = await response.json();
        console.log('Fetch profile response:', data);

        if (data.url) {
          console.log('Setting CRM container URL to:', data.url);
          flex.Actions.invokeAction('SetComponentState', {
            name: 'EnhancedCRMContainer', // Updated to target EnhancedCRMContainer
            state: { url: data.url }
          });
        } else {
          console.log('No URL in response, leaving CRM container unchanged');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    });
  }
};

export default MariadbFetchProfilePlugin;