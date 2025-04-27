import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';
import * as Flex from '@twilio/flex-ui';

const PLUGIN_NAME = 'MariadbFetchProfilePlugin';

export default class MariadbFetchProfilePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {
    flex.CRMContainer.defaultProps.uriCallback = (task) => {
      const crmUrl = task?.attributes?.crm_url || 'https://connie-profiles-v01-4zuxqqz55-connie-direct.vercel.app/search';
      console.log('Loading CRM URL:', crmUrl);
      return crmUrl;
    };
  }
}

