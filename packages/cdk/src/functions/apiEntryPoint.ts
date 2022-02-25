interface APICallProps {
}

interface APIResponse {
  success: boolean
}

export async function handler(event: APICallProps): Promise<APIResponse> {
  console.log(`Received event: ${JSON.stringify(event)}`);

  return {
    success: true
  }
}
