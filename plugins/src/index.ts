import type { ConfigPlugin } from 'expo/config-plugins';
import { createRunOncePlugin } from 'expo/config-plugins';
import { withAndroidMainApplicationDependency, withAndroidSettingsDependency, withAndroidStringsDependency } from './android';
import { withIOSAppDelegateCodePushConfig, withIOSPlistDeploymentKey } from './ios';

type PluginConfig = {
  ios: {
    CodePushDeploymentKey: string;
  }
  android: {
    CodePushDeploymentKey: string;
    // CodePushPublicKey?: string // Only necessary if we will support sign verify for deployment key
  }
}

const withReactNativeCodePush: ConfigPlugin<PluginConfig> = (config, { ios, android }) => {
  config = withAndroidSettingsDependency(config)
  config = withAndroidStringsDependency(config, android.CodePushDeploymentKey)
  config = withAndroidMainApplicationDependency(config)
  // plugins order matter: the later one would run first
  config = withIOSPlistDeploymentKey(config, ios.CodePushDeploymentKey)
  config = withIOSAppDelegateCodePushConfig(config)

  return config
};

let pkg: { name: string; version?: string } = {
  name: "react-native-code-push",
};
try {
  const codePushPkg = require("react-native-code-push/package.json");
  pkg = codePushPkg;
} catch {}
export default createRunOncePlugin(withReactNativeCodePush, pkg.name, pkg.version);
