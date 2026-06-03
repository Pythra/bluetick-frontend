/**
 * Safely parse a fetch Response body as JSON.
 * Never throws the cryptic "Unexpected token '<'" — returns a clear Error instead.
 */
export async function parseJsonResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (!text.trim()) {
    return { data: null, isJson: true };
  }

  const trimmed = text.trim();
  const looksLikeJson = trimmed.startsWith('{') || trimmed.startsWith('[');
  const isJsonContentType = contentType.includes('application/json');

  if (!looksLikeJson && !isJsonContentType) {
    throw buildNonJsonError(response.status, trimmed);
  }

  try {
    return { data: JSON.parse(trimmed), isJson: true };
  } catch {
    throw new Error(
      `Server returned invalid JSON (HTTP ${response.status}). Try again or contact support.`
    );
  }
}

function buildNonJsonError(status, body) {
  const isHtml = body.startsWith('<!DOCTYPE') || body.startsWith('<html') || body.startsWith('<');

  if (!isHtml) {
    const snippet = body.slice(0, 120).replace(/\s+/g, ' ');
    return new Error(
      `Server returned an unexpected response (HTTP ${status})${snippet ? `: ${snippet}` : '.'}`
    );
  }

  if (status === 404) {
    return new Error(
      'Email broadcast is not available on this server. Deploy the latest backend, then try again.'
    );
  }

  if (status === 413) {
    return new Error(
      'Message is too large for the server. Remove embedded images or shorten the email, then try again.'
    );
  }

  if (status === 401 || status === 403) {
    return new Error('Your admin session expired. Sign out, sign in again, and retry.');
  }

  if (status >= 502) {
    return new Error(
      'The server is temporarily unavailable (gateway error). Wait a minute and try again.'
    );
  }

  if (status >= 500) {
    return new Error(`Server error (HTTP ${status}). Check backend logs or try again shortly.`);
  }

  return new Error(
    `Server returned an HTML page instead of JSON (HTTP ${status}). Check that the API URL is correct and the backend is running.`
  );
}
