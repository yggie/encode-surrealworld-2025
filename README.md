# Replicon

**Version:** 0.1.0-alpha
**Last Updated:** June 16, 2025

---

##  Motivation

The creative media landscape is at a critical juncture. The rapid advancement of generative AI threatens to devalue the careers of actors and creators, while simultaneously making it harder for smaller creative studios to compete with the vast resources of industry giants. This has created an urgent need for a platform that champions human creativity and ensures fair, transparent compensation.

Replicon was born from a desire to address these challenges head-on. Our mission is to build the foundational layer of trust for the next generation of media production.

This open-source platform is driven by three core principles:

1.  **Protecting Creatives:** To provide actors, artists, and other creators with the tools to manage their digital identity, protect their craft from unauthorized AI use, and secure an immutable record of their contributions.
2.  **Empowering Studios:** To offer an ethical alternative to generative AI, enabling studios of all sizes to collaborate with verified talent and produce high-quality assets in a streamlined, transparent ecosystem.
3.  **Ensuring Fairness:** To leverage technology to guarantee fair and equitable royalty distribution for every single person involved in a project, effectively creating a decentralized, trustworthy "IMDB on the blockchain."

## Technology Stack

To achieve our goals, Replicon is built on a modern, robust, and decentralized technology stack. The choice of each component is deliberate, reflecting our commitment to security, transparency, and scalability.

### Core Architecture

* **Blockchain:** We utilize [Story](https://www.story.foundation/build), an **EVM-compatible blockchain** to manage identity, certify contributions, and automate royalty distribution.
    * **Smart Contracts:** Derived from the IPA and Licensing modules on Story, our smart contracts handle creator verification, project agreements, and the automated logic for royalty splits. Each verified credit is minted as a non-transferable SBT (Soul-Bound Token) or a custom ERC standard token linked to the creator's wallet.
    * **Decentralized Storage:** All media assets and critical metadata (headshots, project files, agreements) are stored on **IPFS (InterPlanetary File System)**. This ensures that assets are censorship-resistant and permanently available, with only the content hash (`CID`) being stored on-chain.

### Platform & Services

* **Backend:** Our primary backend is built with **Node.js** and **GraphQL**
* **Frontend:** The user interface is a responsive application built with **React.js** and **Next.js**. We prioritize a clean, intuitive user experience for both talent and studio clients.
* **Database:** We use **PostgreSQL** for managing off-chain data that doesn't need to be decentralized, such as user profile information, notifications, and application-level data that requires relational integrity.

### AI & Machine Learning

We leverage the capabilities of our partner [Holoworld](https://www.holoworld.com/), to create lifelike virtual avatars which we can communicate with

---

This project is a commitment to a future where technology empowers creativity, rather than replaces it. We welcome contributions from the community to help build a more equitable and transparent media industry for everyone.