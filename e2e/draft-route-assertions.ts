import { expect, type APIRequestContext } from "@playwright/test";

export async function expectPrivateDrafts(
  request: APIRequestContext,
  paths: string[],
) {
  for (const path of paths) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(404);
    expect(response.headers().location, path).toBeUndefined();
    expect(await response.text(), path).toMatch(
      /<meta name="robots" content="[^"]*noindex/,
    );
  }
}
