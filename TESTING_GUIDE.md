# 🧪 Testing Guide - New Features

## Quick Test Checklist

### 1. Balance Indicator & PMR Tips
**Page:** calculator.html

**Steps:**
1. Open calculator.html
2. Click "➕ 新增貓咪 Add New Cat"
3. Fill in cat details (name, weight, age, activity level)
4. Click "💾 儲存 Save"
5. Click "📊 計算每日需求 Calculate Daily Needs" on the cat card

**Expected Results:**
- ✅ Balance indicator appears showing PMR ratio status
- ✅ Ratios displayed: Muscle %, Bone %, Organs %
- ✅ Status shows "✅ 營養均衡 Balanced" or "⚠️ 需要注意 Check Ratios"
- ✅ PMR tips section appears with personalized suggestions
- ✅ Age-specific warnings (if kitten or senior cat)
- ✅ General tips about protein rotation and HK climate

---

### 2. Weekly Batch Prep Planner
**Page:** calculator.html

**Steps:**
1. Have at least one saved cat
2. Click "📦 每週備餐計劃 Weekly Batch Prep" button on cat card
3. Review the modal that appears

**Expected Results:**
- ✅ Modal opens with batch prep details
- ✅ Weekly totals calculated (7 days worth)
- ✅ Shopping list shows all ingredients with amounts
- ✅ Container calculations displayed
- ✅ Freezer space estimate shown
- ✅ HK storage tips section visible
- ✅ Cost estimates for wet market/supermarket/pet store
- ✅ Print button works
- ✅ Close button closes modal

---

### 3. HK Cost Calculator
**Page:** resources.html

**Steps:**
1. Open resources.html
2. Scroll to "💰 香港成本計算器 HK Cost Calculator" section
3. Enter cat weight (e.g., 4 kg)
4. Select activity level (e.g., Medium)
5. Select purchase source (e.g., Supermarket)
6. Click "計算成本 Calculate Cost"

**Expected Results:**
- ✅ Results section appears below
- ✅ Monthly cost range displayed (min-max-average)
- ✅ Detailed breakdown shows daily/monthly amounts
- ✅ Comparison bars appear for PMR vs Kibble vs Canned
- ✅ Cost insights list appears
- ✅ Money-saving tips displayed
- ✅ All text is bilingual

---

### 4. Myth Cards & Instagram Sharing
**Page:** resources.html

**Steps:**
1. Open resources.html
2. Scroll to "🔍 迷思 vs 現實 Myth vs Reality" section
3. Click "📷 分享到 IG" button on any myth card
4. Review the share modal
5. Click "📋 複製文字 Copy Caption"

**Expected Results:**
- ✅ 6 myth cards visible (kibble-teeth, bacteria-risk, vegetables, detox, cost, bones)
- ✅ Each card shows myth statement and reality
- ✅ Share modal opens with preview card
- ✅ Preview card has gradient design with AnyMoThings branding
- ✅ Instructions for sharing displayed
- ✅ Caption box shows suggested text
- ✅ Copy button copies caption to clipboard
- ✅ Alert confirms "已複製到剪貼簿 Copied to clipboard"
- ✅ Close button works

---

### 5. Lifestyle Profiles
**Page:** resources.html

**Steps:**
1. Open resources.html
2. Scroll to "🏠 香港生活情境 HK Lifestyle Scenarios" section
3. Review all three lifestyle cards

**Expected Results:**
- ✅ Three cards visible: Small Flat, Medium Flat, Large House
- ✅ Each card shows specs (freezer, kitchen, time)
- ✅ Recommendations list appropriate for each scenario
- ✅ Small flat suggests 3-4 day prep
- ✅ Medium flat suggests weekly prep
- ✅ Large house suggests 2-4 week prep

---

### 6. Substitution Helper
**Page:** resources.html

**Steps:**
1. Open resources.html
2. Scroll to "🔄 臨時替代指南 Substitution Helper" section
3. Review all scenarios

**Expected Results:**
- ✅ Three scenarios visible: No liver, No heart, Single protein
- ✅ Each scenario has color-coded options:
  - Green (✅ Safe)
  - Yellow (⚠️ Caution)
  - Red (❌ Danger)
- ✅ "Never Substitute" red box at bottom
- ✅ Clear warnings about cooked bones, vegetables, processed meats

---

### 7. Navigation Updates
**All Pages**

**Steps:**
1. Open each HTML page
2. Check navigation menu

**Expected Results:**
- ✅ All pages have "實用資源 Resources" link in navigation:
  - index.html
  - calculator.html
  - comparison.html
  - transition.html
  - vet-faq.html
  - disclaimer.html
  - resources.html
- ✅ Clicking link navigates to resources.html

---

### 8. Health Log Integration (Existing Feature)
**Page:** calculator.html

**Steps:**
1. Have a saved cat
2. Click "📋 健康記錄 Health Log" button
3. Add several health logs with poor stool quality (1-2 rating)
4. Close health log modal
5. Click "📊 計算每日需求 Calculate Daily Needs"

**Expected Results:**
- ✅ PMR tips section detects persistent stool issues
- ✅ Warning card appears: "糞便問題持續 Persistent Stool Issues"
- ✅ Suggestions provided for liver/bone adjustments

---

## 🎨 Visual Testing

### Desktop (1920x1080)
- ✅ All grids display properly (myth cards, lifestyle cards)
- ✅ Modals are centered and readable
- ✅ Comparison bars fill correctly
- ✅ Navigation fits on one line

### Tablet (768px)
- ✅ Grids collapse to 1-2 columns
- ✅ Modals remain readable
- ✅ Buttons stack appropriately

### Mobile (375px)
- ✅ All grids become single column
- ✅ Modals fit screen with scroll
- ✅ Navigation collapses (if implemented)
- ✅ Text remains readable

---

## 🐛 Common Issues & Solutions

### Issue: Cost calculator doesn't show results
**Solution:** Check that resources.js is loaded in resources.html

### Issue: Share modal doesn't open
**Solution:** Verify resources.js has shareMythToIG() function

### Issue: Batch prep button doesn't work
**Solution:** Check script.js has showBatchPrepPlanner() function

### Issue: Balance indicator doesn't appear
**Solution:** Verify generateBalanceIndicator() is called in calculateForCat()

### Issue: Styles look broken
**Solution:** Confirm styles.css has all new CSS classes (cost-results, myth-card, etc.)

---

## 📱 Browser Testing

### Recommended Browsers:
- ✅ Chrome/Edge (latest)
- ✅ Safari (latest)
- ✅ Firefox (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

### Features to Test:
- ✅ localStorage (cat profiles persist)
- ✅ Clipboard API (copy caption)
- ✅ Print functionality (batch prep)
- ✅ Modal interactions (click outside to close)
- ✅ Smooth scrolling

---

## ✅ Acceptance Criteria

All features pass if:
1. ✅ Balance indicator shows correct PMR ratios
2. ✅ PMR tips are personalized based on cat data
3. ✅ Batch prep planner calculates weekly amounts correctly
4. ✅ Cost calculator compares PMR vs other diets
5. ✅ Myth cards are shareable to Instagram
6. ✅ Lifestyle profiles show HK-specific scenarios
7. ✅ Substitution helper provides safe guidance
8. ✅ All pages have updated navigation
9. ✅ All text is bilingual (Traditional Chinese + English)
10. ✅ Mobile responsive on all screen sizes

---

## 🚀 Ready for Production

Once all tests pass:
- ✅ Features are production-ready
- ✅ No console errors
- ✅ All links work
- ✅ Data persists in localStorage
- ✅ Responsive on all devices
- ✅ Bilingual throughout
- ✅ AnyMoThings branding consistent

---

**Happy Testing! 🎉**
