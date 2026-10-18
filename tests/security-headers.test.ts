/**
 * Security headers on every path, and a CSP that fits what the app actually loads.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const toml = readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8');
const block = toml.slice(toml.indexOf('for = "/*"'));
const header = (name: string) => block.match(new RegExp(`^\\s*${name} = "([^"]*)"`, 'm'))?.[1];

const SRC = fileURLToPath(new URL('../src', import.meta.url));
const sourceText = (dir: string): string =>
  readdirSync(dir)
    .map((name) => {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) return sourceText(path);
      return /\.(ts|tsx)$/.test(name) ? readFileSync(path, 'utf8') : '';
    })
    .join('\n');

describe('the /* header block', () => {
  it('exists', () => {
    expect(toml).toContain('for = "/*"');
  });

  it('enforces frame, sniffing and referrer rules', () => {
    expect(header('X-Frame-Options')).toBe('DENY');
    expect(header('X-Content-Type-Options')).toBe('nosniff');
    expect(header('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
  });

  it('switches off camera, microphone and location, which the code never uses', () => {
    const policy = header('Permissions-Policy') ?? '';
    for (const feature of ['camera=()', 'microphone=()', 'geolocation=()']) expect(policy).toContain(feature);
    const code = sourceText(SRC);
    expect(code).not.toMatch(/getUserMedia|navigator\.geolocation|mediaDevices/);
  });

  it('has a CSP that allows only this origin, with no third-party script', () => {
    const csp = header('Content-Security-Policy') ?? header('Content-Security-Policy-Report-Only') ?? '';
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self';");
    expect(csp).toContain("connect-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toMatch(/unsafe-eval|https?:\/\//);
  });

  it('fits the code: every fetch goes to this origin\'s own API (the Cloudflare Worker)', () => {
    const code = sourceText(SRC);
    const absoluteFetch = code.match(/fetch\(\s*['"`]https?:/g);
    expect(absoluteFetch).toBeNull();
    expect(code).toContain("'/api/visit'");
    expect(code).toContain("'/api/gift'");
  });

  it('fits index.html: no external script or stylesheet', () => {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    expect(html).not.toMatch(/<script[^>]+src="https?:/);
    expect(html).not.toMatch(/<link[^>]+href="https?:/);
  });
});
