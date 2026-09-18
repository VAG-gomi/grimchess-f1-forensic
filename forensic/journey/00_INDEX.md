# GrimChess Forensic Investigation Journey

## Purpose

This four-file archive reconstructs the investigation as far as the public repository evidence permits. It separates repository observations, documented external evidence, structural findings, controlled-test results, hypotheses, and unknowns. It is intended as an entry point for a new investigator who must not repeat completed work or treat a structural result as live runtime causality.

## What this archive is not

It is not a replacement for the existing forensic reports, source manifests, controlled-test files, or APK. It is not a claim that every documented external action can be independently verified from Git history. It does not contain a genuine physical-device `runtime_forensic.jsonl`, and it does not establish the cause of the original live error.

## Reading order

Read these files in order:

1. [`CURRENT_STATE.md`](CURRENT_STATE.md) for the latest checkpoint.
2. [`JOURNEY.md`](JOURNEY.md) for the chronological narrative.
3. [`INVESTIGATION_LEDGER.jsonl`](INVESTIGATION_LEDGER.jsonl) for machine-readable event records.
4. The repository-relative evidence paths cited by those files.

## Relationship between the files

`CURRENT_STATE.md` is the concise operational checkpoint. `JOURNEY.md` explains the sequence and significance of the research transitions. `INVESTIGATION_LEDGER.jsonl` is the structured event record; each line is an independent JSON object. This index explains how to navigate them.

## Evidence references

Evidence references use repository-relative paths whenever the artifact exists in this repository. A reference labelled `documented_external_evidence` means the repository reports or manifests document an external event, but the event itself is not independently observable from the repository. A statement marked `NOT VERIFIED FROM REPOSITORY` must not be promoted to a historical fact.

## How to continue without repeating work

The repository already records the Current-versus-Offline-2 candidate-path comparison, controlled transcripts TX-CTRL-A through TX-CTRL-C, the exact controlled exception, the F1 instrumentation scope, the F1 build and hash, and the current absence of live runtime evidence. The next investigator should preserve the frozen Current artifact, avoid repair, and seek only the missing physical-device F1 trace that correlates one transaction with raw UCI output, parsed analysis, candidate count, prediction-map input, exception, queue/session fields, and FEN fields.
