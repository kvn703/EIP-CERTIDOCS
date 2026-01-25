module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ignorer le module React Native qui n'est pas nécessaire dans un environnement web
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        '@react-native-async-storage/async-storage': false,
      };
      
      // Ignorer les warnings pour ce module
      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        {
          module: /@metamask\/sdk/,
          message: /Can't resolve '@react-native-async-storage\/async-storage'/,
        },
      ];
      
      return webpackConfig;
    },
  },
};

