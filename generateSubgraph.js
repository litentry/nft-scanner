const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');

function assignDataSouroce(dataSourceTemplate, contractMeta) {
  const cloned = _.cloneDeep(dataSourceTemplate);
  cloned['name'] = contractMeta['contract_name'];
  cloned['network'] = contractMeta['network'];
  cloned['source']['address'] = contractMeta['contract_address'];
  cloned['source']['abi'] = contractMeta['abi_name'];
  cloned['source']['startBlock'] = contractMeta['start_block'];
  cloned['source']['mapping']['abis'][0]['name'] = contractMeta['abi_name'];
  cloned['source']['mapping']['abis'][0]['file'] = contractMeta['abi_file_path'];
  cloned['source']['mapping']['file'] = contractMeta['source_file_path'];
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
  console.log(doc);
  fs.writeFileSync(path, yaml.dump(doc, {noRefs: true, quotingType: "\""}));
}

try {
  const dataSourceTemplateFp = fs.readFileSync('./dataSource.template.yaml', 'utf8');
  const dataSourceTemplate = yaml.load(dataSourceTemplateFp);

  // console.log(dataSourceTemplate['source']['mapping']);
  const contractMeta = {
    contract_name: 'WrappedMoonCatsRescue',
    network: 'mainnet',
    contract_address: '0x7c40c393dc0f283f318791d746d894ddd3693572',
    abi_name: 'WrappedMoonCatsRescue',
    start_block: 12025810,
    abi_file_path: './abis/WrappedMoonCatsRescue.json',
    source_file_path: './src/mapping.ts',
  };

  const dataSource = assignDataSouroce(dataSourceTemplate, contractMeta);
  writeSubgraph('./subgraph.test.yaml', [dataSource]);
} catch (e) {
  console.log(e);
}
