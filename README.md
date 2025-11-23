# Epoxy Repro

This is a reproduction case for testing [@mercuryworkshop/epoxy-tls](https://github.com/MercuryWorkshop/epoxy-tls), a library for proxying HTTP requests over WebSockets using the WISP protocol. It runs on Deno.

## Issue

The readwrite implementation (using custom socket/read-write pairs) times out, while the direct implementation (where epoxy handles WebSocket) works.

## Setup

Install dependencies:
```bash
deno install
```

## Usage

Run the test:
```bash
deno task start
```

This will attempt to fetch 5 random URLs through the epoxy proxy and log the results. It times out after 10 seconds if fetches don't complete.

## Files

- `main.ts`: Main script that performs the fetches (currently uses readwrite)
- `make-epoxy-readwrite.ts`: Creates an EpoxyClient with custom read/write streams over WebSocket
- `make-epoxy-direct.ts`: Creates an EpoxyClient letting epoxy handle WebSocket directly
