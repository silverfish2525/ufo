import type { QueryObject } from "./query";
import { decode, decodePath, encodeHash, encodeHost, encodePath } from "./encoding";
import { parseAuth, parseHost, parseURL } from "./parse";
import { parseQuery, stringifyQuery } from "./query";
import { withTrailingSlash, withoutLeadingSlash } from "./utils";

/**
 * @deprecated use native URL with `new URL(input)` or `parseURL(input)`
 */
export class $URL implements URL {
  public protocol: string;
  public host: string;
  public auth: string;
  public pathname: string;
  public query: QueryObject = {};
  public hash: string;

  public constructor(input = "") {
    if (typeof input !== "string") {
      throw new TypeError(`URL input should be string received ${typeof input} (${String(input)})`);
    }

    const parsed = parseURL(input);

    this.protocol = decode(parsed.protocol);
    this.host = decode(parsed.host);
    this.auth = decode(parsed.auth);
    this.pathname = decodePath(parsed.pathname);
    this.query = parseQuery(parsed.search);
    this.hash = decode(parsed.hash);
  }

  public get hostname(): string {
    return parseHost(this.host).hostname;
  }

  public get port(): string {
    return parseHost(this.host).port ?? "";
  }

  public get username(): string {
    return parseAuth(this.auth).username;
  }

  public get password(): string {
    return parseAuth(this.auth).password || "";
  }

  public get hasProtocol(): number {
    return this.protocol.length;
  }

  public get isAbsolute(): boolean {
    return this.hasProtocol !== 0 || this.pathname.startsWith("/");
  }

  public get search(): string {
    const q = stringifyQuery(this.query);
    return q.length > 0 ? `?${q}` : "";
  }

  public get searchParams(): URLSearchParams {
    const p = new URLSearchParams();
    for (const name in this.query) {
      if (!Object.hasOwn(this.query, name)) {
        continue;
      }
      const value = this.query[name];
      if (Array.isArray(value)) {
        for (const v of value) {
          if (v === undefined || v === null) {
            p.append(name, "");
          } else if (typeof v === "object") {
            p.append(name, JSON.stringify(v));
          } else {
            p.append(name, String(v));
          }
        }
      } else {
        p.append(name, typeof value === "string" ? value : JSON.stringify(value ?? null));
      }
    }
    return p;
  }

  public get origin(): string {
    return (this.protocol ? `${this.protocol}//` : "") + encodeHost(this.host);
  }

  public get fullpath(): string {
    return encodePath(this.pathname) + this.search + encodeHash(this.hash);
  }

  public get encodedAuth(): string {
    if (this.auth === "") {
      return "";
    }
    const { username, password } = parseAuth(this.auth);
    return encodeURIComponent(username) + (password ? `:${encodeURIComponent(password)}` : "");
  }

  public get href(): string {
    const auth = this.encodedAuth;
    const originWithAuth =
      (this.protocol ? `${this.protocol}//` : "") +
      (auth ? `${auth}@` : "") +
      encodeHost(this.host);
    return this.hasProtocol !== 0 && this.isAbsolute
      ? originWithAuth + this.fullpath
      : this.fullpath;
  }

  public append(url: $URL): void {
    if (url.hasProtocol) {
      throw new Error("Cannot append a URL with protocol");
    }

    Object.assign(this.query, url.query);

    if (url.pathname) {
      this.pathname = withTrailingSlash(this.pathname) + withoutLeadingSlash(url.pathname);
    }

    if (url.hash) {
      this.hash = url.hash;
    }
  }

  public toJSON(): string {
    return this.href;
  }

  public toString(): string {
    return this.href;
  }
}

/**
 * @deprecated use native URL with `new URL(input)` or `parseURL(input)`
 *
 * @param input - The URL string to parse.
 * @returns A new `$URL` instance wrapping the parsed URL.
 */
export function createURL(input: string): $URL {
  return new $URL(input);
}
