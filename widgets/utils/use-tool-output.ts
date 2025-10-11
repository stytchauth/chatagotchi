import { useOpenAiGlobal } from './use-openai-global.ts';
import { useEffect } from 'react';

export function useToolOutput<T>(): T | null {
  const output = useOpenAiGlobal('toolOutput');

  useEffect(() => {
    console.log('Tool output is', output);
  }, [output]);

  // @ts-ignore looks like the response object shape changed?
  // Todo: figure out in discord / docs
  return output?.result?.structuredContent ?? output;
}
