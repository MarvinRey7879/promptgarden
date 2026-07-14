import { Composition } from 'remotion';
import { LoopZyklus } from './LoopZyklus';
import { ContextWindow } from './ContextWindow';
import { GoalDemo, SandboxDemo, LoopDemo, AiderAddDemo } from './TerminalDemo';
import type { Lang } from './theme';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="GoalDemo"
        component={GoalDemo}
        durationInFrames={420}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ lang: 'de' as Lang }}
      />
      <Composition
        id="SandboxDemo"
        component={SandboxDemo}
        durationInFrames={360}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ lang: 'de' as Lang }}
      />
      <Composition
        id="LoopDemo"
        component={LoopDemo}
        durationInFrames={400}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ lang: 'de' as Lang }}
      />
      <Composition
        id="AiderAddDemo"
        component={AiderAddDemo}
        durationInFrames={430}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ lang: 'de' as Lang }}
      />
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
