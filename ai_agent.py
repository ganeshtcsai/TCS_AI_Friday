import streamlit as st

st.title("Code Quality Checker AI Agent")

code = st.text_area("Paste Code")
checklist = st.text_area("Checklist (comma separated)")

if st.button("Analyze"):
    checks = checklist.split(',')
    
    for c in checks:
        st.subheader(c.strip())
        
        if c.strip().lower() in code.lower():
            st.write("✅ Found")
        else:
            st.write("⚠️ Missing or needs improvement")
            
    st.success("Analysis Complete")