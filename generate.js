const _ = require('lodash');
const fs = require('fs');
const util = require('util');
const yaml = require('js-yaml');


_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

/// source code configuration
let compiled = null;
function getCompiledSource(path) {
  if (_.isEmpty(compiled)) {
    const content = fs.readFileSync(path, 'utf8');
    compiled = _.template(content);
  }
  return compiled;
}

function generateSourcePair(path, contractName) {
  const compiled = getCompiledSource(path);
  const generatedSource = compiled({
    contract_name: contractName,
  });
  return [`./src/${contractName}Mapping.ts`, generatedSource];
}

function writeSource(path, content) {
  fs.writeFileSync(path, content);
}


/// subgraph configuration
function loadSubgraphDataSourceTemplate(path) {
  const dataSourceTemplateFp = fs.readFileSync(path, 'utf8');
  const dataSourceTemplate = yaml.load(dataSourceTemplateFp);
  return dataSourceTemplate;
}

function assignDataSouroce(dataSourceTemplate, contractMeta) {
  const cloned = _.cloneDeep(dataSourceTemplate);
  cloned['name'] = contractMeta['contract_name'];
  cloned['network'] = contractMeta['network'];
  cloned['source']['address'] = contractMeta['contract_address'];
  cloned['source']['abi'] = contractMeta['abi_name'];
  cloned['source']['startBlock'] = contractMeta['start_block'];
  cloned['mapping']['abis'][0]['name'] = contractMeta['abi_name'];
  cloned['mapping']['abis'][0]['file'] = contractMeta['abi_file_path'];
  cloned['mapping']['file'] = contractMeta['source_file_path'];
  return cloned;
}

function writeSubgraph(path, dataSources) {
  if (! _.isArray(dataSources)) {
    dataSources = [dataSources];
  }
  const doc = {
    specVersion: '0.0.2',
    schema: {file: './schema.graphql'},
    dataSources: dataSources
  };

  console.log(util.inspect(doc, {showHidden: false, depth: null}));
  fs.writeFileSync(path, yaml.dump(doc, {noRefs: true, quotingType: "\""}));
}


try {
  /// Generate mapping source codes
  const dataSourceTemplatePath = './templates/dataSource.template.yaml';
  const sourceTemplatePath = './templates/sourceMapping.template.ts';
  const contractName = 'WrappedMoonCatsRescue';

  const [dstPath, source] = generateSourcePair(sourceTemplatePath, contractName);
  writeSource(dstPath, source);

  /// Generate subgraph
  const dataSourceTemplate = loadSubgraphDataSourceTemplate(dataSourceTemplatePath);
  const contractMeta = {
    contract_name: contractName,
    network: 'mainnet',
    contract_address: '0x7c40c393dc0f283f318791d746d894ddd3693572',
    abi_name: contractName,
    start_block: 12025810,
    abi_file_path: `./abis/${contractName}.json`,
    source_file_path: dstPath,
  };
  const dataSource = assignDataSouroce(dataSourceTemplate, contractMeta);
  const subgraphPath = './subgraph.yaml';
  writeSubgraph(subgraphPath, [dataSource]);
} catch (e) {
  console.log(e);
}
