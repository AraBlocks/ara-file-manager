# Inside .ararc

(draft, this doc not yet linked, pushing to see formatting)

TODO
* switching between testnet and mainnet
* discussion of centralized components of network as a whole

[Current .ararc file](https://github.com/AraBlocks/ara-file-manager/blob/master/.ararc)

```
;; Ara File Manager 0.12.6
;; Ethereum
[web3]
provider=ws://127.0.0.1:8546
network_id=testnet

[web3.privatenet]
provider[]=http://127.0.0.1:8545
provider[]=ws://127.0.0.1:8546

[web3.testnet]
provider[]=infuraRopsten

[web3.mainnet]
provider[]=infura

;; Identity network
[network.identity]
keyring = 'https://keyring.ara.one/ara-production-public'
secret = "ara-production"

[network.identity.resolver]
network = resolver1
servers[] = "https://resolver.ara.one"

[network.identity.archiver]
network = archiver2

[network.dns]
server[] = "discovery1.ara.one"
server[] = "8.8.8.8"
server[] = "1.1.1.1"

[network.dht]
bootstrap[] = "discovery1.ara.one:6881"
#bootstrap[] = "discovery1.cafe.network:6881"

[network.discovery.swarm]
utp = false
```



