# CKB Manual Transaction Example

This document outlines the manual process of building, hashing, and signing a **CKB Txn** using JSON, based on the CKB Academy guide and RFC 0022 – Transaction Structure.

### Quick Links:

- [RFC 0022 - Transaction Structure](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md)
- [CKB Academy - Basic Operation](https://academy.ckb.dev/courses/basic-operation)
- [CKB Testnet Explorer](https://testnet.explorer.nervos.org/) and [CKB Faucet](https://faucet.nervos.org/)

## 1. What is a Transaction?

A **transaction** on CKB is simply spending existing **live cells (inputs)** to create **new cells (outputs)**.  
It follows the _off-chain computing, on-chain verifying_ model - meaning you can manually build and verify it before submitting.

To construct a transaction, you define:

- Inputs → which cells to spend
- Outputs → which new cells to create
- Cell Deps → which scripts your transaction depends on

## 2. Transaction Input Example

The **inputs** field lists live cells being spent.  
Each input points to a previous transaction output using:

- `txHash` → transaction hash of the cell being spent
- `index` → output index position
- `since` → optional time-lock (0x0 = immediately spendable)

```json
{
  "cellDeps": [],
  "inputs": []
}
```

After selecting live cells, it becomes:

```json
{
  "cellDeps": [
    {
      "outPoint": {
        "txHash": "0xec18bf0d857c981c3d1f4e17999b9b90c484b303378e94de1a57b0872f5d4602",
        "index": "0x0"
      },
      "depType": "code"
    },
    {
      "outPoint": {
        "txHash": "0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
        "index": "0x0"
      },
      "depType": "depGroup"
    }
  ],
  "inputs": [
    {
      "previousOutput": {
        // These 2 fields are required to reference a cell
        "txHash": "0x430b15f34a42204bdba00469256303406514521f08241419f6d74db4fc5e3b2d",
        "index": "0x0"
      },
      "since": "0x0"
    },
    {
      "previousOutput": {
        "txHash": "0x430b15f34a42204bdba00469256303406514521f08241419f6d74db4fc5e3b2d",
        "index": "0x4"
      },
      "since": "0x0"
    }
  ]
}
```

## 3. Cell Dependencies (`cellDeps`)

`cellDeps` defines which code or script dependencies are needed for transaction verification.
They are not spent — just referenced.

- `depType: code` → direct dependency (standard script like SECP256K1)
- `depType: depGroup` → bundled script group (e.g., OmniLock group)

For OmniLock-protected wallets, both **SECP256K1_BLAKE160** and **OMNILOCK** deps are required.

## 4. Generating the Transaction Hash

Once all fields (version, inputs, cellDeps, outputs, etc.) are filled, you can **serialize the transaction** and **generate its hash (tx_hash)**.

This hash uniquely identifies the transaction before signing.

## 5. Signing the Transaction

The raw transaction above is **unsigned**. <br> To make it valid, you must add a signature inside the `witnesses` field.

Witnesses contain the proofs that authorize the spending of inputs.

**Witness structure:**

```rust
table WitnessArgs {
  lock:          BytesOpt, // signature or lock proof
  input_type:    BytesOpt, // optional input type proof
  output_type:   BytesOpt  // optional output type proof
}
```

**Simplified signed transaction format:**

```json
{
  "version": "0x0",
  "headerDeps": [],
  "cellDeps": [...],
  "inputs": [...],
  "outputs": [...],
  "outputsData": [...],
  "witnesses": [
    {
      "lock": "0x<signature>",
      "input_type": null,
      "output_type": null
    }
  ]
}
```

Once signed, the transaction is complete and ready to be broadcast.

> The signing process is tedious. Know more on: [How to sign transaction](https://github.com/nervosnetwork/ckb-system-scripts/wiki/How-to-sign-transaction)

## 6. Verification and Submission

After signing:

1. Submit the transaction to the **CKB testnet**.
2. Verify the `tx_hash` on the [CKB Testnet Explorer](https://testnet.explorer.nervos.org/).
3. If status = _pending_, it’s under verification. Once mined, it becomes _committed_.

## Summary

| Field           | Description                                 |
| --------------- | ------------------------------------------- |
| **cellDeps**    | Script dependencies required for validation |
| **inputs**      | Cells being spent                           |
| **outputs**     | New cells created                           |
| **outputsData** | Associated data for each output             |
| **since**       | Time-lock control                           |
| **witnesses**   | Holds signatures (lock proofs)              |

---

## Reference Sources

- [CKB RFC 0022 – Transaction Structure](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md)
- [CKB Academy – Practical Transaction Building](https://academy.ckb.dev/courses/basic-operation)
