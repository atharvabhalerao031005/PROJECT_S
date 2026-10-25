"""
docs/build_docs.py
Unified master build script to generate:
1. docs/ATELIER_SYSTEM_ARCHITECTURE.html & .pdf
2. docs/ATELIER_OPERATOR_GUIDE.html & .pdf
"""
import os
import subprocess
import sys

DOCS_DIR = os.path.abspath(r"c:\Sejal project\docs")

print("=" * 75)
print(" BUILDING ATELIER // PRESENCE MONOGRAPHS & OPERATOR GUIDES")
print("=" * 75)

# 1. Build System Architecture
arch_script = os.path.join(DOCS_DIR, "generate_system_architecture.py")
print(f"\n[1/2] Running {arch_script}...")
res1 = subprocess.run([sys.executable, arch_script], cwd=DOCS_DIR)
if res1.returncode != 0:
    print("[ERROR] Failed generating System Architecture!")
    sys.exit(res1.returncode)

# 2. Build Operator Guide
guide_script = os.path.join(DOCS_DIR, "generate_operator_guide.py")
print(f"\n[2/2] Running {guide_script}...")
res2 = subprocess.run([sys.executable, guide_script], cwd=DOCS_DIR)
if res2.returncode != 0:
    print("[ERROR] Failed generating Operator Guide!")
    sys.exit(res2.returncode)

print("\n" + "=" * 75)
print(" ALL DOCUMENTATION COMPILED SUCCESSFULLY!")
print(f" - Architecture PDF: {os.path.join(DOCS_DIR, 'ATELIER_SYSTEM_ARCHITECTURE.pdf')} ({os.path.getsize(os.path.join(DOCS_DIR, 'ATELIER_SYSTEM_ARCHITECTURE.pdf')):,} bytes)")
print(f" - Operator Guide PDF: {os.path.join(DOCS_DIR, 'ATELIER_OPERATOR_GUIDE.pdf')} ({os.path.getsize(os.path.join(DOCS_DIR, 'ATELIER_OPERATOR_GUIDE.pdf')):,} bytes)")
print("=" * 75)
