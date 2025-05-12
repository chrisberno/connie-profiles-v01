import React from "react"
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from "@twilio/flex-plugin"

import CustomTaskList from "./components/CustomTaskList"

const PLUGIN_NAME = "SamplePlugin"

export default class SamplePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME)
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    // Add a console log to verify the URL being used
    console.log("CRM URL for task:", "https://connie-profiles-v01.vercel.app/simple-test");
    
    flex.CRMContainer.defaultProps.uriCallback = (task) => {
      return task
        ? "https://connie-profiles-v01.vercel.app/simple-test"
        : "https://v1.connie.plus"
    }
  }
}