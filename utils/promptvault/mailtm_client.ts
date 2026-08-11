import * as https from 'https';

// ── PromptVault-specific email subject constants ───────────────────────────────
export const VERIFICATION_EMAIL_SUBJECT = 'Verify Your Email Address';
export const VERIFICATION_LINK_SEGMENT = '/verify-email'; // e.g. https://stage.promptvault.us/verify-email?code=...&email=...

// ── Interfaces ────────────────────────────────────────────────────────────────
interface MailTmMessage {
  id: string;
  subject: string;
  createdAt: string;
  from?: { address: string };
}

// ── Client ────────────────────────────────────────────────────────────────────
export class PromptVaultMailTmClient {
  private static readonly BASE_URL = 'https://api.mail.tm';
  private token: string | null = null;
  private email: string | null = null;
  private password: string | null = null;

  // ── Core HTTP helper ────────────────────────────────────────────────────────
  private async request(method: string, path: string, body?: Record<string, any>): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = new URL(`${PromptVaultMailTmClient.BASE_URL}${path}`);
      const bodyStr = body ? JSON.stringify(body) : undefined;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
      if (bodyStr) headers['Content-Length'] = Buffer.byteLength(bodyStr).toString();

      const options: https.RequestOptions = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method,
        headers,
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(data);
          }
        });
      });

      req.on('error', reject);
      if (bodyStr) req.write(bodyStr);
      req.end();
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ── Account management ──────────────────────────────────────────────────────
  async get_available_domain(): Promise<string> {
    console.log('Fetching available domains...');
    const res = await this.request('GET', '/domains');
    const domains = res['hydra:member'] || [];
    if (!domains.length) throw new Error('No available domains found.');
    const domain = domains[0].domain;
    if (!domain) throw new Error('No valid domain found in the response.');
    console.log(`Found available domain: ${domain}`);
    return domain;
  }

  async create_email(prefix = 'pvuser', password = 'StrongPass123!'): Promise<string> {
    const domain = await this.get_available_domain();

    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const timestamp = new Date()
        .toISOString()
        .replace(/[-:.TZ]/g, '')
        .slice(0, 14);
      const uniqueSuffix = Math.random().toString(36).slice(2, 8);
      const emailToCreate = `${prefix}${timestamp}${uniqueSuffix}${attempt > 1 ? `r${attempt}` : ''}@${domain}`;
      console.log(`Creating email in MailTM (attempt ${attempt}/${maxAttempts}): ${emailToCreate}`);

      const res = await this.request('POST', '/accounts', {
        address: emailToCreate,
        password,
      });

      if (res.address) {
        this.email = res.address;
        this.password = password;
        console.log(`Created email: ${this.email}`);
        return this.email!;
      }

      console.log(
        `MailTM account creation returned no address (attempt ${attempt}/${maxAttempts}): ${JSON.stringify(res)}`,
      );
      if (attempt < maxAttempts) await this.sleep(2000);
    }

    throw new Error(`Failed to create MailTM account after ${maxAttempts} attempts`);
  }

  async get_auth_token(email?: string, password = 'StrongPass123!'): Promise<void> {
    const addr = email || this.email;
    console.log(`Retrieving auth token for email: ${addr}`);
    const res = await this.request('POST', '/token', {
      address: addr,
      password,
    });
    if (!res.token) throw new Error(`MailTM login failed: ${JSON.stringify(res)}`);
    this.token = res.token;
    console.log('Auth token retrieved successfully.');
  }

  // ── PromptVault verification helper ─────────────────────────────────────────

  /**
   * Waits for the PromptVault "Verify Your Email Address" email and returns
   * the verification URL extracted from the "copy and paste this link" block
   * (e.g. https://stage.promptvault.us/verify-email?code=<uuid>&email=<addr>).
   */
  async wait_for_verification_and_get_url(
    options: {
      timeout?: number;
      pollInterval?: number;
    } = {},
  ): Promise<string> {
    const { timeout = 120000, pollInterval = 5000 } = options;
    if (!this.token) await this.get_auth_token();

    console.log(`Waiting for PromptVault verification email (subject: "${VERIFICATION_EMAIL_SUBJECT}")...`);
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const res = await this.request('GET', '/messages');
      const messages: MailTmMessage[] = (res['hydra:member'] || []).sort(
        (a: MailTmMessage, b: MailTmMessage) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      for (const msg of messages) {
        if (!msg.subject.toLowerCase().includes(VERIFICATION_EMAIL_SUBJECT.toLowerCase())) continue;

        console.log(`Found verification email: "${msg.subject}"`);
        const emailRes = await this.request('GET', `/messages/${msg.id}`);
        const body: string = emailRes.text || emailRes.html || '';

        // Extract all URLs and find the verification link
        const urls = body.match(/https?:\/\/[^\s\])">,]+/g) || [];
        const verificationUrl = urls.find((u) => u.includes(VERIFICATION_LINK_SEGMENT) || u.includes('code='));

        if (verificationUrl) {
          console.log(`Found Verification URL: ${verificationUrl}`);
          // Some email clients HTML-escape "&" as "&amp;" — normalize before returning.
          return verificationUrl.replace(/&amp;/g, '&');
        }

        console.log(`Verification email found but no URL detected. Body URLs: ${JSON.stringify(urls)}`);
      }

      await this.sleep(pollInterval);
    }

    throw new Error(`No PromptVault verification email received within ${timeout / 1000} seconds`);
  }

  /**
   * Extracts the `code` and `email` query params from a verification URL,
   * useful if your app expects them as separate values (e.g. to call a
   * verification API directly instead of visiting the link).
   */
  static parse_verification_url(url: string): { code: string | null; email: string | null } {
    const parsed = new URL(url);
    return {
      code: parsed.searchParams.get('code'),
      email: parsed.searchParams.get('email'),
    };
  }

  /**
   * Convenience getter for the currently active mailbox address.
   */
  get_email(): string | null {
    return this.email;
  }
}
