# Supabase Auth References Audit

**Generated**: 2025-10-08T15:29:32.489Z
**Status**: ✅ Supabase Found

## Summary

- **Supabase client library**: ✅ FOUND (108 occurrences)
- **Supabase auth helpers**: ✅ FOUND (62 occurrences)
- **Supabase client creation**: ✅ FOUND (213 occurrences)
- **Supabase sign in**: ✅ FOUND (11 occurrences)
- **Supabase auth calls**: ✅ FOUND (82 occurrences)
- **Session retrieval (Supabase or NextAuth)**: ✅ FOUND (60 occurrences)
- **User retrieval (Supabase)**: ✅ FOUND (35 occurrences)

## Detailed Findings


### Supabase client library

```
./app/admin/ai-assistant/page.tsx:4:import { createClient } from '@supabase/supabase-js';
./app/admin/spatial-studio-dev/projects/page.tsx:5:import { createClient } from '@supabase/supabase-js';
./app/admin/subscriptions/page.tsx:4:import { createClient } from '@supabase/supabase-js';
./app/ai-assessment/page.tsx:6:import { createClient } from '@supabase/supabase-js';
./app/api/admin/activity-logs/route.ts:3:import { createClient } from '@supabase/supabase-js';
./app/api/admin/ai-analytics/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/admin/ai-providers/route.ts:4:import { createClient } from '@supabase/supabase-js'
./app/api/admin/assessments/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/admin/chatbot-analytics/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/admin/create-user/route.ts:8:import { createClient } from '@supabase/supabase-js';
./app/api/admin/dashboard/route.ts:8:import { createClient } from '@supabase/supabase-js';
./app/api/admin/delete-user/route.ts:8:import { createClient } from '@supabase/supabase-js';
./app/api/admin/export/route.ts:8:import { createClient } from '@supabase/supabase-js';
./app/api/admin/get-admins/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/admin/get-user/route.ts:3:import { createClient } from '@supabase/supabase-js';
./app/api/admin/harvester/route.ts:2:import { createClient } from '@supabase/supabase-js'
./app/api/admin/leads-analytics/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/admin/operations/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/admin/spatial-analytics/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/admin/subscriptions/cancel/route.ts:8:import { createClient } from '@supabase/supabase-js';
./app/api/admin/subscriptions/extend-trial/route.ts:8:import { createClient } from '@supabase/supabase-js';
./app/api/admin/subscriptions/upgrade/route.ts:8:import { createClient } from '@supabase/supabase-js';
./app/api/admin/suspend-user/route.ts:8:import { createClient } from '@supabase/supabase-js';
./app/api/admin/update-permissions/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/admin/update-user/route.ts:3:import { createClient } from '@supabase/supabase-js';
./app/api/admin/user-journey/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/ai/chat/route.ts:12:import { createClient } from '@supabase/supabase-js'
./app/api/ai/logging/route.ts:2:import { createClient } from '@supabase/supabase-js'
./app/api/ai-assessment/route.ts:13:import { createClient } from '@supabase/supabase-js';
./app/api/careers/applications/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/chat/message/route.ts:3:import { createClient } from '@supabase/supabase-js';
./app/api/chat/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/creative-studio/assets/route.ts:2:import { createClient } from '@supabase/supabase-js'
./app/api/creative-studio/generate/route.ts:2:import { createClient } from '@supabase/supabase-js'
./app/api/creative-studio/publish/route.ts:2:import { createClient } from '@supabase/supabase-js'
./app/api/creative-studio/upload/route.ts:2:import { createClient } from '@supabase/supabase-js'
./app/api/demo-dashboard/route.ts:7:import { createClient } from '@supabase/supabase-js'
./app/api/help-search/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/leads/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/leads-tracking/route.ts:7:import { createClient } from '@supabase/supabase-js'
./app/api/log-lead/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/products/search/route.ts:2:import { createClient } from '@supabase/supabase-js'
./app/api/spatial-studio/add-annotation/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/spatial-studio/analytics/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/spatial-studio/analyze-site/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/spatial-studio/process-analysis/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/spatial-studio/upload-floorplan/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/subscribe/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/waitlist/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/webhooks/calendly/route.ts:7:import { createClient } from '@supabase/supabase-js'
./app/api/webhooks/stripe/route.ts:9:import { createClient } from '@supabase/supabase-js';
./app/auth/confirm/route.ts:1:import { type EmailOtpType } from '@supabase/supabase-js'
./app/hooks/useSupabaseAuth.ts:5:import type { User, Session } from '@supabase/supabase-js';
./docs/CLAUDE_PROJECT_BRIEF_SPATIAL_STUDIO.md:27
... (truncated)
```


### Supabase auth helpers

```
./app/account/page.tsx:10:import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
./app/admin/super/activity/page.tsx:3:import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
./app/admin/super/create-user/page.tsx:3:import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
./app/admin/super/edit-user/[userId]/page.tsx:3:import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
./app/api/admin/activity-logs/route.ts:2:import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
./app/api/admin/create-user/route.ts:7:import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
./app/api/admin/dashboard/route.ts:7:import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
./app/api/admin/delete-user/route.ts:7:import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
./app/api/admin/export/route.ts:7:import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
./app/api/admin/get-user/route.ts:2:import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
./app/api/admin/suspend-user/route.ts:7:import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
./app/api/admin/update-user/route.ts:2:import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
./app/api/stripe/create-portal-session/route.ts:3:import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
./app/api/usage/check/route.ts:2:import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
./app/dashboard/page.tsx:11:import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
./app/login/page.tsx:6:import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
./app/signup/page.tsx:6:import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
./CLAUDE_DESKTOP_UI_PROMPT.md:469:import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
./docs/CLAUDE_PROJECT_BRIEF_SPATIAL_STUDIO.md:185:import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
./docs/CLAUDE_PROJECT_BRIEF_SPATIAL_STUDIO.md:221:import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
./docs/CLAUDE_PROJECT_BRIEF_SPATIAL_STUDIO.md:270:   npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
./docs/SPATIAL_STUDIO_EXTRACTION_PLAN.md:673:import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
./docs/SPATIAL_STUDIO_EXTRACTION_PLAN.md:715:import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
./DOC_AI_AUTH_STRATEGY.md:47:import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
./DOC_AI_IMPLEMENTATION_PLAN.md:48:- `lib/hooks/useUnifiedAuth.ts` → Use `@supabase/auth-helpers-nextjs`
./DOC_AI_NEXT_STEPS.md:40:   npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
./DOC_AI_PROGRESS_SESSION1.md:13:   - `@supabase/auth-helpers-nextjs`
./DOC_AI_PROGRESS_SESSION1.md:64:- Added: `@supabase/auth-helpers-nextjs`
./FUTURE_DEVELOPMENT_ROADMAP.md:1170:- **Legacy Auth Package:** @supabase/auth-helpers-nextjs deprecated (migrate to @supabase/ssr eventually)
./lib/api-auth.ts:6:import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
./lib/check-business-access.ts:6:import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
./lib/hooks/useSupabaseAuth.ts:11:import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
./lib/hooks/useUnifiedAuth.ts:8:import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
./lib/hooks/useUnifiedAuth.ts:251: * import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
./lib/permissions.ts:7:import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
./lib/supabase-admin-auth.ts:7:import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
./middleware.ts:10:import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
./package-lock.json:45:        "@supabase/auth-helpers-nextjs": "^0.10.0",
./package-lock.json:3827:    "node_modules/@supabase/auth-helpers-nextjs": {
./package-lock.json:3829:      "resolved": "https://registry.npmjs.org/@supabase/auth-helpers-nextjs/-/auth-helpers-nextjs-0.10.0.tgz",
./package-lock.json:3834:        "@supabase/auth-helpers-shared": "0.7.0",
./package-lock.json:3841:    "node_modules/@supabase/auth-helpers-shared": {
./package-lock.json:3843:      "resolved": "https://registry.npmjs.org/@supabase/auth-helpers-shared/-/auth-helpers-shared-0.7.0.tgz",
./package.json:51:    "@supabase/auth-helpers-nextjs": "latest",
./ROUTING_AUTH_AUDIT_REPORT.md:495:import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
./SUPABASE_AUTH_MIGRATION_COMPLETE.md:39:- Complete rewrite of AI chat route using `@supabase/auth-helpers-nextjs`
./SUPABASE_AUTH_MIGRATION_COMPLETE.md:94:npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
./SUPABASE
... (truncated)
```


### Supabase client creation

```
./app/account/page.tsx:10:import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
./app/account/page.tsx:24:  const supabase = createClientComponentClient();
./app/admin/ai-assistant/page.tsx:4:import { createClient } from '@supabase/supabase-js';
./app/admin/ai-assistant/page.tsx:10:const supabase = createClient(supabaseUrl, supabaseAnonKey)
./app/admin/spatial-studio-dev/projects/page.tsx:5:import { createClient } from '@supabase/supabase-js';
./app/admin/spatial-studio-dev/projects/page.tsx:7:const supabase = createClient(
./app/admin/subscriptions/page.tsx:4:import { createClient } from '@supabase/supabase-js';
./app/admin/subscriptions/page.tsx:74:  const supabase = createClient(
./app/admin/super/activity/page.tsx:3:import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
./app/admin/super/activity/page.tsx:24:  const supabase = createClientComponentClient();
./app/admin/super/create-user/page.tsx:3:import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
./app/admin/super/create-user/page.tsx:9:  const supabase = createClientComponentClient();
./app/admin/super/edit-user/[userId]/page.tsx:3:import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
./app/admin/super/edit-user/[userId]/page.tsx:56:  const supabase = createClientComponentClient();
./app/ai-assessment/page.tsx:6:import { createClient } from '@supabase/supabase-js';
./app/ai-assessment/page.tsx:9:const supabase = createClient(
./app/api/admin/activity-logs/route.ts:3:import { createClient } from '@supabase/supabase-js';
./app/api/admin/activity-logs/route.ts:6:const supabase = createClient(
./app/api/admin/ai-analytics/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/admin/ai-analytics/route.ts:7:const supabase = createClient(
./app/api/admin/ai-providers/route.ts:4:import { createClient } from '@supabase/supabase-js'
./app/api/admin/ai-providers/route.ts:118:    const supabase = createClient(supabaseUrl, supabaseKey)
./app/api/admin/ai-providers/route.ts:142:      const supabase = createClient(supabaseUrl, supabaseKey)
./app/api/admin/assessments/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/admin/assessments/route.ts:6:const supabase = createClient(supabaseUrl, supabaseServiceKey)
./app/api/admin/chatbot-analytics/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/admin/chatbot-analytics/route.ts:9:const supabase = createClient(supabaseUrl, supabaseServiceKey);
./app/api/admin/create-user/route.ts:8:import { createClient } from '@supabase/supabase-js';
./app/api/admin/create-user/route.ts:11:const supabaseAdmin = createClient(
./app/api/admin/dashboard/route.ts:8:import { createClient } from '@supabase/supabase-js';
./app/api/admin/dashboard/route.ts:11:const supabase = createClient(
./app/api/admin/delete-user/route.ts:8:import { createClient } from '@supabase/supabase-js';
./app/api/admin/delete-user/route.ts:11:const supabase = createClient(
./app/api/admin/export/route.ts:8:import { createClient } from '@supabase/supabase-js';
./app/api/admin/export/route.ts:11:const supabase = createClient(
./app/api/admin/get-admins/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/admin/get-admins/route.ts:4:const supabase = createClient(
./app/api/admin/get-user/route.ts:3:import { createClient } from '@supabase/supabase-js';
./app/api/admin/get-user/route.ts:6:const supabase = createClient(
./app/api/admin/harvester/route.ts:2:import { createClient } from '@supabase/supabase-js'
./app/api/admin/harvester/route.ts:10:  supabase = createClient(supabaseUrl, supabaseServiceKey)
./app/api/admin/leads-analytics/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/admin/leads-analytics/route.ts:9:const supabase = createClient(supabaseUrl, supabaseServiceKey);
./app/api/admin/operations/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/admin/operations/route.ts:7:const supabase = createClient(
./app/api/admin/spatial-analytics/route.ts:2:import { createClient } from '@supabase/supabase-js';
./app/api/admin/spatial-analytics/route.ts:9:const supabase = createClient(supabaseUrl, supabaseServiceKey);
./app/api/admin/subscriptions/cancel/route.ts:8:import { createClient } from '@supabase/supabase-js';
./app/api/admin/subscriptions/cancel/route.ts:22:  return createClient(
./app/api/admin/subscriptions/extend-trial/route.ts:8:import { createClient } from '@supabase/supabase-js';
./app/api/admin/subscriptions/extend-trial/route.ts:22:  return createClient(
./app/api/admin/subscriptions/upgrade/route.ts:8:import { createClient } from '@supabase/supabase-js';
./app/api/admin/subscriptions/upgrade/route.ts:22:  return createClient(
./app/api/admin/suspend-user/route.ts:8:import { createClient } from '@supabase/supabase-js';
./app/api/admin/suspend-user/route.ts:11:const supabase = createClient(
./app/api/admin/update-permissions/route
... (truncated)
```


### Supabase sign in

```
./app/login/page.tsx:56:      const { data, error: signInError } = await supabase.auth.signInWithPassword({
./DOC_AI_NAVIGATION_MAP.md:225:    const { data, error } = await supabase.auth.signInWithPassword({
./lib/hooks/useUnifiedAuth.ts:258: * await supabase.auth.signInWithPassword({ email, password });
./lib/hooks/useUnifiedAuth.ts:269: * - `signIn()` → `supabase.auth.signInWithPassword()`
./lib/supabase.ts:37:    return await supabase.auth.signInWithPassword({
./SUPABASE_AUTH_MIGRATION_COMPLETE.md:194:      supabase.auth.signInWithPassword({ email, password }),
./SUPABASE_AUTH_MIGRATION_COMPLETE.md:219:    const { data, error } = await supabase.auth.signInWithPassword({
./SUPABASE_AUTH_MIGRATION_GUIDE.md:104:const { data, error } = await supabase.auth.signInWithPassword({
./SUPABASE_AUTH_MIGRATION_GUIDE.md:197:      const { data, error } = await supabase.auth.signInWithPassword({
./SUPABASE_AUTH_MIGRATION_PLAN.md:128:      supabase.auth.signInWithPassword({ email, password }),
./SUPABASE_AUTH_MIGRATION_PLAN.md:233:    const { data, error } = await supabase.auth.signInWithPassword({

```


### Supabase auth calls

```
./app/account/page.tsx:34:        const { data: { session } } = await supabase.auth.getSession();
./app/admin/super/activity/page.tsx:34:    supabase.auth.getSession().then(({ data: { session } }) => {
./app/admin/super/activity/page.tsx:48:    } = supabase.auth.onAuthStateChange((_event, session) => {
./app/admin/super/create-user/page.tsx:30:    supabase.auth.getSession().then(({ data: { session } }) => {
./app/admin/super/create-user/page.tsx:44:    } = supabase.auth.onAuthStateChange((_event, session) => {
./app/admin/super/edit-user/[userId]/page.tsx:99:    supabase.auth.getSession().then(({ data: { session } }) => {
./app/admin/super/edit-user/[userId]/page.tsx:113:    } = supabase.auth.onAuthStateChange((_event, session) => {
./app/api/stripe/create-portal-session/route.ts:20:    const { data: { session } } = await supabase.auth.getSession();
./app/api/usage/check/route.ts:10:    const { data: { session } } = await supabase.auth.getSession();
./app/api/usage/check/route.ts:28:    const { data: { session } } = await supabase.auth.getSession();
./app/auth/confirm/route.ts:13:      const { error, data } = await supabase.auth.verifyOtp({
./app/dashboard/page.tsx:50:        const { data: { session } } = await supabase.auth.getSession();
./app/dashboard/page.tsx:133:    await supabase.auth.signOut();
./app/hooks/useSupabaseAuth.ts:26:    const { data: { subscription } } = supabase.auth.onAuthStateChange(
./app/login/page.tsx:24:      const { data: { session } } = await supabase.auth.getSession();
./app/login/page.tsx:56:      const { data, error: signInError } = await supabase.auth.signInWithPassword({
./app/login/page.tsx:178:      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
./app/signup/page.tsx:26:      const { data: { session } } = await supabase.auth.getSession();
./app/signup/page.tsx:54:      const { data, error: signUpError } = await supabase.auth.signUp({
./DATABASE_BACKUP_ANALYSIS.md:260:   - Change `getServerSession(authOptions)` → `supabase.auth.getUser()`
./docs/CLAUDE_PROJECT_BRIEF_SPATIAL_STUDIO.md:193:  const { data: { session } } = await supabase.auth.getSession()
./docs/CLAUDE_PROJECT_BRIEF_SPATIAL_STUDIO.md:226:  const { data: { session } } = await supabase.auth.getSession()
./docs/SPATIAL_STUDIO_EXTRACTION_PLAN.md:683:  } = await supabase.auth.getSession()
./docs/SPATIAL_STUDIO_EXTRACTION_PLAN.md:722:  const { data: { session } } = await supabase.auth.getSession()
./DOC_AI_AUTH_STRATEGY.md:49:const { data: { session } } = await supabase.auth.getSession();
./DOC_AI_MIGRATION_ANALYSIS.md:92:1. Extract JWT from Authorization header → supabase.auth.getUser()
./DOC_AI_MIGRATION_ANALYSIS.md:107:const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
./DOC_AI_NAVIGATION_MAP.md:225:    const { data, error } = await supabase.auth.signInWithPassword({
./lib/api-auth.ts:17:  const { data: { session }, error } = await supabase.auth.getSession();
./lib/api-auth.ts:77:  const { data: { session } } = await supabase.auth.getSession();
./lib/check-business-access.ts:33:    const { data: { user } } = await supabase.auth.getUser();
./lib/hooks/useSupabaseAuth.ts:89:    supabase.auth.getSession().then(({ data: { session } }) => {
./lib/hooks/useSupabaseAuth.ts:101:    } = supabase.auth.onAuthStateChange((_event, session) => {
./lib/hooks/useSupabaseAuth.ts:155:    await supabase.auth.signOut();
./lib/hooks/useUnifiedAuth.ts:73:    supabase.auth.getSession().then(({ data: { session } }) => {
./lib/hooks/useUnifiedAuth.ts:85:    } = supabase.auth.onAuthStateChange((_event, session) => {
./lib/hooks/useUnifiedAuth.ts:258: * await supabase.auth.signInWithPassword({ email, password });
./lib/hooks/useUnifiedAuth.ts:259: * await supabase.auth.signOut();
./lib/hooks/useUnifiedAuth.ts:269: * - `signIn()` → `supabase.auth.signInWithPassword()`
./lib/hooks/useUnifiedAuth.ts:270: * - `signOut()` → `supabase.auth.signOut()`
./lib/permissions.ts:54:  const { data: { session } } = await supabase.auth.getSession();
./lib/sessionManager.ts:277:      const { data: { user: authUser } } = await supabase.auth.getUser();
./lib/sessionManager.ts:352:      const { data: { user: authUser } } = await supabase.auth.getUser();
./lib/sessionManager.ts:384:      const { data: { user: authUser } } = await supabase.auth.getUser();
./lib/supabase-admin-auth.ts:32:    } = await supabase.auth.getSession();
./lib/supabase.ts:22:    return await supabase.auth.signUp({
./lib/supabase.ts:37:    return await supabase.auth.signInWithPassword({
./lib/supabase.ts:143:      const { data, error } = await supabase.auth.signInWithOtp({
./lib/supabase.ts:185:    return await supabase.auth.signInWithOAuth({
./lib/supabase.ts:195:    return await supabase.auth.signOut()
./lib/supabase.ts:200:    const { data: { user } } = await supabase.auth.getUser()
./lib/supabase.ts:206:    const { data: { session } } = await supabase.auth.getSession()
./LOGOUT_COMMAND.txt:5:await su
... (truncated)
```


### Session retrieval (Supabase or NextAuth)

```
./app/account/page.tsx:34:        const { data: { session } } = await supabase.auth.getSession();
./app/admin/session-debug/page.tsx:16:    const summary = sessionManager.getSessionSummary()
./app/admin/super/activity/page.tsx:34:    supabase.auth.getSession().then(({ data: { session } }) => {
./app/admin/super/create-user/page.tsx:30:    supabase.auth.getSession().then(({ data: { session } }) => {
./app/admin/super/edit-user/[userId]/page.tsx:99:    supabase.auth.getSession().then(({ data: { session } }) => {
./app/ai-assistant/page.tsx:376:  const switchToSession = async (targetSessionId: string) => {
./app/ai-assistant/page.tsx:377:    setSessionId(targetSessionId)
./app/ai-assistant/page.tsx:378:    sessionStorage.setItem('ai_current_session', targetSessionId)
./app/ai-assistant/page.tsx:380:    await loadSession(targetSessionId, userHash)
./app/api/admin/activity-logs/route.ts:15:    const { data: { session } } = await supabaseAuth.auth.getSession();
./app/api/admin/ai-analytics/route.ts:33:      getSessionMetrics(startDate),
./app/api/admin/ai-analytics/route.ts:70:async function getSessionMetrics(startDate: Date) {
./app/api/admin/create-user/route.ts:26:    const { data: { session } } = await supabaseAuth.auth.getSession();
./app/api/admin/dashboard/route.ts:20:    const { data: { session } } = await supabaseAuth.auth.getSession();
./app/api/admin/delete-user/route.ts:19:    const { data: { session } } = await supabaseAuth.auth.getSession();
./app/api/admin/export/route.ts:20:    const { data: { session } } = await supabaseAuth.auth.getSession();
./app/api/admin/get-user/route.ts:15:    const { data: { session } } = await supabaseAuth.auth.getSession();
./app/api/admin/suspend-user/route.ts:19:    const { data: { session } } = await supabaseAuth.auth.getSession();
./app/api/admin/update-user/route.ts:15:    const { data: { session } } = await supabaseAuth.auth.getSession();
./app/api/ai/logging/route.ts:20:        return await getSession(data)
./app/api/ai/logging/route.ts:115:async function getSession(data: any) {
./app/api/stripe/create-portal-session/route.ts:20:    const { data: { session } } = await supabase.auth.getSession();
./app/api/usage/check/route.ts:10:    const { data: { session } } = await supabase.auth.getSession();
./app/api/usage/check/route.ts:28:    const { data: { session } } = await supabase.auth.getSession();
./app/dashboard/page.tsx:50:        const { data: { session } } = await supabase.auth.getSession();
./app/login/page.tsx:24:      const { data: { session } } = await supabase.auth.getSession();
./app/signup/page.tsx:26:      const { data: { session } } = await supabase.auth.getSession();
./docs/CLAUDE_PROJECT_BRIEF_SPATIAL_STUDIO.md:193:  const { data: { session } } = await supabase.auth.getSession()
./docs/CLAUDE_PROJECT_BRIEF_SPATIAL_STUDIO.md:226:  const { data: { session } } = await supabase.auth.getSession()
./docs/CLAUDE_PROJECT_BRIEF_SPATIAL_STUDIO.md:368:import { getSession } from 'next-auth/react'
./docs/CLAUDE_PROJECT_BRIEF_SPATIAL_STUDIO.md:373:  const session = await getSession()
./docs/CLAUDE_PROJECT_BRIEF_SPATIAL_STUDIO.md:387:  const session = await getSession()
./docs/SPATIAL_STUDIO_EXTRACTION_PLAN.md:421:import { getSession } from 'next-auth/react'
./docs/SPATIAL_STUDIO_EXTRACTION_PLAN.md:426:  const session = await getSession()
./docs/SPATIAL_STUDIO_EXTRACTION_PLAN.md:440:  const session = await getSession()
./docs/SPATIAL_STUDIO_EXTRACTION_PLAN.md:683:  } = await supabase.auth.getSession()
./docs/SPATIAL_STUDIO_EXTRACTION_PLAN.md:722:  const { data: { session } } = await supabase.auth.getSession()
./docs/SPATIAL_STUDIO_EXTRACTION_PLAN.md:872:import { getSession } from 'next-auth/react'
./DOC_AI_AUTH_STRATEGY.md:49:const { data: { session } } = await supabase.auth.getSession();
./DOC_AI_PROGRESS_SESSION1.md:201:2. Replace `useSession` with `getSession`
./lib/api-auth.ts:17:  const { data: { session }, error } = await supabase.auth.getSession();
./lib/api-auth.ts:77:  const { data: { session } } = await supabase.auth.getSession();
./lib/hooks/useSupabaseAuth.ts:89:    supabase.auth.getSession().then(({ data: { session } }) => {
./lib/hooks/useUnifiedAuth.ts:73:    supabase.auth.getSession().then(({ data: { session } }) => {
./lib/permissions.ts:54:  const { data: { session } } = await supabase.auth.getSession();
./lib/sessionManager.ts:256:  getSessionSummary(): {
./lib/supabase-admin-auth.ts:32:    } = await supabase.auth.getSession();
./lib/supabase.ts:206:    const { data: { session } } = await supabase.auth.getSession()
./middleware.ts:27:    const { data: { session } } = await supabase.auth.getSession();
./middleware.ts:90:    const { data: { session } } = await supabase.auth.getSession();
./ROUTING_AUTH_AUDIT_REPORT.md:501:  const { data: { session } } = await supabase.auth.getSession()
./SUPABASE_AUTH_MIGRATION_COMPLETE.md:124:const { data: { session } } = await supabase.auth.getSession()
./SUPABASE_AUTH_MIGRATION_COMPLETE.md:165:    supabase.auth.
... (truncated)
```


### User retrieval (Supabase)

```
./app/admin/session-debug/page.tsx:17:    const localProjects = sessionManager.getUserProjects()
./app/api/admin/ai-analytics/route.ts:35:      getUserEngagement(startDate),
./app/api/admin/ai-analytics/route.ts:178:async function getUserEngagement(startDate: Date) {
./app/api/admin/get-permissions/route.ts:2:import { getUserPermissions } from '@/lib/permission-checker';
./app/api/admin/get-permissions/route.ts:16:    const permissions = await getUserPermissions(userId);
./app/api/admin/operations/route.ts:44:      getUserEngagement(startDate),
./app/api/admin/operations/route.ts:163:async function getUserEngagement(startDate: Date) {
./app/api/ai/logging/route.ts:18:        return await getUserSessions(data)
./app/api/ai/logging/route.ts:86:async function getUserSessions(data: any) {
./app/api/usage/check/route.ts:4:import { checkUsageLimit, getUserTier, getCurrentUsage, getLimitsForTier } from '@/lib/usage-limits';
./app/api/usage/check/route.ts:35:    const tier = await getUserTier(session.user.id);
./app/hooks/useSupabaseAuth.ts:73:    userPlan: user ? authHelpers.getUserPlan(user) : 'trial',
./DATABASE_BACKUP_ANALYSIS.md:260:   - Change `getServerSession(authOptions)` → `supabase.auth.getUser()`
./DOC_AI_MIGRATION_ANALYSIS.md:92:1. Extract JWT from Authorization header → supabase.auth.getUser()
./DOC_AI_MIGRATION_ANALYSIS.md:107:const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
./lib/check-business-access.ts:33:    const { data: { user } } = await supabase.auth.getUser();
./lib/permission-checker.ts:154:export async function getUserPermissions(userId: string): Promise<Record<Permission, boolean> | null> {
./lib/permissions.ts:355: * @param targetUserId - ID of user being managed
./lib/permissions.ts:358:export async function canManageUser(targetUserId: string): Promise<boolean> {
./lib/permissions.ts:371:  const { data: targetUser } = await supabaseAdmin
./lib/permissions.ts:374:    .eq('id', targetUserId)
./lib/permissions.ts:377:  if (!targetUser) {
./lib/permissions.ts:383:    if (targetUser.role === 'super_admin' || targetUser.role === 'admin') {
./lib/permissions.ts:386:    return targetUser.created_by === session.user.id;
./lib/sessionManager.ts:172:      const existingProjects = this.getUserProjects();
./lib/sessionManager.ts:190:  getUserProjects(): ProjectSession[] {
./lib/sessionManager.ts:264:      allProjects: this.getUserProjects().length
./lib/sessionManager.ts:277:      const { data: { user: authUser } } = await supabase.auth.getUser();
./lib/sessionManager.ts:352:      const { data: { user: authUser } } = await supabase.auth.getUser();
./lib/sessionManager.ts:384:      const { data: { user: authUser } } = await supabase.auth.getUser();
./lib/supabase.ts:200:    const { data: { user } } = await supabase.auth.getUser()
./lib/supabase.ts:217:  getUserPlan(user: any) {
./lib/usage-limits.ts:81:export async function getUserTier(userId: string): Promise<string> {
./lib/usage-limits.ts:100:    const tier = await getUserTier(userId);
./UNIFIED_AUTH_INTEGRATION_GUIDE.md:473:const { data: { user } } = await supabase.auth.getUser(token);

```


## Recommendation

✅ **GOOD**: Supabase auth implementation detected.
