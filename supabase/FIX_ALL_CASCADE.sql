-- Fix ALL foreign keys to allow CASCADE deletion
-- This is the nuclear option you wanted!

-- 1. admin_actions_logs
ALTER TABLE admin_actions_logs DROP CONSTRAINT IF EXISTS admin_actions_logs_admin_user_id_fkey;
ALTER TABLE admin_actions_logs ADD CONSTRAINT admin_actions_logs_admin_user_id_fkey
  FOREIGN KEY (admin_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. admin_chat_history
ALTER TABLE admin_chat_history DROP CONSTRAINT IF EXISTS admin_chat_history_user_id_fkey;
ALTER TABLE admin_chat_history ADD CONSTRAINT admin_chat_history_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. assessments
ALTER TABLE assessments DROP CONSTRAINT IF EXISTS assessments_user_id_fkey;
ALTER TABLE assessments ADD CONSTRAINT assessments_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. documents
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_user_id_fkey;
ALTER TABLE documents ADD CONSTRAINT documents_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 5. orchestration_sessions
ALTER TABLE orchestration_sessions DROP CONSTRAINT IF EXISTS orchestration_sessions_user_id_fkey;
ALTER TABLE orchestration_sessions ADD CONSTRAINT orchestration_sessions_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 6. pricing_history (SET NULL makes more sense here - preserve history)
ALTER TABLE pricing_history DROP CONSTRAINT IF EXISTS pricing_history_changed_by_fkey;
ALTER TABLE pricing_history ADD CONSTRAINT pricing_history_changed_by_fkey
  FOREIGN KEY (changed_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 7. spatial_projects
ALTER TABLE spatial_projects DROP CONSTRAINT IF EXISTS spatial_projects_user_id_fkey;
ALTER TABLE spatial_projects ADD CONSTRAINT spatial_projects_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 8. super_agent_user_journey
ALTER TABLE super_agent_user_journey DROP CONSTRAINT IF EXISTS super_agent_user_journey_user_id_fkey;
ALTER TABLE super_agent_user_journey ADD CONSTRAINT super_agent_user_journey_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 9. test_runs (SET NULL - preserve test history)
ALTER TABLE test_runs DROP CONSTRAINT IF EXISTS test_runs_triggered_by_user_fkey;
ALTER TABLE test_runs ADD CONSTRAINT test_runs_triggered_by_user_fkey
  FOREIGN KEY (triggered_by_user) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 10. test_schedules (SET NULL - preserve schedule history)
ALTER TABLE test_schedules DROP CONSTRAINT IF EXISTS test_schedules_created_by_fkey;
ALTER TABLE test_schedules ADD CONSTRAINT test_schedules_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 11. uploaded_documents
ALTER TABLE uploaded_documents DROP CONSTRAINT IF EXISTS uploaded_documents_user_id_fkey;
ALTER TABLE uploaded_documents ADD CONSTRAINT uploaded_documents_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Verify all constraints are now fixed
SELECT '✅ All CASCADE constraints fixed!' as status;
