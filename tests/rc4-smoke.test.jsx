import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { transformSync } from '@babel/core';
import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import sessionDiff from '../release-candidates/js/session-diff.js';

const htmlSource = readFileSync(
  path.join(__dirname, '../release-candidates/latency-tester-v3.9-rc4.html'),
  'utf8'
);
const scriptMatches = [...htmlSource.matchAll(/<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/gi)];
const inlineScript = scriptMatches.map(match => match[1]).filter(Boolean).pop() || '';

describe('rc4 dashboard smoke test', () => {
  it('mounts the Latency Tester React app without crashing', async () => {
    expect(inlineScript).not.toEqual('');
    const { code } = transformSync(inlineScript, {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'classic' }]
      ]
    });

    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
      url: 'http://localhost/#comparison'
    });

    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;
    window.React = React;
    window.ReactDOM = ReactDOMClient;
    window.LatencySessionDiff = sessionDiff;
    window.CompareSessionsSummary = () => null;
    Object.defineProperty(window, 'localStorage', {
      value: dom.window.localStorage,
      configurable: true
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: dom.window.sessionStorage,
      configurable: true
    });
    global.localStorage = window.localStorage;
    global.sessionStorage = window.sessionStorage;
    window.alert = () => {};
    window.confirm = () => true;
    window.prompt = () => '';
    window.open = () => {};
    window.navigator.clipboard = { writeText: () => Promise.resolve() };
    global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ defects: [] }) });
    if (!global.URL.createObjectURL) {
      global.URL.createObjectURL = () => 'blob://test';
    }
    if (!global.URL.revokeObjectURL) {
      global.URL.revokeObjectURL = () => {};
    }
    window.requestAnimationFrame = window.requestAnimationFrame || (cb => setTimeout(cb, 0));

    const boot = new Function('window', 'document', 'React', 'ReactDOM', code);
    boot(window, document, React, ReactDOMClient);

    await new Promise(resolve => setTimeout(resolve, 0));
    const rootHtml = dom.window.document.getElementById('root').innerHTML;
    expect(rootHtml).toContain('Hardware Latency Tester');
  });
});
