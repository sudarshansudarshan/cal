import { CoreEngine } from './CoreEngine/CoreEngine';

/**
 * Unified SDK instance exposing CoreEngine functionality.
 */
export const calSDK = {
  core: new CoreEngine(),
};