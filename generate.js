const _ = require('lodash');
const fs = require('fs');
const util = require('util');
const yaml = require('js-yaml');
var axios = require('axios');

/// Load ABI from etherscan
async function loadABI(path, contractAddress) {
  contractAddress = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';
  const config = {
    method: 'get',
    url: `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}`,
  };

  const resp = await axios(config);
  const { result } = resp.data;
  fs.writeFileSync(path, result);
}

/// source code configuration
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

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
  return generatedSource;
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

function assignDataSouroce(dataSourceTemplate, contract) {
  const cloned = _.cloneDeep(dataSourceTemplate);
  cloned['name'] = contract['name'];
  cloned['network'] = contract['network'];
  cloned['source']['address'] = contract['address'];
  cloned['source']['abi'] = contract['abi_name'];
  cloned['source']['startBlock'] = contract['start_block'];
  cloned['mapping']['abis'][0]['name'] = contract['abi_name'];
  cloned['mapping']['abis'][0]['file'] = contract['abi_file_path'];
  cloned['mapping']['file'] = contract['source_file_path'];
  return cloned;
}

function writeSubgraph(path, dataSources) {
  if (!_.isArray(dataSources)) {
    dataSources = [dataSources];
  }
  const doc = {
    specVersion: '0.0.2',
    schema: { file: './schema.graphql' },
    dataSources: dataSources,
  };

  console.log(util.inspect(doc, { showHidden: false, depth: null }));
  fs.writeFileSync(path, yaml.dump(doc, { noRefs: true, quotingType: '"' }));
}


(async () => {
  try {
    const contract = {
      name: 'WrappedMoonCatsRescue',
      address: '0x7c40c393dc0f283f318791d746d894ddd3693572',
      network: 'mainnet',
      start_block: 12025810,
    };

    contract['abi_name'] = contract.name;
    contract['abi_file_path'] = `./abis/${contract.name}.json`;
    contract['source_file_path'] = `./src/${contract.name}Mapping.ts`;

    await loadABI(contract.abi_file_path, contract.address);

    /// Generate mapping source codes
    const dataSourceTemplatePath = './templates/dataSource.template.yaml';
    const sourceTemplatePath = './templates/sourceMapping.template.ts';

    const source = generateSourcePair(sourceTemplatePath, contract.name);
    writeSource(contract.source_file_path, source);

    /// Generate subgraph
    const subgraphPath = './subgraph.yaml';
    const dataSourceTemplate = loadSubgraphDataSourceTemplate(dataSourceTemplatePath);
    const dataSource = assignDataSouroce(dataSourceTemplate, contract);

    writeSubgraph(subgraphPath, [dataSource]);
    console.log(`Generate [${contract.name}] abi: ${contract.abi_file_path}, source: ${contract.source_file_path}.`);
  } catch (e) {
    console.log(e);
  }
})();
