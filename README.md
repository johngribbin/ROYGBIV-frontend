# ROYGBIV

![Prism Preview](https://i.imgur.com/heUckq4.jpg)

## Introduction

ROYGBIV creates Lightning prisms, which are BOLT 12 offers that split Lightning payments to different parties at percentages you define.

This repository contains a progressive web app - the frontend component to ROYGBIV. The backend plugin is available [here](https://github.com/daGoodenough/ROYGBIV-backend) and requires Core Lightning with the runtime flag 'experimental-dual-fund.'

BOLT 12 offers are static QR payment codes that can be reused again and again. Currently, ROYGBIV supports prism payouts to node pubkeys via keysend.

## Coming Soon

- Functionality to edit existing prisms: add or remove members, change share amounts, etc.
- Support for split payments to other BOLT 12 offers, LNURL, AMP, and Lightning Addresses
- Different payout strategies, such as payment amount thresholds and time-based payouts

## Install Instructions

1. Clone ROYGBIV

```bash
git clone https://github.com/johngribbin/ROYGBIV-frontend.git
cd ROYGBIV-frontend
```

2. Install the dependencies

```bash
npm i
```

3. Start the app in dev mode

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

5. Follow the instructions at [https://github.com/farscapian/clams-app-docker](https://github.com/farscapian/clams-app-docker) to set up the backend
