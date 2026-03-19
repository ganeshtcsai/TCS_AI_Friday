import streamlit as st

st.title("🤖 AI Code Quality Checker")

code = st.text_area("Paste your code here")
checklist = st.text_area("Checklist (comma separated)")

if st.button("Run Check"):

    items = checklist.split(",")

    for item in items:

        rule = item.strip().lower()

        if "comment" in rule:
            if "//" in code or "#" in code:
                st.success(f"{item} → Good: Comments present ✅")
            else:
                st.error(f"{item} → Issue: Add comments ❌")

        elif "length" in rule:
            if len(code) > 300:
                st.warning(f"{item} → Issue: Code too long ⚠️")
            else:
                st.success(f"{item} → Good: Length is fine ✅")

        elif "naming" in rule:
            if "var " in code or "let " in code:
                st.info(f"{item} → Check variable naming manually 🔍")
            else:
                st.success(f"{item} → Looks okay ✅")

        else:
            st.warning(f"{item} → Unknown rule, manual review needed ⚠️")