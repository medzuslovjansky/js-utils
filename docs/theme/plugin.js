const { ParameterType } = require('typedoc/dist/lib/utils/options/declaration');

module.exports = function (PluginHost) {
  const { options } = PluginHost.owner;

  if (!options.getDeclaration('githubUrl')) {
    options.addDeclaration({ name: 'githubUrl', type: ParameterType.String });
  }
};
