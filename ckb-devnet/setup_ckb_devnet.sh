#!/bin/bash
set -e

echo "----------------------------------------------"
echo "Setting up Nervos CKB Devnet (Local Environment)"
echo "----------------------------------------------"
echo ""

# Versions
CKB_VERSION="v0.203.0-rc3"
CKB_CLI_VERSION="v1.15.0"

# Folder names from releases
CKB_DIR="ckb_${CKB_VERSION}_x86_64-unknown-linux-gnu"
CKB_CLI_DIR="ckb-cli_${CKB_CLI_VERSION}_x86_64-unknown-linux-gnu"

WORK_DIR=$(pwd)
echo "Working Directory: $WORK_DIR"
echo ""

# Step 1. Download binaries
echo "Downloading CKB and CKB-CLI binaries..."
wget -q https://github.com/nervosnetwork/ckb/releases/download/${CKB_VERSION}/${CKB_DIR}.tar.gz
wget -q https://github.com/nervosnetwork/ckb-cli/releases/download/${CKB_CLI_VERSION}/${CKB_CLI_DIR}.tar.gz

# Step 2. Extract archives
echo "Extracting archives..."
tar -xzf ${CKB_DIR}.tar.gz
tar -xzf ${CKB_CLI_DIR}.tar.gz

# Step 3. Clean up archives
rm -f ${CKB_DIR}.tar.gz ${CKB_CLI_DIR}.tar.gz

# Step 4. Verify installations
echo ""
echo "Verifying installations..."
${CKB_DIR}/ckb --version
${CKB_CLI_DIR}/ckb-cli --version

echo ""
echo "----------------------------------------------"
echo "Setup Complete"
echo "----------------------------------------------"
echo ""
echo "Installed Versions:"
echo "  - CKB: ${CKB_VERSION}"
echo "  - CKB-CLI: ${CKB_CLI_VERSION}"
echo ""
echo "Next Commands to Initialize and Run Devnet:"
echo ""
echo "  1. Initialize the local devnet chain:"
echo "     cd ${CKB_DIR} && ./ckb init --chain dev"
echo ""
echo "  2. Configure block assembler (optional):"
echo "     ./ckb-cli account new"
echo "     # then update 'block_assembler' section in ckb.toml"
echo ""
echo "  3. Run the node manually:"
echo "     ./ckb run"
echo ""
echo "  4. In another terminal, start the miner:"
echo "     ./ckb miner"
echo ""
echo "  5. To open ckb-cli shell:"
echo "     cd ../${CKB_CLI_DIR} && ./ckb-cli"
echo ""
echo "Configuration files will be generated inside:"
echo "  ${WORK_DIR}/${CKB_DIR}"
echo ""
echo "----------------------------------------------"
echo "Nervos CKB environment is now ready for use."
echo "----------------------------------------------"
