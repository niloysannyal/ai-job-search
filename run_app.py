"""
AI Career OS - Application Launcher
Runs both the FastAPI Gateway on port 8000 and Next.js frontend on port 3000.
"""

import os
import sys
import subprocess
import time

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")
    
    python_exe = os.path.join(root_dir, ".venv", "Scripts", "python.exe")
    if not os.path.exists(python_exe):
        python_exe = sys.executable
        
    bun_exe = os.path.expanduser("~\\.bun\\bin\\bun.exe")
    env = os.environ.copy()
    bun_dir = os.path.expanduser("~\\.bun\\bin")
    if bun_dir not in env.get("PATH", ""):
        env["PATH"] = f"{bun_dir};{env.get('PATH', '')}"

    print("==================================================")
    print("      🚀 Starting AI Career OS Platform           ")
    print("==================================================")
    print(f"[Backend] Starting FastAPI gateway on http://127.0.0.1:8000 ...")
    
    backend_proc = subprocess.Popen(
        [python_exe, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
        cwd=root_dir,
        env=env
    )
    
    time.sleep(1)
    
    print(f"[Frontend] Starting Next.js 15 UI on http://localhost:3000 ...")
    npm_or_bun = bun_exe if os.path.exists(bun_exe) else "npm"
    frontend_proc = subprocess.Popen(
        [npm_or_bun, "run", "dev"],
        cwd=frontend_dir,
        env=env,
        shell=True
    )
    
    print("\n✅ AI Career OS is running!")
    print("👉 Open http://localhost:3000 in your browser.")
    print("Press Ctrl+C to terminate both servers.\n")
    
    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping AI Career OS...")
        backend_proc.terminate()
        frontend_proc.terminate()
        sys.exit(0)

if __name__ == "__main__":
    main()
