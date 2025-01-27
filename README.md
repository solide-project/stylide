<p align="center">
  <h2 align="center">Stylide</h2>
  <p align="center"><b>Advanced Smart Contract IDE for Stylus</b></p>
  <p align="center">A streamlined and intuitive integrated development environment tailored for developing, compiling, and deploying Stylus smart contracts directly from the browser.</p>
</p>

## About Stylide

**Stylide** is an open-source Integrated Development Environment (IDE) designed specifically for **Stylus** smart contracts. It aims to provide developers with a powerful and user-friendly platform for writing, compiling, and deploying contracts within the Stylus blockchain ecosystem. Stylide supports seamless integration with Stylus networks, facilitating efficient contract management and testing. This repository serves as the home for Stylide, supporting developers in their journey of smart contract development and deployment on Stylus.

## Documentation

To start using Stylide, visit our [Documentation](https://docs.solide0x.tech/docs/ide/stylus-ide)

## Getting Started

To run Stylide locally, follow these steps:

### Clone the Repository
First, clone the Stylide repository to your local machine using Git:
```bash
git clone https://github.com/solide-project/stylide
```

### Install Dependencies
Navigate into the cloned repository directory and install the required npm packages:
```bash
cd stylide
bun install
```

### Install Backend Compiler
Next, install rust and stylus cli and all the backend dependency for interacting with Stylus
```bash
# Requires Rust Nightly
rustup update
rustup update nightly
rustup component add rust-src --toolchain nightly-x86_64-unknown-linux-gnu

# Install Stylus (Note we can either use 1. or 2. Currently using 1.)
rustup target add wasm32-unknown-unknown
# 1. Build and install from source
git clone https://github.com/OffchainLabs/cargo-stylus.git
cargo install --path main/
# 2. Ensure to target wasm32-unknown-unknown to nightly
cargo install --force cargo-stylus cargo-stylus-check


# Solidity Compiler Solc
sudo add-apt-repository ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install solc
```

### Updates
```bash
rustup update 1.81.0-x86_64-unknown-linux-gnu 

cargo install --force cargo-stylus cargo-stylus-check

rustup default 1.81.0-x86_64-unknown-linux-gnu
rustup target add wasm32-unknown-unknown --toolchain 1.81.0-x86_64-unknown-linux-gnu
```

If you can't default 1.81 (because of override). Found `settings.toml` in *typically* `~/.rustup` and add path with the default project path ~~because Note Koba relies on 1.81~~

### Configure Environment Variables
Create a `.env.local` file in the root directory of the project and use the following template to fill in the required variables:
```
PROJECT_PATH=
GITHUB_API_KEY=
```

### Running Stylide
After configuring the environment variables, start the Stylide IDE:
```bash
bun run start
```

This command will launch the Stylide IDE in your default web browser.

## Contribution Guidelines

We welcome contributions from the community to enhance Stylide further. If you have suggestions, bug reports, or want to contribute code, please follow our [Contribution Guidelines](link-to-contribution-guidelines).

## Community and Support

Join the Stylide community for discussions, support, and collaboration. Visit our [Discord channel (Coming Soon)](#) to connect with fellow developers and enthusiasts.

## License

Stylide is released under the [MIT License](link-to-license). Feel free to use, modify, and distribute Stylide for your projects.

---

Note: Stylide is a community-driven project aimed at fostering openness, collaboration, and innovation in the blockchain development domain. Your feedback and contributions are highly valued. Let's build the future of smart contract development together!

Support us by starring this Repository and following us on [X](https://twitter.com/SolideProject)! 😊