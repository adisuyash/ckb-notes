# CKB Builder Handbook

Welcome to the **CKB Builder Handbook**.

This resource is designed for cohort members participating in the **Community Keeps Building** - **Builders’ Track**.  
It provides structured guidance for learning [Nervos CKB](https://www.nervos.org), from foundational concepts to advanced development practices.

> Some older docs mention Lumos or Capsule, which are now deprecated. Recommended tools and SDKs are listed below.

---

### Table of Contents

- [Introduction](#introduction)
- [Beginner](#beginner)
  - [Building on CKB with CCC](#building-on-ckb-with-ccc)
  - [Other Programming Languages & Tools](#other-programming-languages--tools)
- [Task: Create Your Own Basic Application](#task-create-your-own-basic-application)
- [Further Reading](#further-reading)
- [Intermediate](#intermediate)
  - [Script Development Course](#script-development-course)
  - [Other Intermediate Topics](#other-intermediate-topics)
  - [Simple UDTs (sUDT)](#simple-udts-sudt)
- [Nervos DAO](#nervos-dao)
- [Spore Protocol (DOBs)](#spore-protocol-dobs)
- [Advanced Topics](#advanced-topics)
  - [Script-Sourced Rich Information (SSRI)](#script-sourced-rich-information-ssri)
  - [RGB++ – Bitcoin’s Turing Catalyst](#rgb--bitcoins-turing-catalyst)
  - [xUDT – Extensible User-Defined Token](#xudt--extensible-user-defined-token)
  - [iCKB](#ickb)

---

## Introduction

Start by building a strong conceptual foundation:

- [Introduction to Nervos CKB](https://docs.nervos.org/docs/tech-explanation/nervos-blockchain) – basic technical concepts and terminology
- [Getting Started on CKB](https://docs.nervos.org/docs/getting-started/how-ckb-works) – overview of networks, RPCs, and workflows
  - [Quick Start with OffCKB](https://docs.nervos.org/docs/getting-started/quick-start) – set up your development environment and projects rapidly
- [CKB Academy Lessons 1 & 2](https://academy.ckb.dev/courses) – build theoretical knowledge
- [Introduction to Script (smart contracts)](https://docs.nervos.org/docs/script/intro-to-script) – learn the basics of CKB smart contracts

It is recommended to maintain a **dev log on GitHub** to document your progress. Example: [Methemeticz/ckb-builder-track](https://github.com/Methemeticz/ckb-builder-track).

---

## Beginner

Once your environment is set up and you understand the basics, you can start practical exercises. For each tutorial, retain screenshots as proof of participation and record them in your dev log:

- [Transfer CKB](https://docs.nervos.org/docs/dapp/transfer-ckb)
- [Store Data on Cell](https://docs.nervos.org/docs/dapp/store-data-on-cell)
- [Create Fungible Token](https://docs.nervos.org/docs/dapp/create-token)
- [Create DOB (Digital Object)](https://docs.nervos.org/docs/dapp/create-dob)
- [Build a Simple Lock](https://docs.nervos.org/docs/dapp/simple-lock)

The **L1 Developer Course** provides further theoretical understanding. Ignore Lumos/Capsule references when following labs.

### Building on CKB with CCC

Use **CCC (Common Chain Connector)** for beginner-friendly dApp development with integrated wallet support:

- [Explore CCC App](https://docs.ckbccc.com/docs/ccc-app)
- [Test your code in CCC Playground](https://docs.ckbccc.com/docs/playground)
- [Code Examples](https://docs.ckbccc.com/docs/code-examples)
- [CCC API Reference](https://api.ckbccc.com/)

Other programming languages and tools:

- [Rust SDK](https://docs.nervos.org/docs/sdk-and-devtool/rust)
  - [CKB-CLI](https://docs.nervos.org/docs/sdk-and-devtool/ckb-cli) – Rust-based command-line tool
- [Go SDK](https://docs.nervos.org/docs/sdk-and-devtool/go)
- [Java SDK](https://docs.nervos.org/docs/sdk-and-devtool/java)

Additional development tools:

- [Testnet Faucet](https://faucet.nervos.org/)
- [CKB Debugger](https://github.com/nervosnetwork/ckb-standalone-debugger)
- [CKB Tools Website](https://ckb.tools/)

---

## Task: Create Your Own Basic Application

Apply your knowledge by creating a simple application. Examples:

- Token generator
- DOB (Spore) minter
- Custom script demo

Discuss your ideas with **Neon** or the **CKB DevRel** team for guidance. High-quality projects may qualify for support from:

- [Spark Program](https://talk.nervos.org/t/ckb-eco-fund-spark-program-mini-grant-initiative/8752)
- [CKB Community Fund DAO](https://talk.nervos.org/t/ckb-community-fund-dao-willing-to-back-every-ckb-buidler-up)

---

## Further Reading

Deepen your understanding of CKB through core documents and proposals:

- [Nervos RFCs Repository](https://github.com/nervosnetwork/rfcs) – standards, proposals, and documentation

---

## Intermediate

Advance your skills with modules covering script development, ecosystem tools, and serialization:

### Script Development Course

- [Class 1: Validation Model](https://docs.nervos.org/docs/script-course/intro-to-script-1)
- [Class 2: Script Basics](https://docs.nervos.org/docs/script-course/intro-to-script-2)
- [Class 3: UDT](https://docs.nervos.org/docs/script-course/intro-to-script-3)
- [Class 4: WebAssembly on CKB](https://docs.nervos.org/docs/script-course/intro-to-script-4)
- [Class 5: Debugging](https://docs.nervos.org/docs/script-course/intro-to-script-5)
- [Class 6: Type ID](https://docs.nervos.org/docs/script-course/intro-to-script-6)
- [Class 7: Advanced Duktape Examples](https://docs.nervos.org/docs/script-course/intro-to-script-7)
- [Class 8: Performant WASM](https://docs.nervos.org/docs/script-course/intro-to-script-8)
- [Class 9: Cycle Reductions in Duktape Script](https://docs.nervos.org/docs/script-course/intro-to-script-9)
- [Class 10: Language Choices](https://docs.nervos.org/docs/script-course/intro-to-script-10)

Other intermediate topics:

- [Detailed Rust Scripting](https://docs.nervos.org/docs/script/rust/rust-quick-start)
- [Detailed JS Scripting](https://docs.nervos.org/docs/script/js/js-quick-start)
- [Ecosystem Scripts & Libraries](https://docs.nervos.org/docs/ecosystem-scripts/introduction)
- [Molecule & Serialization](https://docs.nervos.org/docs/serialization/serialization-molecule-in-ckb)

### Simple UDTs (sUDT)

sUDTs are the simplest form of user-defined tokens on Nervos, analogous to Ethereum ERC20/777 standards:

- [sUDT Standard](https://docs-xi-two.vercel.app/docs/rfcs/0025-simple-udt/0025-simple-udt)
- [sUDT Operations Tutorial](https://github.com/nervosnetwork/ckb-cli/wiki/UDT-%28sudt%29-Operations-Tutorial)

---

## Nervos DAO

Lock CKBytes to earn secondary issuance rewards. The DAO provides a "virtual hardcap" to protect CKByte holders from inflation:

- [Introduction](https://messari.io/copilot/share/understanding-nervos-dao-830c1d00-0afc-47aa-a65c-465701adc67f)
- [Deposit & Withdraw](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md)
- [Source Code](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/dao.c)
- [NervDAO Browser Implementation](https://github.com/ckb-devrel/nervdao)

---

## Spore Protocol (DOBs)

DOBs (Digital Objects) allow for value-backed digital assets with on-chain ownership and tokenomics:

- [Introduction to Spore Protocol](https://docs.nervos.org/docs/tech-explanation/spore-protocol)
- [Spore Docs & Tutorials](https://docs.spore.pro/)
- [DOB Cookbook](https://github.com/sporeprotocol/dob-cookbook)
- [How-to Recipes](https://docs.spore.pro/category/how-to-recipes)
- [SDK, Examples & Demos](https://docs.spore.pro/resources/examples)
- [Contracts](https://docs.spore.pro/resources/contracts)
- [DOB Decoder Standalone Server](https://github.com/sporeprotocol/dob-decoder-standalone-server)

---

## Advanced Topics

### Script-Sourced Rich Information (SSRI)

Embed data and logic directly into Scripts for advanced off-chain interactions:

- [Introduction](https://talk.nervos.org/t/en-cn-script-sourced-rich-information-script/8256/2)
- [SSRI SDK](https://crates.io/crates/ckb-ssri-std)
- [Prototype Contract](https://github.com/Hanssen0/ssri-test)
- [SSRI Server](https://github.com/ckb-devrel/ssri-server)
- [Pausable UDT Example](https://github.com/Alive24/pausable-udt)

### RGB++ – Bitcoin’s Turing Catalyst

Leverage CKB to extend Bitcoin’s programmability for dynamic asset issuance and decentralized applications:

- [Website](http://www.rgbpp.com)
- [Introduction](https://rgbpp.com/docs/introduction)
- [Light Paper](https://talk.nervos.org/t/rgb-protocol-light-paper-translation/7790)
- [Resource Hub](https://rgbpp.com/docs/resources)
- [RGB++ SDK](https://github.com/ckb-devrel/ccc/tree/rgbpp-sdk)
- [RGB++ Explorer](https://explorer.rgbpp.io/en)

### xUDT – Extensible User-Defined Token

xUDT extends sUDT by enabling custom validation logic through external Scripts for advanced governance, minting rules, and token behaviors:

- [Overview](https://docs.nervos.org/docs/tech-explanation/xudt)
- [How xUDT Works](https://docs.nervos.org/docs/ecosystem-scripts/xudt#how-xudt-works)
- [Enhance sUDT’s Programmability](https://blog.cryptape.com/enhance-sudts-programmability-with-xudt)
- [xUDT RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0052-extensible-udt/0052-extensible-udt.md)

### iCKB

Tokenize NervosDAO deposits to create a liquid, tradable iCKB token:

- [Website](https://ickb.org/)
- [GitHub Repository](https://github.com/ickb/)
- [Audit Report](https://scalebit.xyz/reports/20240911-ICKB-Final-Audit-Report.pdf)
- [iCKB SDK](https://github.com/ickb/sdk)
