<p align="center">
  <h2 align="center">Stylus IDE</h2>
  <p align="center"><b>Lightweight Stylus Contract IDE</b></p>
  <p align="center">Comprehensive intuitive integrated development environment tailored for load smart contract from various blockchain and repositories</p>
</p>

## Coming Soon

## Running Locally

### Install Rust and dependencies
```bash
# Install Stylus
cargo install --force cargo-stylus cargo-stylus-check
rustup target add wasm32-unknown-unknown

# Library Helper
cargo install koba

# Solidity Compiler Solc
sudo add-apt-repository ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install solc
```

### Frontend
```bash
bun i
bun run dev
```