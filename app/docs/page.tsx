"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  BookOpen, Key, Upload, List, Download, Trash2,
  Copy, Check, Zap, Pencil, Search, Package,
} from "lucide-react";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import go from "highlight.js/lib/languages/go";
import php from "highlight.js/lib/languages/php";
import "highlight.js/styles/github-dark.css";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("go", go);
hljs.registerLanguage("php", php);

// ─── Types ────────────────────────────────────────────────────────────────────

type Lang = "curl" | "js" | "python" | "go" | "php";

const LANG_LABEL: Record<Lang, string> = {
  curl: "cURL", js: "JavaScript", python: "Python", go: "Go", php: "PHP",
};
const LANG_HJS: Record<Lang, string> = {
  curl: "bash", js: "javascript", python: "python", go: "go", php: "php",
};

// ─── Code block ───────────────────────────────────────────────────────────────

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (ref.current) {
      delete ref.current.dataset.highlighted;
      ref.current.textContent = code;
      hljs.highlightElement(ref.current);
    }
  }, [code, lang]);

  return (
    <div className="relative group rounded-b-xl rounded-tr-xl overflow-hidden border border-gray-700">
      <pre className="!m-0 !rounded-none !bg-[#0d1117]">
        <code ref={ref} className={`language-${lang} !bg-transparent text-sm leading-relaxed`}>
          {code}
        </code>
      </pre>
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="absolute top-3 right-3 p-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition"
      >
        {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
      </button>
    </div>
  );
}

function LanguageTabs({ examples }: { examples: Partial<Record<Lang, string>> }) {
  const langs = Object.keys(examples) as Lang[];
  const [active, setActive] = useState<Lang>(langs[0]);

  return (
    <div>
      <div className="flex gap-px">
        {langs.map((lang) => (
          <button
            key={lang}
            onClick={() => setActive(lang)}
            className={`px-3 py-1.5 text-xs font-mono rounded-t-lg transition border-x border-t ${
              active === lang
                ? "border-gray-700 bg-[#0d1117] text-white"
                : "border-transparent bg-gray-900/40 text-gray-500 hover:text-gray-300"
            }`}
          >
            {LANG_LABEL[lang]}
          </button>
        ))}
      </div>
      <CodeBlock code={examples[active] ?? ""} lang={LANG_HJS[active]} />
    </div>
  );
}

function Block({ code, lang = "bash" }: { code: string; lang?: string }) {
  return <CodeBlock code={code} lang={lang} />;
}

function Section({ id, icon: Icon, title, children }: {
  id: string; icon: React.ElementType; title: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-[#9b3dff]/10 text-[#9b3dff]"><Icon size={16} /></div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

// ─── Code examples (all on /api/v1/ext/* — API key auth) ─────────────────────

const BASE = "https://api.nexium.ai";

const upload: Record<Lang, string> = {
  curl: `curl -X POST \\
  -H "Authorization: Bearer nx_live_..." \\
  -F "file=@photo.jpg" \\
  ${BASE}/api/v1/ext/buckets/<bucket_id>/files`,

  js: `const form = new FormData()
form.append('file', fileInput.files[0])

const res = await fetch('${BASE}/api/v1/ext/buckets/<bucket_id>/files', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + process.env.NEXIUM_API_KEY },
  body: form,
})
const file = await res.json()`,

  python: `import requests, os

with open('photo.jpg', 'rb') as f:
    res = requests.post(
        '${BASE}/api/v1/ext/buckets/<bucket_id>/files',
        headers={'Authorization': f'Bearer {os.getenv("NEXIUM_API_KEY")}'},
        files={'file': ('photo.jpg', f, 'image/jpeg')},
    )
file = res.json()
print(file['id'])`,

  go: `package main

import (
    "bytes"
    "io"
    "mime/multipart"
    "net/http"
    "os"
)

func uploadFile(bucketID, filePath string) {
    f, _ := os.Open(filePath)
    defer f.Close()

    body := &bytes.Buffer{}
    w := multipart.NewWriter(body)
    part, _ := w.CreateFormFile("file", "photo.jpg")
    io.Copy(part, f)
    w.Close()

    req, _ := http.NewRequest("POST",
        "${BASE}/api/v1/ext/buckets/"+bucketID+"/files", body)
    req.Header.Set("Authorization", "Bearer "+os.Getenv("NEXIUM_API_KEY"))
    req.Header.Set("Content-Type", w.FormDataContentType())
    http.DefaultClient.Do(req)
}`,

  php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL            => '${BASE}/api/v1/ext/buckets/<bucket_id>/files',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . getenv('NEXIUM_API_KEY')],
    CURLOPT_POSTFIELDS     => ['file' => new CURLFile('photo.jpg', 'image/jpeg')],
]);
$file = json_decode(curl_exec($curl), true);
echo $file['id']; // save to your database`,
};

const list: Record<Lang, string> = {
  curl: `# All files
curl -H "Authorization: Bearer nx_live_..." \\
  ${BASE}/api/v1/ext/buckets/<bucket_id>/files

# Filter by name
curl -H "Authorization: Bearer nx_live_..." \\
  "${BASE}/api/v1/ext/buckets/<bucket_id>/files?search=photo"`,

  js: `// All files
const files = await fetch('${BASE}/api/v1/ext/buckets/<bucket_id>/files', {
  headers: { Authorization: 'Bearer ' + process.env.NEXIUM_API_KEY },
}).then(r => r.json())

// Filter by name
const results = await fetch(
  '${BASE}/api/v1/ext/buckets/<bucket_id>/files?search=photo',
  { headers: { Authorization: 'Bearer ' + process.env.NEXIUM_API_KEY } }
).then(r => r.json())`,

  python: `import requests, os

# All files
res = requests.get(
    '${BASE}/api/v1/ext/buckets/<bucket_id>/files',
    headers={'Authorization': f'Bearer {os.getenv("NEXIUM_API_KEY")}'},
)

# Filter by name
res = requests.get(
    '${BASE}/api/v1/ext/buckets/<bucket_id>/files',
    params={'search': 'photo'},
    headers={'Authorization': f'Bearer {os.getenv("NEXIUM_API_KEY")}'},
)
for f in res.json()['files']:
    print(f['filename'], f['size_bytes'])`,

  go: `req, _ := http.NewRequest("GET",
    "${BASE}/api/v1/ext/buckets/<bucket_id>/files?search=photo", nil)
req.Header.Set("Authorization", "Bearer "+os.Getenv("NEXIUM_API_KEY"))
resp, _ := http.DefaultClient.Do(req)
// decode resp.Body as { "files": [...], "total": N, "page": 1, "per_page": 24 }`,

  php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL            => '${BASE}/api/v1/ext/buckets/<bucket_id>/files?search=photo',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . getenv('NEXIUM_API_KEY')],
]);
$data = json_decode(curl_exec($curl), true);
foreach ($data['files'] as $f) echo $f['filename'] . PHP_EOL;`,
};

const download: Record<Lang, string> = {
  curl: `curl -H "Authorization: Bearer nx_live_..." \\
  ${BASE}/api/v1/ext/files/<file_id>/download`,

  js: `const { url } = await fetch('${BASE}/api/v1/ext/files/<file_id>/download', {
  headers: { Authorization: 'Bearer ' + process.env.NEXIUM_API_KEY },
}).then(r => r.json())`,

  python: `import requests, os

res = requests.get(
    '${BASE}/api/v1/ext/files/<file_id>/download',
    headers={'Authorization': f'Bearer {os.getenv("NEXIUM_API_KEY")}'},
)
url = res.json()['url']`,

  go: `req, _ := http.NewRequest("GET",
    "${BASE}/api/v1/ext/files/<file_id>/download", nil)
req.Header.Set("Authorization", "Bearer "+os.Getenv("NEXIUM_API_KEY"))
resp, _ := http.DefaultClient.Do(req)`,

  php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL            => '${BASE}/api/v1/ext/files/<file_id>/download',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . getenv('NEXIUM_API_KEY')],
]);
$data = json_decode(curl_exec($curl), true);
echo $data['url'];`,
};

const renameFile: Record<Lang, string> = {
  curl: `curl -X PATCH \\
  -H "Authorization: Bearer nx_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"filename":"new-name.jpg"}' \\
  ${BASE}/api/v1/ext/files/<file_id>`,

  js: `const file = await fetch('${BASE}/api/v1/ext/files/<file_id>', {
  method: 'PATCH',
  headers: {
    Authorization: 'Bearer ' + process.env.NEXIUM_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ filename: 'new-name.jpg' }),
}).then(r => r.json())
console.log(file.filename) // "new-name.jpg"`,

  python: `import requests, os

res = requests.patch(
    '${BASE}/api/v1/ext/files/<file_id>',
    headers={'Authorization': f'Bearer {os.getenv("NEXIUM_API_KEY")}'},
    json={'filename': 'new-name.jpg'},
)
file = res.json()
print(file['filename'])  # "new-name.jpg"`,

  go: `body, _ := json.Marshal(map[string]string{"filename": "new-name.jpg"})
req, _ := http.NewRequest("PATCH",
    "${BASE}/api/v1/ext/files/<file_id>", bytes.NewReader(body))
req.Header.Set("Authorization", "Bearer "+os.Getenv("NEXIUM_API_KEY"))
req.Header.Set("Content-Type", "application/json")
resp, _ := http.DefaultClient.Do(req)`,

  php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL            => '${BASE}/api/v1/ext/files/<file_id>',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST  => 'PATCH',
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . getenv('NEXIUM_API_KEY'), 'Content-Type: application/json'],
    CURLOPT_POSTFIELDS     => json_encode(['filename' => 'new-name.jpg']),
]);
$file = json_decode(curl_exec($curl), true);
echo $file['filename'];`,
};

const deleteFile: Record<Lang, string> = {
  curl: `curl -X DELETE \\
  -H "Authorization: Bearer nx_live_..." \\
  ${BASE}/api/v1/ext/files/<file_id>`,

  js: `await fetch('${BASE}/api/v1/ext/files/<file_id>', {
  method: 'DELETE',
  headers: { Authorization: 'Bearer ' + process.env.NEXIUM_API_KEY },
})`,

  python: `import requests, os

requests.delete(
    '${BASE}/api/v1/ext/files/<file_id>',
    headers={'Authorization': f'Bearer {os.getenv("NEXIUM_API_KEY")}'},
)`,

  go: `req, _ := http.NewRequest("DELETE",
    "${BASE}/api/v1/ext/files/<file_id>", nil)
req.Header.Set("Authorization", "Bearer "+os.Getenv("NEXIUM_API_KEY"))
http.DefaultClient.Do(req)`,

  php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL           => '${BASE}/api/v1/ext/files/<file_id>',
    CURLOPT_CUSTOMREQUEST => 'DELETE',
    CURLOPT_HTTPHEADER    => ['Authorization: Bearer ' . getenv('NEXIUM_API_KEY')],
]);
curl_exec($curl);`,
};

const presignStep1: Record<Lang, string> = {
  curl: `curl -X POST \\
  -H "Authorization: Bearer nx_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"filename":"photo.jpg","mime_type":"image/jpeg"}' \\
  ${BASE}/api/v1/ext/buckets/<bucket_id>/files/presign`,

  js: `const { file_id, object_key, upload_url } = await fetch(
  '${BASE}/api/v1/ext/buckets/<bucket_id>/files/presign',
  {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: 'photo.jpg', mime_type: 'image/jpeg' }),
  }
).then(r => r.json())`,

  python: `import requests, os
presign = requests.post(
    '${BASE}/api/v1/ext/buckets/<bucket_id>/files/presign',
    headers={'Authorization': f'Bearer {os.getenv("NEXIUM_API_KEY")}'},
    json={'filename': 'photo.jpg', 'mime_type': 'image/jpeg'},
).json()`,

  go: `body, _ := json.Marshal(map[string]string{"filename": "photo.jpg", "mime_type": "image/jpeg"})
req, _ := http.NewRequest("POST", "${BASE}/api/v1/ext/buckets/"+bucketID+"/files/presign", bytes.NewReader(body))
req.Header.Set("Authorization", "Bearer "+os.Getenv("NEXIUM_API_KEY"))
req.Header.Set("Content-Type", "application/json")
resp, _ := http.DefaultClient.Do(req)
var presign map[string]any
json.NewDecoder(resp.Body).Decode(&presign)`,

  php: `$presign = json_decode(curl_exec(tap(curl_init('${BASE}/api/v1/ext/buckets/<bucket_id>/files/presign'), function($c) use ($apiKey) {
    curl_setopt_array($c, [
        CURLOPT_RETURNTRANSFER => true, CURLOPT_POST => true,
        CURLOPT_HTTPHEADER     => ['Authorization: Bearer '.$apiKey, 'Content-Type: application/json'],
        CURLOPT_POSTFIELDS     => json_encode(['filename'=>'photo.jpg','mime_type'=>'image/jpeg']),
    ]);
})), true);`,
};

const presignStep2: Record<Lang, string> = {
  curl: `curl -X PUT \\
  -H "Content-Type: image/jpeg" \\
  --data-binary @photo.jpg \\
  "<upload_url>"`,

  js: `await fetch(upload_url, {
  method: 'PUT',
  headers: { 'Content-Type': 'image/jpeg' },
  body: file, // File | Blob | Buffer
})`,

  python: `with open('photo.jpg', 'rb') as f:
    data = f.read()
requests.put(presign['upload_url'], data=data, headers={'Content-Type': 'image/jpeg'})`,

  go: `data, _ := os.ReadFile("photo.jpg")
put, _ := http.NewRequest("PUT", presign["upload_url"].(string), bytes.NewReader(data))
put.Header.Set("Content-Type", "image/jpeg")
http.DefaultClient.Do(put)`,

  php: `$data = file_get_contents('photo.jpg');
$put  = curl_init($presign['upload_url']);
curl_setopt_array($put, [CURLOPT_CUSTOMREQUEST=>'PUT', CURLOPT_POSTFIELDS=>$data,
    CURLOPT_HTTPHEADER=>['Content-Type: image/jpeg'], CURLOPT_RETURNTRANSFER=>true]);
curl_exec($put);`,
};

const presignStep3: Record<Lang, string> = {
  curl: `curl -X POST \\
  -H "Authorization: Bearer nx_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"file_id":"<file_id>","object_key":"<object_key>","filename":"photo.jpg","mime_type":"image/jpeg","size_bytes":204800}' \\
  ${BASE}/api/v1/ext/buckets/<bucket_id>/files/confirm`,

  js: `const saved = await fetch(
  '${BASE}/api/v1/ext/buckets/<bucket_id>/files/confirm',
  {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file_id, object_key,
      filename: 'photo.jpg', mime_type: 'image/jpeg', size_bytes: file.size,
    }),
  }
).then(r => r.json())
console.log(saved.url) // permanent URL`,

  python: `saved = requests.post(
    '${BASE}/api/v1/ext/buckets/<bucket_id>/files/confirm',
    headers={'Authorization': f'Bearer {os.getenv("NEXIUM_API_KEY")}'},
    json={'file_id': presign['file_id'], 'object_key': presign['object_key'],
          'filename': 'photo.jpg', 'mime_type': 'image/jpeg', 'size_bytes': len(data)},
).json()
print(saved['url'])`,

  go: `confirm, _ := json.Marshal(map[string]any{
    "file_id": presign["file_id"], "object_key": presign["object_key"],
    "filename": "photo.jpg", "mime_type": "image/jpeg", "size_bytes": len(data),
})
req2, _ := http.NewRequest("POST", "${BASE}/api/v1/ext/buckets/"+bucketID+"/files/confirm", bytes.NewReader(confirm))
req2.Header.Set("Authorization", "Bearer "+os.Getenv("NEXIUM_API_KEY"))
req2.Header.Set("Content-Type", "application/json")
resp2, _ := http.DefaultClient.Do(req2)`,

  php: `$saved = json_decode(curl_exec(tap(curl_init('${BASE}/api/v1/ext/buckets/<bucket_id>/files/confirm'), function($c) use ($apiKey, $presign, $data) {
    curl_setopt_array($c, [
        CURLOPT_RETURNTRANSFER => true, CURLOPT_POST => true,
        CURLOPT_HTTPHEADER     => ['Authorization: Bearer '.$apiKey, 'Content-Type: application/json'],
        CURLOPT_POSTFIELDS     => json_encode(['file_id'=>$presign['file_id'],'object_key'=>$presign['object_key'],
            'filename'=>'photo.jpg','mime_type'=>'image/jpeg','size_bytes'=>strlen($data)]),
    ]);
})), true);
echo $saved['url'];`,
};

// ─── SDK examples ─────────────────────────────────────────────────────────────

const sdkInstall: Partial<Record<Lang, string>> = {
  js: `# npm
npm install @ainexium/storage

# pnpm
pnpm add @ainexium/storage

# yarn
yarn add @ainexium/storage`,

  python: `pip install nexium-storage

# For file upload support (uses requests under the hood):
pip install "nexium-storage[requests]"`,
};

const sdkUsage: Partial<Record<Lang, string>> = {
  js: `import { NexiumStorage } from '@ainexium/storage'

const storage = new NexiumStorage({ apiKey: process.env.NEXIUM_API_KEY })

// Upload (with optional progress tracking)
const file = await storage.upload(bucketId, fileBlob, 'photo.jpg', {
  onProgress: (pct) => console.log(pct + '%'),
})
console.log(file.id, file.url)

// List & search
const { files, total } = await storage.list(bucketId, { search: 'photo', page: 1 })

// Download URL
const url = await storage.download(file.id)

// Rename
const updated = await storage.rename(file.id, 'new-name.jpg')

// Delete
await storage.delete(file.id)`,

  python: `import os
from nexium_storage import NexiumStorage

storage = NexiumStorage(api_key=os.getenv("NEXIUM_API_KEY"))

# Upload
with open('photo.jpg', 'rb') as f:
    file = storage.upload(bucket_id, f, 'photo.jpg', 'image/jpeg')
print(file.id, file.url)

# List & search
result = storage.list(bucket_id, search='photo', page=1)
for f in result.files:
    print(f.filename, f.size_bytes)

# Download URL
url = storage.download(file.id)

# Rename
updated = storage.rename(file.id, 'new-name.jpg')

# Delete
storage.delete(file.id)`,
};

const sdkWebhook: Partial<Record<Lang, string>> = {
  js: `import { NexiumStorage } from '@ainexium/storage'

// Express / Node.js example
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const payload = await NexiumStorage.verifyWebhook(
      req.body,                               // raw Buffer
      req.headers['x-nexium-signature'],      // "sha256=..."
      process.env.NEXIUM_WEBHOOK_SECRET,
    )
    const event = payload as { event: string; data: unknown }
    console.log(event.event, event.data)      // "file.created", { id, filename, ... }
    res.sendStatus(200)
  } catch {
    res.sendStatus(401)
  }
})`,

  python: `from nexium_storage import NexiumStorage, NexiumError

# Flask example
@app.route('/webhook', methods=['POST'])
def webhook():
    try:
        payload = NexiumStorage.verify_webhook(
            request.get_data(),                        # raw bytes
            request.headers.get('X-Nexium-Signature'), # "sha256=..."
            os.getenv('NEXIUM_WEBHOOK_SECRET'),
        )
        print(payload['event'], payload['data'])       # "file.created", {...}
        return '', 200
    except NexiumError:
        return '', 401`,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "#getting-started", key: "gettingStarted" },
  { href: "#sdks",            key: "sdks" },
  { href: "#authentication",  key: "authentication" },
  { href: "#upload",          key: "upload" },
  { href: "#list",            key: "list" },
  { href: "#download",        key: "download" },
  { href: "#rename",          key: "rename" },
  { href: "#direct-upload",   key: "directUpload" },
  { href: "#delete",          key: "delete" },
  { href: "#errors",          key: "errors" },
] as const;

export default function DocsPage() {
  const t = useTranslations("docs");
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState("getting-started");

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("access_token"));
  }, []);

  const code = (chunks: React.ReactNode) => (
    <code className="text-[#9b3dff]">{chunks}</code>
  );
  const grayCode = (chunks: React.ReactNode) => (
    <code className="text-gray-300">{chunks}</code>
  );
  const ok = (chunks: React.ReactNode) => (
    <code className="text-green-400">{chunks}</code>
  );
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    NAV_ITEMS.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="themed-page min-h-screen bg-[var(--lp-bg)]">
      <nav className="lp-header flex items-center justify-between px-8 py-5 border-b border-gray-800 sticky top-0 backdrop-blur z-10">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-[#9b3dff]">NEXIUM</span>{" "}
          <span className="text-gray-300 text-base font-medium">{t("brand")}</span>
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {loggedIn ? (
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">
              {t("dashboard")}
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-400 hover:text-white transition">
                {t("logIn")}
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 text-sm bg-[#9b3dff] hover:bg-[#aa55ff] rounded-md font-medium transition"
              >
                {t("getStarted")}
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-14 flex gap-12">
        <aside className="hidden lg:block w-48 flex-shrink-0">
          <div className="sticky top-24 space-y-1 text-sm">
            {NAV_ITEMS.map((l) => {
              const isActive = activeSection === l.href.slice(1);
              return (
                <a key={l.href} href={l.href}
                  className={`block px-3 py-1.5 rounded-lg transition ${
                    isActive
                      ? "text-white bg-gray-800 font-medium"
                      : "text-gray-500 hover:text-white hover:bg-gray-800"
                  }`}>
                  {isActive && <span className="inline-block w-1 h-1 rounded-full bg-[#9b3dff] mr-2 mb-0.5" />}
                  {t(`nav.${l.key}`)}
                </a>
              );
            })}
          </div>
        </aside>

        <div className="flex-1 space-y-16 min-w-0">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#9b3dff]/30 bg-[#9b3dff]/10 text-[#9b3dff] text-xs font-medium mb-5">
              {t("badge")}
            </div>
            <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              {t("intro")}
            </p>
          </div>

          <Section id="getting-started" icon={BookOpen} title={t("gettingStarted")}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { n: "1", title: t("step1Title"), body: t("step1Body") },
                { n: "2", title: t("step2Title"), body: t("step2Body") },
                { n: "3", title: t("step3Title"), body: t("step3Body") },
              ].map((s) => (
                <div key={s.n} className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
                  <div className="w-7 h-7 rounded-full bg-[#9b3dff]/20 text-[#9b3dff] text-xs font-bold flex items-center justify-center mb-3">{s.n}</div>
                  <p className="font-semibold mb-1">{s.title}</p>
                  <p className="text-sm text-gray-400">{s.body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="sdks" icon={Package} title={t("sdks")}>
            <p className="text-gray-400">
              {t.rich("sdksIntro", { fetch: code, crypto: code, urllib: code, requests: code })}
            </p>
            <div className="space-y-2">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{t("install")}</p>
              <LanguageTabs examples={sdkInstall} />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{t("usage")}</p>
              <LanguageTabs examples={sdkUsage} />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{t("webhookVerification")}</p>
              <LanguageTabs examples={sdkWebhook} />
            </div>
            <div className="rounded-xl border border-[#9b3dff]/20 bg-[#9b3dff]/5 p-4 text-sm text-blue-300">
              {t("sdksNote")}
            </div>
          </Section>

          <Section id="authentication" icon={Key} title={t("authentication")}>
            <p className="text-gray-400">
              {t.rich("authIntro", { auth: code, ext: code })}
            </p>
            <Block code={`Authorization: Bearer nx_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`} />
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-300">
              {t("authWarn")}
            </div>
          </Section>

          <Section id="upload" icon={Upload} title={t("upload")}>
            <p className="text-gray-400">
              {t.rich("uploadIntro", { mp: code, file: code, id: grayCode })}
            </p>
            <LanguageTabs examples={upload} />
            <p className="text-sm text-gray-500 mt-1">{t.rich("response", { code: (chunks) => <code className="text-green-400">{chunks}</code> })}</p>
            <Block lang="javascript" code={`{
  "id":         "87e60d98-6cde-4e8a-bc65-7ff0b448091b",
  "bucket_id":  "71438929-d96a-4424-a425-552ca5b7a464",
  "filename":   "photo.jpg",
  "mime_type":  "image/jpeg",
  "size_bytes": 245120,
  "url":        "https://cdn.nexiumai.io/71438929-d96a-4424-a425-552ca5b7a464/87e60d98-6cde-4e8a-bc65-7ff0b448091b/87e60d98-6cde-4e8a-bc65-7ff0b448091b_photo.jpg",
  "created_at": "2026-08-16T00:53:23Z"
}`} />
          </Section>

          <Section id="list" icon={List} title={t("list")}>
            <p className="text-gray-400">
              {t.rich("listIntro", { search: code })}
            </p>
            <LanguageTabs examples={list} />
            <p className="text-sm text-gray-500 mt-1">{t.rich("response", { code: () => <code className="text-green-400">200 OK</code> })}</p>
            <Block lang="javascript" code={`{
  "files": [
    {
      "id":         "87e60d98-...",
      "bucket_id":  "71438929-...",
      "filename":   "photo.jpg",
      "mime_type":  "image/jpeg",
      "size_bytes": 245120,
      "url":        "https://cdn.nexiumai.io/71438929-d96a-4424-a425-552ca5b7a464/87e60d98-6cde-4e8a-bc65-7ff0b448091b/87e60d98-6cde-4e8a-bc65-7ff0b448091b_photo.jpg",
      "created_at": "2026-08-16T00:53:23Z"
    }
  ],
  "total":    1,
  "page":     1,
  "per_page": 24
}`} />
          </Section>

          <Section id="download" icon={Download} title={t("download")}>
            <p className="text-gray-400">
              {t.rich("downloadIntro", { img: code, flutter: code })}
            </p>
            <LanguageTabs examples={download} />
            <p className="text-sm text-gray-500 mt-1">{t.rich("response", { code: () => <code className="text-green-400">200 OK</code> })}</p>
            <Block lang="javascript" code={`{ "url": "https://cdn.nexiumai.io/71438929-d96a-4424-a425-552ca5b7a464/87e60d98-6cde-4e8a-bc65-7ff0b448091b/87e60d98-6cde-4e8a-bc65-7ff0b448091b_photo.jpg" }`} />
          </Section>

          <Section id="rename" icon={Pencil} title={t("rename")}>
            <p className="text-gray-400">
              {t.rich("renameIntro", { filename: code })}
            </p>
            <LanguageTabs examples={renameFile} />
            <p className="text-sm text-gray-500 mt-1">{t.rich("renameResponse", { ok })}</p>
          </Section>

          <Section id="direct-upload" icon={Zap} title={t("directUpload")}>
            <p className="text-gray-400">
              {t("directIntro")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { n: "1", title: t("presign1Title"), body: t("presign1Body") },
                { n: "2", title: t("presign2Title"), body: t("presign2Body") },
                { n: "3", title: t("presign3Title"), body: t("presign3Body") },
              ].map((s) => (
                <div key={s.n} className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
                  <div className="w-7 h-7 rounded-full bg-[#9b3dff]/20 text-[#9b3dff] text-xs font-bold flex items-center justify-center mb-3">{s.n}</div>
                  <p className="font-semibold mb-1 text-sm font-mono">{s.title}</p>
                  <p className="text-sm text-gray-400">{s.body}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{t("step1Presign")}</p>
              <LanguageTabs examples={presignStep1} />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{t("step2Put")}</p>
              <LanguageTabs examples={presignStep2} />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{t("step3Confirm")}</p>
              <LanguageTabs examples={presignStep3} />
            </div>
            <p className="text-sm text-gray-500 mt-1">{t.rich("confirmResponse", { code: (chunks) => <code className="text-green-400">{chunks}</code> })}</p>
            <Block lang="javascript" code={`{
  "id":         "87e60d98-...",
  "filename":   "photo.jpg",
  "mime_type":  "image/jpeg",
  "size_bytes": 204800,
  "url":        "https://cdn.nexiumai.io/71438929-d96a-4424-a425-552ca5b7a464/87e60d98-6cde-4e8a-bc65-7ff0b448091b/87e60d98-6cde-4e8a-bc65-7ff0b448091b_photo.jpg",
  "created_at": "2026-08-16T01:20:00Z"
}`} />
          </Section>

          <Section id="delete" icon={Trash2} title={t("delete")}>
            <p className="text-gray-400">{t("deleteIntro")}</p>
            <LanguageTabs examples={deleteFile} />
          </Section>

          <Section id="errors" icon={BookOpen} title={t("errors")}>
            <p className="text-gray-400">{t.rich("errorsIntro", { message: code })}</p>
            <Block lang="javascript" code={`{ "message": "unauthorized" }`} />
            <div className="rounded-xl border border-gray-800 overflow-hidden">
              {[
                { code: "400", color: "text-orange-400", label: "Bad Request",       desc: t("err400") },
                { code: "401", color: "text-red-400",    label: "Unauthorized",      desc: t("err401") },
                { code: "403", color: "text-red-400",    label: "Forbidden",         desc: t("err403") },
                { code: "404", color: "text-yellow-400", label: "Not Found",         desc: t("err404") },
                { code: "409", color: "text-yellow-400", label: "Conflict",          desc: t("err409") },
                { code: "429", color: "text-orange-400", label: "Too Many Requests", desc: t("err429") },
                { code: "500", color: "text-red-400",    label: "Server Error",      desc: t("err500") },
              ].map((e, i, arr) => (
                <div key={e.code} className={`flex items-center gap-4 px-5 py-3.5 ${i < arr.length - 1 ? "border-b border-gray-800" : ""}`}>
                  <code className={`text-sm font-mono font-bold w-10 ${e.color}`}>{e.code}</code>
                  <span className="text-sm font-medium w-36 text-gray-200">{e.label}</span>
                  <span className="text-sm text-gray-400">{e.desc}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
