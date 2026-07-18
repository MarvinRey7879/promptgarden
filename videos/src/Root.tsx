import { Composition } from 'remotion';
import { LoopZyklus } from './LoopZyklus';
import { ContextWindow } from './ContextWindow';
import { PromptgartenExplainer } from './PromptgartenExplainer';
import { SearchDemo } from './SearchDemo';
import { ChallengeDemo } from './ChallengeDemo';
import { MapDemo } from './MapDemo';
import { CompareDemo } from './CompareDemo';
import { MoeDemo } from './MoeDemo';
import { GoalDemo, SandboxDemo, LoopDemo, AiderAddDemo, CompactDemo, CursorPlanDemo, CodexExecDemo, CodexReviewDemo, AgyPrintDemo } from './TerminalDemo';
import type { Lang } from './theme';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="PromptgartenExplainer"
        component={PromptgartenExplainer}
        durationInFrames={1260}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ lang: 'de' as Lang }}
      />
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
        id="CompactDemo"
        component={CompactDemo}
        durationInFrames={380}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ lang: 'de' as Lang }}
      />
      <Composition
        id="CursorPlanDemo"
        component={CursorPlanDemo}
        durationInFrames={400}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ lang: 'de' as Lang }}
      />
      <Composition
        id="CodexExecDemo"
        component={CodexExecDemo}
        durationInFrames={420}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ lang: 'de' as Lang }}
      />
      <Composition
        id="CodexReviewDemo"
        component={CodexReviewDemo}
        durationInFrames={400}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ lang: 'de' as Lang }}
      />
      <Composition
        id="MoeDemo"
        component={MoeDemo}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ lang: 'de' as Lang }}
      />
      <Composition
        id="CompareDemo"
        component={CompareDemo}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ lang: 'de' as Lang }}
      />
      <Composition
        id="MapDemo"
        component={MapDemo}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ lang: 'de' as Lang }}
      />
      <Composition
        id="ChallengeDemo"
        component={ChallengeDemo}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ lang: 'de' as Lang }}
      />
      <Composition
        id="SearchDemo"
        component={SearchDemo}
        durationInFrames={340}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ lang: 'de' as Lang }}
      />
      <Composition
        id="AgyPrintDemo"
        component={AgyPrintDemo}
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
