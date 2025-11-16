# Start Manual Testing - Quick Guide

## You're Ready to Test! 🎉

All Float Browser features have been implemented and the build is verified. Now it's time for comprehensive manual testing.

---

## Quick Start

### 1. Verify Build Status

```bash
node scripts/verifyFloatBuild.js
```

This should show all green checkmarks. If not, run:

```bash
npm run build
```

### 2. Start Float Browser

```bash
npm run start
```

The application should launch with all Float features visible in the toolbar.

---

## Testing Documents

### 📋 **MANUAL_TESTING_CHECKLIST.md**
- Quick checklist format
- Check off items as you test
- Perfect for quick verification
- **Use this for fast testing**

### 📖 **MANUAL_TESTING_GUIDE.md**
- Detailed step-by-step instructions
- Expected results for each test
- Space for notes and observations
- **Use this for thorough testing**

---

## What to Test

### Core Features (Task 20.1)

1. **Opacity Slider** (30-100%)
   - Move slider and verify transparency changes
   - Check persistence after restart

2. **Always-On-Top**
   - Toggle button in toolbar
   - Test across macOS Spaces
   - Test with other apps

3. **PIP Mode**
   - Toggle to 400x300 window
   - Verify all features work in PIP
   - Test restore to normal size

4. **Global Shortcuts**
   - Cmd+Shift+F (toggle visibility)
   - Cmd+Shift+A (toggle always-on-top)
   - Cmd+Shift+P (toggle PIP)
   - Test from other applications

5. **Window Profiles**
   - Cmd+1 (Small: 400x300, 80%)
   - Cmd+2 (Medium: 800x600, 90%)
   - Cmd+3 (Large: 1200x800, 100%)

6. **Float Menu**
   - Check all menu items work
   - Verify shortcuts shown
   - Test opacity presets

7. **Settings**
   - Open Settings (Cmd+,)
   - Find Float Browser section
   - Test default opacity
   - Test default always-on-top

### Error Scenarios (Task 20.2)

1. **Corrupted Settings**
   - Manually corrupt settings file
   - Verify graceful recovery

2. **Invalid Values**
   - Test with invalid opacity values
   - Verify safe defaults used

3. **Registration Failures**
   - Test with conflicting shortcuts
   - Verify browser still works

4. **Window Management**
   - Test operations on minimized window
   - Verify error handling

5. **Performance**
   - Rapidly change opacity
   - Check for visual artifacts

---

## Testing Tips

### Before You Start

- Close other browsers to avoid confusion
- Have multiple apps open for testing always-on-top
- Set up multiple macOS Spaces for testing
- Have a second monitor if possible

### During Testing

- Test each feature individually first
- Then test combinations of features
- Note any unexpected behavior
- Check console for errors (View > Toggle Developer Tools)

### What to Look For

- ✓ Features work as expected
- ✓ UI is consistent with Min Browser style
- ✓ No visual glitches or artifacts
- ✓ No console errors
- ✓ Settings persist correctly
- ✓ Performance is smooth
- ✓ All Min Browser features still work

---

## Reporting Issues

If you find issues during testing:

1. **Note the issue** in the testing documents
2. **Check console** for error messages (Cmd+Option+I)
3. **Document steps** to reproduce
4. **Note severity**: Critical, High, Medium, Low

### Issue Template

```
**Issue**: [Brief description]
**Severity**: [Critical/High/Medium/Low]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Console Errors**: [Any errors from console]
```

---

## Success Criteria

Float Browser is ready for release when:

- ✓ All features work correctly
- ✓ No critical bugs
- ✓ Performance is acceptable
- ✓ All Min Browser features work
- ✓ UI is polished and consistent
- ✓ Settings persist correctly
- ✓ Error handling works

---

## Next Steps After Testing

Once manual testing is complete:

1. **Fix any critical issues** found
2. **Document known issues** (if any)
3. **Update documentation** if behavior differs
4. **Proceed to Phase 9**: Documentation (Task 21)
5. **Proceed to Phase 10**: Build & Distribution (Task 23)

---

## Need Help?

- Check `FLOAT_MODIFICATIONS.md` for implementation details
- Check `.kiro/specs/float-browser-v2/design.md` for architecture
- Check `.kiro/specs/float-browser-v2/requirements.md` for expected behavior
- Review test files in `tests/` for automated test examples

---

## Quick Command Reference

```bash
# Start application
npm run start

# Rebuild if needed
npm run build

# Run automated tests
npm test

# Check build status
node scripts/verifyFloatBuild.js

# View console logs
# In app: Cmd+Option+I
```

---

**Happy Testing! 🚀**

Remember: The goal is to ensure Float Browser provides a smooth, reliable experience while maintaining all of Min Browser's excellent features.
