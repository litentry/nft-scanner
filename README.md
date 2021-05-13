
# Compile & Deploy
    graph codegen
    graph auth https://api.thegraph.com/deploy/ <access token>
    graph deploy 
        --debug \
        --node https://api.thegraph.com/deploy/ \
        --ipfs https://api.thegraph.com/ipfs/ \
        <subgraph name>

# [ERC721 token](https://eips.ethereum.org/EIPS/eip-721)
    
    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);

# [Supported NFTs](./supportedNFTs.csv)
