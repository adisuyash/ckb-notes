## Nervos CKB Devnet Setup

This repository contains a simple shell script to install and configure the Nervos CKB (Common Knowledge Base) and CKB-CLI locally for development and testing.

### Requirements

- Linux or WSL environment
- `wget` and `tar` installed
- Basic shell access

### Setup Instructions

Make the setup script executable and run the script:

```sh
chmod +x setup_ckb_devnet.sh
./setup_ckb_devnet.sh
```

This will:

- Download and extract the CKB and CKB-CLI binaries
- Verify the installations
- Print next-step instructions

### You're Ready

Your local Nervos CKB devnet environment is now up and running.
Use it to test smart contracts, experiment with cells, and build on the CKB layer!

### Additional Resources

For the latest binaries or release notes, you can refer to the official Nervos releases:

- [CKB GitHub Releases](https://github.com/nervosnetwork/ckb/releases)
- [CKB Official Doc to run Devnet node](https://docs.nervos.org/docs/node/run-devnet-node)
