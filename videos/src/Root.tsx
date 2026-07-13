import { Composition } from 'remotion';
import { LoopZyklus } from './LoopZyklus';
import { ContextWindow } from './ContextWindow';
import type { Lang } from './theme';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="LoopZyklus"
        component={LoopZyklus}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ lang: 'de' as Lang }}
      />
      <Composition
        id="ContextWindow"
        component={ContextWindow}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ lang: 'de' as Lang }}
      />
    </>
  );
};
