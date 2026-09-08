# 🚀 PromptVault - Playwright Automation Test Suite

A robust, enterprise-grade End-to-End (E2E) Test Automation Framework designed for **PromptVault** using **Playwright**, **TypeScript**, and the **Page Object Model (POM)** design pattern.

---

## 🌟 Key Technical Features

- **Page Object Model (POM) Architecture**: Highly modular, maintainable, and reusable page object structure isolating UI locators from test logic.
- **Global Authentication & Session Reuse (`storageState`)**: Utilizes Playwright global setup (`auth.setup.ts`) to authenticate once and persist browser state (`cookies`, `localStorage`), accelerating suite execution time.
- **Automated Disposable Email Verification (Mail.tm API)**: Integrated custom `PromptVaultMailTmClient` to dynamically create temporary email addresses, capture verification links via API, and verify user signup workflows autonomously.
- **Role-Based Access Control (RBAC) Verification**: Comprehensive permission matrix testing covering **Admin**, **Maintainer**, and **Member** roles for team management and feature access control.
- **Collaboration & Sharing Workflows**: Automated E2E verification of prompt sharing (View/Edit access), access revoking, and Public link sharing across multi-user contexts.
- **Prompt Version Control Testing**: Validates version history generation, revision switching, and URL state retention.
- **Multi-Device & Cross-Browser Capabilities**: Built-in support for Desktop Chrome, Android Chrome (Pixel 5 emulation), and iOS Safari (iPhone 12 emulation).
- **Resilient Waiting & Interaction Utility Layer**: Custom `base_interactions/utils.ts` wrapper functions providing explicit wait strategies (`wait_for_loadState`, `wait_for_element_to_be_absent`, text assertions) to eliminate flaky tests.

---

## 📁 Repository Structure

```text
prompt_vault/
├── Projects/
│   └── promptvault/
│       ├── .env.pv                 # Environment credentials & configuration
│       ├── pages/                  # Page Object Classes & Locators
│       │   ├── login_page.ts
│       │   ├── sign_up_page.ts
│       │   ├── category_page.ts
│       │   ├── prompt_page.ts
│       │   ├── prompt_detail_page.ts
│       │   ├── team_page.ts
│       │   ├── team_detail_page.ts
│       │   ├── profile_page.ts
│       │   ├── community_page.ts
│       │   ├── public_page.ts
│       │   ├── header.ts
│       │   └── sidebar.ts
│       └── tests/                  # Test Specs & Auth Setup
│           ├── auth.setup.ts       # Global Auth setup script
│           ├── authentication.spec.ts
│           ├── test_category_page.spec.ts
│           ├── test_profile_page.spec.ts
│           ├── test_prompt_page.spec.ts
│           ├── test_team_page.spec.ts
│           └── test_team_details_page.spec.ts
├── base_interactions/
│   └── utils.ts                    # Custom Playwright interaction & wait wrappers
├── test_data/
│   └── promptvault/
│       └── data.ts                 # Centralized test data & Faker generators
├── utils/
│   └── promptvault/
│       └── mailtm_client.ts        # Mail.tm API client for disposable email verification
├── playwright.config.ts            # Dynamic multi-project & device configuration
├── package.json                    # Project dependencies & npm scripts
└── GLOBAL_AUTH_SETUP.md            # Global Auth implementation documentation
```

---

## 🛠️ Prerequisites & Setup

1. **Node.js**: Ensure Node.js (`v18+`) is installed.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Install Playwright Browsers**:
   ```bash
   npx playwright install
   ```

---

## ⚙️ Environment Configuration

Create or configure `.env` or project-specific `.env.pv` under `Projects/promptvault/`:

```env
BASE_URL=https://your-promptvault-url.com
TEST_EMAIL=your_test_email@example.com
TEST_PASSWORD=your_test_password
```

---

## 🧪 Executing Tests

### Run PromptVault Suite

```bash
npm run test:pv
```

### Run in CI Mode (Headless)

```bash
npm run test:ci
```

### Run Specs for Other Projects

```bash
npm run test:apex
npm run test:iam
```

### View Test Reports

```bash
npx playwright show-report
```

---

## 🎯 Test Coverage Summary & Resume Highlight

### Modules & Workflows Covered

1. **Authentication & Sign-up**: Global Auth Setup, Registration with real-time Mail.tm email verification, Login/Logout, Password resets.
2. **Category Management**: Full CRUD lifecycle, search filtering, and toast notification assertions.
3. **Prompt Lifecycle & Versioning**: Creation, rich updates, dynamic version history switching, and prompt deletion.
4. **Sharing & Access Control**: View & Edit permission sharing, user access revocation, and public page link sharing.
5. **Team Management & RBAC**: Team creation/updates, team context switching, invitation lifecycle (Admin, Maintainer, Member), pending invitation cancellation, and member removal.
6. **User Profile Settings**: Profile information updates, phone/username changes, password change workflows, and session re-authentication validation.

---

### 📝 Resume Description (1-2 Line Highlight)

> **Automated QA / E2E Testing Highlight:**  
> _Engineered an enterprise Playwright-TypeScript test automation framework with POM architecture, achieving 95%+ E2E workflow coverage across 6 core application modules (Auth, Category, Prompt CRUD/Versioning, Profile, Team RBAC, and Public Sharing) while implementing Global Storage State auth and automated Mail.tm email verification._
