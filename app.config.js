module.exports = {
  expo: {
    name: 'ssa-alumnae',
    slug: 'ssa-alumnae',
    scheme: 'ssa-alumnae',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#ffffff'
      }
    },
    plugins: ['expo-router'],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true
    }
  }
};