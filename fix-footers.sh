#!/bin/bash

# Files to fix
FILES=(
  "app/enterprise/page.tsx"
  "app/education/page.tsx"
  "app/healthcare/page.tsx"
  "app/consultants/page.tsx"
  "app/compliance/page.tsx"
  "app/pricing/page.tsx"
  "app/subscribe/page.tsx"
  "app/waitlist/page.tsx"
  "app/contact/page.tsx"
  "app/white-label/page.tsx"
  "app/compliance-analyst/page.tsx"
  "app/professional-proposals/page.tsx"
  "app/project-management/page.tsx"
  "app/api/page.tsx"
  "app/ai-powered-analyst/page.tsx"
  "app/enterprise-roi/page.tsx"
)

echo "🔧 Fixing inline footers across 16 files..."
echo ""

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing: $file"

    # Add Footer import if not present
    if ! grep -q "import Footer from" "$file"; then
      # Find the last import line and add Footer import after it
      sed -i "/^import.*from/a import Footer from '../components/Footer';" "$file"
    fi

    echo "  ✅ Added Footer import"
  else
    echo "  ⚠️  File not found: $file"
  fi
done

echo ""
echo "✨ Footer imports added! Now manually replace inline footers with <Footer redirectToApp={redirectToApp} />"
