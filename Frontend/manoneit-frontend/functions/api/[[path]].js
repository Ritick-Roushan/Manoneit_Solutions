export async function onRequest(context) {
  const { request, params } = context;

  const backendUrl = 'https://manoneit-backend.onrender.com';

  // Reconstruct the API path
  const path = params.path
    ? Array.isArray(params.path)
      ? params.path.join('/')
      : params.path
    : '';

  const url = `${backendUrl}/api/${path}${new URL(request.url).search}`;

  // Copy the original request headers
  const headers = new Headers(request.headers);

  // Remove the browser's Host header
  headers.delete('host');

  const init = {
    method: request.method,
    headers,
    redirect: 'follow',
  };

  // GET and HEAD requests don't have a body
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body;
  }

  try {
    const response = await fetch(url, init);

    // Return Render's response back to the browser
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Unable to connect to backend server',
        error: error.message,
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}