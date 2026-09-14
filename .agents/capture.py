#!/usr/bin/env python3
"""
Agent Capture Hook & Session Logger
Conforms to the 8x Assignment Agent Capture Specification.
Captures prompt and final response verbatim per turn into .agent-logs/
"""

import sys
import os
import json
import re
import glob
import time
from datetime import datetime, timezone

REPO_ROOT = "/home/waleed/Desktop/fathom-clone"
AUTHOR = "Muhammad-Waleed381"
TOOL = "antigravity-cli"
PROJECT = "fathom-clone"
DEFAULT_MODEL = "gemini-3.8-flash"
BRAIN_DIR = os.path.expanduser("~/.gemini/antigravity-cli/brain")

# Claude Code stores one JSONL transcript per session under a directory named
# after the cwd with every "/" replaced by "-".
CLAUDE_PROJECTS_DIR = os.path.expanduser("~/.claude/projects")
CLAUDE_TOOL = "claude-code"
CLAUDE_DEFAULT_MODEL = "claude-opus-5"


def get_repo_root(workspace_paths=None):
    if workspace_paths and len(workspace_paths) > 0:
        p = workspace_paths[0]
        if os.path.isdir(p):
            return p
    script_dir = os.path.dirname(os.path.abspath(__file__))
    parent = os.path.dirname(script_dir)
    if os.path.isdir(os.path.join(parent, ".git")):
        return parent
    if os.path.isdir(os.path.join(REPO_ROOT, ".git")):
        return REPO_ROOT
    return os.getcwd()


def clean_prompt(raw_text):
    if not raw_text:
        return ""
    # Extract inside <USER_REQUEST> if present
    m = re.search(r"<USER_REQUEST>\s*([\s\S]*?)\s*</USER_REQUEST>", raw_text)
    if m:
        return m.group(1).strip()
    return raw_text.strip()


def parse_session_transcript(transcript_path, session_id, model_name=DEFAULT_MODEL):
    if not os.path.exists(transcript_path):
        return None

    # Prefer transcript_full.jsonl if available in the same directory
    d = os.path.dirname(transcript_path)
    full_path = os.path.join(d, "transcript_full.jsonl")
    if os.path.exists(full_path):
        read_path = full_path
    else:
        read_path = transcript_path

    steps = []
    try:
        with open(read_path, "r", encoding="utf-8", errors="replace") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        steps.append(json.loads(line))
                    except Exception:
                        pass
    except Exception as e:
        return None

    if not steps:
        return None

    # Identify user turns
    user_step_indices = [
        i for i, s in enumerate(steps)
        if s.get("type") == "USER_INPUT" or s.get("source") == "USER_EXPLICIT"
    ]

    if not user_step_indices:
        return None

    turns = []
    short_session = session_id[:8] if len(session_id) >= 8 else session_id

    for turn_num, u_idx in enumerate(user_step_indices, 1):
        u_step = steps[u_idx]
        p_text = clean_prompt(u_step.get("content", ""))
        p_time = u_step.get("created_at", "")
        if not p_time:
            p_time = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")

        # Range of steps for this turn
        next_u_idx = user_step_indices[turn_num] if turn_num < len(user_step_indices) else len(steps)
        turn_steps = steps[u_idx + 1 : next_u_idx]

        # Find final response
        resp_candidates = [
            s for s in turn_steps
            if s.get("type") == "PLANNER_RESPONSE" and s.get("content")
        ]

        r_text = None
        r_time = None
        if resp_candidates:
            final_s = resp_candidates[-1]
            r_text = final_s.get("content", "").strip()
            r_time = final_s.get("created_at", "")
            if not r_time:
                r_time = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")

        turns.append({
            "num": turn_num,
            "prompt": p_text,
            "prompt_time": p_time,
            "response": r_text,
            "response_time": r_time,
            "model": model_name
        })

    return turns


def format_log_markdown(session_id, turns, repo_root, model_name=DEFAULT_MODEL, tool=TOOL):
    if not turns:
        return None

    short_session = session_id[:8] if len(session_id) >= 8 else session_id
    first_prompt_time = turns[0]["prompt_time"]
    last_prompt_time = turns[-1]["prompt_time"]

    # Format date from first prompt
    try:
        dt = datetime.fromisoformat(first_prompt_time.replace("Z", "+00:00"))
        date_str = dt.strftime("%Y-%m-%d")
        file_ts = dt.strftime("%Y-%m-%d_%H-%M-%S")
    except Exception:
        date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        file_ts = datetime.now(timezone.utc).strftime("%Y-%m-%d_%H-%M-%S")

    # Count exchanges that have responses
    completed_exchanges = sum(1 for t in turns if t["response"] is not None)
    total_exchanges = max(completed_exchanges, len(turns))

    lines = []
    lines.append("---")
    lines.append(f"session_id: {session_id}")
    lines.append(f"date: {date_str}")
    lines.append(f"author: {AUTHOR}")
    lines.append(f"model: {model_name}")
    lines.append(f"tool: {tool}")
    lines.append(f"project: {PROJECT}")
    lines.append(f"total_exchanges: {total_exchanges}")
    lines.append(f"first_prompt_time: {first_prompt_time}")
    lines.append(f"last_prompt_time: {last_prompt_time}")
    lines.append("---")
    lines.append("")
    lines.append(f"# Session Log - {date_str}")
    lines.append("")
    lines.append(f"Session: `{short_session}` | Project: `{PROJECT}` | Author: `{AUTHOR}`")
    lines.append("")
    lines.append("---")
    lines.append("")

    for t in turns:
        num = t["num"]
        lines.append(f"[LOG_ENTRY type=PROMPT num={num} session={short_session}]")
        lines.append(f"timestamp: {t['prompt_time']}")
        lines.append(f"model: {t['model']}")
        lines.append("")
        lines.append(t["prompt"])
        lines.append("")
        lines.append("")
        if t["response"] is not None:
            lines.append(f"[LOG_ENTRY type=RESPONSE num={num} session={short_session}]")
            lines.append(f"timestamp: {t['response_time']}")
            lines.append(f"model: {t['model']}")
            lines.append("")
            lines.append(t["response"])
            lines.append("")
            lines.append("")

    content = "\n".join(lines).rstrip() + "\n"
    filename = f"{file_ts}_{session_id}.md"
    return filename, content


def process_session(session_id, transcript_path=None, repo_root=None, model_name=DEFAULT_MODEL):
    if not repo_root:
        repo_root = get_repo_root()

    if not transcript_path:
        transcript_path = os.path.join(
            BRAIN_DIR, session_id, ".system_generated", "logs", "transcript_full.jsonl"
        )
        if not os.path.exists(transcript_path):
            transcript_path = os.path.join(
                BRAIN_DIR, session_id, ".system_generated", "logs", "transcript.jsonl"
            )

    if not os.path.exists(transcript_path):
        return None

    turns = parse_session_transcript(transcript_path, session_id, model_name)
    if not turns:
        return None

    filename, md_content = format_log_markdown(session_id, turns, repo_root, model_name)
    logs_dir = os.path.join(repo_root, ".agent-logs")
    os.makedirs(logs_dir, exist_ok=True)

    target_file = os.path.join(logs_dir, filename)
    with open(target_file, "w", encoding="utf-8") as f:
        f.write(md_content)

    return target_file


# --------------------------------------------------------------------------
# Claude Code (~/.claude/projects/<encoded-cwd>/<session-id>.jsonl)
# --------------------------------------------------------------------------

def encode_claude_project_dir(path):
    return path.replace(os.sep, "-")


def strip_reminders(text):
    """Drop harness-injected noise that is not part of what the user typed."""
    if not text:
        return ""
    text = re.sub(r"<system-reminder>[\s\S]*?</system-reminder>", "", text)
    text = re.sub(r"<local-command-stdout>[\s\S]*?</local-command-stdout>", "", text)
    text = re.sub(r"<command-message>[\s\S]*?</command-message>", "", text)
    return text.strip()


def claude_text(content):
    """Flatten a Claude message content field (str or block list) to text."""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, dict) and block.get("type") == "text":
                parts.append(block.get("text", ""))
        return "\n".join(parts)
    return ""


def claude_prompt_text(msg_content):
    """Render a user turn, expanding slash commands to `/name args`."""
    raw = claude_text(msg_content)
    name = re.search(r"<command-name>\s*([\s\S]*?)\s*</command-name>", raw)
    if name:
        args = re.search(r"<command-args>\s*([\s\S]*?)\s*</command-args>", raw)
        cmd = name.group(1).strip()
        if args and args.group(1).strip():
            cmd = f"{cmd} {args.group(1).strip()}"
        return cmd
    return strip_reminders(raw)


# Markers the CLI writes as user turns that the human never typed.
SYNTHETIC_PROMPTS = (
    "[Request interrupted by user]",
    "[Request interrupted by user for tool use]",
    "API Error",
    "No response requested.",
)


def is_claude_user_prompt(step):
    """True only for turns the human actually typed, not tool results."""
    if step.get("type") != "user" or step.get("isSidechain") or step.get("isMeta"):
        return False

    content = (step.get("message") or {}).get("content")
    text = claude_text(content).strip()
    if any(text.startswith(m) for m in SYNTHETIC_PROMPTS):
        return False

    origin = step.get("origin")
    if isinstance(origin, dict):
        # Authoritative signal on CLI >= 2.1; tool results carry no origin.
        return origin.get("kind") == "human"
    # Fallback for transcripts written before `origin` existed.
    if isinstance(content, list):
        return not any(
            isinstance(b, dict) and b.get("type") == "tool_result" for b in content
        )
    return isinstance(content, str)


def parse_claude_transcript(transcript_path, session_id):
    steps = []
    try:
        with open(transcript_path, "r", encoding="utf-8", errors="replace") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        steps.append(json.loads(line))
                    except Exception:
                        pass
    except Exception:
        return None

    user_step_indices = [i for i, s in enumerate(steps) if is_claude_user_prompt(s)]
    if not user_step_indices:
        return None

    turns = []
    for turn_num, u_idx in enumerate(user_step_indices, 1):
        u_step = steps[u_idx]
        p_text = claude_prompt_text((u_step.get("message") or {}).get("content"))
        if not p_text:
            continue
        p_time = u_step.get("timestamp") or datetime.now(timezone.utc).strftime(
            "%Y-%m-%dT%H:%M:%S.%fZ"
        )

        next_u_idx = (
            user_step_indices[turn_num]
            if turn_num < len(user_step_indices)
            else len(steps)
        )

        # Final response = last assistant text of the turn. Thinking blocks and
        # subagent (sidechain) output are excluded by claude_text/isSidechain.
        r_text = None
        r_time = None
        model = CLAUDE_DEFAULT_MODEL
        for s in steps[u_idx + 1 : next_u_idx]:
            if s.get("type") != "assistant" or s.get("isSidechain"):
                continue
            msg = s.get("message") or {}
            model = msg.get("model") or model
            text = claude_text(msg.get("content")).strip()
            if text:
                r_text = text
                r_time = s.get("timestamp") or r_time

        turns.append({
            "num": len(turns) + 1,
            "prompt": p_text,
            "prompt_time": p_time,
            "response": r_text,
            "response_time": r_time,
            "model": model,
        })

    return turns or None


def process_claude_session(session_id, transcript_path, repo_root=None):
    if not repo_root:
        repo_root = get_repo_root()
    if not os.path.exists(transcript_path):
        return None

    turns = parse_claude_transcript(transcript_path, session_id)
    if not turns:
        return None

    model_name = turns[-1]["model"]
    formatted = format_log_markdown(
        session_id, turns, repo_root, model_name, tool=CLAUDE_TOOL
    )
    if not formatted:
        return None
    filename, md_content = formatted

    logs_dir = os.path.join(repo_root, ".agent-logs")
    os.makedirs(logs_dir, exist_ok=True)
    target_file = os.path.join(logs_dir, filename)
    with open(target_file, "w", encoding="utf-8") as f:
        f.write(md_content)

    return target_file


def claude_transcripts_for_repo(repo_root):
    """Transcripts for the repo itself and any session started in a subdir."""
    encoded = encode_claude_project_dir(os.path.abspath(repo_root))
    found = []
    for pattern in (encoded, encoded + "-*"):
        found.extend(
            glob.glob(os.path.join(CLAUDE_PROJECTS_DIR, pattern, "*.jsonl"))
        )
    return found


def process_hook_payload():
    # Read stdin if available
    payload = {}
    if not sys.stdin.isatty():
        try:
            stdin_data = sys.stdin.read()
            if stdin_data.strip():
                payload = json.loads(stdin_data)
        except Exception:
            pass

    session_id = payload.get("conversationId")
    transcript_path = payload.get("transcriptPath")
    workspace_paths = payload.get("workspacePaths", [])
    model_name = payload.get("modelName") or DEFAULT_MODEL
    if model_name == "auto":
        model_name = DEFAULT_MODEL

    repo_root = get_repo_root(workspace_paths)

    # If session_id not in payload, check env or most recently updated brain session
    if not session_id:
        session_id = os.environ.get("ANTIGRAVITY_CONVERSATION_ID")

    if not session_id:
        # Find newest session folder in BRAIN_DIR
        sessions = glob.glob(os.path.join(BRAIN_DIR, "*", ".system_generated", "logs", "transcript*.jsonl"))
        if sessions:
            newest = max(sessions, key=os.path.getmtime)
            session_id = newest.split(os.sep)[-4]
            transcript_path = newest

    if session_id:
        try:
            process_session(session_id, transcript_path, repo_root, model_name)
        except Exception as e:
            pass


def is_project_session(tp, repo_root):
    try:
        with open(tp, "r", encoding="utf-8", errors="replace") as f:
            # Check the first 20 lines
            for _ in range(20):
                line = f.readline()
                if not line:
                    break
                if "fathom-clone" in line:
                    return True
    except Exception:
        pass
    return False


def watch_daemon(repo_root=None, interval=1.0):
    if not repo_root:
        repo_root = get_repo_root()
    mtimes = {}
    while True:
        try:
            transcripts = glob.glob(
                os.path.join(BRAIN_DIR, "*", ".system_generated", "logs", "transcript_full.jsonl")
            )
            for tp in transcripts:
                try:
                    mt = os.path.getmtime(tp)
                    if tp not in mtimes or mtimes[tp] < mt:
                        mtimes[tp] = mt
                        session_id = tp.split(os.sep)[-4]
                        if session_id == "f045626a-382f-421d-9038-3e07dd68ad3b" or is_project_session(tp, repo_root):
                            process_session(session_id, tp, repo_root, DEFAULT_MODEL)
                except Exception:
                    pass
        except Exception:
            pass

        try:
            for tp in claude_transcripts_for_repo(repo_root):
                try:
                    mt = os.path.getmtime(tp)
                    if tp not in mtimes or mtimes[tp] < mt:
                        mtimes[tp] = mt
                        session_id = os.path.splitext(os.path.basename(tp))[0]
                        process_claude_session(session_id, tp, repo_root)
                except Exception:
                    pass
        except Exception:
            pass

        time.sleep(interval)



if __name__ == "__main__":
    if "--watch" in sys.argv:
        watch_daemon()
    elif "--all" in sys.argv:
        transcripts = glob.glob(
            os.path.join(BRAIN_DIR, "*", ".system_generated", "logs", "transcript_full.jsonl")
        )
        for tp in transcripts:
            session_id = tp.split(os.sep)[-4]
            out = process_session(session_id, tp)
            if out:
                print(f"Processed {session_id} -> {out}")
        for tp in claude_transcripts_for_repo(get_repo_root()):
            session_id = os.path.splitext(os.path.basename(tp))[0]
            out = process_claude_session(session_id, tp)
            if out:
                print(f"Processed {session_id} -> {out}")
    elif "--session" in sys.argv:
        idx = sys.argv.index("--session")
        if idx + 1 < len(sys.argv):
            s_id = sys.argv[idx + 1]
            out = process_session(s_id)
            print(f"Processed {s_id} -> {out}")
    else:
        # Running as hook (or standalone run)
        process_hook_payload()
        # Always return valid JSON on stdout for Antigravity hooks
        print(json.dumps({}))
