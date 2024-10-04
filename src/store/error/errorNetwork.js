export async function sendError(payload) {
  try {
    const data = await publicPost(`/v1/error`, payload);

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function publicPost(path, body) {
  const response = await fetch(`${import.meta.env.VITE_EASYY_API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw response;

  return await response.json();
}
