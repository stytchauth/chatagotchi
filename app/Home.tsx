import { useStytchUser } from '@stytch/react';
import { Logout } from './Auth.tsx';

export default function Home() {
  const { user } = useStytchUser();
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold mb-6">🐣 Chatagotchi Demo</h1>
      <p className="text-gray-500">
        {user && (
          <>
            {' '}
            You are logged in as {user.emails[0].email} <Logout />
          </>
        )}
        {!user && <> You are not logged in</>}
      </p>
      <p className="text-lg">
        This is the homepage for the Chatagotchi demo - a little interactive pet
        in your ChatGPT using the{' '}
        <a
          href="https://developers.openai.com/apps-sdk"
          className="text-blue-600 hover:underline"
        >
          Apps SDK
        </a>
        .
      </p>
      <div>
        <p className="text-lg font-semibold mb-2">
          This demo consists of several parts:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>
            A classic web application (where you are now!) that handles User
            registration and OAuth consent management using{' '}
            <a
              href="https://stytch.com"
              className="text-blue-600 hover:underline"
            >
              Stytch
            </a>
            .
          </li>
          <li>
            A MCP Server running on{' '}
            <a
              href="https://alpic.ai"
              className="text-blue-600 hover:underline"
            >
              Alpic
            </a>
            .
          </li>
          <li>
            Multiple UI widget "microfrontends" hosted on{' '}
            <a
              href="https://vercel.com"
              className="text-blue-600 hover:underline"
            >
              Vercel
            </a>{' '}
            that can be referenced by ChatGPT chats.
          </li>
        </ul>
      </div>
      <p className="text-lg">
        Tools exposed by the MCP Server will return{' '}
        <code className="bg-gray-100 px-2 py-1 rounded">structuredContent</code>{' '}
        that can be rendered by the UI widgets to create rich interactive
        experiences.
      </p>
      <div>
        <p className="text-lg font-semibold mb-2">To use this demo:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>
            Enable{' '}
            <a
              href="https://platform.openai.com/docs/guides/developer-mode"
              className="text-blue-600 hover:underline"
            >
              Developer Mode
            </a>{' '}
            in ChatGPT
          </li>
          <li>
            Connect to the MCP Server running at{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">
              {import.meta.env.VITE_APLIC_MCP_URL ??
                'TODO: Configure Alpic Deployment URL'}
            </code>
          </li>
        </ul>
      </div>
    </div>
  );
}
