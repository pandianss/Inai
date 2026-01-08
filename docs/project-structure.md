# Bharat Messenger - Project Structure

This document outlines the complete directory structure for the Bharat Messenger platform.

```
bharat-messenger/
│
├── web-client/                          # React PWA Web Client
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx        # Main chat UI with glassmorphism
│   │   │   ├── OnboardingFlow.jsx       # Voice-first onboarding
│   │   │   ├── CommerceHub.jsx          # ONDC marketplace interface
│   │   │   ├── PaymentBubble.jsx        # UPI payment UI component
│   │   │   └── TranslationWidget.jsx    # AI translation interface
│   │   ├── styles/
│   │   │   └── design-system.css        # "Nostalgic Bharat Modernism" theme
│   │   ├── assets/
│   │   │   ├── icons.svg                # Cultural icon library
│   │   │   └── patterns/                # Rangoli/Block-print textures
│   │   ├── data/
│   │   │   └── demo-data.json           # Mock data for demonstration
│   │   ├── utils/
│   │   │   ├── encryption.js            # E2E encryption utilities
│   │   │   └── mqtt-client.js           # MQTT connection handler
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── mobile-lite/                         # <10MB Android Lite Client
│   ├── src/
│   │   └── (Minimal React Native or PWA wrapper)
│   └── android/
│
├── services/                            # Backend Microservices
│   │
│   ├── gateway/                         # Golang MQTT Gateway
│   │   ├── main.go
│   │   ├── handlers/
│   │   │   ├── message_handler.go
│   │   │   └── presence_handler.go
│   │   ├── mqtt/
│   │   │   └── broker.go
│   │   └── Dockerfile
│   │
│   ├── messaging/                       # Message Processing Service
│   │   ├── src/
│   │   │   ├── sealed_sender.go         # Sealed Sender Protocol
│   │   │   ├── encryption.go            # E2E encryption
│   │   │   └── storage.go               # Cassandra integration
│   │   └── Dockerfile
│   │
│   ├── ai-translation/                  # Python FastAPI AI Service
│   │   ├── main.py
│   │   ├── services/
│   │   │   ├── asr_service.py           # Bhashini/Whisper ASR
│   │   │   ├── llm_service.py           # Llama-3-8B translation
│   │   │   ├── tts_service.py           # Text-to-Speech
│   │   │   └── edge_worker.js           # Cloudflare Worker
│   │   ├── models/
│   │   │   └── (Quantized LLM models)
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   │
│   ├── payments/                        # UPI/ONDC Integration
│   │   ├── src/
│   │   │   ├── upi_integration.js       # NPCI UPI SDK wrapper
│   │   │   ├── beckn_gateway.py         # Beckn Protocol implementation
│   │   │   └── ondc_client.py           # ONDC network client
│   │   └── Dockerfile
│   │
│   ├── presence/                        # Redis-based Presence Service
│   │   ├── presence_service.py
│   │   ├── websocket_handler.py
│   │   └── Dockerfile
│   │
│   └── compliance/                      # DPDP Act Compliance
│       ├── consent_manager.py           # Right to Erase/Access
│       ├── audit_logger.py
│       └── Dockerfile
│
├── shared/                              # Shared Code & Schemas
│   ├── proto/                           # Protocol Buffers
│   │   ├── message.proto
│   │   ├── presence.proto
│   │   └── payment.proto
│   ├── schemas/                         # Database Schemas
│   │   ├── cassandra/
│   │   │   └── message_history.cql
│   │   ├── postgresql/
│   │   │   ├── users.sql
│   │   │   └── transactions.sql
│   │   └── redis/
│   │       └── presence_keys.md
│   └── crypto/
│       └── encryption.js                # Shared encryption library
│
├── infrastructure/                      # DevOps & Infrastructure
│   ├── docker/
│   │   └── docker-compose.yml           # Local development setup
│   ├── k8s/                             # Kubernetes Manifests
│   │   ├── deployments/
│   │   ├── services/
│   │   └── ingress/
│   ├── terraform/                       # AWS Infrastructure as Code
│   │   ├── main.tf
│   │   ├── vpc.tf
│   │   └── rds.tf
│   └── edge-cache-config.yaml           # CtrlS/E2E Networks CDN
│
├── docs/                                # Documentation
│   ├── api-spec.yaml                    # OpenAPI 3.0 Specification
│   ├── architecture.md                  # System Architecture
│   ├── data-localization.md             # DPDP Compliance Guide
│   ├── project-structure.md             # This file
│   └── deployment-guide.md              # Deployment Instructions
│
├── tests/                               # Testing
│   ├── e2e/                             # End-to-End Tests
│   ├── integration/                     # Integration Tests
│   └── performance/                     # Load Testing Scripts
│
└── README.md                            # Project Overview

```

## Technology Stack Summary

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Custom CSS (Nostalgic Bharat Modernism)
- **Fonts:** Noto Sans Devanagari, Noto Sans Tamil, Inter
- **Icons:** Custom SVG library with cultural context

### Backend
- **Gateway:** Golang (MQTT over TLS 1.3)
- **AI Service:** Python FastAPI
- **Payments:** Node.js (UPI SDK wrapper)
- **Presence:** Python with Redis

### Databases
- **Cassandra:** Message history (write-optimized)
- **PostgreSQL:** User profiles, transactions (ACID)
- **Redis:** Presence, session caching

### External Integrations
- **Bhashini/Whisper:** Speech recognition
- **Llama-3-8B/OpenHathi:** Translation
- **NPCI UPI SDK:** Payments
- **ONDC Beckn Protocol:** Commerce
- **DigiLocker:** Identity verification

### Infrastructure
- **Cloud:** AWS Mumbai/Hyderabad (data localization)
- **CDN:** Cloudflare Workers, CtrlS/E2E Networks
- **Containers:** Docker + Kubernetes
- **Monitoring:** Prometheus + Grafana

## Development Workflow

1. **Local Development:**
   ```bash
   cd web-client
   npm install
   npm run dev
   ```

2. **Backend Services:**
   ```bash
   docker-compose up
   ```

3. **Run Tests:**
   ```bash
   npm run test
   npm run test:e2e
   ```

## Deployment

See `docs/deployment-guide.md` for detailed deployment instructions.

## Compliance

All services are configured for DPDP Act 2023 compliance with:
- Data localization in Indian regions
- Automated consent management
- Right to Erase/Access implementation
- 24-hour metadata purging
