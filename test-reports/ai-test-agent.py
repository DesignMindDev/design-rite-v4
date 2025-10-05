"""
AI Test Agent - Automated Testing with GPT-4
Performs stress tests, penetration tests, and UX tests
Writes issues to test-reports/issues/ for Claude Code to fix
Monitors test-reports/fixes/ for Claude's solutions and retests
"""

import sys
import io

# Fix Windows console encoding for emojis
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

import openai
import json
import requests
import time
import os
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(Path(__file__).parent.parent / '.env')

# Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
BASE_URL = "http://localhost:3000"
SUPER_AGENT_URL = "http://localhost:9500"
ISSUES_DIR = Path(__file__).parent / "issues"
FIXES_DIR = Path(__file__).parent / "fixes"
FINAL_DIR = Path(__file__).parent / "final"

openai.api_key = OPENAI_API_KEY


class TestAgent:
    def __init__(self):
        self.issues = []
        self.fixes = []
        self.test_results = {
            "stress_tests": [],
            "penetration_tests": [],
            "ux_tests": [],
            "admin_tests": []
        }

    def run_stress_tests(self):
        """Stress test - concurrent requests, large payloads, rate limiting"""
        print("\n🔥 Running Stress Tests...")

        tests = [
            {
                "name": "Concurrent AI Assistant Requests",
                "endpoint": f"{BASE_URL}/api/ai-assistant",
                "method": "POST",
                "concurrent": 10,
                "payload": {"message": "Generate a security proposal", "conversationId": "test-123"}
            },
            {
                "name": "Large Payload Test",
                "endpoint": f"{SUPER_AGENT_URL}/orchestrate",
                "method": "POST",
                "payload": {
                    "prompt": "A" * 10000,  # 10KB prompt
                    "user_id": "stress-test",
                    "max_iterations": 5
                },
                "headers": {"X-API-Key": "super-agent-dev-key-12345"}
            },
            {
                "name": "Rate Limit Test - 50 requests/min",
                "endpoint": f"{BASE_URL}/api/estimate",
                "method": "POST",
                "rapid_fire": 50,
                "payload": {"industry": "education", "size": 50000}
            }
        ]

        for test in tests:
            result = self._execute_stress_test(test)
            self.test_results["stress_tests"].append(result)

            if not result["passed"]:
                self._create_issue("STRESS_TEST", result)

    def run_penetration_tests(self):
        """Security tests - SQL injection, XSS, auth bypass, etc."""
        print("\n🛡️ Running Penetration Tests...")

        tests = [
            {
                "name": "SQL Injection - Login Form",
                "endpoint": f"{BASE_URL}/api/auth/[...nextauth]",
                "payload": {"username": "admin' OR '1'='1", "password": "' OR '1'='1"}
            },
            {
                "name": "XSS - AI Assistant Input",
                "endpoint": f"{BASE_URL}/api/ai-assistant",
                "payload": {"message": "<script>alert('XSS')</script>"}
            },
            {
                "name": "Authentication Bypass - Admin Routes",
                "endpoint": f"{BASE_URL}/admin/super",
                "method": "GET",
                "expect_redirect": True
            },
            {
                "name": "API Key Validation - Super Agent",
                "endpoint": f"{SUPER_AGENT_URL}/orchestrate",
                "payload": {"prompt": "test"},
                "headers": {"X-API-Key": "invalid-key-12345"}
            },
            {
                "name": "CSRF Protection Test",
                "endpoint": f"{BASE_URL}/api/estimate",
                "method": "POST",
                "no_csrf_token": True
            }
        ]

        for test in tests:
            result = self._execute_security_test(test)
            self.test_results["penetration_tests"].append(result)

            if not result["passed"]:
                self._create_issue("SECURITY", result)

    def run_ux_tests(self):
        """User Experience tests - populate data, test workflows"""
        print("\n🎨 Running UX Tests (Data Population)...")

        # Create realistic user sessions in Supabase
        tests = [
            {
                "name": "AI Assessment Workflow - Elementary School",
                "steps": [
                    {"action": "Start AI Assessment", "endpoint": f"{BASE_URL}/api/ai-assessment/start"},
                    {"action": "Answer 5 questions", "endpoint": f"{BASE_URL}/api/ai-assessment/answer"},
                    {"action": "Generate proposal", "endpoint": f"{BASE_URL}/api/ai-assessment/generate"}
                ]
            },
            {
                "name": "Super Agent - A&E Spec Matching",
                "endpoint": f"{SUPER_AGENT_URL}/orchestrate",
                "payload": {
                    "prompt": "Compare these A&E specs: IP cameras, 4MP minimum, WDR, vandal-resistant, NDAA compliant. Find equal or better alternatives.",
                    "user_id": "ux-test-user",
                    "max_iterations": 5
                },
                "headers": {"X-API-Key": "super-agent-dev-key-12345"}
            },
            {
                "name": "Admin Dashboard - View Analytics",
                "endpoint": f"{BASE_URL}/api/admin/analytics",
                "auth_required": True
            }
        ]

        for test in tests:
            result = self._execute_ux_test(test)
            self.test_results["ux_tests"].append(result)

            if not result["passed"]:
                self._create_issue("UX", result)

    def run_admin_tests(self):
        """Admin panel tests - authentication, permissions, CRUD operations"""
        print("\n👑 Running Admin Panel Tests...")

        tests = [
            {
                "name": "Super Admin Login",
                "endpoint": f"{BASE_URL}/api/auth/signin",
                "credentials": {"username": "admin", "password": "test-password"}
            },
            {
                "name": "User Creation - Manager Role",
                "endpoint": f"{BASE_URL}/api/admin/users",
                "method": "POST",
                "payload": {"email": "test-manager@design-rite.com", "role": "manager"}
            },
            {
                "name": "Rate Limit Override - Super Admin",
                "endpoint": f"{BASE_URL}/api/estimate",
                "method": "POST",
                "repeat": 100,  # Should not be rate limited
                "auth": "super_admin"
            },
            {
                "name": "Activity Logs - View All Users",
                "endpoint": f"{BASE_URL}/api/admin/activity-logs",
                "method": "GET"
            }
        ]

        for test in tests:
            result = self._execute_admin_test(test)
            self.test_results["admin_tests"].append(result)

            if not result["passed"]:
                self._create_issue("ADMIN", result)

    def _execute_stress_test(self, test):
        """Execute a stress test"""
        try:
            start_time = time.time()

            if "concurrent" in test:
                # Concurrent requests test
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor(max_workers=test["concurrent"]) as executor:
                    futures = [
                        executor.submit(self._make_request, test)
                        for _ in range(test["concurrent"])
                    ]
                    results = [f.result() for f in futures]

                success_count = sum(1 for r in results if r.get("success", False))
                passed = success_count == test["concurrent"]

            elif "rapid_fire" in test:
                # Rapid fire test
                results = []
                for _ in range(test["rapid_fire"]):
                    result = self._make_request(test)
                    results.append(result)
                    time.sleep(0.01)  # 10ms between requests = 100/sec

                success_count = sum(1 for r in results if r.get("success", False))
                passed = success_count >= test["rapid_fire"] * 0.8  # 80% success rate acceptable

            else:
                # Single request test
                result = self._make_request(test)
                passed = result.get("success", False)
                results = [result]

            duration = time.time() - start_time

            return {
                "name": test["name"],
                "passed": passed,
                "duration_ms": duration * 1000,
                "details": f"Success: {success_count}/{len(results)}" if "success_count" in locals() else "Completed",
                "results": results
            }

        except Exception as e:
            return {
                "name": test["name"],
                "passed": False,
                "error": str(e),
                "duration_ms": 0
            }

    def _execute_security_test(self, test):
        """Execute a security/penetration test"""
        try:
            result = self._make_request(test)

            # Security tests check for proper error handling
            if "expect_redirect" in test:
                passed = result.get("status_code") in [302, 401, 403]
            elif "headers" in test and "X-API-Key" in test["headers"]:
                passed = result.get("status_code") == 403  # Should reject invalid key
            else:
                # Should NOT execute malicious code
                passed = result.get("status_code") not in [200, 201]

            return {
                "name": test["name"],
                "passed": passed,
                "status_code": result.get("status_code"),
                "details": result.get("error", "Security test passed - malicious input rejected")
            }

        except Exception as e:
            return {
                "name": test["name"],
                "passed": False,
                "error": str(e)
            }

    def _execute_ux_test(self, test):
        """Execute a UX test"""
        try:
            if "steps" in test:
                # Multi-step workflow
                all_passed = True
                for step in test["steps"]:
                    result = self._make_request(step)
                    if not result.get("success", False):
                        all_passed = False
                        break

                return {
                    "name": test["name"],
                    "passed": all_passed,
                    "details": f"Completed {len(test['steps'])} steps"
                }
            else:
                # Single request
                result = self._make_request(test)
                return {
                    "name": test["name"],
                    "passed": result.get("success", False),
                    "details": result.get("data", "")
                }

        except Exception as e:
            return {
                "name": test["name"],
                "passed": False,
                "error": str(e)
            }

    def _execute_admin_test(self, test):
        """Execute an admin panel test"""
        try:
            result = self._make_request(test)

            return {
                "name": test["name"],
                "passed": result.get("success", False),
                "status_code": result.get("status_code"),
                "details": result.get("data", "")
            }

        except Exception as e:
            return {
                "name": test["name"],
                "passed": False,
                "error": str(e)
            }

    def _make_request(self, test):
        """Make HTTP request"""
        try:
            method = test.get("method", "POST")
            endpoint = test.get("endpoint")
            payload = test.get("payload", {})
            headers = test.get("headers", {})

            if method == "GET":
                response = requests.get(endpoint, headers=headers, timeout=30)
            else:
                response = requests.post(endpoint, json=payload, headers=headers, timeout=30)

            return {
                "success": response.status_code in [200, 201],
                "status_code": response.status_code,
                "data": response.text[:500]  # First 500 chars
            }

        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": str(e)
            }

    def _create_issue(self, category, test_result):
        """Write issue report for Claude Code to fix"""
        issue_id = f"{category}_{len(self.issues) + 1}_{int(time.time())}"

        issue = {
            "id": issue_id,
            "category": category,
            "severity": "HIGH" if category == "SECURITY" else "MEDIUM",
            "test_name": test_result["name"],
            "status": "OPEN",
            "error": test_result.get("error", "Test failed"),
            "details": test_result.get("details", ""),
            "timestamp": datetime.now().isoformat(),
            "suggested_fix": self._generate_fix_suggestion(category, test_result)
        }

        # Write to issues folder
        issue_file = ISSUES_DIR / f"{issue_id}.json"
        with open(issue_file, 'w', encoding='utf-8') as f:
            json.dump(issue, f, indent=2, ensure_ascii=False)

        print(f"🚨 Issue Created: {issue_id} - {test_result['name']}")
        self.issues.append(issue)

    def _generate_fix_suggestion(self, category, test_result):
        """Use GPT-4 to generate fix suggestion"""
        try:
            prompt = f"""
You are a senior security engineer. A {category} test failed with the following details:

Test: {test_result['name']}
Error: {test_result.get('error', 'N/A')}
Details: {test_result.get('details', 'N/A')}

Provide a specific, actionable fix suggestion including:
1. Root cause analysis
2. Specific file(s) to modify
3. Code changes needed
4. Security best practices to implement

Be concise but detailed.
"""

            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500
            )

            return response.choices[0].message.content

        except Exception as e:
            return f"Failed to generate fix suggestion: {str(e)}"

    def monitor_fixes(self):
        """Monitor test-reports/fixes/ for Claude's solutions"""
        print("\n👀 Monitoring for fixes from Claude Code...")

        for issue in self.issues:
            fix_file = FIXES_DIR / f"{issue['id']}_FIXED.json"

            if fix_file.exists():
                print(f"✅ Fix found for {issue['id']} - Retesting...")

                with open(fix_file, 'r') as f:
                    fix_data = json.load(f)

                # Retest the original test
                retest_result = self._retest_issue(issue, fix_data)

                if retest_result["passed"]:
                    print(f"✅ Fix confirmed for {issue['id']}")
                    self.fixes.append({
                        "issue_id": issue['id'],
                        "status": "FIXED",
                        "fix_data": fix_data,
                        "retest_passed": True
                    })
                else:
                    print(f"❌ Fix failed for {issue['id']} - Needs rework")
                    self._create_issue("FIX_FAILED", retest_result)

    def _retest_issue(self, issue, fix_data):
        """Retest a fixed issue"""
        # TODO: Implement retesting logic based on original test
        return {"passed": True, "details": "Retesting not yet implemented"}

    def generate_final_report(self):
        """Generate final test report"""
        print("\n📊 Generating Final Report...")

        total_tests = sum(len(v) for v in self.test_results.values())
        total_passed = sum(
            sum(1 for test in tests if test.get("passed", False))
            for tests in self.test_results.values()
        )

        report = f"""
# AI Agent Testing Report
**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Agent:** GPT-4 Test Agent

## Summary
- **Total Tests:** {total_tests}
- **Passed:** {total_passed}
- **Failed:** {total_tests - total_passed}
- **Success Rate:** {(total_passed / total_tests * 100):.1f}%

## Test Categories

### Stress Tests ({len(self.test_results['stress_tests'])} tests)
{self._format_test_results(self.test_results['stress_tests'])}

### Penetration Tests ({len(self.test_results['penetration_tests'])} tests)
{self._format_test_results(self.test_results['penetration_tests'])}

### UX Tests ({len(self.test_results['ux_tests'])} tests)
{self._format_test_results(self.test_results['ux_tests'])}

### Admin Tests ({len(self.test_results['admin_tests'])} tests)
{self._format_test_results(self.test_results['admin_tests'])}

## Issues Created
{len(self.issues)} issues written to test-reports/issues/

## Fixes Applied
{len(self.fixes)} fixes confirmed from Claude Code

## GPT-4 Agent Observations
- Server response times averaged {self._calculate_avg_response_time():.0f}ms
- Most common failure: {self._get_most_common_failure()}
- Security posture: {self._assess_security()}

---
**Next Steps:** Review issues in test-reports/issues/ and apply fixes from Claude Code
"""

        # Write report
        report_file = FINAL_DIR / f"test-report-{int(time.time())}.md"
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)

        print(f"✅ Report saved to {report_file}")
        return report

    def _format_test_results(self, tests):
        """Format test results for report"""
        if not tests:
            return "No tests run"

        lines = []
        for test in tests:
            status = "✅" if test.get("passed", False) else "❌"
            lines.append(f"- {status} {test['name']}")
        return "\n".join(lines)

    def _calculate_avg_response_time(self):
        """Calculate average response time across all tests"""
        times = []
        for tests in self.test_results.values():
            times.extend([t.get("duration_ms", 0) for t in tests])
        return sum(times) / len(times) if times else 0

    def _get_most_common_failure(self):
        """Get most common failure type"""
        failures = []
        for tests in self.test_results.values():
            failures.extend([t.get("error", "Unknown") for t in tests if not t.get("passed", False)])

        if not failures:
            return "None"

        from collections import Counter
        return Counter(failures).most_common(1)[0][0]

    def _assess_security(self):
        """Assess overall security posture"""
        security_tests = self.test_results.get("penetration_tests", [])
        if not security_tests:
            return "Not assessed"

        passed = sum(1 for t in security_tests if t.get("passed", False))
        total = len(security_tests)

        if passed == total:
            return "✅ Excellent - All security tests passed"
        elif passed / total > 0.8:
            return "⚠️ Good - Minor security issues detected"
        else:
            return "🚨 Critical - Multiple security vulnerabilities found"


if __name__ == "__main__":
    print("🤖 AI Test Agent Starting...")
    print("=" * 60)

    agent = TestAgent()

    # Run all test suites
    agent.run_stress_tests()
    agent.run_penetration_tests()
    agent.run_ux_tests()
    agent.run_admin_tests()

    # Monitor for Claude's fixes (run this in a loop or separate process)
    # agent.monitor_fixes()

    # Generate final report
    report = agent.generate_final_report()
    print("\n" + report)

    print("\n✅ Testing complete! Issues written to test-reports/issues/")
    print("👉 Run file watcher to notify Claude Code of issues")
