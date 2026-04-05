#!/usr/bin/env node
/**
 * 1Password MCP Server for n8m-auto secrets-manager agent
 *
 * Exposes 1Password CLI operations as MCP tools so AI agents
 * (GitHub Copilot secrets-manager) can manage credentials securely.
 *
 * Tools:
 *   - op_get_secret     : Read a specific field from a vault item
 *   - op_list_items     : List items in a vault
 *   - op_create_secret  : Create a new credential item
 *   - op_inject_env     : Resolve op:// references in a string
 *
 * Security: this server NEVER logs secret values.
 * All output masked as <concealed>.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { execSync } from "node:child_process";

const VAULT = "Programing"; // default vault

/**
 * Run an op CLI command safely.
 * Throws on non-zero exit with stderr as message.
 * @param {string[]} args - Arguments to pass to `op`
 * @returns {string} stdout
 */
function runOp(args) {
  const cmd = ["op", ...args].join(" ");
  try {
    return execSync(cmd, {
      encoding: "utf-8",
      env: process.env,
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
  } catch (err) {
    const stderr = err.stderr?.toString() || err.message;
    throw new Error(`op CLI error: ${stderr.trim()}`);
  }
}

// ─── Server Setup ──────────────────────────────────────────────────────────

const server = new McpServer({
  name: "1password-secrets",
  version: "1.0.0",
});

// ─── Tool: op_get_secret ───────────────────────────────────────────────────

server.tool(
  "op_get_secret",
  "Read a field value from a 1Password item. Returns the secret reference (op://) and whether the field is a sensitive type. Does NOT return the raw secret value in the response.",
  {
    item: z.string().describe("Item name or UUID in 1Password"),
    field: z
      .string()
      .default("password")
      .describe("Field name to read (e.g. password, username, token)"),
    vault: z
      .string()
      .default(VAULT)
      .describe("Vault name (default: Programing)"),
  },
  async ({ item, field, vault }) => {
    // Return the op:// reference — never the raw value
    const reference = `op://${vault}/${item}/${field}`;

    // Validate it resolves (will throw if item/field doesn't exist)
    try {
      runOp(["read", `"${reference}"`]);
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error: Could not resolve "${reference}"\n${err.message}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: [
            `✅ Secret reference validated successfully.`,
            ``,
            `Reference: ${reference}`,
            ``,
            `Use this reference in your files instead of the raw secret.`,
            `To inject at runtime: op run --env-file=.env -- docker compose up -d`,
            `To read directly:     op read "${reference}"`,
          ].join("\n"),
        },
      ],
    };
  }
);

// ─── Tool: op_list_items ───────────────────────────────────────────────────

server.tool(
  "op_list_items",
  "List all items in a 1Password vault. Returns item names, categories, and op:// references (no secret values).",
  {
    vault: z
      .string()
      .default(VAULT)
      .describe("Vault name to list (default: Programing)"),
    category: z
      .string()
      .optional()
      .describe(
        "Optional: filter by category (Login, Password, API Credential, etc.)"
      ),
  },
  async ({ vault, category }) => {
    const args = ["item", "list", "--vault", vault, "--format", "json"];
    if (category) {
      args.push("--categories", category);
    }

    let raw;
    try {
      raw = runOp(args);
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error listing vault: ${err.message}` }],
        isError: true,
      };
    }

    const items = JSON.parse(raw);
    const lines = [`Items in vault "${vault}" (${items.length} found):`, ""];

    for (const item of items) {
      lines.push(`- **${item.title}**`);
      lines.push(`  Category: ${item.category}`);
      lines.push(`  ID: ${item.id}`);
      lines.push(`  Reference: op://${vault}/${item.title}`);
      lines.push("");
    }

    return {
      content: [{ type: "text", text: lines.join("\n") }],
    };
  }
);

// ─── Tool: op_create_secret ────────────────────────────────────────────────

server.tool(
  "op_create_secret",
  "Create a new credential item in 1Password with a generated password. Returns the op:// reference.",
  {
    title: z.string().describe("Item title/name in 1Password"),
    username: z.string().default("admin").describe("Username field value"),
    vault: z
      .string()
      .default(VAULT)
      .describe("Vault to store in (default: Programing)"),
    category: z
      .string()
      .default("Login")
      .describe("Item category: Login, Password, API Credential"),
  },
  async ({ title, username, vault, category }) => {
    // Check if item already exists to avoid duplicates
    try {
      runOp(["item", "get", `"${title}"`, "--vault", vault, "--fields", "id"]);
      return {
        content: [
          {
            type: "text",
            text: [
              `⚠️  Item "${title}" already exists in vault "${vault}".`,
              ``,
              `Existing reference: op://${vault}/${title}/password`,
              `To update, delete first: op item delete "${title}" --vault ${vault}`,
            ].join("\n"),
          },
        ],
      };
    } catch {
      // Item doesn't exist — proceed with creation
    }

    const args = [
      "item",
      "create",
      "--vault",
      vault,
      "--category",
      category,
      "--title",
      `"${title}"`,
      `username="${username}"`,
      "--generate-password=letters,digits,symbols,32",
      "--format=json",
    ];

    let raw;
    try {
      raw = runOp(args);
    } catch (err) {
      return {
        content: [
          { type: "text", text: `Error creating item: ${err.message}` },
        ],
        isError: true,
      };
    }

    const item = JSON.parse(raw);
    const passwordRef = item.fields?.find((f) => f.purpose === "PASSWORD")?.reference;
    const usernameRef = item.fields?.find((f) => f.purpose === "USERNAME")?.reference;

    return {
      content: [
        {
          type: "text",
          text: [
            `✅ Created "${title}" in vault "${vault}"`,
            ``,
            `Item ID: ${item.id}`,
            ``,
            `Secret References:`,
            `  Username: ${usernameRef}`,
            `  Password: ${passwordRef}`,
            ``,
            `Add to your .env file:`,
            `  N8N_BASIC_AUTH_USER=${usernameRef}`,
            `  N8N_BASIC_AUTH_PASSWORD=${passwordRef}`,
            ``,
            `Deploy with:`,
            `  op run --env-file=".env" -- docker compose up -d`,
          ].join("\n"),
        },
      ],
    };
  }
);

// ─── Tool: op_inject_env ───────────────────────────────────────────────────

server.tool(
  "op_inject_env",
  "Show which environment variables in the project .env file use op:// references and validate they resolve correctly.",
  {
    env_file: z
      .string()
      .default(".env")
      .describe("Path to the .env file to inspect (default: .env)"),
  },
  async ({ env_file }) => {
    let content;
    try {
      content = runOp([
        "run",
        `--env-file="${env_file}"`,
        "--",
        "pwsh",
        "-c",
        '"Get-ChildItem Env: | Where-Object { $_.Name -like \'N8N_*\' } | ForEach-Object { $_.Name }"',
      ]);
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error validating env file: ${err.message}`,
          },
        ],
        isError: true,
      };
    }

    const vars = content.split("\n").filter(Boolean);

    return {
      content: [
        {
          type: "text",
          text: [
            `✅ op:// references in "${env_file}" validated successfully.`,
            ``,
            `Injected environment variables detectable by Docker:`,
            ...vars.map((v) => `  - ${v} → <concealed by 1Password>`),
            ``,
            `All secrets resolve from vault without touching disk.`,
            `Deploy command: op run --env-file="${env_file}" -- docker compose up -d`,
          ].join("\n"),
        },
      ],
    };
  }
);

// ─── Start ──────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
