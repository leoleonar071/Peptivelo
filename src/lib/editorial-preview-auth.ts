export function previewAuthorized(
  authorization: string | null,
  env: Record<string, string | undefined> = process.env,
) {
  const token = env.EDITORIAL_PREVIEW_TOKEN;
  if (env.EDITORIAL_PREVIEW_ENABLED !== "true" || !token || token.length < 32)
    return false;
  const expected = `Basic ${btoa(`editor:${token}`)}`;
  if (!authorization || authorization.length !== expected.length) return false;
  let difference = 0;
  for (let i = 0; i < expected.length; i++)
    difference |= expected.charCodeAt(i) ^ authorization.charCodeAt(i);
  return difference === 0;
}
