import { Client } from 'stytch';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { config } from './config.ts';

let client: Client | null = null;

function getClient(): Client {
  if (!client) {
    client = new Client({
      project_id: config.STYTCH_PROJECT_ID,
      secret: config.STYTCH_PROJECT_SECRET,
      custom_base_url: config.STYTCH_DOMAIN,
    });
  }
  return client;
}

export const stytchVerifier = async (token: string): Promise<AuthInfo> => {
  console.time('stytch:introspectTokenLocal');
  try {
    const { audience, scope, expires_at, ...rest } =
      await getClient().idp.introspectTokenLocal(token);
    console.timeEnd('stytch:introspectTokenLocal');
    return {
      token,
      clientId: audience as string,
      scopes: scope.split(' '),
      expiresAt: expires_at,
      extra: rest,
    } satisfies AuthInfo;
  } catch (error) {
    console.timeEnd('stytch:introspectTokenLocal');
    console.error('FAILED AUTH');
    console.error(error);
    throw error;
  }
};

export async function getUserTrustedMetadata(
  userId: string
): Promise<Record<string, unknown>> {
  console.time('stytch:getUserMetadata');
  try {
    const response = await getClient().users.get({ user_id: userId });
    console.timeEnd('stytch:getUserMetadata');
    return response.trusted_metadata || {};
  } catch (error) {
    console.timeEnd('stytch:getUserMetadata');
    console.error('Failed to get user trusted metadata', error);
    return {};
  }
}

export async function updateUserTrustedMetadata(
  userId: string,
  metadata: Record<string, unknown>
): Promise<void> {
  console.time('stytch:updateUserMetadata');
  try {
    await getClient().users.update({
      user_id: userId,
      trusted_metadata: metadata,
    });
    console.timeEnd('stytch:updateUserMetadata');
  } catch (error) {
    console.timeEnd('stytch:updateUserMetadata');
    console.error('Failed to update user trusted metadata', error);
    throw error;
  }
}
