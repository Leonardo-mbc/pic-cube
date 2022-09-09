interface CheckResponse {
  message: string;
}

export async function check(): Promise<CheckResponse> {
  const request = await fetch('/api/scanner/check', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await request.json();
}

interface StopResponse {
  message: string;
}

export async function stop(): Promise<StopResponse> {
  const request = await fetch('/api/scanner/stop', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await request.json();
}
