## Week 04

**Date:** 15th - 22nd Oct, 2025

### Tasks Completed

#### CKB Devnet Setup and Testing Locally

- Downloaded & extracted `CKB v0.203.0-rc3` and `CKB-CLI v1.15.0`.
- Created _[setup_ckb_devnet.sh](../ckb-devnet/setup_ckb_devnet.sh)_ to automate whole setup. See [SETUP_CKB_DEVNET.md](../ckb-devnet/SETUP_CKB_DEVNET.md) for details.
- Initialized local devnet chain (`ckb init --chain dev`).
- Created miner account (`ckb-cli account new`) and updated `block_assembler` config.
- Ran node & miner manually (`ckb run` + `ckb miner`).
- Transferred some CKBytes to a new account for testing.

#### Rust Learning and Practice

- Completed Rust basics up to data types.
- Explored `scalar types`, `tuples`, `arrays`, `String`/`&str`, `enums`, and `structs`.
- Practiced exercises for each concept using [Cyfrin Updraft](https://updraft.cyfrin.io/courses/rust-programming-basics).
- Learned _mutability_, _shadowing_, and _constants_.
- Wrote simple functions with parameters & returns, including using tuples for multiple returns.
- Built small exercises combining types and functions for hands-on reinforcement.

### References

- [Nervos Docs - Run Devnet Node Locally](https://docs.nervos.org/docs/node/run-devnet-node#quick-start-with-offckb)
- [Rust Programming Basics - Cyfrin Updraft](https://updraft.cyfrin.io/courses/rust-programming-basics)
